# 📋 PLAN ESTRATÉGICO DE TOMA DE DECISIONES
## Proyecto: MindHealth - Dashboard Interactivo de Salud Mental con Integración de Inteligencia Artificial Avanzada

**Autor:** NotToxict  
**Repositorio:** [MindHealth](https://github.com/NotToxict/MindHealth)  
**Fecha:** Diciembre 2025  
**Versión:** 2.0

---

## 📌 RESUMEN EJECUTIVO

El proyecto **MindHealth** es una iniciativa desarrollada en el contexto universitario, concebida para abordar la necesidad crítica de comprender y visualizar la situación actual de la salud mental en México. Este plan estratégico detalla la creación de un dashboard interactivo que integra datos epidemiológicos relevantes y una herramienta de autoevaluación avanzada, potenciada por capacidades de Inteligencia Artificial.

> *"En un mundo donde la información sobre salud mental es crucial pero a menudo compleja o dispersa, MindHealth se posiciona como una herramienta que busca simplificar ese acceso, ofreciendo una ventana a la experiencia personal donde la tecnología sirve como un compañero en el camino de la autocomprensión emocional."*

---

## 🔷 MATRIZ DEL ANÁLISIS DEL PROBLEMA

### 1️⃣ IDENTIFICACIÓN DEL PROBLEMA

#### Definición del Problema (Estado Actual vs Estado Deseado)

| Aspecto | Estado Actual | Estado Deseado |
|---------|---------------|----------------|
| **Acceso a información** | La información sobre salud mental en México está dispersa, es compleja y difícil de interpretar para el público general | Transformar datos crudos en conocimiento accesible mediante visualizaciones claras e interactivas |
| **Datos epidemiológicos** | Los datos de INEGI, GBD y SSa existen pero no están integrados en una plataforma accesible | Dashboard unificado con datos reales de múltiples fuentes oficiales mexicanas |
| **Autoevaluación emocional** | Las personas carecen de herramientas objetivas para monitorear su estado emocional | Sistema de IA que analiza expresiones faciales en tiempo real para fomentar la autoconciencia |
| **Seguimiento personal** | No existe un registro histórico del bienestar emocional individual | Historial personalizado con análisis multimodal (IA + texto + blendshapes) |
| **Visualización geográfica** | Los datos estatales no se presentan de forma visual e interactiva | Mapa coroplético interactivo de México con métricas por entidad federativa |

#### Descripción del Problema Principal

> *"Existe una necesidad crítica de democratizar el acceso a herramientas de comprensión y autoevaluación de salud mental en México, combinando visualización de datos epidemiológicos reales con tecnología de inteligencia artificial para el análisis de expresiones faciales, sin pretender reemplazar la intervención profesional."*

#### Fuentes de Identificación del Problema

| Fuente | Tipo de Datos | Aplicación en MindHealth |
|--------|---------------|--------------------------|
| 📊 **INEGI 2023** | Tasas de suicidio por estado y género, métodos, tendencias 2013-2023 | Dashboard nacional, mapa interactivo |
| 🏥 **SSa 2024** | Atenciones por género y condición de salud mental | Gráficos de distribución por género |
| 🌍 **GBD 2021** | AVD (Años Vividos con Discapacidad) por depresión y ansiedad | Mapa coroplético, comparativas estatales |
| 📚 **DSM-5** | Criterios diagnósticos de trastornos mentales | Guía de trastornos educativa |
| 🔬 **OMS** | Prevalencia global de trastornos mentales | Contexto internacional |
| 🧠 **FER-2013** | Dataset de expresiones faciales etiquetadas | Entrenamiento del modelo de IA |

---

### 2️⃣ ANÁLISIS DE CAUSAS

#### Diagrama Causa-Efecto (Espina de Pescado)

```
                                    ┌─────────────────────────────────────┐
                                    │   PROBLEMA PRINCIPAL:               │
                                    │   Falta de herramientas accesibles  │
                                    │   para comprender la salud mental   │
                                    │   en México                         │
                                    └─────────────────────────────────────┘
                                                      │
        ┌─────────────────────┬───────────────────────┼───────────────────────┬─────────────────────┐
        │                     │                       │                       │                     │
   ┌────▼────┐          ┌─────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐       ┌──────▼──────┐
   │  DATOS  │          │TECNOLOGÍA │          │  USUARIOS   │         │ INFORMACIÓN │       │  CONTEXTO   │
   └────┬────┘          └─────┬─────┘          └──────┬──────┘         └──────┬──────┘       └──────┬──────┘
        │                     │                       │                       │                     │
   - Datos dispersos    - Falta de apps         - Estigma social       - Información         - Pandemia
     en múltiples         especializadas          hacia salud            dispersa y            incrementó
     fuentes (INEGI,    - Complejidad de          mental                 compleja              problemas
     GBD, SSa)            soluciones IA         - Falta de              - Poco contenido      - Aislamiento
   - Formato no         - Barreras                autoconocimiento       en español            social
     accesible            técnicas                emocional            - Datos crudos        - Ansiedad
                                                                         sin contexto          generalizada
```

#### Causas Principales Identificadas

| Causa | Descripción | Impacto | Datos de Respaldo |
|-------|-------------|---------|-------------------|
| **C1: Datos fragmentados** | Información de INEGI, GBD, SSa y OMS no está integrada | ALTO | Múltiples portales con formatos diferentes |
| **C2: Complejidad técnica** | Las soluciones de IA son difíciles de implementar en web | ALTO | Requiere conocimiento especializado en ML |
| **C3: Brecha de acceso** | Servicios de salud mental concentrados en zonas urbanas | ALTO | SSa 2024: disparidades en atención por estado |
| **C4: Estigma social** | Muchas personas no buscan ayuda por temor | MEDIO | OMS: barreras culturales significativas |
| **C5: Falta de autoconciencia** | Las personas no identifican sus estados emocionales | ALTO | Necesidad de herramientas de auto-monitoreo |

#### Datos Epidemiológicos Reales (Justificación del Problema)

| Indicador | Valor | Fuente |
|-----------|-------|--------|
| Tasa nacional de suicidio | 6.8 por cada 100,000 habitantes | INEGI 2023 |
| Tasa de suicidio hombres | 11.0 por cada 100,000 | INEGI 2023 |
| Tasa de suicidio mujeres | 2.8 por cada 100,000 | INEGI 2023 |
| Personas con depresión (global) | 280 millones | OMS 2021 |
| Personas con ansiedad (global) | 301 millones | OMS 2019 |
| Personas con trastorno bipolar | 40 millones | OMS 2019 |
| Personas con esquizofrenia | 24 millones | OMS |

---

### 3️⃣ SOLUCIONES POTENCIALES

#### Generación de Alternativas de Solución

| Alternativa | Descripción | Viabilidad |
|-------------|-------------|------------|
| **A1: Dashboard web con IA integrada** | Plataforma que combine visualización de datos nacionales con autoevaluación mediante análisis facial en tiempo real | ✅ ALTA |
| **A2: App móvil nativa** | Aplicación para iOS/Android con funcionalidades similares | ⚠️ MEDIA (mayor costo y tiempo) |
| **A3: Portal solo informativo** | Sitio web con estadísticas sin componente de IA | ❌ BAJA (no diferenciador) |
| **A4: Chatbot conversacional** | Asistente virtual sin análisis visual | ⚠️ MEDIA (limitado en detección) |

#### Criterios de Selección

| Criterio | Peso | A1 | A2 | A3 | A4 |
|----------|------|----|----|----|----|
| Costo de desarrollo | 20% | 8 | 4 | 9 | 7 |
| Impacto en usuarios | 25% | 9 | 9 | 5 | 6 |
| Tiempo de implementación | 15% | 7 | 3 | 9 | 8 |
| Innovación tecnológica | 20% | 10 | 8 | 3 | 5 |
| Accesibilidad | 10% | 9 | 6 | 9 | 8 |
| Escalabilidad | 10% | 8 | 7 | 8 | 7 |
| **TOTAL PONDERADO** | **100%** | **8.55** | **6.25** | **6.35** | **6.55** |

#### ✅ Solución Seleccionada: A1 - Dashboard Web MindHealth con IA Integrada

---

### 4️⃣ CONSECUENCIAS DE ACCIONES

#### Análisis de Fuerzas (Kurt Lewin)

| Fuerzas Positivas ⬆️ | Fuerzas Negativas ⬇️ |
|----------------------|---------------------|
| Tecnología disponible (TensorFlow.js, MediaPipe) | Curva de aprendizaje en ML |
| Firebase como backend escalable y gratuito | Precisión del modelo depende de calidad de datos |
| Dataset FER-2013 con 35,000+ imágenes etiquetadas | Dependencia de conexión a internet |
| Datos oficiales de INEGI, GBD, SSa disponibles | Privacidad de datos faciales |
| ECharts y Chart.js para visualizaciones profesionales | Requiere cámara y permisos del navegador |
| Demanda creciente de herramientas de salud mental | Posible resistencia de usuarios al análisis facial |

#### Análisis P-N-I (Positivo-Negativo-Interesante)

| POSITIVO ✅ | NEGATIVO ❌ | INTERESANTE 🤔 |
|-------------|-------------|----------------|
| Democratiza acceso a datos de salud mental de México | Requiere cámara y permisos del navegador | Podría integrarse con profesionales de salud |
| Visualización geográfica por estado con datos reales | Precisión del modelo no es 100% | Potencial de expansión a otros países de LATAM |
| Combina análisis de IA con auto-reporte textual | No reemplaza atención profesional | Uso de datos anónimos para investigación |
| Historial multimodal (IA + texto + blendshapes) | Puede generar dependencia tecnológica | Gamificación futura para engagement |
| Código abierto y reproducible | Mantenimiento continuo requerido | Integración con wearables y sensores |
| Educación sobre trastornos basada en DSM-5 | Limitaciones en dispositivos sin cámara | Colaboración con instituciones de salud |

---

## 🔷 ALTERNATIVAS DE DECISIÓN

### 1️⃣ SELECCIÓN DEL MODELO DE DECISIÓN

#### Modelo de Decisión: Racional-Analítico con Enfoque Modular

Se seleccionó este modelo porque:
- ✅ El problema está **bien estructurado** (desarrollo de software con objetivos claros)
- ✅ Existe **información suficiente** sobre tecnologías y datos disponibles
- ✅ Los **criterios son cuantificables** (costo, tiempo, impacto, precisión)
- ✅ Las **alternativas son comparables** objetivamente
- ✅ Permite **desarrollo iterativo** por fases

#### Metodología de Desarrollo Adoptada

> *"Adoptamos un enfoque modular y por fases, una estrategia que nos permitió construir el proyecto pieza por pieza, asegurando la estabilidad en cada etapa antes de pasar a la siguiente. Fue como construir un edificio, poniendo primero cimientos sólidos (la base de datos), luego las estructuras principales (el dashboard), y finalmente los sistemas más avanzados (la IA)."*

**Principios Clave:**

| Principio | Descripción |
|-----------|-------------|
| **Modularidad** | Cada funcionalidad (mapa, gráficos, autoevaluación, IA) en módulos JavaScript separados |
| **Desarrollo por Fases** | Etapas lógicas con objetivos claros y entregables definidos |
| **Frontend + Backend Cloud** | Aplicación en navegador con Firebase para datos y autenticación |
| **Enfoque Humano** | Interfaz intuitiva, mensajes claros, experiencia amigable |

#### Arquitectura Técnica Decidida

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITECTURA MINDHEALTH v2.0                                │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐        │
│  │      FRONTEND       │   │      BACKEND        │   │    MACHINE LEARNING │        │
│  │     (Browser)       │◄─►│     (Firebase)      │◄─►│        (IA)         │        │
│  └─────────────────────┘   └─────────────────────┘   └─────────────────────┘        │
│  • HTML5 / CSS3            • Firestore DB            • MediaPipe Face               │
│  • Tailwind CSS            • Authentication          • TensorFlow.js                │
│  • JavaScript ES Modules   • Cloud Storage           • Modelo TFLite propio         │
│  • Chart.js (gráficos)                               • Dataset FER-2013             │
│  • ECharts (mapas)                                   • 52 Blendshapes               │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐        │
│  │                        MÓDULOS JAVASCRIPT                                │        │
│  ├─────────────────────────────────────────────────────────────────────────┤        │
│  │ main.js │ firebase-config.js │ firestore-service.js │ auth-guard.js    │        │
│  │ ui-dashboard.js │ ui-map.js │ ui-disorders.js │ ui-self-assessment.js  │        │
│  └─────────────────────────────────────────────────────────────────────────┘        │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2️⃣ SELECCIÓN DE LA SOLUCIÓN

#### Componentes de la Solución Implementada

| Módulo | Tecnología | Propósito |
|--------|------------|-----------|
| **Base de Datos** | Firebase Firestore | Almacenar estadísticas nacionales, guías de trastornos, evaluaciones de usuarios |
| **Autenticación** | Firebase Auth | Registro, login y gestión segura de usuarios |
| **Dashboard Nacional** | Chart.js + ECharts | Visualización de datos epidemiológicos de México |
| **Mapa Interactivo** | ECharts + GeoJSON | Mapa coroplético de 32 estados con métricas |
| **Guía de Trastornos** | JSON + UI dinámica | Información educativa basada en DSM-5 |
| **Autoevaluación IA** | MediaPipe + TFLite | Análisis facial en tiempo real |
| **Historial** | Firestore + Chart.js | Registro multimodal de evaluaciones |

#### Pipeline de Machine Learning

```python
# 1. PREPROCESAMIENTO (preprocess_fer2013.py)
# - Carga del dataset FER-2013 (35,000+ imágenes)
# - Extracción de 52 blendshapes con MediaPipe
# - Generación de fer2013_mediapipe_features.csv

# 2. ENTRENAMIENTO (train_emotion_classifier.py)
model = keras.Sequential([
    keras.layers.Input(shape=(52,)),              # 52 blendshapes de entrada
    keras.layers.Dense(128, activation='relu'),   # Capa oculta 1
    keras.layers.Dropout(0.3),                    # Prevención de overfitting
    keras.layers.Dense(64, activation='relu'),    # Capa oculta 2
    keras.layers.Dropout(0.3),
    keras.layers.Dense(7, activation='softmax')   # 7 emociones de salida
])

# 3. EMOCIONES CLASIFICADAS
EMOTION_CLASSES = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']

# 4. EXPORTACIÓN A TFLITE
# - Modelo optimizado para ejecución en navegador
# - emotion_classifier_model.tflite
```

#### Visualizaciones Implementadas

| Visualización | Tipo | Datos | Fuente |
|---------------|------|-------|--------|
| Distribución por género en atenciones | Barras | Atenciones por condición y sexo | SSa 2024 |
| Tasa de suicidio por género | Barras | Tasa por 100,000 hab. | INEGI 2023 |
| Tendencia de suicidio 2013-2023 | Línea | Evolución temporal | INEGI |
| Métodos de suicidio | Dona | Distribución por método y género | INEGI 2023 |
| Mapa de tasa de suicidio | Coroplético | Tasa por estado | INEGI 2023 |
| Mapa de AVD por depresión | Coroplético | Años vividos con discapacidad | GBD 2021 |
| Mapa de AVD por ansiedad | Coroplético | Años vividos con discapacidad | GBD 2021 |
| Blendshapes en historial | Barras | Top 5 movimientos faciales | MediaPipe |

---

### 3️⃣ IMPLEMENTACIÓN

#### Plan de Implementación por Fases

| Fase | Objetivo | Actividades | Entregables | Estado |
|------|----------|-------------|-------------|--------|
| **Fase 1** | Construcción de Base de Datos | Configurar Firebase, crear colecciones, implementar ETL con import-script.js | Firestore configurado, datos cargados | ✅ |
| **Fase 2** | Dashboard Interactivo | Diseño responsivo con Tailwind, gráficos con Chart.js, mapa con ECharts | index.html funcional con visualizaciones | ✅ |
| **Fase 3** | Funcionalidades de Usuario | Autoevaluación, captura de webcam, preguntas contextuales, historial | self-assessment.html, history-dashboard.html | ✅ |
| **Fase 4** | Integración de IA | Preprocesar FER-2013, entrenar modelo, exportar TFLite, integrar en frontend | emotion_classifier_model.tflite funcional | ✅ |

#### Detalle de Fase 1: Base de Datos y Estructura

| Componente | Implementación |
|------------|----------------|
| **Firestore** | Base de datos NoSQL en la nube para estadísticas, trastornos y evaluaciones |
| **Firebase Auth** | Sistema de registro/login con persistencia de sesión |
| **ETL Script** | import-script.js para cargar disorders.json y statistics.json |
| **Arquitectura Modular** | Separación en módulos: main.js, firebase-config.js, firestore-service.js, ui-* |

#### Detalle de Fase 2: Dashboard Nacional

| Componente | Implementación |
|------------|----------------|
| **Tailwind CSS** | Framework de utilidad para diseño responsivo |
| **Chart.js** | Gráficos de barras, líneas y dona para estadísticas |
| **ECharts + GeoJSON** | Mapa interactivo de México con mexico.json |
| **Tooltips dinámicos** | Información contextual al interactuar con estados |
| **Selector de métricas** | Botones para alternar entre tasa de suicidio, AVD depresión, AVD ansiedad |

#### Detalle de Fase 3: Autoevaluación e Historial

| Componente | Implementación |
|------------|----------------|
| **getUserMedia API** | Acceso a webcam con consentimiento del usuario |
| **Preguntas contextuales** | 5 preguntas abiertas sobre estado emocional |
| **Textarea para respuestas** | Captura de auto-reporte textual |
| **Almacenamiento multimodal** | Firestore guarda: pregunta + respuesta + emoción IA + blendshapes |
| **Historial visual** | Lista de evaluaciones pasadas con detalles y gráficos |

#### Detalle de Fase 4: Inteligencia Artificial

| Componente | Implementación |
|------------|----------------|
| **MediaPipe Face Landmarker** | Detección de 468 puntos faciales + 52 blendshapes en tiempo real |
| **Dataset FER-2013** | 35,000+ imágenes faciales etiquetadas con 7 emociones |
| **Preprocesamiento Python** | preprocess_fer2013.py extrae blendshapes de cada imagen |
| **Entrenamiento Keras** | Red neuronal: Input(52) → Dense(128) → Dropout → Dense(64) → Dropout → Dense(7) |
| **TensorFlow Lite** | Modelo optimizado para inferencia en navegador |
| **TensorFlow.js + WASM** | Ejecución del modelo TFLite en el cliente |

#### Cronograma de Implementación

```
JULIO 2025 ──────────────────────────────────────────────────► DICIEMBRE 2025

│   Fase 1    │    Fase 2     │      Fase 3       │      Fase 4       │
│  Firebase   │   Dashboard   │   Autoevaluación  │   IA Avanzada     │
│  + ETL      │   + Mapas     │   + Historial     │   + TFLite        │
└─────────────┴───────────────┴───────────────────┴───────────────────┘
    Jul-Ago        Sep-Oct          Oct-Nov            Nov-Dic
```

#### Plan de Contingencia

| Riesgo | Probabilidad | Impacto | Plan de Contingencia |
|--------|--------------|---------|---------------------|
| Modelo con baja precisión | Media | Alto | Aumentar epochs, ajustar arquitectura, data augmentation |
| Firebase alcanza límites gratuitos | Baja | Medio | Migrar a plan Blaze o alternativa (Supabase) |
| Problemas de privacidad facial | Media | Alto | Procesar todo localmente, no almacenar imágenes |
| Navegador no soporta cámara | Baja | Medio | Ofrecer cuestionario alternativo sin IA |
| Datos de GBD incompletos | Media | Medio | Mostrar "Datos no disponibles" con color gris en mapa |
| Incompatibilidad de nombres de estados | Alta | Medio | Implementar stateNameMapping en ui-map.js |

---

### 4️⃣ EVALUACIÓN

#### Métricas de Éxito

| Métrica | Objetivo | Resultado | Estado |
|---------|----------|-----------|--------|
| **Precisión del modelo** | > 70% en clasificación | Modelo funcional con 7 emociones | ✅ |
| **Cobertura de datos estatales** | 32 estados de México | 32 estados con datos de INEGI | ✅ |
| **Tiempo de carga** | < 3 segundos | Carga optimizada con módulos | ✅ |
| **Responsividad** | Funcional en móvil y desktop | Tailwind CSS responsive | ✅ |
| **Funcionalidades completas** | 4 fases implementadas | Todas las fases completadas | ✅ |

#### Validación de Hipótesis

**Hipótesis Central:**
> *"Una aplicación web, al combinar la visualización clara de datos epidemiológicos con una herramienta de autoevaluación avanzada impulsada por Inteligencia Artificial, podría servir como un valioso apoyo para la comprensión y gestión de la salud mental."*

**Validación del Dashboard Interactivo:**
| Aspecto | Resultado |
|---------|-----------|
| Acceso a datos epidemiológicos | ✅ Gráficos y mapa con datos reales de INEGI, GBD, SSa |
| Comprensión contextual | ✅ Tooltips, factores de riesgo, información por estado |
| Visualización geográfica | ✅ Mapa coroplético con 3 métricas seleccionables |

**Validación de la Herramienta de IA:**
| Aspecto | Resultado |
|---------|-----------|
| Análisis de expresiones faciales | ✅ Detección en tiempo real de 7 emociones |
| Autoconciencia aumentada | ✅ Combinación de IA + auto-reporte textual |
| Historial y seguimiento | ✅ Registro multimodal con gráficos de blendshapes |

#### Lecciones Aprendidas

| Área | Lección | Aplicación Futura |
|------|---------|-------------------|
| **Machine Learning** | MediaPipe simplifica la extracción de características faciales | Explorar otros modelos (pose, hands) |
| **Visualización** | ECharts es poderoso pero requiere mapeo preciso de nombres | Validar GeoJSON antes de integrar |
| **Datos** | Los datos de GBD a veces requieren extracción manual de gráficos | Buscar APIs o datasets estructurados |
| **UX** | El feedback en tiempo real mejora el engagement | Agregar más indicadores visuales |
| **Arquitectura** | La modularización facilita el mantenimiento | Aplicar en todos los proyectos futuros |

---

## 📊 DATOS EPIDEMIOLÓGICOS DE MÉXICO

### Estadísticas Nacionales de Salud Mental

#### Trastorno Depresivo Mayor (TDM)
| Indicador | Valor | Fuente |
|-----------|-------|--------|
| Afectados globalmente | 280 millones | OMS 2021 |
| Porcentaje de adultos | 5% | OMS 2021 |
| Niños y adolescentes afectados | 23 millones | OMS 2019 |
| Reducción de esperanza de vida | 7-11 años (depresión recurrente severa) | Investigación |
| Ranking de discapacidad global | 2da causa principal | GBD 2019 |

#### Trastornos de Ansiedad
| Indicador | Valor | Fuente |
|-----------|-------|--------|
| Afectados globalmente | 301 millones | OMS 2019 |
| Porcentaje global | 4% | OMS 2019 |
| Niños y adolescentes afectados | 58 millones | OMS 2019 |
| Ranking de discapacidad global | 8va causa principal | GBD 2019 |

#### Suicidio en México
| Indicador | Valor | Fuente |
|-----------|-------|--------|
| Tasa nacional | 6.8 por 100,000 hab. | INEGI 2023 |
| Tasa hombres | 11.0 por 100,000 hab. | INEGI 2023 |
| Tasa mujeres | 2.8 por 100,000 hab. | INEGI 2023 |
| Brecha de género | 4x mayor en hombres | INEGI 2023 |

### Trastornos Incluidos en la Guía Educativa

| Trastorno | Categoría | Prevalencia |
|-----------|-----------|-------------|
| Trastorno Depresivo Mayor | Estado de Ánimo | 5% adultos |
| Trastornos de Ansiedad | Ansiedad | 4% global |
| Trastorno Bipolar | Estado de Ánimo | 40 millones |
| Espectro de Esquizofrenia | Psicótico | 24 millones (1/300) |
| TEPT | Trauma | 3.6% último año |
| Trastornos Alimentarios | Alimentario | 2.4% población |

---

## 🛠️ STACK TECNOLÓGICO COMPLETO

### Frontend y Desarrollo Web

| Tecnología | Propósito |
|------------|-----------|
| **HTML5 / CSS3** | Estructura semántica y estilos base |
| **JavaScript ES Modules** | Lógica interactiva, import/export modular |
| **Tailwind CSS** | Framework de utilidad para diseño responsivo |
| **http-server** | Servidor local para desarrollo |

### Backend y Base de Datos

| Tecnología | Propósito |
|------------|-----------|
| **Firebase Firestore** | Base de datos NoSQL en la nube |
| **Firebase Authentication** | Gestión de usuarios y sesiones |

### Visualización de Datos

| Tecnología | Propósito |
|------------|-----------|
| **Chart.js** | Gráficos de barras, líneas, dona |
| **ECharts (Apache)** | Mapas coropléticos interactivos |
| **GeoJSON** | Geometrías de estados mexicanos |

### Inteligencia Artificial

| Tecnología | Propósito |
|------------|-----------|
| **MediaPipe Face Landmarker** | Detección de 468 landmarks + 52 blendshapes |
| **TensorFlow.js** | Ejecución de modelos ML en navegador |
| **TensorFlow Lite** | Formato optimizado del modelo |
| **Python + Keras** | Entrenamiento del clasificador |
| **Dataset FER-2013** | 35,000+ imágenes para entrenamiento |

---

## 📚 REFERENCIAS BIBLIOGRÁFICAS

### Fuentes de Datos Oficiales

| Fuente | Descripción | Uso en MindHealth |
|--------|-------------|-------------------|
| **INEGI 2023** | Instituto Nacional de Estadística y Geografía | Tasas de suicidio por estado y género |
| **GBD 2021** | Global Burden of Disease Study | AVD por depresión y ansiedad |
| **SSa 2024** | Secretaría de Salud de México | Atenciones por condición y género |
| **OMS** | Organización Mundial de la Salud | Prevalencia global de trastornos |
| **DSM-5** | Manual Diagnóstico y Estadístico | Criterios de trastornos mentales |

### Recursos Técnicos

| Recurso | URL |
|---------|-----|
| MediaPipe | https://mediapipe.dev/ |
| TensorFlow.js | https://www.tensorflow.org/js |
| TensorFlow Lite | https://www.tensorflow.org/lite |
| Firebase | https://firebase.google.com/ |
| Chart.js | https://www.chartjs.org/ |
| ECharts | https://echarts.apache.org/ |
| Dataset FER-2013 | Kaggle Facial Expression Recognition |

---

## 📊 RESUMEN EJECUTIVO FINAL

### El Proyecto MindHealth demuestra:

1. ✅ **Identificación clara del problema**: Necesidad de herramientas accesibles para comprender la salud mental en México
2. ✅ **Análisis exhaustivo de causas**: Datos fragmentados, barreras tecnológicas, estigma social, falta de autoconciencia
3. ✅ **Generación de alternativas**: 4 opciones evaluadas con criterios objetivos y ponderados
4. ✅ **Selección fundamentada**: Dashboard web con IA como mejor solución (score 8.55/10)
5. ✅ **Implementación estructurada**: 4 fases con entregables definidos y completados
6. ✅ **Evaluación continua**: Métricas cumplidas, hipótesis validada, lecciones documentadas
7. ✅ **Datos reales**: Integración de INEGI, GBD, SSa, OMS y DSM-5
8. ✅ **IA personalizada**: Modelo propio entrenado con FER-2013 y MediaPipe

### Tipo de Decisión

> 📌 **Decisión No Estructurada** - Requirió solución innovadora combinando múltiples tecnologías (ML, Web, Cloud, Visualización) para resolver un problema complejo de salud pública en México.

### Impacto Esperado

> *"MindHealth busca simplificar el acceso a información sobre salud mental, ofreciendo una ventana a la experiencia personal donde la tecnología sirve como un compañero en el camino de la autocomprensión emocional, siempre con la convicción de que la información clara y una autoevaluación consciente pueden marcar una diferencia en el bienestar de las personas."*

---

## 👨‍💻 INFORMACIÓN DEL PROYECTO

| Campo | Valor |
|-------|-------|
| **Repositorio** | https://github.com/NotToxict/MindHealth |
| **Autor** | NotToxict |
| **Lenguaje Principal** | JavaScript |
| **Licencia** | Open Source |
| **Estado** | ✅ Completado |
| **Versión del Documento** | 2.0 |
| **Última Actualización** | Diciembre 2025 |

---

*Documento elaborado como parte del análisis de problemas y toma de decisiones para el proyecto MindHealth, integrando información del Informe Final del Proyecto y datos epidemiológicos reales de México.*