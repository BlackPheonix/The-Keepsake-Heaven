// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkls6E5t3ASj78vLdkoDuNLhkSFSnZhKI",
  authDomain: "the-keepsake-heaven.firebaseapp.com",
  projectId: "the-keepsake-heaven",
  storageBucket: "the-keepsake-heaven.firebasestorage.app",
  messagingSenderId: "383989939973",
  appId: "1:383989939973:web:6ae8fa52b8655d0c90016c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);

const auth = getAuth(app);

export {auth, fireDB}