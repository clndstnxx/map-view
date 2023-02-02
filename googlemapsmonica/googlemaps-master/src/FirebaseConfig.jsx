// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATxOgKBgoKHk1B3BFLNV7YxGNGEurQWmg",
  authDomain: "gmap-39278.firebaseapp.com",
  projectId: "gmap-39278",
  storageBucket: "gmap-39278.appspot.com",
  messagingSenderId: "277183073443",
  appId: "1:277183073443:web:d4b0bd5f5529a432390316",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
