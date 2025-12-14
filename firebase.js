// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpfQ-hssZIJMKZRBNnhG9oh4dqBxxY358",
  authDomain: "uber-next-e0970.firebaseapp.com",
  projectId: "uber-next-e0970",
  storageBucket: "uber-next-e0970.firebasestorage.app",
  messagingSenderId: "585137880882",
  appId: "1:585137880882:web:6c865fdbe0aac51d57612b",
  measurementId: "G-5Z940HR1SD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (browser-only)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

// Export everything
export { app, analytics, auth, provider, db };
