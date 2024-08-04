// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirebase, getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxISZRg_fbqu59csYhbPgG3X13jkipuSI",
  authDomain: "intrack-2024.firebaseapp.com",
  projectId: "intrack-2024",
  storageBucket: "intrack-2024.appspot.com",
  messagingSenderId: "192656206817",
  appId: "1:192656206817:web:8d74b72cc143347f6680a0",
  measurementId: "G-JWSR59RHY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}