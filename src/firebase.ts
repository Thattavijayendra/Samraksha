// src/firebase.js

// Import Firebase core + services you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA_-I_X7g_S9V-p5qn0KDXHct3zI3nJynQ",
  authDomain: "samraksha-8fdfa.firebaseapp.com",
  projectId: "samraksha-8fdfa",
  storageBucket: "samraksha-8fdfa.appspot.com", // ✅ Fixed the domain here
  messagingSenderId: "558244153990",
  appId: "1:558244153990:web:6822e3e2cb5e9652e91f07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
