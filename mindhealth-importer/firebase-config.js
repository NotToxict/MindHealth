// Importa las funciones que necesitas de los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, setPersistence, indexedDBLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"; 

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyCphYloUQSsy1BZ2KQ4pD2tCRR2cZtwb2k",
    authDomain: "mindhealth-232e6.firebaseapp.com",
    databaseURL: "https://mindhealth-232e6-default-rtdb.firebaseio.com",
    projectId: "mindhealth-232e6",
    storageBucket: "mindhealth-232e6.firebasestorage.app",
    messagingSenderId: "29633219335",  
    appId: "1:29633219335:web:68366c870edf5efcd713a2",
    measurementId: "G-L2927C7C3W"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de la base de datos y autenticación para usarla en otros archivos
export const db = getFirestore(app);
export const auth = getAuth(app);

// Asegura persistencia local para evitar perder sesión al recargar
setPersistence(auth, indexedDBLocalPersistence).catch(console.error);

// Helper: espera a que Firebase restaure el estado de auth antes de usar auth.currentUser
export async function waitForAuthReady() {
  if (typeof auth.authStateReady === 'function') {
    // Disponible en SDKs recientes
    await auth.authStateReady();
    return;
  }
  // Polyfill para versiones que no lo expongan
  await new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, () => {
      unsub();
      resolve();
    });
  });
}