import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAnND4Bi2Yg0eH7Cf2-sSkoZj3PcltyiYY',
  authDomain: 'appointmert-booking.firebaseapp.com',
  projectId: 'appointmert-booking',
  storageBucket:'appointmert-booking.firebasestorage.app',
  messagingSenderId: '500056172134',
  appId: '1:500056172134:web:8f04108cebfc7d14726fa7',
  measurementId: 'G-5LZDHP60HS'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

