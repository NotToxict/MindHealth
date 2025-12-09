import pandas as pd
import numpy as np
import cv2
import os
import sys

# CAMBIO: Importaciones actualizadas para MediaPipe 0.10.x y posteriores
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# --- Configuración de rutas y modelo ---
# Asegúrate de que esta ruta apunte a tu archivo fer2013.csv
FER2013_CSV_PATH = 'fer2013.csv' 
# Este será el nombre del archivo CSV donde se guardarán las características extraídas
OUTPUT_FEATURES_CSV_PATH = 'fer2013_mediapipe_features.csv'

# Ruta al archivo del modelo .task de MediaPipe FaceLandmarker.
# Asegúrate de haberlo descargado y colocado en la carpeta 'Entrenamiento'.
# Puedes obtenerlo de: https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task
MODEL_PATH = 'face_landmarker.task' 

# Puedes procesar un subconjunto pequeño para probar (ej. 100) o None para todo el dataset
NUM_IMAGES_TO_PROCESS = None # Cambia a un número (ej. 500) para pruebas, o deja None para todo


# Función para cargar el FaceLandmarker
def load_face_landmarker_model(model_path):
    """Carga el modelo de MediaPipe FaceLandmarker."""
    if not os.path.exists(model_path):
        print(f"ERROR: El archivo del modelo '{model_path}' no se encontró.")
        print("Por favor, descarga 'face_landmarker.task' de la documentación de MediaPipe y colócalo en la misma carpeta que este script.")
        sys.exit(1) # Sale del script si el modelo no se encuentra

    # CAMBIO: La forma de crear el modelo es diferente y se eliminó 'output_face_geometry'
    base_options = python.BaseOptions(model_asset_path=model_path)
    options = vision.FaceLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.IMAGE, # Para procesar imágenes estáticas
        output_face_blendshapes=True # Mantener esto para extraer las características de emoción
    )
    # CAMBIO: Usar vision.FaceLandmarker.create_from_options
    return vision.FaceLandmarker.create_from_options(options)

# Función para procesar una imagen y extraer blendshapes
# Función para procesar una imagen y extraer blendshapes
def process_image_with_mediapipe(face_landmarker_detector, image_array):
    """
    Procesa una imagen y extrae los blendshapes faciales usando MediaPipe.
    image_array debe ser un array de NumPy (H, W) para imágenes en escala de grises.
    """
    image_rgb = cv2.cvtColor(image_array, cv2.COLOR_GRAY2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
    
    detection_result = face_landmarker_detector.detect(mp_image)
    
    # CAMBIO CRÍTICO AQUÍ: Acceder a los blendshapes directamente si ya son la lista
    if detection_result.face_blendshapes and len(detection_result.face_blendshapes) > 0:
        # Asegurarse de que el primer elemento sea la lista de categorías
        # Algunos modelos/versiones devuelven una lista de listas de categorías
        # o directamente la lista de categorías en detection_result.face_blendshapes[0]
        # La forma más robusta es iterar si es una lista de listas, o usar directamente si es una lista de categorías
        
        # Intentamos acceder a .categories, si da error, asumimos que ya es la lista.
        try:
            # Si el primer elemento es un objeto con propiedad 'categories' (comportamiento antiguo)
            blendshapes = detection_result.face_blendshapes[0].categories
        except AttributeError:
            # Si el primer elemento ya es la lista de blendshape categories (comportamiento nuevo)
            blendshapes = detection_result.face_blendshapes[0] # Asumimos que [0] ya es la lista de categorías


        features = {b.category_name: b.score for b in blendshapes}
        return features
    return None

# --- Script principal ---
if __name__ == "__main__":
    # Cargar el dataset FER2013
    try:
        df = pd.read_csv(FER2013_CSV_PATH)
        print(f"Dataset FER2013 cargado exitosamente. Total de filas: {len(df)}")
    except FileNotFoundError:
        print(f"ERROR: No se encontró el archivo '{FER2013_CSV_PATH}'.")
        print("Asegúrate de que 'fer2013.csv' esté en la misma carpeta que este script (Entrenamiento/).")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR al cargar el CSV: {e}")
        sys.exit(1)

    # Preparar mapeo de etiquetas numéricas de emoción a nombres
    # FER2013 usa: 0=Angry, 1=Disgust, 2=Fear, 3=Happy, 4=Sad, 5=Surprise, 6=Neutral
    emotion_labels_map = {
        0: 'angry', 1: 'disgust', 2: 'fear', 
        3: 'happy', 4: 'sad', 5: 'surprise', 6: 'neutral'
    }
    df['emotion_name'] = df['emotion'].map(emotion_labels_map)

    # Inicializar el FaceLandmarker
    print("Cargando modelo de MediaPipe FaceLandmarker...")
    landmarker = load_face_landmarker_model(MODEL_PATH)
    print("Modelo de MediaPipe FaceLandmarker cargado.")

    # Lista para almacenar las características extraídas
    extracted_features = []
    
    # Lista de nombres de blendshapes para asegurar un orden consistente en el CSV de salida
    # MediaPipe tiene alrededor de 52 blendshapes, los obtendremos del primer resultado válido
    blendshape_names = []

    print(f"Iniciando procesamiento de imágenes. Se procesarán {NUM_IMAGES_TO_PROCESS if NUM_IMAGES_TO_PROCESS is not None else 'todas las'} imágenes.")

    # Iterar sobre las filas del DataFrame
    processed_count = 0
    skipped_count = 0
    # Agrega un contador para el total de la base de datos
    total_rows = len(df)
    
    for index, row in df.iterrows():
        if NUM_IMAGES_TO_PROCESS is not None and processed_count >= NUM_IMAGES_TO_PROCESS:
            break # Detener si se alcanza el límite para pruebas
        
        pixels_str = row['pixels']
        emotion_label_id = row['emotion']
        emotion_name = row['emotion_name']
        
        # Convertir la cadena de píxeles a un array NumPy
        # Las imágenes de FER2013 son 48x48 píxeles en escala de grises
        pixels = np.array(pixels_str.split(' '), dtype='uint8')
        image_array = pixels.reshape(48, 48) 
        
        features = process_image_with_mediapipe(landmarker, image_array)
        
        if features:
            if not blendshape_names:
                # Captura los nombres de los blendshapes del primer resultado exitoso para usarlos como columnas
                blendshape_names = sorted(features.keys())
                print(f"Detectados {len(blendshape_names)} blendshapes. Asegurando consistencia en columnas.")
                
            # Crear un diccionario para esta fila, inicializando todos los blendshapes a 0.0
            row_data = {name: features.get(name, 0.0) for name in blendshape_names}
            row_data['emotion_label_id'] = emotion_label_id
            row_data['emotion_name'] = emotion_name
            
            extracted_features.append(row_data)
            processed_count += 1
            if processed_count % 100 == 0: # Imprimir cada 100 imágenes procesadas
                print(f"Progreso: {processed_count}/{total_rows} imágenes procesadas. ({skipped_count} saltadas).")
        else:
            skipped_count += 1
            # Si quieres ver cada imagen saltada, descomenta la siguiente línea:
            # print(f"No se detectó rostro en la imagen {index + 1} (Emoción: {emotion_name}). Saltando.")

    print(f"\n--- Resumen del Pre-procesamiento ---")
    print(f"Total de imágenes en el dataset original: {total_rows}")
    if NUM_IMAGES_TO_PROCESS is not None:
        print(f"Límite de imágenes a procesar establecido: {NUM_IMAGES_TO_PROCESS}")
    print(f"Imágenes procesadas con rostro detectado: {processed_count}")
    print(f"Imágenes saltadas (sin rostro detectado): {skipped_count}")

    if not extracted_features:
        print("No se extrajo ninguna característica. El archivo de salida no se creará.")
        sys.exit(0)

    # Convertir las características extraídas a un DataFrame
    output_df = pd.DataFrame(extracted_features)

    # Reordenar las columnas para que las etiquetas de emoción estén al final
    cols = [col for col in output_df.columns if col not in ['emotion_label_id', 'emotion_name']] + ['emotion_label_id', 'emotion_name']
    output_df = output_df[cols]

    # Guardar las características en un nuevo CSV
    output_df.to_csv(OUTPUT_FEATURES_CSV_PATH, index=False)
    print(f"\nCaracterísticas extraídas y guardadas en '{OUTPUT_FEATURES_CSV_PATH}'.")
    print("\nPrimeras 5 filas del archivo de características:")
    print(output_df.head())
    print(f"\nEl archivo CSV de salida tiene {len(output_df.columns)} columnas (incluyendo las etiquetas).")