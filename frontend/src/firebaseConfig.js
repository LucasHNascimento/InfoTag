import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuração pública do aplicativo Web (não é a chave privada do servidor).
const firebaseConfig = {
  apiKey: "AIzaSyDPzPoT2xfm7GDn-wNztI96WdEzSVB10qE",
  authDomain: "info-tag-fcc7a.firebaseapp.com",
  projectId: "info-tag-fcc7a",
  storageBucket: "info-tag-fcc7a.firebasestorage.app",
  messagingSenderId: "478269060393",
  appId: "1:478269060393:web:4c34259f19ec31fc1a3338"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o serviço de autenticação para usarmos em outros arquivos
export const auth = getAuth(app);
