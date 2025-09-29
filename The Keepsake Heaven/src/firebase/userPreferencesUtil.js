import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./FirebaseConfig";

export const setUserPreferences = async (uid, preferences) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      preferences: preferences,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error setting user preferences:", error);
    return { success: false, error };
  }
};

export const getUserPreferences = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    }
    return { success: false, error: "User document does not exist" };
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return { success: false, error };
  }
};