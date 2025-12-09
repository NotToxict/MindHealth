// Este script lee los archivos JSON locales y los sube a tu base de datos de Firestore.
// ADVERTENCIA: Este script BORRA las colecciones existentes antes de subir los nuevos datos.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// --- CONFIGURACIÓN ---
// 1. Descarga tu clave de cuenta de servicio de Firebase
//    (Proyecto > Configuración del proyecto > Cuentas de servicio > Generar nueva clave privada)
// 2. Guarda el archivo JSON descargado en esta misma carpeta con el nombre "serviceAccountKey.json"
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// --- DATOS A IMPORTAR ---
// Lee los archivos JSON que creaste
const disorders = JSON.parse(readFileSync('./disorders.json'));
const statistics = JSON.parse(readFileSync('./statistics.json'));

// --- FUNCIÓN DE IMPORTACIÓN ---
async function importData() {
  try {
    console.log('Iniciando importación de datos...');

    // 1. Importar Trastornos (Disorders)
    console.log('Borrando colección "disorders" existente...');
    await deleteCollection(db, 'disorders');
    console.log('Subiendo documentos a la colección "disorders"...');
    for (const disorder of disorders) {
      // Usa el 'id' del JSON como el ID del documento en Firestore
      const docId = disorder.id;
      // Crea una copia del objeto sin el campo 'id' para no guardarlo duplicado
      const disorderData = { ...disorder };
      delete disorderData.id;
      await db.collection('disorders').doc(docId).set(disorderData);
      console.log(`  -> Documento "${docId}" creado.`);
    }
    console.log('Colección "disorders" importada con éxito.');

    // 2. Importar Estadísticas (Statistics)
    console.log('Borrando colección "statistics" existente...');
    await deleteCollection(db, 'statistics');
    console.log('Subiendo documento a la colección "statistics"...');
    await db.collection('statistics').doc('mexico_national_dashboard').set(statistics);
    console.log('  -> Documento "mexico_national_dashboard" creado.');
    console.log('Colección "statistics" importada con éxito.');

    console.log('\n¡IMPORTACIÓN COMPLETADA!');

  } catch (error) {
    console.error('ERROR DURANTE LA IMPORTACIÓN:', error);
  }
}

// --- FUNCIÓN AUXILIAR PARA BORRAR COLECCIONES ---
// (Necesaria porque Firebase no tiene un método directo para borrar colecciones)
async function deleteCollection(db, collectionPath) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(100);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    if (snapshot.size === 0) {
        return resolve();
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}


// --- EJECUTAR EL SCRIPT ---
importData();
