// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDYvjlpkM618bV1GxvBQTmavCP4oPGetFA",
  authDomain: "dyci-attendance-tracker.firebaseapp.com",
  projectId: "dyci-attendance-tracker",
  storageBucket: "dyci-attendance-tracker.firebasestorage.app",
  messagingSenderId: "360793514694",
  appId: "1:360793514694:web:a7688391b6351ade262dc7",
  measurementId: "G-V4BBSD12JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export  { app, analytics, db, auth, storage };