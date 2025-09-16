// Updated FirebaseConfig.js helpers with Add to Cart support for order history
import { auth, db, storage } from './FirebaseConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  arrayUnion,
  orderBy,
  addDoc,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';

const normalizeCategory = (category) => {
  return category
    .toLowerCase()
    .replace(/[/&-]/g, ' ')
    .split(' ')
    .filter(word => word);
};

export const createUserDocument = async (uid, userData) => {
  try {
    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating user document:", error);
    return { success: false, error };
  }
};

export async function getUserDocument(uid) {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { success: true, data: snap.data() };
    }
    return { success: false, error: "Profile does not exist" };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export const updateUserDocument = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const uploadUserAvatar = async (uid, file) => {
  try {
    const storageRef = ref(storage, `avatars/${uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        null,
        (error) => reject({ success: false, error }),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateUserDocument(uid, { avatar: downloadURL });
          resolve({ success: true, url: downloadURL });
        }
      );
    });
  } catch (error) {
    return { success: false, error };
  }
};

export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: products };
  } catch (error) {
    return { success: false, error };
  }
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "Product does not exist" };
    }
  } catch (error) {
    return { success: false, error };
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const normalizedCategory = normalizeCategory(category);
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const productCategoryWords = normalizeCategory(data.category || '');
      if (productCategoryWords.some(word => normalizedCategory.includes(word))) {
        products.push({ id: doc.id, ...data });
      }
    });

    return { success: true, data: products };
  } catch (error) {
    return { success: false, error };
  }
};

export const getFeaturedProducts = async (limitValue = 6) => {
  try {
    const q = query(
      collection(db, "products"),
      where("featured", "==", true),
      orderBy("rating", "desc"),
      limit(limitValue)
    );

    const querySnapshot = await getDocs(q);
    const products = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: products };
  } catch (error) {
    return { success: false, error };
  }
};

export const searchProducts = async (searchTerm) => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];

    querySnapshot.forEach((doc) => {
      const product = { id: doc.id, ...doc.data() };
      const name = product.name?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';

      if (
        name.includes(searchTerm.toLowerCase()) ||
        description.includes(searchTerm.toLowerCase()) ||
        category.includes(searchTerm.toLowerCase())
      ) {
        products.push(product);
      }
    });

    return { success: true, data: products };
  } catch (error) {
    return { success: false, error };
  }
};

export const getUserCart = async (userId) => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);
    if (cartDoc.exists()) {
      return { success: true, data: cartDoc.data() };
    } else {
      return { success: true, data: { items: [] } };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addToCart = async (userId, cartItem) => {
  try {
    if (!auth.currentUser || auth.currentUser.uid !== userId) {
      throw new Error('Authentication required or user mismatch');
    }

    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      const existingIndex = cartData.items?.findIndex(
        item => item.productId === cartItem.productId
      ) ?? -1;

      if (existingIndex >= 0) {
        const updatedItems = [...(cartData.items || [])];
        updatedItems[existingIndex].quantity += cartItem.quantity;
        await updateDoc(cartRef, { items: updatedItems, updatedAt: new Date() });
      } else {
        await updateDoc(cartRef, { items: arrayUnion(cartItem), updatedAt: new Date() });
      }
    } else {
      await setDoc(cartRef, {
        userId,
        items: [cartItem],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateCartItemQuantity = async (userId, productId, newQuantity) => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) throw new Error('Cart not found');

    const cartData = cartDoc.data();
    const items = [...(cartData.items || [])];
    const itemIndex = items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) throw new Error('Item not found');

    if (newQuantity <= 0) {
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].quantity = newQuantity;
    }

    await updateDoc(cartRef, { items, updatedAt: new Date() });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) throw new Error('Cart does not exist');

    const cartData = cartDoc.data();
    const updatedItems = (cartData.items || []).filter(item => item.productId !== productId);

    await updateDoc(cartRef, { items: updatedItems, updatedAt: new Date() });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createOrder = async (uid, orderData) => {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      userId: uid,
      ...orderData,
      status: "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, data: { orderId: orderRef.id } };
  } catch (error) {
    return { success: false, error };
  }
};

export const getUserOrders = async (uid) => {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "Order does not exist" };
    }
  } catch (error) {
    return { success: false, error };
  }
};

  //clear cart
export const clearUserCart = async (userId) => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      await updateDoc(cartRef, {
        items: [],
        updatedAt: new Date()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: error.message };
  }
};
