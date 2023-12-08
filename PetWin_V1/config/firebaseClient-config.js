import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: `AIzaSyCLarDPCi4PpJKFk9Nu8kYZ8mynFiMPGfw`,
  authDomain: 'petwin-v2.firebaseapp.com',
  projectId: `petwin-v2`,
  storageBucket: `petwin-v2.appspot.com`,
  messagingSenderId: `971339852369`,
  appId: `1:971339852369:web:23ecf58643132e5a81e670`,
  measurementId: `G-KPGTHY7KJF`
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
