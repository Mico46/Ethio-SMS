import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCzbl7lp8CT2-Etk2DYxMoxqRgwB0qgNE0",
  authDomain: "my-school-project-867e8.firebaseapp.com",
  projectId: "my-school-project-867e8",
  storageBucket: "my-school-project-867e8.firebasestorage.app",
  messagingSenderId: "908583630376",
  appId: "1:908583630376:web:dc6949ea4960ac30d0671d",
  measurementId: "G-YTKXQSR1Q5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
