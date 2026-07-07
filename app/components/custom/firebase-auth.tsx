import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore, collection, doc, setDoc } from 'firebase/firestore/lite';


// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "lc-board-app.firebaseapp.com",
    projectId: "lc-board-app",
    storageBucket: "lc-board-app.firebasestorage.app",
    messagingSenderId: "939340153185",
    appId: "1:939340153185:web:a0d26ba06a41eb391f8520",
    measurementId: "G-EGQCD2TS6P"
};

// Initialize Firebease
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

