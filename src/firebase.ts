import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBJ-GVeMeSfPtPDA4ImpeCEqp-VJtxQnSo",
  authDomain: "lachlanmortgageaus.firebaseapp.com",
  projectId: "lachlanmortgageaus",
  storageBucket: "lachlanmortgageaus.firebasestorage.app",
  messagingSenderId: "340049492445",
  appId: "1:340049492445:web:7eaf1d64caf2e777585e34",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 