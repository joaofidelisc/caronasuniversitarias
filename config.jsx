// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvsc6jHMVnWRjdArxxdWkdzW9dHpmX4Jk",
  authDomain: "strong-matrix-353719.firebaseapp.com",
  projectId: "strong-matrix-353719",
  storageBucket: "strong-matrix-353719.appspot.com",
  messagingSenderId: "918935501460",
  appId: "1:918935501460:web:d33bd24c294112270a5281"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);