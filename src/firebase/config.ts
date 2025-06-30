import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWiUeLDNFvEb4J1JCrXJ9JsDbGv2eZF6o",
  authDomain: "appointment-booking-42761.firebaseapp.com",
  projectId: "appointment-booking-42761",
  storageBucket: "appointment-booking-42761.firebasestorage.app",
  messagingSenderId: "352386056350",
  appId: "1:352386056350:web:8ed43b0991a3c497a7fb8f",
  measurementId: "G-QRDMQVYT94"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;