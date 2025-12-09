# 📋 PLAN ESTRATÉGICO DE TOMA DE DECISIONES
## Proyecto: MindHealth - Plataforma de Salud Mental con IA

**Autor:** NotToxict  
**Repositorio:** [MindHealth](https://github.com/NotToxict/MindHealth)  
**Fecha:** Diciembre 2025

---

## 🔷 MATRIZ DEL ANÁLISIS DEL PROBLEMA

### 1️⃣ IDENTIFICACIÓN DEL PROBLEMA

#### Definición del Problema (Estado Actual vs Estado Deseado)

| Aspecto | Estado Actual | Estado Deseado |
|---------|---------------|----------------|
| **Acceso a salud mental** | En México existe una brecha significativa en el acceso a servicios de salud mental; muchas personas no pueden identificar sus estados emocionales ni acceder a recursos adecuados | Proporcionar una herramienta accesible vía web que permita a los usuarios monitorear su salud mental, identificar emociones y acceder a información sobre trastornos mentales |
| **Detección de emociones** | Los usuarios no tienen forma fácil de auto-evaluar su estado emocional de manera objetiva | Implementar un sistema de reconocimiento de emociones faciales mediante IA que proporcione retroalimentación en tiempo real |
| **Información sobre trastornos** | La información sobre trastornos mentales está dispersa y no siempre es confiable | Centralizar información confiable sobre trastornos mentales en una plataforma accesible |
| **Seguimiento personal** | No existe un historial personalizado del estado emocional del usuario | Implementar dashboards con historial y estadísticas del estado emocional del usuario |

#### Descripción del Problema Principal

> *"Existe una necesidad de democratizar el acceso a herramientas de autoevaluación y seguimiento de salud mental, combinando tecnología de inteligencia artificial con información educativa confiable sobre bienestar emocional."*

#### Fuentes de Identificación del Problema

- 📊 Estadísticas de salud mental en México (almacenadas en `statistics.json`)
- 🔬 Investigación sobre detección de emociones (dataset FER2013)
- 👥 Necesidades de usuarios que buscan recursos de autoayuda
- 🌍 Cambios en el entorno post-pandemia que incrementaron problemas de salud mental

---

### 2️⃣ ANÁLISIS DE CAUSAS

#### Diagrama Causa-Efecto (Espina de Pescado)

```
                                    ┌─────────────────────────────────────┐
                                    │   PROBLEMA PRINCIPAL:               │
                                    │   Falta de acceso a herramientas    │
                                    │   de salud mental accesibles        │
                                    └─────────────────────────────────────┘
                                                      │
        ┌─────────────────────┬───────────────────────┼───────────────────────┬─────────────────────┐
        │                     │                       │                       │                     │
   ┌────▼────┐          ┌─────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐       ┌──────▼──────┐
   │TECNOLOGÍA│         │ RECURSOS  │          │  USUARIOS   │         │ INFORMACIÓN │       │  CONTEXTO   │
   └────┬────┘          └─────┬─────┘          └──────┬──────┘         └──────┬──────┘       └──────┬──────┘
        │                     │                       │                       │                     │
   - Falta de apps      - Escasez de            - Estigma social       - Información         - Pandemia
     especializadas       profesionales           hacia salud            dispersa y no         incrementó
   - Complejidad de     - Alto costo de           mental                 verificada            problemas
     soluciones IA        consultas             - Falta de              - Poco contenido      - Aislamiento
   - Barreras           - Concentración           autoconocimiento       en español            social
     técnicas             en zonas urbanas        emocional                                   - Ansiedad
                                                                                                generalizada
```

#### Causas Principales Identificadas

| Causa | Descripción | Impacto |
|-------|-------------|---------|
| **C1: Brecha tecnológica** | Pocas herramientas accesibles combinan IA con salud mental | ALTO |
| **C2: Costo de servicios** | Los servicios de salud mental profesionales son costosos | ALTO |
| **C3: Estigma social** | Muchas personas no buscan ayuda por temor al qué dirán | MEDIO |
| **C4: Falta de autoconocimiento** | Las personas no saben identificar sus estados emocionales | ALTO |
| **C5: Información poco accesible** | La información sobre trastornos mentales está fragmentada | MEDIO |

---

### 3️⃣ SOLUCIONES POTENCIALES

#### Generación de Alternativas de Solución

| Alternativa | Descripción | Viabilidad |
|-------------|-------------|------------|
| **A1: Plataforma web con IA** | Desarrollar una aplicación web que use reconocimiento facial para detectar emociones y proporcione recursos de salud mental | ✅ ALTA |
| **A2: App móvil standalone** | Crear una aplicación móvil nativa para iOS/Android | ⚠️ MEDIA (requiere más recursos) |
| **A3: Chatbot de salud mental** | Implementar un chatbot conversacional sin componente visual | ⚠️ MEDIA (limitado en detección) |
| **A4: Plataforma solo informativa** | Portal web con solo información sobre trastornos sin IA | ❌ BAJA (no diferenciador) |

#### Criterios de Selección

| Criterio | Peso | A1 | A2 | A3 | A4 |
|----------|------|----|----|----|----|
| Costo de desarrollo | 25% | 8 | 5 | 7 | 9 |
| Impacto en usuarios | 30% | 9 | 9 | 6 | 4 |
| Tiempo de implementación | 20% | 7 | 4 | 8 | 9 |
| Innovación tecnológica | 15% | 9 | 8 | 5 | 2 |
| Escalabilidad | 10% | 8 | 7 | 7 | 8 |
| **TOTAL PONDERADO** | **100%** | **8.25** | **6.65** | **6.55** | **5.75** |

#### Solución Seleccionada: A1 - Plataforma Web MindHealth con IA

---

### 4️⃣ CONSECUENCIAS DE ACCIONES

#### Análisis de Fuerzas (Kurt Lewin)

| Fuerzas Positivas ⬆️ | Fuerzas Negativas ⬇️ |
|----------------------|---------------------|
| Tecnología disponible (TensorFlow, MediaPipe) | Curva de aprendizaje en ML |
| Firebase como backend escalable y gratuito | Limitaciones del modelo de emociones |
| Dataset FER2013 disponible para entrenamiento | Dependencia de conexión a internet |
| Demanda creciente de herramientas de salud mental | Privacidad de datos faciales |
| Interfaz web accesible desde cualquier dispositivo | Posible resistencia de usuarios |

#### Análisis P-N-I (Positivo-Negativo-Interesante)

| POSITIVO ✅ | NEGATIVO ❌ | INTERESANTE 🤔 |
|-------------|-------------|----------------|
| Democratiza acceso a autoevaluación emocional | Requiere cámara y permisos del navegador | Podría integrarse con profesionales de salud |
| Bajo costo para el usuario final | Precisión del modelo no es 100% | Potencial de expansión a otros países |
| Historial personalizado de emociones | Puede generar dependencia tecnológica | Uso de datos para investigación |
| Educación sobre trastornos mentales | No reemplaza atención profesional | Gamificación futura |
| Código abierto y reproducible | Mantenimiento continuo requerido | Integración con wearables |

---

## 🔷 ALTERNATIVAS DE DECISIÓN

### 1️⃣ SELECCIÓN DEL MODELO

#### Modelo de Decisión: Racional-Analítico

Se seleccionó este modelo porque:
- ✅ El problema está **bien estructurado** (desarrollo de software)
- ✅ Existe **información suficiente** sobre tecnologías disponibles
- ✅ Los **criterios son cuantificables** (costo, tiempo, impacto)
- ✅ Las **alternativas son comparables** objetivamente

#### Arquitectura Técnica Decidida

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA MINDHEALTH                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│   │   FRONTEND      │    │   BACKEND       │    │   ML/IA         │        │
│   │   (Web App)     │◄──►│   (Firebase)    │◄──►│   (TFLite)      │        │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘        │
│   • HTML/CSS/JS          • Firestore DB         • MediaPipe Face           │
│   • index.html           • Authentication       • FER2013 Dataset          │
│   • Dashboards           • Cloud Functions      • Red Neuronal             │
│   • Self-Assessment                             • TensorFlow Lite          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2️⃣ SELECCIÓN DE LA SOLUCIÓN

#### Componentes de la Solución Implementada

| Módulo | Tecnología | Propósito |
|--------|------------|-----------|
| **Entrenamiento de IA** | Python + TensorFlow + MediaPipe | Entrenar modelo de clasificación de emociones |
| **Modelo de emociones** | TFLite (emotion_classifier_model.tflite) | Clasificar 7 emociones: angry, disgust, fear, happy, sad, surprise, neutral |
| **Frontend Web** | HTML + CSS + JavaScript | Interfaz de usuario responsive |
| **Autenticación** | Firebase Auth | Login seguro de usuarios |
| **Base de datos** | Firestore | Almacenar historial y datos de usuarios |
| **Información educativa** | JSON (disorders.json) | Base de datos de trastornos mentales |
| **Visualización** | Dashboards + Mapas | Estadísticas y visualización geográfica |

#### Decisiones Técnicas Clave

```python
# Arquitectura del modelo de IA (train_emotion_classifier.py)
model = keras.Sequential([
    keras.layers.Input(shape=(num_features,)),          # 52 blendshapes de MediaPipe
    keras.layers.Dense(128, activation='relu'),         # Capa oculta 1
    keras.layers.Dropout(0.3),                          # Prevención de overfitting
    keras.layers.Dense(64, activation='relu'),          # Capa oculta 2
    keras.layers.Dropout(0.3),
    keras.layers.Dense(7, activation='softmax')         # 7 emociones de salida
])
```

---

### 3️⃣ IMPLEMENTACIÓN

#### Plan de Implementación por Fases

| Fase | Actividades | Entregables | Estado |
|------|-------------|-------------|--------|
| **Fase 1: Preparación de Datos** | Preprocesamiento del dataset FER2013, extracción de características con MediaPipe | `fer2013_mediapipe_features.csv`, `preprocess_fer2013.py` | ✅ Completado |
| **Fase 2: Entrenamiento de Modelo** | Entrenar red neuronal, evaluar precisión, exportar a TFLite | `emotion_classifier_model.tflite`, `train_emotion_classifier.py` | ✅ Completado |
| **Fase 3: Desarrollo Frontend** | Crear interfaz web, páginas de login, dashboard, autoevaluación | `index.html`, `login.html`, `self-assessment.html`, estilos CSS | ✅ Completado |
| **Fase 4: Integración Backend** | Configurar Firebase, implementar autenticación, conectar Firestore | `firebase-config.js`, `firestore-service.js`, `auth-guard.js` | ✅ Completado |
| **Fase 5: Módulos Funcionales** | Implementar dashboards, mapas, visualización de trastornos | `ui-dashboard.js`, `ui-map.js`, `ui-disorders.js` | ✅ Completado |
| **Fase 6: Despliegue** | Subir a repositorio, documentación, pruebas finales | Repositorio GitHub público | ✅ Completado |

#### Cronograma de Implementación

```
JULIO 2025 ────────────────────────────────────────────► DICIEMBRE 2025

│ Fase 1 │ Fase 2 │   Fase 3    │ Fase 4 │   Fase 5    │ Fase 6 │
│  Data  │   ML   │  Frontend   │Backend │ Integración │Deploy  │
└────────┴────────┴─────────────┴────────┴─────────────┴────────┘
   Jul      Ago       Sep-Oct      Nov        Nov-Dic      Dic
```

#### Plan de Contingencia

| Riesgo | Probabilidad | Impacto | Plan de Contingencia |
|--------|--------------|---------|---------------------|
| Modelo con baja precisión | Media | Alto | Aumentar epochs, ajustar arquitectura, usar más datos |
| Firebase alcanza límites gratuitos | Baja | Medio | Migrar a plan de pago o alternativa (Supabase) |
| Problemas de privacidad | Media | Alto | Procesar imágenes localmente, no almacenar fotos |
| Navegador no soporta cámara | Baja | Medio | Mostrar mensaje informativo, ofrecer cuestionario alternativo |

---

### 4️⃣ EVALUACIÓN

#### Métricas de Éxito

| Métrica | Objetivo | Cómo Medirlo |
|---------|----------|--------------|
| **Precisión del modelo** | > 70% en clasificación de emociones | `classification_report` en Python |
| **Tiempo de carga** | < 3 segundos para la app web | Developer Tools del navegador |
| **Usabilidad** | Navegación intuitiva | Pruebas con usuarios |
| **Adopción** | Usuarios registrados y activos | Analytics de Firebase |
| **Funcionalidad completa** | 100% de features implementados | Checklist de requerimientos |

#### Resultados de Evaluación Técnica

| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Modelo TFLite | ✅ Funcional | Clasificador de 7 emociones operativo |
| Autenticación Firebase | ✅ Funcional | Login/registro con persistencia |
| Dashboard de estadísticas | ✅ Funcional | Visualización de datos de México |
| Autoevaluación | ✅ Funcional | Cuestionarios interactivos |
| Mapa de México | ✅ Funcional | Visualización geográfica |
| Historial de usuario | ✅ Funcional | Seguimiento temporal |

#### Lecciones Aprendidas

| Área | Lección | Aplicación Futura |
|------|---------|-------------------|
| **Machine Learning** | MediaPipe facilita enormemente la extracción de características faciales | Explorar otros modelos de MediaPipe |
| **Frontend** | Modularizar JavaScript mejora mantenibilidad | Aplicar patrón en futuros proyectos |
| **Backend** | Firebase acelera desarrollo pero tiene limitaciones | Evaluar necesidades antes de elegir backend |
| **Gestión** | Dividir en fases pequeñas permite control efectivo | Metodología ágil recomendada |

---

## 📊 RESUMEN EJECUTIVO

### El Proyecto MindHealth demuestra:

1. ✅ **Identificación clara del problema**: Brecha en acceso a herramientas de salud mental
2. ✅ **Análisis exhaustivo de causas**: Tecnológicas, económicas, sociales e informativas
3. ✅ **Generación de alternativas**: 4 opciones evaluadas con criterios objetivos
4. ✅ **Selección fundamentada**: Plataforma web con IA como mejor opción
5. ✅ **Implementación estructurada**: 6 fases con entregables definidos
6. ✅ **Evaluación continua**: Métricas y planes de contingencia establecidos

### Tipo de Decisión

> 📌 **Decisión No Estructurada** - Requirió solución innovadora combinando múltiples tecnologías (ML, Web, Cloud) para resolver un problema complejo de salud pública.

---

## 📚 REFERENCIAS

- Repositorio del proyecto: https://github.com/NotToxict/MindHealth
- Dataset FER2013: Facial Expression Recognition Dataset
- TensorFlow Lite: https://www.tensorflow.org/lite
- MediaPipe: https://mediapipe.dev/
- Firebase: https://firebase.google.com/

---

*Documento elaborado como parte del análisis de problemas y toma de decisiones para el proyecto MindHealth.*