import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBK1-8DDoHgHamEre3_TLhn22tsSlAKrrM",
  authDomain: "lumis-journal.firebaseapp.com",
  projectId: "lumis-journal",
  storageBucket: "lumis-journal.firebasestorage.app",
  messagingSenderId: "440583721510",
  appId: "1:440583721510:web:680cddcb4b0d0f33360ce7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();