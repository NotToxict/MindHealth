// Estado del usuario basado en historial de evaluaciones + barra iOS con cara animada.

import { auth, db } from './firebase-config.js';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

const TFLITE_EMOTION_CLASSES = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
const idx = { angry:0, disgust:1, fear:2, happy:3, sad:4, surprise:5, neutral:6 };

const lexicon = {
  positive: ['feliz','contento','contenta','bien','tranquilo','tranquila','relajado','relajada','motivado','motivada','agradecido','agradecida','entusiasmado','entusiasmada','satisfecho','satisfecha','optimista','esperanzado','esperanzada'],
  negative: ['mal','triste','cansado','cansada','agotado','agotada','desesperado','desesperada','culpable','inutil','inútil','sin','solo','sola','vacio','vacío','decaido','decaído'],
  anxiety: ['ansioso','ansiosa','ansiedad','nervioso','nerviosa','preocupado','preocupada','preocupacion','preocupación','miedo','panico','pánico','tenso','tensa','inquieto','inquieta','estresado','estresada'],
  depression: ['deprimido','deprimida','depresion','depresión','sin energia','sin energía','apatia','apatía','anhedonia','desinteresado','desinteresada','insomnio','fatiga','llanto','triste'],
  anger: ['enojado','enojada','ira','furioso','furiosa','rabia','molesto','molesta','irritado','irritada','frustrado','frustrada'],
  stress: ['estres','estrés','estresado','estresada','saturado','saturada','abrumado','abrumada','presion','presión','colapsado','colapsada']
};

function normalizeText(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
function scoreLexicon(text) {
  const t = normalizeText(text);
  const tokens = t.split(/[^a-zñ]+/i).filter(Boolean);
  const counts = { positive:0, negative:0, anxiety:0, depression:0, anger:0, stress:0 };
  const total = Math.max(tokens.length, 1);
  const clip = (x, maxPerWord = 0.08) => Math.min(1, x / total / maxPerWord);

  for (const [key, words] of Object.entries(lexicon)) {
    for (const w of words) {
      const nw = normalizeText(w);
      counts[key] += tokens.filter(tok => tok === nw).length;
    }
  }
  return {
    positive: clip(counts.positive),
    negative: clip(counts.negative),
    anxiety: clip(counts.anxiety),
    depression: clip(counts.depression),
    anger: clip(counts.anger),
    stress: clip(counts.stress)
  };
}

function getAllScoresFromResult(result) {
  const pe = result?.predictedEmotion;
  if (pe?.allScores && Array.isArray(pe.allScores) && pe.allScores.length === 7) {
    return pe.allScores.map(Number);
  }
  const arr = new Array(7).fill(0);
  if (pe?.categoryName && idx[pe.categoryName] !== undefined) {
    arr[idx[pe.categoryName]] = Math.max(0.6, pe.score || 0.6);
  }
  return arr;
}

function computeAggregates(assessments, maxDocs = 8) {
  const docs = assessments.slice(0, maxDocs);
  if (!docs.length) return null;

  const totals = new Array(7).fill(0);
  let count = 0;

  const perEvalNegIndex = [];
  const textAgg = { positive:0, negative:0, anxiety:0, depression:0, anger:0, stress:0 };
  let textCount = 0;

  docs.forEach((docData) => {
    const results = docData.summarizedResults || [];
    let evalTotals = new Array(7).fill(0);
    let evalCount = 0;

    results.forEach((r) => {
      const scores = getAllScoresFromResult(r);
      for (let i=0;i<7;i++){ totals[i]+=scores[i]; evalTotals[i]+=scores[i]; }
      count++; evalCount++;

      if (typeof r.userAnswer === 'string' && r.userAnswer.trim().length > 0) {
        const ts = scoreLexicon(r.userAnswer);
        for (const k in textAgg) textAgg[k] += ts[k];
        textCount++;
      }
    });

    if (evalCount > 0) {
      const avgEval = evalTotals.map(v => v / evalCount);
      const negIdx = (avgEval[idx.angry] + avgEval[idx.disgust] + avgEval[idx.fear] + avgEval[idx.sad]) / 4;
      perEvalNegIndex.push({ ts: docData.timestamp, value: negIdx });
    }
  });

  if (count === 0) return null;
  const avg = totals.map(v => v / count);
  const textAvg = {};
  for (const k in textAgg) textAvg[k] = textCount ? (textAgg[k] / textCount) : 0;

  return { emotionAvg: avg, textAvg, perEvalNegIndex };
}

function clamp01(x){ return Math.max(0, Math.min(1, x)); }

function buildRiskProfile(agg) {
  const e = agg.emotionAvg;
  const t = agg.textAvg;

  const sad = e[idx.sad] || 0;
  const fear = e[idx.fear] || 0;
  const disgust = e[idx.disgust] || 0;
  const angry = e[idx.angry] || 0;
  const happy = e[idx.happy] || 0;
  const neutral = e[idx.neutral] || 0;

  const negIndex = (sad + fear + disgust + angry) / 4;
  const posIndex = happy;
  const calmnessProxy = Math.max(0, 1 - (fear + angry) / 2);

  const boost = (x, w=0.35) => Math.max(0, Math.min(0.5, x * w));

  const depression = clamp01( 0.65*sad + 0.15*negIndex + 0.10*(1-posIndex) + boost(t.depression, 0.6) + boost(t.negative, 0.4) );
  const anxiety    = clamp01( 0.60*fear + 0.15*negIndex + 0.10*(1-calmnessProxy) + boost(t.anxiety, 0.7) + boost(t.stress, 0.4) );
  const stress     = clamp01( 0.50*(fear+angry)/2 + 0.15*negIndex + boost(t.stress, 0.7) + boost(t.negative, 0.3) );
  const anger      = clamp01( 0.70*angry + 0.10*negIndex + boost(t.anger, 0.8) );

  return { indices: { depression, anxiety, stress, anger }, summaries: { negIndex, posIndex, neutral } };
}

function levelFromScore(s) {
  if (s >= 0.65) return { label: 'Alto', color: 'bg-red-500', text: 'text-red-600', levelKey:'high' };
  if (s >= 0.45) return { label: 'Medio', color: 'bg-amber-400', text: 'text-amber-600', levelKey:'medium' };
  return { label: 'Bajo', color: 'bg-emerald-500', text: 'text-emerald-600', levelKey:'low' };
}

function globalStatus(profile) {
  const { depression, anxiety, stress, anger } = profile.indices;
  if ([depression, anxiety, stress, anger].some(s => s >= 0.65)) {
    return { label: 'Consulta recomendada', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-600', levelKey: 'high' };
  }
  if ([depression, anxiety, stress, anger].some(s => s >= 0.45)) {
    return { label: 'Atención', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', levelKey: 'medium' };
  }
  return { label: 'Bien', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-600', levelKey: 'low' };
}

/* NUEVO: Selección de emoción para la cara */
function emotionForFace(profile){
  const { depression, anxiety, stress, anger } = profile.indices;
  const { posIndex, negIndex } = profile.summaries;

  const top = Object.entries({ angry:anger, anxious:anxiety, sad:depression, stressed:stress })
    .sort((a,b)=>b[1]-a[1])[0];

  // Si el positivo domina claramente, feliz.
  if (posIndex > negIndex + 0.18) return 'happy';

  const [label, val] = top;
  if (val >= 0.55){
    if (label === 'angry') return 'angry';
    if (label === 'anxious') return 'anxious';
    if (label === 'sad') return 'sad';
    return 'sad';
  }
  // Si no hay alta severidad y el positivo no domina:
  if (negIndex > 0.35) return 'sad';
  return 'neutral';
}

/* NUEVO: Aplica barra y cara animada */
function applyStatusBar(profile){
  const bar = document.getElementById('emotion-statusbar');
  const fill = document.getElementById('statusbar-fill');
  const face = document.getElementById('statusbar-face');

  if (!bar || !fill || !face) return;

  // Porcentaje de riesgo global (máximo de índices)
  const { depression, anxiety, stress, anger } = profile.indices;
  const overallRisk = Math.max(depression, anxiety, stress, anger); // 0..1
  const pct = Math.round(overallRisk * 100);

  // Actualiza barra
  fill.style.setProperty('--pct', `${pct}%`);
  const meter = bar.querySelector('.ios-statusbar__track');
  meter?.setAttribute('aria-valuenow', String(pct));
  bar.setAttribute('data-level', levelFromScore(overallRisk).levelKey);

  // Actualiza cara
  const emo = emotionForFace(profile);
  face.setAttribute('data-emotion', emo);
  face.setAttribute('aria-label', `Estado: ${({
    happy:'Feliz', neutral:'Neutral', sad:'Triste', anxious:'Ansioso', angry:'Enojado', surprised:'Sorprendido'
  })[emo] || emo}`);

  // Render mínimo de ojos y boca si no existen (por si el HTML se minifica)
  if (!face.querySelector('.eye')){
    const left = document.createElement('div'); left.className='eye left';
    const right = document.createElement('div'); right.className='eye right';
    const mouth = document.createElement('div'); mouth.className='mouth';
    face.append(left, right, mouth);
  }
}

function applyStatusToUI(user, agg, profile) {
  const welcome = document.getElementById('welcome-user');
  welcome.textContent = user?.displayName ? `Hola, ${user.displayName}` : `Hola, ${user?.email || 'usuario'}`;

  const badge = document.getElementById('status-badge');
  const g = globalStatus(profile);
  badge.textContent = g.label;
  badge.className = `px-3 py-1 rounded-full text-sm font-medium ${g.bg} ${g.text} border border-white shadow-sm flex items-center gap-2`;
  const dot = document.createElement('span');
  dot.className = `inline-block w-2 h-2 rounded-full ${g.dot}`;
  badge.innerHTML = ''; badge.append(dot, document.createTextNode(' ' + g.label));

  // NUEVO: cara + barra
  applyStatusBar(profile);

  // Tarjetas por categoría
  const setCard = (base, score) => {
    const lvl = levelFromScore(score);
    document.getElementById(`score-${base}`).textContent = `${Math.round(score*100)}%`;
    document.getElementById(`bar-${base}`).style.width = `${Math.round(score*100)}%`;
    document.getElementById(`bar-${base}`).className = `h-2 rounded ${lvl.color}`;
    document.getElementById(`lvl-${base}`).textContent = `Nivel: ${lvl.label}`;
    document.getElementById(`lvl-${base}`).className = `text-sm ${lvl.text} mt-2`;
  };
  setCard('depresion', profile.indices.depression);
  setCard('ansiedad', profile.indices.anxiety);
  setCard('estres', profile.indices.stress);
  setCard('ira', profile.indices.anger);

  // Recomendaciones
  const ul = document.getElementById('recommendations');
  ul.innerHTML = '';
  for (const r of generateRecommendations(profile)) {
    const li = document.createElement('li'); li.textContent = r; ul.appendChild(li);
  }

  // Tendencia
  const ctx = document.getElementById('trend-chart')?.getContext('2d');
  if (ctx && typeof Chart !== 'undefined' && agg.perEvalNegIndex?.length) {
    const labels = agg.perEvalNegIndex.slice().reverse().map(d => new Date(d.ts).toLocaleDateString('es-MX', { month: 'short', day:'2-digit' }));
    const data = agg.perEvalNegIndex.slice().reverse().map(d => d.value);
    new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label:'Índice Negativo', data, tension:.25, borderColor:'rgb(239,68,68)', backgroundColor:'rgba(239,68,68,.15)', fill:true, pointRadius:2 }] },
      options: { responsive:true, maintainAspectRatio:false, scales:{ y:{ min:0, max:1, ticks:{ callback:v=>`${Math.round(v*100)}%` } } }, plugins:{ legend:{ display:false } } }
    });
  }
}

function generateRecommendations(profile) {
  const recs = [];
  const { depression, anxiety, stress, anger } = profile.indices;

  if (depression >= 0.65) recs.push('Considera agendar una cita con un profesional. Tristeza o apatía persistentes merecen atención.');
  else if (depression >= 0.45) recs.push('Refuerza hábitos: sueño regular, luz solar, actividad física suave y conexión social.');

  if (anxiety >= 0.65) recs.push('Practica respiración diafragmática 5–10 minutos, 2–3 veces/día. Si persiste, consulta a un especialista.');
  else if (anxiety >= 0.45) recs.push('Técnicas de relajación: 4-7-8, meditación breve o pausas conscientes.');

  if (stress >= 0.65) recs.push('Ajusta carga de tareas y establece límites. Prioriza y delega. Busca apoyo si te sobrepasa.');
  else if (stress >= 0.45) recs.push('Microdescansos, higiene del sueño y limitar pantallas en la noche.');

  if (anger >= 0.65) recs.push('Antes de responder en tensión, respira y aléjate 2–3 minutos. Explora reestructuración cognitiva.');
  else if (anger >= 0.45) recs.push('Identifica detonantes y planifica respuestas alternativas (escritura, caminar, hablar).');

  if (recs.length === 0) {
    recs.push('Mantén hábitos saludables: movimiento diario, hidratación y espacios de descanso.');
    recs.push('Sigue usando la autoevaluación para monitorear tu bienestar emocional.');
  }
  return recs;
}

async function loadAssessments(uid, take = 12) {
  const q = query(collection(db, 'users', uid, 'assessments'), orderBy('timestamp', 'desc'), limit(take));
  const snap = await getDocs(q);
  const docs = []; snap.forEach(d => docs.push(d.data())); return docs;
}

// Lógica principal cuando hay usuario autenticado
async function startWithUser(user) {
  const listSection = document.getElementById('status-cards');
  const noData = document.getElementById('no-data');

  const assessments = await loadAssessments(user.uid);
  if (!assessments.length) {
    listSection.classList.add('hidden');
    noData.classList.remove('hidden');
    document.getElementById('welcome-user').textContent = `Hola, ${user.email || 'usuario'}`;
    document.getElementById('status-badge').textContent = 'Sin datos';
    // Reset barra
    document.getElementById('statusbar-fill')?.style.setProperty('--pct','0%');
    document.getElementById('emotion-statusbar')?.setAttribute('data-level','low');
    document.getElementById('statusbar-face')?.setAttribute('data-emotion','neutral');
    return;
  }

  const agg = computeAggregates(assessments, 8);
  if (!agg) {
    listSection.classList.add('hidden');
    noData.classList.remove('hidden');
    return;
  }

  const profile = buildRiskProfile(agg);
  applyStatusToUI(user, agg, profile);
}

// Espera el estado de auth y decide una sola vez
window.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      const from = encodeURIComponent('status-dashboard.html');
      window.location.replace(`login.html?from=${from}`);
      return;
    }
    startWithUser(user);
  });
});