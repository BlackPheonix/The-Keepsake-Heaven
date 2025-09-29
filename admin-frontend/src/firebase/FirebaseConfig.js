import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserLocalPersistence, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkls6E5t3ASj78vLdkoDuNLhkSFSnZhKI",
  authDomain: "the-keepsake-heaven.firebaseapp.com",
  projectId: "the-keepsake-heaven",
  storageBucket: "the-keepsake-heaven.appspot.com",
  messagingSenderId: "383989939973",
  appId: "1:383989939973:web:6ae8fa52b8655d0c90016c"
};

const app = initializeApp(firebaseConfig);
console.log("Firebase initialized successfully:", app.name);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Optional: Set auth persistence to local for reliability
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Firebase auth persistence set"))
  .catch(err => console.error("Persistence error", err));

console.log("Firestore database initialized");
console.log("Firebase auth initialized");
console.log("Firebase storage initialized");

export default app;