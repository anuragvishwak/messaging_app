// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxOgKvJTZH7G5gf9fuSQBmfb9KmFV-UdQ",
  authDomain: "research-agency.firebaseapp.com",
  projectId: "research-agency",
  storageBucket: "research-agency.firebasestorage.app",
  messagingSenderId: "553712193003",
  appId: "1:553712193003:web:416328e0a68e96f2459dae",
  measurementId: "G-BFV2WRDFE2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore(app);
const auth = getAuth(app);

export { app, database, auth };
