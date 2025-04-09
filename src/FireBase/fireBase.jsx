// Configuración e inicialización de Firebase en la aplicación

// Se importa la funcionalidad necesaria de Firebase para la app
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase con las claves y parámetros específicos del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyB3z2EjI6uxj9sP-lyUg77rvxAJuO-1pyI",
  authDomain: "bd-wilsmart.firebaseapp.com",
  databaseURL: "https://bd-wilsmart-default-rtdb.firebaseio.com",
  projectId: "bd-wilsmart",
  storageBucket: "bd-wilsmart.appspot.com",
  messagingSenderId: "722305794719",
  appId: "1:722305794719:web:024468d96eadc9534e98aa"
};

// Inicialización de la aplicación Firebase con la configuración
const app = initializeApp(firebaseConfig);

// Obtención de instancias de los servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportación de las instancias para ser usadas en otras partes de la app
export { auth, db, storage };
