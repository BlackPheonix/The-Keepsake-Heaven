import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "./FirebaseConfig";

// Add a review to Firestore
export async function addReview({ name, text, rating }) {
  await addDoc(collection(db, "customer_reviews"), {
    name,
    text,
    rating,
    date: serverTimestamp()
  });
}

// Fetch all reviews (most recent first)
export async function fetchReviews() {
  const q = query(collection(db, "customer_reviews"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    date: doc.data().date
      ? doc.data().date.toDate().toLocaleString()
      : new Date().toLocaleString()
  }));
}