import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMY-Snm1brtqNPJ7Nf8cHcO_wgR87_aDQ",
  authDomain: "zaks-kebab.firebaseapp.com",
  projectId: "zaks-kebab",
  storageBucket: "zaks-kebab.firebasestorage.app",
  messagingSenderId: "281713955679",
  appId: "1:281713955679:web:9860db981a7d976c179cea",
  measurementId: "G-8SB6NG98Z4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);