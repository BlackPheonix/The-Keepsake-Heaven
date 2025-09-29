// Updated FirebaseConfig.js helpers with Add to Cart support for order history
import { auth, db, storage } from './FirebaseConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc, // Added this for banner deletion
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
  getDownloadURL,
  deleteObject // Added this for banner image deletion
} from 'firebase/storage';

const normalizeCategory = (category) => {
  return category
    .toLowerCase()
    .replace(/[/&-]/g, ' ')
    .split(' ')
    .filter(word => word);
};

// === USER FUNCTIONS ===

// Create a new user document in Firestore
export const createUserDocument = async (uid, userData) => {
  try {
    console.log("👤 Creating user document at 2025-08-08 16:24:09 for user:", uid);
    console.log("🔐 Current user login: BlackPheonix");
    
    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log("✅ User document created successfully");
    return { success: true };
  } catch (error) {
    console.error("💥 Error creating user document at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// Get user document by UID
export async function getUserDocument(uid) {
  try {
    console.log("🔍 Getting user document at 2025-08-08 16:24:09 for UID:", uid);
    console.log("🔐 Current user login: BlackPheonix");
    
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      console.log("✅ User document found successfully");
      return { success: true, data: snap.data() };
    }
    console.log("⚠️ User profile does not exist");
    return { success: false, error: "Profile does not exist" };
  } catch (err) {
    console.error("💥 Error getting user document at 2025-08-08 16:24:09:", err);
    return { success: false, error: err.message };
  }
}

// Update user document
export const updateUserDocument = async (uid, userData) => {
  try {
    console.log("📝 Updating user document at 2025-08-08 16:24:09 for UID:", uid);
    console.log("🔐 Current user login: BlackPheonix");
    
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    
    console.log("✅ User document updated successfully");
    return { success: true };
  } catch (error) {
    console.error("💥 Error updating user document at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// upload user avatar
export const uploadUserAvatar = async (uid, file) => {
  try {
    console.log("📸 Uploading user avatar at 2025-08-08 16:24:09 for UID:", uid);
    console.log("🔐 Current user login: BlackPheonix");
    console.log("📁 File details:", { name: file.name, size: file.size, type: file.type });
    
    const storageRef = ref(storage, `avatars/${uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`📤 Avatar upload is ${progress.toFixed(1)}% done`);
        },
        (error) => {
          console.error("💥 Avatar upload error at 2025-08-08 16:24:09:", error);
          reject({ success: false, error });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateUserDocument(uid, { avatar: downloadURL });
            console.log("✅ Avatar uploaded and profile updated successfully");
            resolve({ success: true, url: downloadURL });
          } catch (error) {
            console.error("💥 Error getting avatar download URL at 2025-08-08 16:24:09:", error);
            reject({ success: false, error });
          }
        }
      );
    });
  } catch (error) {
    console.error("💥 Error in uploadUserAvatar at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// === PRODUCT FUNCTIONS ===

// Get all products
export const getAllProducts = async () => {
  try {
    console.log("🛍️ Getting all products at 2025-08-08 16:24:09");
    console.log("🔐 Current user login: BlackPheonix");
    
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    console.log("✅ Successfully retrieved", products.length, "products");
    return { success: true, data: products };
  } catch (error) {
    console.error("💥 Error getting all products at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    console.log("🔍 Getting product by ID at 2025-08-08 16:24:09:", id);
    console.log("🔐 Current user login: BlackPheonix");
    
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("✅ Product found successfully");
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      console.log("⚠️ Product does not exist");
      return { success: false, error: "Product does not exist" };
    }
  } catch (error) {
    console.error("💥 Error getting product by ID at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    console.log("📂 Getting products by category at 2025-08-08 16:24:09:", category);
    console.log("🔐 Current user login: BlackPheonix");
    
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

    console.log("✅ Found", products.length, "products in category:", category);
    return { success: true, data: products };
  } catch (error) {
    console.error("💥 Error getting products by category at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// Get featured products
export const getFeaturedProducts = async (limitValue = 6) => {
  try {
    console.log("⭐ Getting featured products at 2025-08-08 16:24:09, limit:", limitValue);
    console.log("🔐 Current user login: BlackPheonix");
    
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

    console.log("✅ Found", products.length, "featured products");
    return { success: true, data: products };
  } catch (error) {
    console.error("💥 Error getting featured products at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// search products
export const searchProducts = async (searchTerm) => {
  try {
    console.log("🔍 Searching products at 2025-08-08 16:24:09 for term:", searchTerm);
    console.log("🔐 Current user login: BlackPheonix");
    
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

    console.log("✅ Found", products.length, "products matching search term");
    return { success: true, data: products };
  } catch (error) {
    console.error("💥 Error searching products at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// === CART FUNCTIONS ===

// Get user cart from Firestore (using 'main' doc under 'users/{userId}/cart')
export const getUserCart = async (userId) => {
  try {
    console.log("🛒 Getting user cart at 2025-08-08 16:24:09 for user:", userId);
    console.log("🔐 Current user login: BlackPheonix");
    
    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      console.log("✅ User cart found");
      return { success: true, data: cartDoc.data() };
    } else {
      console.log("📝 No cart found, returning empty cart");
      return { success: true, data: { items: [] } };
    }
  } catch (error) {
    console.error('💥 Error getting cart at 2025-08-08 16:24:09:', error);
    return { success: false, error: error.message };
  }
};

// Add item to cart
export const addToCart = async (userId, cartItem) => {
  try {
    console.log("➕ Adding item to cart at 2025-08-08 16:24:09");
    console.log("🔐 Current user login: BlackPheonix");
    
    // Verify user is authenticated
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    // Verify the userId matches the authenticated user
    if (auth.currentUser.uid !== userId) {
      throw new Error('User ID mismatch');
    }

    console.log('🛒 Adding to cart for user:', userId);
    console.log('📦 Cart item:', cartItem);

    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      // Cart exists, check if item already exists
      const cartData = cartDoc.data();
      const existingItemIndex = cartData.items?.findIndex(
        item => item.productId === cartItem.productId
      ) ?? -1;

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...(cartData.items || [])];
        updatedItems[existingItemIndex].quantity += cartItem.quantity;
        
        await updateDoc(cartRef, {
          items: updatedItems,
          updatedAt: new Date()
        });
        console.log('✅ Updated existing item quantity');
      } else {
        // Item doesn't exist, add new item
        await updateDoc(cartRef, {
          items: arrayUnion(cartItem),
          updatedAt: new Date()
        });
        console.log('✅ Added new item to existing cart');
      }
    } else {
      // Cart doesn't exist, create new cart
      await setDoc(cartRef, {
        userId: userId,
        items: [cartItem],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Created new cart with item');
    }

    return { success: true };
  } catch (error) {
    console.error('💥 Error adding to cart at 2025-08-08 16:24:09:', error);
    
    // More specific error messages
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Permission denied. Please check your authentication and Firestore rules.' };
    } else if (error.code === 'unauthenticated') {
      return { success: false, error: 'User not authenticated. Please sign in again.' };
    } else {
      return { success: false, error: error.message };
    }
  }
}

// Get all items in user's cart
export const getUserCartItems = async (userId) => {
  try {
    console.log("📋 Getting user cart items at 2025-08-08 16:24:09 for user:", userId);
    console.log("🔐 Current user login: BlackPheonix");
    
    const cartCol = collection(db, "users", userId, "cart");
    const querySnapshot = await getDocs(cartCol);
    const items = [];
    
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), productId: doc.id });
    });
    
    console.log("✅ Retrieved", items.length, "cart items");
    return { success: true, items };
  } catch (error) {
    console.error("💥 Error getting user cart items at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (userId, productId, newQuantity) => {
  try {
    console.log("🔄 Updating cart item quantity at 2025-08-08 16:24:09");
    console.log("🔐 Current user login: BlackPheonix");
    console.log("📦 User:", userId, "Product:", productId, "New Quantity:", newQuantity);
    
    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) {
      throw new Error('Cart does not exist');
    }

    const cartData = cartDoc.data();
    const items = [...(cartData.items || [])];

    const itemIndex = items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    if (newQuantity <= 0) {
      // Remove item from array
      items.splice(itemIndex, 1);
      console.log("🗑️ Removed item from cart");
    } else {
      // Update quantity
      items[itemIndex].quantity = newQuantity;
      console.log("✅ Updated item quantity");
    }

    await updateDoc(cartRef, {
      items,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('💥 Error updating cart item quantity at 2025-08-08 16:24:09:', error);
    return { success: false, error: error.message };
  }
};

// Remove item from cart
export const removeFromCart = async (userId, productId) => {
  try {
    console.log("🗑️ Removing item from cart at 2025-08-08 16:24:09");
    console.log("🔐 Current user login: BlackPheonix");
    console.log("📦 User:", userId, "Product:", productId);
    
    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) {
      throw new Error('Cart does not exist');
    }

    const cartData = cartDoc.data();
    const updatedItems = (cartData.items || []).filter(item => item.productId !== productId);

    await updateDoc(cartRef, {
      items: updatedItems,
      updatedAt: new Date()
    });

    console.log("✅ Item removed from cart successfully");
    return { success: true };
  } catch (error) {
    console.error('💥 Error removing from cart at 2025-08-08 16:24:09:', error);
    return { success: false, error: error.message };
  }
};

// Clear user cart
export const clearUserCart = async (userId) => {
  try {
    console.log("🧹 Clearing user cart at 2025-08-08 16:24:09 for user:", userId);
    console.log("🔐 Current user login: BlackPheonix");
    
    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      await updateDoc(cartRef, {
        items: [],
        updatedAt: new Date()
      });
    }

    console.log("✅ User cart cleared successfully");
    return { success: true };
  } catch (error) {
    console.error('💥 Error clearing cart at 2025-08-08 16:24:09:', error);
    return { success: false, error: error.message };
  }
};

// === ORDER FUNCTIONS ===

// Create a new order
export const createOrder = async (uid, orderData) => {
  try {
    console.log("📝 Creating new order at 2025-08-08 16:24:09 for user:", uid);
    console.log("🔐 Current user login: BlackPheonix");
    console.log("📦 Order data:", orderData);
    
    const orderRef = await addDoc(collection(db, "orders"), {
      userId: uid,
      ...orderData,
      status: "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log("✅ Order created with ID:", orderRef.id);
    
    // Clear cart after successful order
    const cartRes = await getUserCart(uid);
    if (cartRes.success) {
      await clearUserCart(uid);
      console.log("✅ User cart cleared after order");
    }
    
    return { success: true, data: { orderId: orderRef.id } };
  } catch (error) {
    console.error("💥 Error creating order at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// Get user orders
export const getUserOrders = async (uid) => {
  try {
    console.log("📋 Getting user orders at 2025-08-08 16:24:09 for user:", uid);
    console.log("🔐 Current user login: BlackPheonix");
    
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
    
    console.log("✅ Retrieved", orders.length, "orders for user");
    return { success: true, data: orders };
  } catch (error) {
    console.error("💥 Error getting user orders at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// Get order details
export const getOrderById = async (orderId) => {
  try {
    console.log("🔍 Getting order by ID at 2025-08-08 16:24:09:", orderId);
    console.log("🔐 Current user login: BlackPheonix");
    
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("✅ Order found successfully");
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      console.log("⚠️ Order does not exist");
      return { success: false, error: "Order does not exist" };
    }
  } catch (error) {
    console.error("💥 Error getting order at 2025-08-08 16:24:09:", error);
    return { success: false, error };
  }
};

// ===== BANNER FUNCTIONS ===== (ADMIN ACCESS)

export const getAllBanners = async () => {
  try {
    console.log("🖼️ getAllBanners: Starting function at 2025-08-08 16:24:09");
    console.log("🔐 Current user login: BlackPheonix");
    console.log("👨‍💼 Admin access - authentication required");
    console.log("🖼️ Current user:", auth.currentUser?.email);
    
    const bannersCollection = collection(db, "banners");
    const querySnapshot = await getDocs(bannersCollection);
    
    console.log("📊 Banners query completed. Size:", querySnapshot.size);

    if (querySnapshot.empty) {
      console.log("⚠️ No banners found in 'banners' collection");
      return { success: true, data: [] };
    }

    const banners = [];
    let docCount = 0;
    
    querySnapshot.forEach((doc) => {
      docCount++;
      const data = doc.data();
      console.log(`🖼️ Banner ${docCount}:`, doc.id, {
        name: data.name,
        status: data.status,
        hasImage: !!data.imageUrl
      });
      
      banners.push({
        id: doc.id,
        ...data
      });
    });

    console.log("✅ Successfully processed", banners.length, "banners");
    return { success: true, data: banners };
    
  } catch (error) {
    console.error("💥 getAllBanners error at 2025-08-08 16:24:09:", error);
    return { success: false, error: error.message };
  }
};

// PUBLIC BANNER FUNCTION (NO AUTH REQUIRED) - Updated for 2025-08-08 16:37:24
export const getPublicBanners = async () => {
  try {
    console.log("🌐 getPublicBanners: Starting function at 2025-08-08 16:37:24");
    console.log("🔐 Current user login: BlackPheonix");
    console.log("🔓 Public access - no authentication required");
    console.log("🔍 Attempting to fetch active banners...");
    
    // Simple query first - just get all banners, then filter
    const bannersCollection = collection(db, "banners");
    console.log("📂 Collection reference created successfully");
    
    const querySnapshot = await getDocs(bannersCollection);
    console.log("📊 Query executed successfully at 2025-08-08 16:37:24");
    console.log("📊 Total documents found:", querySnapshot.size);
    console.log("📊 Is query empty:", querySnapshot.empty);

    if (querySnapshot.empty) {
      console.log("⚠️ No banners found in 'banners' collection");
      console.log("🔧 This might mean:");
      console.log("   1. No banners exist in the database");
      console.log("   2. Collection name 'banners' doesn't match");
      console.log("   3. All banners were deleted");
      return { success: true, data: [] };
    }

    const allBanners = [];
    const activeBanners = [];
    let docCount = 0;
    
    console.log("📄 Processing banner documents...");
    querySnapshot.forEach((doc) => {
      docCount++;
      const data = doc.data();
      const banner = {
        id: doc.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        status: data.status,
        createdAt: data.createdAt
      };
      
      allBanners.push(banner);
      
      console.log(`📋 Banner ${docCount}:`, {
        id: doc.id,
        name: data.name || 'No name',
        status: data.status || 'No status',
        hasImage: !!data.imageUrl,
        imageType: data.imageUrl ? (data.imageUrl.startsWith('data:') ? 'Base64' : 'Firebase Storage URL') : 'None'
      });
      
      // Only include active banners for public display
      if (data.status === 'Active') {
        activeBanners.push(banner);
        console.log(`✅ Active Banner Added: ${data.name}`);
      } else {
        console.log(`⏸️ Inactive Banner Skipped: ${data.name} (Status: ${data.status})`);
      }
    });

    console.log("📊 Banner Summary at 2025-08-08 16:37:24:");
    console.log(`   - Total banners found: ${allBanners.length}`);
    console.log(`   - Active banners: ${activeBanners.length}`);
    console.log(`   - Inactive banners: ${allBanners.length - activeBanners.length}`);

    if (activeBanners.length === 0) {
      console.log("⚠️ No active banners found for public display");
      console.log("💡 Suggestions:");
      console.log("   1. Check if banners have status='Active' in the database");
      console.log("   2. Verify banner creation is working in admin panel");
      console.log("   3. Check if banners exist but are marked as 'Inactive'");
    } else {
      console.log("🎉 Found active banners for public display:");
      activeBanners.forEach((banner, index) => {
        console.log(`   ${index + 1}. ${banner.name} (ID: ${banner.id})`);
      });
    }

    console.log("✅ Successfully processed", activeBanners.length, "active public banners");
    console.log("🌐 Public banners ready for Hero display at 2025-08-08 16:37:24");
    return { success: true, data: activeBanners };
    
  } catch (error) {
    console.error("💥 getPublicBanners error occurred at 2025-08-08 16:37:24:");
    console.error("💥 Error name:", error.name);
    console.error("💥 Error message:", error.message);
    console.error("💥 Error code:", error.code);
    console.error("💥 Full error stack:", error.stack);
    
    // Detailed error analysis
    if (error.code === 'permission-denied') {
      console.error("🚫 PERMISSION DENIED - ROOT CAUSE IDENTIFIED:");
      console.error("   ❌ Firestore security rules are blocking public read access to 'banners' collection");
      console.error("   ✅ SOLUTION: Add banner rule to firestore.rules:");
      console.error("       match /banners/{bannerId} {");
      console.error("         allow read: if true;");
      console.error("         allow write: if request.auth != null;");
      console.error("       }");
    } else if (error.code === 'unavailable') {
      console.error("📡 UNAVAILABLE - Possible causes:");
      console.error("   1. Network connectivity issues");
      console.error("   2. Firestore service is down");
      console.error("   3. Firebase configuration problems");
    } else if (error.code === 'not-found') {
      console.error("🔍 NOT FOUND - Possible causes:");
      console.error("   1. Collection 'banners' does not exist");
      console.error("   2. Database path is incorrect");
      console.error("   3. Project ID mismatch in FirebaseConfig");
    } else {
      console.error("❓ UNKNOWN ERROR - Full details above");
    }
    
    // Return empty array instead of error for public access
    console.log("🛡️ Returning empty array to prevent Hero component from breaking");
    return { success: true, data: [] };
  }
};