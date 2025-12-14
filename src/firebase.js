// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 1. Import Firestore
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNYLEui7hNLtIswaHGZy2PV2LpY0Zjj3s",
  authDomain: "last-puzzle-endgame.firebaseapp.com",
  projectId: "last-puzzle-endgame",
  storageBucket: "last-puzzle-endgame.firebasestorage.app",
  messagingSenderId: "48253069292",
  appId: "1:48253069292:web:b2e8becf64329abb2242c9",
  measurementId: "G-LLGXTLF6FX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Initialize and Export the Database
export const db = getFirestore(app);