// ui-self-assessment.js
// Este módulo maneja la lógica de la autoevaluación activa y el historial.

import { auth, db } from './firebase-config.js'; 
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    getDocs 
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

import { FaceLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

let faceLandmarker = null; 
let questions = []; 
let currentQuestionIndex = 0;
let assessmentResults = []; 
let currentQuestionRecording = []; 
let animationFrameId = null; 

let emotionClassifierModel = null;

// Referencias a elementos UI (se obtienen en initializeSelfAssessment)
let webcamFeed, webcamStatus, startAssessmentButton, nextQuestionButton, endAssessmentButton;
let questionTextElement, emotionsFeedbackElement;
let faceDrawingCanvas, faceDrawingCtx;

// Traducción de blendshapes
const blendshapeTranslations = {
    "mouthSmileRight": "Sonrisa Derecha", "mouthSmileLeft": "Sonrisa Izquierda",
    "browInnerUp": "Cejas Interiores Arriba", "eyeSquintLeft": "Ojo Entrecerrado Izquierdo",
    "eyeLookDownLeft": "Mirada Abajo Izquierda", "browOuterUpLeft": "Cejas Exteriores Arriba Izquierda",
    "eyeLookUpLeft": "Mirada Arriba Izquierda", "eyeLookOutLeft": "Mirada Izquierda (Ojo Izquierdo)",
    "eyeLookInLeft": "Mirada Adentro (Ojo Izquierdo)", "eyeLookDownRight": "Mirada Abajo Derecha",
    "browOuterUpRight": "Cejas Exteriores Arriba Derecha", "eyeLookUpRight": "Mirada Arriba Derecha",
    "eyeLookOutRight": "Mirada Derecha (Ojo Derecho)", "eyeLookInRight": "Mirada Adentro (Ojo Derecho)",
    "jawOpen": "Mandíbula Abierta", "mouthFrownLeft": "Ceño Fruncido Boca Izquierda",
    "mouthFrownRight": "Ceño Fruncido Boca Derecha", "noseSneerLeft": "Nariz Arrugada Izquierda",
    "noseSneerRight": "Nariz Arrugada Derecha", "browDownLeft": "Ceja Abajo Izquierda",
    "browDownRight": "Ceja Abajo Derecha", "mouthClose": "Boca Cerrada",
    "mouthFunnel": "Boca en Embudo", "mouthPucker": "Boca Fruncida",
    "mouthDimpleLeft": "Hoyuelo Izquierdo", "mouthDimpleRight": "Hoyuelo Derecho",
    "mouthStretch": "Boca Estirada", "mouthRollUpper": "Labio Superior Enrollado",
    "mouthRollLower": "Labio Inferior Enrollado", "mouthShrugUpper": "Labio Superior Encogido",
    "mouthShrugLower": "Labio Inferior Encogido", "mouthPressLeft": "Boca Apretada Izquierda",
    "mouthPressRight": "Boca Apretada Derecha", "mouthLeft": "Boca Izquierda",
    "mouthRight": "Boca Derecha", "mouthOpen": "Boca Abierta",
    "mouthUpperUp": "Labio Superior Arriba", "mouthLowerDown": "Labio Inferior Abajo",
    "mouthSadLeft": "Boca Triste Izquierda", "mouthSadRight": "Boca Triste Derecha",
    "mouthKiss": "Boca de Beso", "mouthWhistle": "Boca Silbando",
    "mouthSmile": "Sonrisa General", "mouthStretchLeft": "Boca Estirada Izquierda",
    "mouthStretchRight": "Boca Estirada Derecha", "mouthUpperUpLeft": "Labio Superior Arriba Izquierda",
    "mouthUpperUpRight": "Labio Superior Arriba Derecha", "mouthLowerDownLeft": "Labio Inferior Abajo Izquierda",
    "mouthLowerDownRight": "Labio Inferior Abajo Derecha", "cheekPuff": "Mejilla Hinchada",
    "cheekSquintLeft": "Mejilla Entrecerrada Izquierda", "cheekSquintRight": "Mejilla Entrecerrada Derecha",
    "eyeBlinkLeft": "Pestañeo Izquierdo", "eyeBlinkRight": "Pestañeo Derecho",
    "jawForward": "Mandíbula Adelante", "jawLeft": "Mandíbula Izquierda", "jawRight": "Mandíbula Derecha",
    "neutral": "Neutral",
    "happy": "Feliz",
    "sad": "Triste",
    "angry": "Enojado",
    "surprised": "Sorprendido",
    "disgust": "Asco",
    "fear": "Temor"
};

const TFLITE_EMOTION_CLASSES = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];

export async function initializeSelfAssessment() {
    webcamFeed = document.getElementById('webcam-feed');
    webcamStatus = document.getElementById('webcam-status');
    startAssessmentButton = document.getElementById('start-assessment-button');
    nextQuestionButton = document.getElementById('next-question-button');
    endAssessmentButton = document.getElementById('end-assessment-button');
    questionTextElement = document.getElementById('question-text');
    emotionsFeedbackElement = document.getElementById('emotions-feedback');
    faceDrawingCanvas = document.getElementById('face-drawing-canvas');

    const requiredElements = { 
        webcamFeed, webcamStatus, startAssessmentButton, nextQuestionButton, 
        endAssessmentButton, questionTextElement, emotionsFeedbackElement, 
        faceDrawingCanvas
    };
    for (const key in requiredElements) {
        if (!requiredElements[key]) {
            console.error(`Error Crítico: El elemento HTML con id '${key}' no se encontró. Revisa 'self-assessment.html'.`);
            if (webcamStatus) webcamStatus.textContent = "Error: Faltan componentes en la página.";
            return;
        }
    }
    faceDrawingCtx = faceDrawingCanvas.getContext('2d');

    questions = [
        { id: 'q1', text: "¿Cómo te sientes hoy en general?" },
        { id: 'q2', text: "¿Qué te preocupa o te hace sentir tenso últimamente?" },
        { id: 'q3', text: "¿Hay algo que te haga sentir particularmente feliz o satisfecho?" },
        { id: 'q4', text: "¿Has notado cambios en tu energía o estado de ánimo recientemente?" },
        { id: 'q5', text: "¿Qué emoción crees que predomina en tu expresión ahora mismo?" }
    ];

    startAssessmentButton.addEventListener('click', () => startAssessment());
    nextQuestionButton.addEventListener('click', () => showNextQuestion());
    endAssessmentButton.addEventListener('click', () => endAssessment());

    try {
        webcamStatus.textContent = "Inicializando TensorFlow.js...";
        await tf.setBackend('wasm'); 
        await tf.ready(); 
        console.log("TensorFlow.js y backend WASM inicializados y listos.");

        if (!emotionClassifierModel) {
            webcamStatus.textContent = "Cargando modelo de emociones (TensorFlow.js)...";
            try {
                emotionClassifierModel = await tf.lite.loadTFLiteModel('./models/emotion_classifier_model.tflite'); 
                console.log("Modelo de clasificador de emociones cargado con TensorFlow.js.");
                emotionsFeedbackElement.textContent = "Modelos listos. Esperando cámara...";
            } catch (modelError) {
                console.error("ERROR al cargar el modelo TFLite:", modelError);
                webcamStatus.textContent = `Error al cargar el modelo de emociones: ${modelError.message}.`;
            }
        }

        if (!faceLandmarker) {
            webcamStatus.textContent = "Cargando modelo de IA (MediaPipe)...";
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"); 
            faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: { modelAssetPath: `./models/face_landmarker.task`, delegate: "GPU" },
                outputFaceBlendshapes: true, 
                runningMode: "VIDEO",
                outputFaceGeometry: true 
            });
            console.log("MediaPipe FaceLandmarker inicializado.");
        }
        
        await setupWebcam();
    } catch (error) {
        console.error("Error inicializando modelos de IA (general):", error);
        webcamStatus.textContent = `Error al cargar la IA: ${error.message}. Intenta recargar la página o revisa la consola.`;
    }
}

async function setupWebcam() {
    try {
        webcamStatus.textContent = "Solicitando acceso a la cámara...";
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamFeed.srcObject = stream;
        webcamFeed.addEventListener('loadeddata', () => {
            faceDrawingCanvas.width = webcamFeed.videoWidth;
            faceDrawingCanvas.height = webcamFeed.videoHeight;
            webcamStatus.textContent = "Cámara lista. Por favor, asegúrate de que tu rostro está visible.";
            startAssessmentButton.disabled = false;
            startAssessmentButton.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        webcamStatus.textContent = `Error: ${err.message}. Asegúrate de dar permisos.`;
    }
}

let lastVideoTime = -1;
async function predictWebcam() {
    if (webcamFeed.readyState < 2) { 
        animationFrameId = window.requestAnimationFrame(() => predictWebcam());
        return;
    }

    faceDrawingCtx.clearRect(0, 0, faceDrawingCanvas.width, faceDrawingCanvas.height);

    if (webcamFeed.currentTime !== lastVideoTime) {
        const results = faceLandmarker.detectForVideo(webcamFeed, performance.now());
        lastVideoTime = webcamFeed.currentTime;

        if (results.detections && results.detections.length > 0) {
            results.detections.forEach(detection => {
                const bbox = detection.boundingBox;
                faceDrawingCtx.strokeStyle = 'lime'; 
                faceDrawingCtx.lineWidth = 2;
                faceDrawingCtx.strokeRect(bbox.originX, bbox.originY, bbox.width, bbox.height);
            });
        }

        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
            const blendshapes = results.faceBlendshapes[0].categories;
            const relevantBlendshapes = blendshapes.filter(b => b.score > 0.05).map(b => ({ categoryName: b.categoryName, score: parseFloat(b.score.toFixed(3)) }));
            
            let predictedEmotion = { categoryName: 'neutral', score: 1.0, translatedName: 'Neutral' };

            if (emotionClassifierModel && blendshapeNamesGlobal.length > 0) {
                const inputData = new Float32Array(blendshapeNamesGlobal.length);
                for (let i = 0; i < blendshapeNamesGlobal.length; i++) {
                    const bs = blendshapes.find(b => b.categoryName === blendshapeNamesGlobal[i]);
                    inputData[i] = bs ? bs.score : 0.0;
                }
                
                const inputTensor = tf.tensor([inputData]); 
                const predictions = emotionClassifierModel.predict(inputTensor);
                const scores = predictions.dataSync();
                inputTensor.dispose();

                const maxScoreIndex = scores.indexOf(Math.max(...scores));
                const predictedEmotionName = TFLITE_EMOTION_CLASSES[maxScoreIndex];
                const predictedScore = scores[maxScoreIndex];

                predictedEmotion = {
                    categoryName: predictedEmotionName,
                    score: predictedScore,
                    translatedName: blendshapeTranslations[predictedEmotionName] || predictedEmotionName.charAt(0).toUpperCase() + predictedEmotionName.slice(1),
                    allScores: Array.from(scores) // ⭐ AGREGAR TODOS LOS SCORES
                };

                if (predictedEmotion.score < 0.5 && predictedEmotion.categoryName !== 'neutral') {
                    predictedEmotion = { 
                        categoryName: 'neutral', 
                        score: 1.0, 
                        translatedName: 'Neutral',
                        allScores: Array.from(scores) // ⭐ TAMBIÉN AQUÍ
                    };
                }

            } else {
                predictedEmotion = inferGeneralEmotionFromBlendshapes(blendshapes);
            }
            
            currentQuestionRecording.push({ 
                timestamp: new Date().toISOString(), 
                blendshapes: relevantBlendshapes,
                predictedEmotion: predictedEmotion
            });
            
            emotionsFeedbackElement.textContent = `Detectando: ${predictedEmotion.translatedName} (${(predictedEmotion.score * 100).toFixed(1)}%)`;

        } else {
            emotionsFeedbackElement.textContent = "Asegúrate de que tu rostro esté bien iluminado y centrado.";
            faceDrawingCtx.clearRect(0, 0, faceDrawingCanvas.width, faceDrawingCanvas.height);
        }
    }
    animationFrameId = window.requestAnimationFrame(() => predictWebcam());
}

function inferGeneralEmotionFromBlendshapes(blendshapes) {
    let dominantEmotion = { categoryName: 'neutral', score: 0, translatedName: 'Neutral' };

    const bsMap = new Map(blendshapes.map(b => [b.categoryName, b.score]));

    const emotionCriteria = {
        'happy': { blendshapes: {'mouthSmileLeft': 1.0, 'mouthSmileRight': 1.0, 'mouthSmile': 0.8, 'cheekSquintLeft': 0.7, 'cheekSquintRight': 0.7}, minScoreThreshold: 0.3 },
        'sad': { blendshapes: {'mouthFrownLeft': 1.0, 'mouthFrownRight': 1.0, 'mouthSadLeft': 0.8, 'mouthSadRight': 0.8, 'browInnerUp': 0.6, 'eyeLookDownLeft': 0.4, 'eyeLookDownRight': 0.4}, minScoreThreshold: 0.2 },
        'angry': { blendshapes: {'browDownLeft': 1.0, 'browDownRight': 1.0, 'noseSneerLeft': 0.7, 'noseSneerRight': 0.7, 'mouthPressLeft': 0.5, 'mouthPressRight': 0.5, 'jawForward': 0.4}, excludeIfActive: {'mouthSmileLeft': 0.1, 'mouthSmileRight': 0.1, 'jawOpen': 0.2}, minScoreThreshold: 0.3 },
        'surprised': { blendshapes: {'jawOpen': 1.0, 'eyeLookUpLeft': 0.7, 'eyeLookUpRight': 0.7, 'browOuterUpLeft': 0.8, 'browOuterUpRight': 0.8, 'browInnerUp': 0.5}, minScoreThreshold: 0.2 },
        'disgust': { blendshapes: {'noseSneerLeft': 1.0, 'noseSneerRight': 1.0, 'mouthFunnel': 0.5, 'mouthPucker': 0.5}, minScoreThreshold: 0.2 },
        'fear': { blendshapes: {'browInnerUp': 0.7, 'browOuterUpLeft': 0.7, 'browOuterUpRight': 0.7, 'eyeWideLeft': 0.8, 'eyeWideRight': 0.8, 'mouthStretch': 0.6}, minScoreThreshold: 0.2 }
    };

    let maxOverallScore = 0;
    let overallEmotion = 'neutral';

    for (const emotionName in emotionCriteria) {
        const criteria = emotionCriteria[emotionName];
        let currentEmotionScore = 0;
        let activeBlendshapeCount = 0;
        let excludedActive = false;

        if (criteria.excludeIfActive) {
            for (const excludeBsName in criteria.excludeIfActive) {
                if (bsMap.get(excludeBsName) > criteria.excludeIfActive[excludeBsName]) {
                    excludedActive = true;
                    break;
                }
            }
        }
        if (excludedActive) continue;

        for (const blendshapeName in criteria.blendshapes) {
            const weight = criteria.blendshapes[blendshapeName];
            const score = bsMap.get(blendshapeName) || 0;
            currentEmotionScore += score * weight;
            if (score > 0.05) activeBlendshapeCount++;
        }

        if (activeBlendshapeCount > 0 && currentEmotionScore / activeBlendshapeCount > criteria.minScoreThreshold) {
            const avgScore = currentEmotionScore / activeBlendshapeCount;
            if (avgScore > maxOverallScore) {
                maxOverallScore = avgScore;
                overallEmotion = emotionName;
            }
        }
    }

    dominantEmotion.categoryName = overallEmotion;
    dominantEmotion.score = maxOverallScore;
    dominantEmotion.translatedName = blendshapeTranslations[overallEmotion] || overallEmotion.charAt(0).toUpperCase() + overallEmotion.slice(1);

    if (dominantEmotion.score < 0.25 && overallEmotion === 'neutral') {
        dominantEmotion.score = 1.0;
    }

    // ⭐ CREAR SCORES SIMULADOS PARA COMPATIBILIDAD
    const simulatedScores = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]; // 7 emociones
    const emotionIndex = TFLITE_EMOTION_CLASSES.indexOf(overallEmotion);
    if (emotionIndex !== -1) {
        simulatedScores[emotionIndex] = dominantEmotion.score;
    }
    dominantEmotion.allScores = simulatedScores;

    return dominantEmotion;
}

// CRUCIAL: Incluir "_neutral" al inicio como en el código que funciona
const blendshapeNamesGlobal = [
    "_neutral", "browDownLeft", "browDownRight", "browInnerUp", "browOuterUpLeft", "browOuterUpRight", 
    "cheekPuff", "cheekSquintLeft", "cheekSquintRight", "eyeBlinkLeft", "eyeBlinkRight", 
    "eyeLookDownLeft", "eyeLookDownRight", "eyeLookInLeft", "eyeLookInRight", "eyeLookOutLeft", 
    "eyeLookOutRight", "eyeLookUpLeft", "eyeLookUpRight", "eyeSquintLeft", "eyeSquintRight", 
    "eyeWideLeft", "eyeWideRight", "jawForward", "jawLeft", "jawOpen", "jawRight", 
    "mouthClose", "mouthDimpleLeft", "mouthDimpleRight", "mouthFrownLeft", "mouthFrownRight", 
    "mouthFunnel", "mouthLeft", "mouthLowerDownLeft", "mouthLowerDownRight", "mouthOpen", 
    "mouthPucker", "mouthRight", "mouthRollLower", "mouthRollUpper", "mouthShrugLower", 
    "mouthShrugUpper", "mouthSmile", "mouthSmileLeft", "mouthSmileRight", "mouthStretch", 
    "mouthStretchLeft", "mouthStretchRight", "mouthUpperUpLeft", "mouthUpperUpRight", 
    "noseSneerLeft", "noseSneerRight"
];

function startAssessment() {
    startAssessmentButton.classList.add('js-hide');
    nextQuestionButton.classList.remove('js-hide');
    endAssessmentButton.classList.remove('js-hide');
    webcamStatus.classList.add('js-hide');
    emotionsFeedbackElement.classList.remove('js-hide');
    webcamFeed.classList.add('active-assessment');
    assessmentResults = [];
    currentQuestionIndex = 0;
    showQuestion();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    predictWebcam();
}

function showQuestion() {
    currentQuestionRecording = []; 
    if (currentQuestionIndex < questions.length) {
        questionTextElement.textContent = questions[currentQuestionIndex].text;
    } else {
        endAssessment();
    }
    const textarea = document.getElementById('question-answer');
    if (textarea) textarea.value = '';
}

function showNextQuestion() {
    if (currentQuestionRecording.length > 0) {
        const summarizedData = summarizeEmotionData(currentQuestionRecording);
        const lastPredictedEmotion = currentQuestionRecording[currentQuestionRecording.length - 1]?.predictedEmotion;
        const userAnswer = document.getElementById('question-answer')?.value ?? '';
        assessmentResults.push({
            questionId: questions[currentQuestionIndex].id,
            questionText: questions[currentQuestionIndex].text,
            summary: summarizedData,
            predictedEmotion: lastPredictedEmotion,
            userAnswer: userAnswer
        });
    }
    currentQuestionIndex++;
    showQuestion();
}

async function endAssessment() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    if (currentQuestionIndex < questions.length && currentQuestionRecording.length > 0) {
        const summarizedData = summarizeEmotionData(currentQuestionRecording);
        const lastPredictedEmotion = currentQuestionRecording[currentQuestionRecording.length - 1]?.predictedEmotion;
        const userAnswer = document.getElementById('question-answer')?.value ?? '';
        assessmentResults.push({
            questionId: questions[currentQuestionIndex].id,
            questionText: questions[currentQuestionIndex].text,
            summary: summarizedData,
            predictedEmotion: lastPredictedEmotion,
            userAnswer: userAnswer
        });
    }

    questionTextElement.textContent = "Evaluación finalizada. Guardando tus resultados...";
    nextQuestionButton.classList.add('js-hide');
    endAssessmentButton.classList.add('js-hide');
    emotionsFeedbackElement.classList.add('js-hide');
    webcamFeed.classList.remove('active-assessment');
    if (webcamFeed.srcObject) {
        webcamFeed.srcObject.getTracks().forEach(track => track.stop());
        webcamFeed.srcObject = null;
    }
    faceDrawingCtx.clearRect(0, 0, faceDrawingCanvas.width, faceDrawingCanvas.height);

    const user = auth.currentUser;
    if (user && assessmentResults.length > 0) {
        try {
            const docRef = await addDoc(collection(db, "users", user.uid, "assessments"), {
                userId: user.uid,
                timestamp: new Date().toISOString(),
                summarizedResults: assessmentResults
            });
            console.log("Evaluación guardada con ID:", docRef.id);
            questionTextElement.textContent = "¡Resultados guardados! Ya puedes ver tu historial o comenzar de nuevo.";
        } catch (error) {
            console.error("Error guardando la evaluación:", error);
            questionTextElement.textContent = "Hubo un error al guardar. Por favor, inténtalo de nuevo.";
        }
    } else {
        questionTextElement.textContent = "Debes iniciar sesión para guardar tus resultados de evaluación.";
    }
    startAssessmentButton.classList.remove('js-hide');
    webcamStatus.classList.remove('js-hide');
    await setupWebcam();
}

function summarizeEmotionData(dataPoints) {
    if (!dataPoints || dataPoints.length === 0) return {};
    const emotionScores = {}, emotionCounts = {};
    dataPoints.forEach(dp => dp.blendshapes.forEach(bs => {
        emotionScores[bs.categoryName] = (emotionScores[bs.categoryName] || 0) + bs.score;
        emotionCounts[bs.categoryName] = (emotionCounts[bs.categoryName] || 0) + 1;
    }));
    const averageEmotions = Object.keys(emotionScores).map(key => ({
        categoryName: key,
        averageScore: parseFloat((emotionScores[key] / emotionCounts[key]).toFixed(3))
    })).sort((a, b) => b.averageScore - a.averageScore);
    return {
        totalFrames: dataPoints.length,
        averageEmotions: averageEmotions.slice(0, 5),
        dominantBlendshape: averageEmotions[0] || { categoryName: "N/A", averageScore: 0 }
    };
}

// =========================== HISTORIAL ===========================

export async function loadPastAssessmentsForCurrentUser(userId) {
    const listElement = document.getElementById('past-assessments-list');
    const historyWrapper = document.getElementById('history-wrapper');
    const detailSection = document.getElementById('detailed-assessment-view');
    const listSection = document.getElementById('assessment-history-list-section');

    if (!listElement || !historyWrapper || !detailSection || !listSection) {
        console.error("Error: Elementos del historial no encontrados en history-dashboard.html.");
        return;
    }

    listElement.innerHTML = `<li>Cargando historial...</li>`;
    try {
        const q = query(collection(db, "users", userId, "assessments"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            listElement.innerHTML = `<li>No hay evaluaciones guardadas.</li>`;
            return;
        }
        listElement.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = new Date(data.timestamp).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' });
            const listItem = document.createElement('li');
            listItem.className = "p-2 rounded-md hover:bg-slate-200 cursor-pointer";
            listItem.textContent = `${date} - ${data.summarizedResults.length} preguntas`;
            listItem.addEventListener('click', () => displayDetailedAssessment(data));
            listElement.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error cargando el historial:", error);
        listElement.innerHTML = `<li>Error al cargar el historial.</li>`;
    }
}

export function displayDetailedAssessment(data) {
    const listSection = document.getElementById('assessment-history-list-section');
    const detailSection = document.getElementById('detailed-assessment-view');
    const dateElement = document.getElementById('assessment-date');
    const contentElement = document.getElementById('detailed-results-content');
    const closeDetailedViewButton = document.getElementById('close-detailed-view');

    if (!listSection || !detailSection || !dateElement || !contentElement || !closeDetailedViewButton) {
        console.error("Error: Elementos de la vista detallada no encontrados en history-dashboard.html.");
        return;
    }

    listSection.classList.add('js-hide');
    detailSection.classList.remove('js-hide');
    dateElement.textContent = `del ${new Date(data.timestamp).toLocaleString('es-MX')}`;
    
    if (typeof Chart !== 'undefined') {
        Array.from(contentElement.querySelectorAll('canvas')).forEach(canvas => {
            const chart = Chart.getChart(canvas);
            if (chart) {
                chart.destroy();
            }
        });
    } else {
        console.warn("Chart.js no está definido. Los gráficos no se renderizarán.");
    }

    contentElement.innerHTML = '';

    if (data.summarizedResults && data.summarizedResults.length > 0) {
        data.summarizedResults.forEach((result, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'p-4 border-b border-slate-200';

            // ⭐ CALCULAR EMOCIÓN PRINCIPAL, INTERMEDIA Y MENOS DOMINANTE
            const translatedPredictedEmotion = result.predictedEmotion?.translatedName || 'N/A';
            let leastEmotionName = 'N/A';
            let leastEmotionScore = null;
            let midEmotionName = 'N/A';
            let midEmotionScore = null;

            if (result.predictedEmotion?.allScores) {
                // Filtrar emociones con score > 0 (todas del modelo)
                const scoresArr = Array.from(result.predictedEmotion.allScores);
                // Dominante = max, menos dominante = min, intermedia = median (ordenando)
                const scoreObjs = scoresArr.map((score, idx) => ({
                    name: TFLITE_EMOTION_CLASSES[idx],
                    score: score
                })).sort((a, b) => b.score - a.score);

                leastEmotionName = blendshapeTranslations[scoreObjs[scoreObjs.length-1].name] || scoreObjs[scoreObjs.length-1].name;
                leastEmotionScore = scoreObjs[scoreObjs.length-1].score;
                
                // Si hay más de 2 emociones, mostrar la del medio como intermedia
                if (scoreObjs.length > 2) {
                    const midIdx = Math.floor(scoreObjs.length/2);
                    midEmotionName = blendshapeTranslations[scoreObjs[midIdx].name] || scoreObjs[midIdx].name;
                    midEmotionScore = scoreObjs[midIdx].score;
                }
            }

            resultDiv.innerHTML = `
                <p class="font-semibold text-slate-800">${index + 1}. ${result.questionText}</p>
                <p class="text-sm mt-2">Emoción principal detectada: <strong>${translatedPredictedEmotion}</strong></p>
                <p class="text-sm mt-2">Emoción intermedia: <strong>${midEmotionName} (${midEmotionScore !== null ? (midEmotionScore*100).toFixed(1)+'%' : ''})</strong></p>
                <p class="text-sm mt-2">Emoción menos dominante: <strong>${leastEmotionName} (${leastEmotionScore !== null ? (leastEmotionScore*100).toFixed(1)+'%' : ''})</strong></p>
                <p class="text-sm mt-2">Respuesta escrita: <em>${result.userAnswer ? result.userAnswer : 'Sin respuesta.'}</em></p>
                <div class="chart-container h-48 w-full mt-2">
                    <canvas id="chart-q-${data.timestamp}-${index}"></canvas>
                </div>
            `;
            contentElement.appendChild(resultDiv);

            const ctx = document.getElementById(`chart-q-${data.timestamp}-${index}`)?.getContext('2d');
            if (ctx && typeof Chart !== 'undefined' && result.summary && result.summary.averageEmotions && result.summary.averageEmotions.length > 0) {
                const labels = result.summary.averageEmotions.map(e => blendshapeTranslations[e.categoryName] || e.categoryName);
                const scores = result.summary.averageEmotions.map(e => e.averageScore);
                
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Intensidad Promedio',
                            data: scores,
                            backgroundColor: 'rgba(59, 130, 246, 0.6)', 
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 1, 
                                title: {
                                    display: true,
                                    text: 'Score Promedio'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Blendshape'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    title: function(tooltipItems) {
                                        return 'Blendshape: ' + tooltipItems[0].label; 
                                    },
                                    label: function(context) {
                                        return `${context.dataset.label}: ${(context.raw * 100).toFixed(1)}%`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    } else {
        contentElement.innerHTML = '<p class="text-center text-slate-500">No hay datos de emociones registrados para esta evaluación.</p>';
    }

    closeDetailedViewButton.onclick = () => {
        detailSection.classList.add('js-hide');
        listSection.classList.remove('js-hide');
    };
}