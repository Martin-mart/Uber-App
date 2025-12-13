import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// 1️⃣ Initialize Firebase app first
const app = initializeApp(firebaseConfig);

// 2️⃣ Initialize Analytics only in the browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// 3️⃣ Firebase Auth
const provider = new GoogleAuthProvider();
const auth = getAuth();

export { app, analytics, provider, auth };