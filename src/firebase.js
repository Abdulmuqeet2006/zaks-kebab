import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh13SmbDty9Rc4R6sSWefo8YIvXqYTIbw",
  authDomain: "orderhub-restaurant-e3bef.firebaseapp.com",
  projectId: "orderhub-restaurant-e3bef",
  storageBucket: "orderhub-restaurant-e3bef.firebasestorage.app",
  messagingSenderId: "734261688897",
  appId: "1:734261688897:web:e5bad731b6501252fde4c0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);