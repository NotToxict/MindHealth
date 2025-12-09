// Este módulo se encarga de toda la comunicación con Firestore
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/**
 * Obtiene todos los documentos de la colección 'disorders'.
 * @param {Firestore} db - La instancia de la base de datos de Firestore.
 * @returns {Promise<Array>} Una promesa que se resuelve con un array de objetos de trastornos.
 */
export async function getDisorders(db) {
  const disordersCol = collection(db, 'disorders');
  const disorderSnapshot = await getDocs(disordersCol);
  const disorderList = disorderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return disorderList;
}

/**
 * Obtiene el documento único de estadísticas de México.
 * @param {Firestore} db - La instancia de la base de datos de Firestore.
 * @returns {Promise<Object>} Una promesa que se resuelve con el objeto de estadísticas.
 */
export async function getStatistics(db) {
  const docRef = doc(db, "statistics", "mexico_national_dashboard");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No se encontró el documento de estadísticas!");
    return null;
  }
}
