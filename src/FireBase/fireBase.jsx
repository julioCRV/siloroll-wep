// Configuración e inicialización de Firebase en la aplicación

// Se importa la funcionalidad necesaria de Firebase para la app
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase con las claves y parámetros específicos del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyCzqTojtFkspoATG8nm5y2ziU1Mp1TCpEM",
  authDomain: "silo-roll.firebaseapp.com",
  projectId: "silo-roll",
  storageBucket: "silo-roll.firebasestorage.app",
  messagingSenderId: "441765175511",
  appId: "1:441765175511:web:3959ad9457cdc3a1bf9092",
  measurementId: "G-347NTM3KFJ"
};

// Inicialización de la aplicación Firebase con la configuración
const app = initializeApp(firebaseConfig);

// Obtención de instancias de los servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportación de las instancias para ser usadas en otras partes de la app
export { auth, db, storage };
