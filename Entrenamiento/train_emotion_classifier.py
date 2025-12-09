import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import os

# --- Configuración de rutas ---
# Ruta al archivo CSV con las características de MediaPipe que creaste en el paso anterior
FEATURES_CSV_PATH = 'fer2013_mediapipe_features.csv'
# Nombre del archivo para guardar el modelo entrenado en formato TensorFlow Lite
OUTPUT_TFLITE_MODEL_PATH = 'emotion_classifier_model.tflite'

# --- Parámetros de entrenamiento ---
TEST_SIZE = 0.2        # 20% de los datos para prueba, 80% para entrenamiento
RANDOM_STATE = 42      # Semilla para reproducibilidad
EPOCHS = 50            # Número de veces que el modelo verá todo el dataset de entrenamiento
BATCH_SIZE = 32        # Número de muestras por actualización de gradiente

# --- Nombres de las emociones (debe coincidir con tu mapeo en el pre-procesamiento) ---
EMOTION_NAMES = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']

# --- Script Principal ---
if __name__ == "__main__":
    print(f"Iniciando entrenamiento del clasificador de emociones...")
    print(f"Cargando características desde: {FEATURES_CSV_PATH}")

    # 1. Cargar el dataset de características pre-procesadas
    try:
        df_features = pd.read_csv(FEATURES_CSV_PATH)
        print(f"Dataset de características cargado. Filas: {len(df_features)}, Columnas: {len(df_features.columns)}")
        if df_features.empty:
            print("ERROR: El dataset de características está vacío. No se puede entrenar el modelo.")
            sys.exit(1)
    except FileNotFoundError:
        print(f"ERROR: No se encontró el archivo '{FEATURES_CSV_PATH}'. Asegúrate de que el CSV esté en la misma carpeta.")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR al cargar el CSV de características: {e}")
        sys.exit(1)

    # Separar características (X) y etiquetas (y)
    # Todas las columnas excepto 'emotion_label_id' y 'emotion_name' son características (blendshapes)
    X = df_features.drop(columns=['emotion_label_id', 'emotion_name'])
    y = df_features['emotion_label_id'] # Usamos la ID numérica para el entrenamiento

    # Verificar que el número de características sea el esperado (ej. 52 blendshapes)
    num_features = X.shape[1]
    print(f"Número de características (blendshapes): {num_features}")
    print(f"Número de clases de emoción: {len(EMOTION_NAMES)}")

    # 2. Dividir los datos en conjuntos de entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y # Stratify mantiene la proporción de clases
    )
    print(f"Tamaño del conjunto de entrenamiento: {len(X_train)} muestras")
    print(f"Tamaño del conjunto de prueba: {len(X_test)} muestras")

    # 3. Escalar las características
    # Los blendshapes ya están entre 0 y 1, pero escalar puede ayudar a algunas redes neuronales
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("Características escaladas.")

    # 4. Construir el modelo de red neuronal (Keras)
    model = keras.Sequential([
        keras.layers.Input(shape=(num_features,)), # Capa de entrada con el número de blendshapes
        keras.layers.Dense(128, activation='relu', name='hidden_layer_1'), # Capa oculta con 128 neuronas y activación ReLU
        keras.layers.Dropout(0.3), # Capa de Dropout para evitar sobreajuste
        keras.layers.Dense(64, activation='relu', name='hidden_layer_2'), # Segunda capa oculta
        keras.layers.Dropout(0.3),
        keras.layers.Dense(len(EMOTION_NAMES), activation='softmax', name='output_layer') # Capa de salida con activación softmax para clasificación multiclase
    ])

    # Compilar el modelo
    model.compile(
        optimizer='adam', # Optimizador Adam es una buena opción por defecto
        loss='sparse_categorical_crossentropy', # Pérdida para clasificación multiclase con etiquetas enteras
        metrics=['accuracy'] # Métrica a optimizar durante el entrenamiento
    )
    model.summary() # Muestra un resumen de la arquitectura del modelo

    # 5. Entrenar el modelo
    print("\nEntrenando el modelo...")
    history = model.fit(
        X_train_scaled, y_train,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        validation_split=0.1, # Usar un 10% del conjunto de entrenamiento para validación
        verbose=1
    )
    print("Entrenamiento completado.")

    # 6. Evaluar el modelo
    print("\nEvaluando el modelo en el conjunto de prueba...")
    loss, accuracy = model.evaluate(X_test_scaled, y_test, verbose=0)
    print(f"Precisión del modelo en el conjunto de prueba: {accuracy:.4f}")
    print(f"Pérdida del modelo en el conjunto de prueba: {loss:.4f}")

    # Reporte de clasificación detallado
    print("\nReporte de Clasificación:")
    y_pred_probs = model.predict(X_test_scaled)
    y_pred = np.argmax(y_pred_probs, axis=1) # Obtener la clase predicha (índice de la mayor probabilidad)
    print(classification_report(y_test, y_pred, target_names=EMOTION_NAMES))

    # Matriz de confusión (opcional, para ver errores específicos entre clases)
    # print("\nMatriz de Confusión:")
    # print(confusion_matrix(y_test, y_pred))


    # 7. Exportar el modelo a formato TensorFlow Lite
    print(f"\nExportando el modelo a TensorFlow Lite en '{OUTPUT_TFLITE_MODEL_PATH}'...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_model = converter.convert()

    with open(OUTPUT_TFLITE_MODEL_PATH, 'wb') as f:
        f.write(tflite_model)
    print(f"Modelo TFLite guardado exitosamente.")
    print("--------------------------------------------------")
    print(f"El archivo '{OUTPUT_TFLITE_MODEL_PATH}' es el que copiarás a tu carpeta 'mindhealth-importer/models/'")
    print("--------------------------------------------------")