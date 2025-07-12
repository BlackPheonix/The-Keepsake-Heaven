import { collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { fireDB } from "./FirebaseConfig";

// Add a document
export const addDocument = async (collectionName, data) => {
  return await addDoc(collection(fireDB, collectionName), data);
};

// Get all documents from a collection
export const getAllDocuments = async (collectionName) => {
  const querySnapshot = await getDocs(collection(fireDB, collectionName));
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

// Update a document
export const updateDocument = async (collectionName, id, data) => {
  const docRef = doc(fireDB, collectionName, id);
  await updateDoc(docRef, data);
};

// Delete a document
export const deleteDocument = async (collectionName, id) => {
  const docRef = doc(fireDB, collectionName, id);
  await deleteDoc(docRef);
};