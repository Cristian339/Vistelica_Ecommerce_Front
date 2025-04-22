import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuración
const firebaseConfig = {
    apiKey: "AIzaSyCE1L1c9XCdsYhwgm_vFcltZRXMNqEb_d4",
    authDomain: "auth-vistelica.firebaseapp.com",
    projectId: "auth-vistelica",
    storageBucket: "auth-vistelica.firebasestorage.app",
    messagingSenderId: "306993004982",
    appId: "1:306993004982:web:0d5a48e113e4aab24dc117",
    measurementId: "G-RNXR75QFDT"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Analytics solo en el navegador (evita errores en SSR)
let analytics = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

// Autenticación
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configurar alcance de permisos
googleProvider.addScope('profile');
googleProvider.addScope('email');
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

export { analytics };
export default app;