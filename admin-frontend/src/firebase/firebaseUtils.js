import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  limit,
  setDoc,
  arrayUnion
} from "firebase/firestore";
import { db, auth } from "./FirebaseConfig";

// ===== PRODUCT FUNCTIONS =====

export const getAllProducts = async () => {
  try {
    console.log("🔍 getAllProducts: Starting function");
    console.log("🔍 Current user:", auth.currentUser?.email);
    console.log("🔍 User UID:", auth.currentUser?.uid);
    console.log("🔍 Timestamp:", new Date().toISOString());
    
    const productsCollection = collection(db, "products");
    const querySnapshot = await getDocs(productsCollection);
    
    console.log("📊 Query completed successfully!");
    console.log("📊 Snapshot size:", querySnapshot.size);
    console.log("📊 Is empty:", querySnapshot.empty);

    if (querySnapshot.empty) {
      console.log("⚠️ No products found in 'products' collection");
      return { success: true, data: [] };
    }

    const products = [];
    let docCount = 0;
    
    querySnapshot.forEach((doc) => {
      docCount++;
      const data = doc.data();
      console.log(`📄 Document ${docCount}:`, doc.id);
      
      products.push({
        id: doc.id,
        ...data
      });
    });

    console.log("✅ Successfully processed", products.length, "products");
    return { success: true, data: products };
    
  } catch (error) {
    console.error("💥 getAllProducts error occurred:", error);
    
    if (error.code === 'permission-denied') {
      return { success: false, error: "Permission denied. Please check authentication." };
    } else if (error.code === 'unavailable') {
      return { success: false, error: "Firestore is currently unavailable." };
    } else if (error.code === 'unauthenticated') {
      return { success: false, error: "User not authenticated." };
    }
    
    return { success: false, error: error.message };
  }
};

export const addProduct = async (productData) => {
  try {
    console.log("📝 Adding new product:", productData);
    console.log("📸 Product image type:", typeof productData.image);
    console.log("📸 Has image:", !!productData.image);
    
    const productRef = await addDoc(collection(db, "products"), {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      category: productData.category,
      stock: Number(productData.stock),
      image: productData.image || '', // Base64 image string
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log("✅ Product document created with ID:", productRef.id);

    const newProductDoc = await getDoc(doc(db, "products", productRef.id));
    const newProductData = { id: productRef.id, ...newProductDoc.data() };
    
    console.log("✅ Product added successfully:", newProductData);
    return { success: true, data: newProductData };

  } catch (error) {
    console.error("💥 Error adding product:", error);
    return { success: false, error: error.message };
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    console.log("🔄 Updating product:", productId, productData);
    
    const productDoc = await getDoc(doc(db, "products", productId));
    if (!productDoc.exists()) {
      return { success: false, error: "Product not found" };
    }

    const updateData = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      stock: Number(productData.stock),
      category: productData.category,
      image: productData.image || '', // Base64 image string
      updatedAt: serverTimestamp()
    };

    await updateDoc(doc(db, "products", productId), updateData);

    const updatedProductDoc = await getDoc(doc(db, "products", productId));
    const updatedProductData = { id: productId, ...updatedProductDoc.data() };
    
    console.log("✅ Product updated successfully");
    return { success: true, data: updatedProductData };
  } catch (error) {
    console.error("💥 Error updating product:", error);
    return { success: false, error: error.message };
  }
};

export const deleteProduct = async (productId) => {
  try {
    console.log("🗑️ Deleting product:", productId);
    await deleteDoc(doc(db, "products", productId));
    console.log("✅ Product deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("💥 Error deleting product:", error);
    return { success: false, error: error.message };
  }
};

// ===== USER/CUSTOMER FUNCTIONS =====

export const getAllUsers = async () => {
  try {
    console.log("🔍 getAllUsers: Starting function");
    console.log("🔍 Current admin user:", auth.currentUser?.email);
    
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    
    console.log("📊 Users query completed. Size:", querySnapshot.size);

    if (querySnapshot.empty) {
      console.log("⚠️ No users found in 'users' collection");
      return { success: true, data: [] };
    }

    const users = [];
    let docCount = 0;
    
    querySnapshot.forEach((doc) => {
      docCount++;
      const data = doc.data();
      
      const user = {
        id: doc.id,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.displayName || 'No Name',
        email: data.email || 'No Email',
        phone: data.phone || data.phoneNumber || 'No Phone',
        orders: data.orders?.length || data.orderCount || 0,
        totalSpent: data.totalSpent || 0,
        tier: data.tier || 'Regular',
        lastActive: data.lastLoginAt ? 
          (data.lastLoginAt.toDate ? data.lastLoginAt.toDate().toISOString().split('T')[0] : data.lastLoginAt) : 
          (data.createdAt ? 
            (data.createdAt.toDate ? data.createdAt.toDate().toISOString().split('T')[0] : data.createdAt) : 
            new Date().toISOString().split('T')[0]),
        address: data.address || '',
        createdAt: data.createdAt,
        ...data
      };
      
      users.push(user);
    });

    console.log("✅ Successfully processed", users.length, "users");
    return { success: true, data: users };
    
  } catch (error) {
    console.error("💥 getAllUsers error:", error);
    return { success: false, error: error.message };
  }
};

export const updateUserData = async (userId, userData) => {
  try {
    console.log("🔄 Updating user:", userId, userData);
    
    const updateData = {
      ...userData,
      updatedAt: serverTimestamp()
    };

    if (userData.name) {
      const nameParts = userData.name.split(' ');
      updateData.firstName = nameParts[0] || '';
      updateData.lastName = nameParts.slice(1).join(' ') || '';
    }

    await updateDoc(doc(db, "users", userId), updateData);

    console.log("✅ User updated successfully");
    return { success: true };
  } catch (error) {
    console.error("💥 Error updating user:", error);
    return { success: false, error: error.message };
  }
};

export const getUserStatistics = async () => {
  try {
    console.log("📊 Getting user statistics...");
    
    const usersSnapshot = await getDocs(collection(db, "users"));
    
    let totalUsers = 0;
    let newThisMonth = 0;
    const tiers = { Regular: 0, Silver: 0, Gold: 0, Platinum: 0 };
    const highValueUsers = [];
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      totalUsers++;

      if (user.createdAt) {
        let createdDate;
        if (user.createdAt.toDate) {
          createdDate = user.createdAt.toDate();
        } else {
          createdDate = new Date(user.createdAt);
        }
        
        if (createdDate.getMonth() === currentMonth && 
            createdDate.getFullYear() === currentYear) {
          newThisMonth++;
        }
      }

      const userTier = user.tier || 'Regular';
      if (tiers[userTier] !== undefined) {
        tiers[userTier]++;
      }

      if (user.totalSpent > 30000) {
        highValueUsers.push({
          id: doc.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.displayName || 'No Name',
          totalSpent: user.totalSpent || 0
        });
      }
    });

    highValueUsers.sort((a, b) => b.totalSpent - a.totalSpent);

    const stats = {
      totalUsers,
      newThisMonth,
      tiers,
      loyaltyMembers: totalUsers - (tiers.Regular || 0),
      highValueCount: highValueUsers.length,
      topSpenders: highValueUsers.slice(0, 5)
    };

    console.log("📊 User statistics:", stats);
    return { success: true, data: stats };
    
  } catch (error) {
    console.error("💥 Error getting user statistics:", error);
    return { success: false, error: error.message };
  }
};

// ===== ORDER FUNCTIONS =====

export const getAllOrders = async () => {
  try {
    console.log("📦 Getting all orders...");
    
    const querySnapshot = await getDocs(collection(db, "orders"));

    const orders = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data
      });
    });

    console.log("✅ Retrieved", orders.length, "orders");
    return { success: true, data: orders };
  } catch (error) {
    console.error("💥 Error getting orders:", error);
    return { success: false, error: error.message };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    if (!orderDoc.exists()) {
      return { success: false, error: "Order not found" };
    }
    return { 
      success: true, 
      data: { 
        id: orderDoc.id, 
        ...orderDoc.data() 
      } 
    };
  } catch (error) {
    console.error("💥 Error getting order:", error);
    return { success: false, error: error.message };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log("🔄 Updating order status:", orderId, status);
    
    await updateDoc(doc(db, "orders", orderId), {
      status: status,
      updatedAt: serverTimestamp()
    });
    
    console.log("✅ Order status updated");
    return { success: true };
  } catch (error) {
    console.error("💥 Error updating order status:", error);
    return { success: false, error: error.message };
  }
};

// ===== DASHBOARD FUNCTIONS =====

export const getDashboardData = async () => {
  try {
    console.log("📊 Getting dashboard data...");
    
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    let totalSales = 0;
    let totalOrders = ordersSnapshot.size;
    
    const orders = [];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySales = {
      'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0,
      'May': 0, 'Jun': 0, 'Jul': 0, 'Aug': 0,
      'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
    };
    
    const monthlyTargets = {
      'Jan': 150000, 'Feb': 160000, 'Mar': 170000,
      'Apr': 180000, 'May': 190000, 'Jun': 200000,
      'Jul': 210000, 'Aug': 220000, 'Sep': 230000,
      'Oct': 240000, 'Nov': 250000, 'Dec': 260000
    };

    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      totalSales += order.amount || order.total || 0;

      let orderDate = null;
      if (order.createdAt && typeof order.createdAt.toDate === "function") {
        orderDate = order.createdAt.toDate();
        const month = orderDate.toLocaleString('en-US', { month: 'short' });
        if (orderDate >= sixMonthsAgo) {
          monthlySales[month] += order.amount || order.total || 0;
        }
      }

      const formattedOrder = {
        id: doc.id,
        customer: order.customerName || order.customer || 'Unknown',
        date: orderDate,
        amount: order.amount || order.total || 0,
        items: order.items?.length || order.itemCount || 0,
        status: order.status || 'Processing'
      };
      orders.push(formattedOrder);
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const salesData = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const month = new Date(now.getFullYear(), monthIndex, 1).toLocaleString('en-US', { month: 'short' });
      salesData.push({
        month,
        sales: monthlySales[month],
        target: monthlyTargets[month]
      });
    }

    const customersSnapshot = await getDocs(collection(db, "users"));
    const totalCustomers = customersSnapshot.size;

    const locations = {
      'Colombo': 0,
      'Kandy': 0,
      'Galle': 0,
      'Other': 0
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    let newCustomers = 0;

    customersSnapshot.forEach(doc => {
      const customer = doc.data();
      let location = 'Other';
      if (customer.address) {
        if (customer.address.includes('Colombo')) location = 'Colombo';
        else if (customer.address.includes('Kandy')) location = 'Kandy';
        else if (customer.address.includes('Galle')) location = 'Galle';
      }
      locations[location]++;

      if (customer.createdAt && typeof customer.createdAt.toDate === "function" && customer.createdAt.toDate() >= thirtyDaysAgo) {
        newCustomers++;
      }
    });

    const customerLocations = Object.keys(locations).map(region => ({
      region,
      value: locations[region]
    }));

    const lowStockQuery = query(
      collection(db, "products"),
      where("stock", "<", 6),
      limit(5)
    );
    const lowStockSnapshot = await getDocs(lowStockQuery);
    const stockAlerts = [];
    lowStockSnapshot.forEach(doc => {
      const product = doc.data();
      stockAlerts.push({
        product: product.name || 'Unknown Product',
        category: product.category || 'Unknown Category',
        stock: product.stock || 0
      });
    });

    const productsSnapshot = await getDocs(collection(db, "products"));
    const totalProducts = productsSnapshot.size;

    const recentOrders = orders
      .filter(o => o.date instanceof Date)
      .sort((a, b) => b.date - a.date)
      .slice(0, 8);

    const dashboardData = {
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      newCustomers,
      salesData,
      customerLocations,
      recentOrders,
      stockAlerts
    };

    console.log("✅ Dashboard data compiled:", dashboardData);
    return {
      success: true,
      data: dashboardData
    };
  } catch (error) {
    console.error("💥 Error getting dashboard data:", error);
    return { success: false, error: error.message };
  }
};

// ===== CART FUNCTIONS =====

export const addToCart = async (userId, cartItem) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    if (auth.currentUser.uid !== userId) {
      throw new Error('User ID mismatch');
    }

    console.log('Adding to cart for user:', userId);
    console.log('Cart item:', cartItem);

    const cartRef = doc(db, 'users', userId, 'cart', 'main');
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      const existingItemIndex = cartData.items?.findIndex(
        item => item.productId === cartItem.productId
      ) ?? -1;

      if (existingItemIndex >= 0) {
        const updatedItems = [...(cartData.items || [])];
        updatedItems[existingItemIndex].quantity += cartItem.quantity;
        
        await updateDoc(cartRef, {
          items: updatedItems,
          updatedAt: new Date()
        });
        console.log('Updated existing item quantity');
      } else {
        await updateDoc(cartRef, {
          items: arrayUnion(cartItem),
          updatedAt: new Date()
        });
        console.log('Added new item to existing cart');
      }
    } else {
      await setDoc(cartRef, {
        userId: userId,
        items: [cartItem],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Created new cart with item');
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Permission denied. Please check your authentication and Firestore rules.' };
    } else if (error.code === 'unauthenticated') {
      return { success: false, error: 'User not authenticated. Please sign in again.' };
    } else {
      return { success: false, error: error.message };
    }
  }
};

export const getUserCartItems = async (userId) => {
  try {
    const cartCol = collection(db, "users", userId, "cart");
    const querySnapshot = await getDocs(cartCol);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), productId: doc.id });
    });
    return { success: true, items };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateCartItemQuantity = async (userId, productId, newQuantity) => {
  try {
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
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].quantity = newQuantity;
    }

    await updateDoc(cartRef, {
      items,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return { success: false, error: error.message };
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
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

    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: error.message };
  }
};

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

// ===== ORDER CREATION FUNCTIONS =====

export const createOrder = async (uid, orderData) => {
  try {
    console.log("📝 Creating order for user:", uid, orderData);
    
    const orderRef = await addDoc(collection(db, "orders"), {
      userId: uid,
      ...orderData,
      status: "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    await clearUserCart(uid);
    
    console.log("✅ Order created successfully:", orderRef.id);
    return { success: true, data: { orderId: orderRef.id } };
  } catch (error) {
    console.error("💥 Error creating order:", error);
    return { success: false, error: error.message };
  }
};

export const getUserOrders = async (uid) => {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", uid)
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: orders };
  } catch (error) {
    console.error("💥 Error getting user orders:", error);
    return { success: false, error: error.message };
  }
};

// ===== CHAT FUNCTIONS =====

export const getUserChatMessages = async (userId) => {
  try {
    console.log("💬 Getting chat messages for user:", userId);
    return {
      success: true,
      data: [
        { 
          id: 1,
          sender: 'Customer', 
          text: 'Hello, I have a question about my order', 
          time: new Date().toLocaleTimeString(),
          timestamp: new Date()
        },
        { 
          id: 2,
          sender: 'Admin', 
          text: 'Hello! How can I help you today?', 
          time: new Date().toLocaleTimeString(),
          timestamp: new Date()
        }
      ]
    };
  } catch (error) {
    console.error("💥 Error getting chat messages:", error);
    return { success: false, error: error.message };
  }
};

export const sendUserChatMessage = async (userId, message) => {
  try {
    console.log(`💬 Sending message to ${userId}:`, message);
    return { success: true };
  } catch (error) {
    console.error("💥 Error sending chat message:", error);
    return { success: false, error: error.message };
  }
};

// ===== BANNER FUNCTIONS WITH BASE64 IMAGE SUPPORT =====

export const getAllBanners = async () => {
  try {
    console.log("🖼️ getAllBanners: Starting function at 2025-08-07 20:42:58");
    console.log("🖼️ Current user:", auth.currentUser?.email);
    console.log("🖼️ User login: BlackPheonix");
    
    const bannersCollection = collection(db, "banners");
    const querySnapshot = await getDocs(bannersCollection);
    
    console.log("📊 Banners query completed. Size:", querySnapshot.size);
    console.log("📊 Is empty:", querySnapshot.empty);

    if (querySnapshot.empty) {
      console.log("⚠️ No banners found in 'banners' collection");
      return { success: true, data: [] };
    }

    const banners = [];
    let docCount = 0;
    
    console.log("📄 Processing banner documents...");
    querySnapshot.forEach((doc) => {
      docCount++;
      const data = doc.data();
      console.log(`🖼️ Banner ${docCount}:`);
      console.log(`   - ID: ${doc.id}`);
      console.log(`   - Name: ${data.name || 'No name'}`);
      console.log(`   - Status: ${data.status || 'No status'}`);
      console.log(`   - Has ImageURL: ${!!data.imageUrl}`);
      console.log(`   - ImageURL Type: ${typeof data.imageUrl}`);
      console.log(`   - Is Base64: ${data.imageUrl?.startsWith('data:') ? 'Yes' : 'No'}`);
      
      banners.push({
        id: doc.id,
        ...data
      });
    });

    console.log("✅ Successfully processed", banners.length, "banners");
    return { success: true, data: banners };
    
  } catch (error) {
    console.error("💥 getAllBanners error occurred:");
    console.error("💥 Error message:", error.message);
    console.error("💥 Error code:", error.code);
    return { success: false, error: error.message };
  }
};

export const addBanner = async (bannerData) => {
  try {
    console.log("📝 Adding new banner at 2025-08-07 20:42:58");
    console.log("📝 Current user: BlackPheonix");
    console.log("📝 Banner data:", {
      name: bannerData.name,
      description: bannerData.description,
      status: bannerData.status,
      hasImage: !!bannerData.imageUrl,
      imageType: typeof bannerData.imageUrl,
      isBase64: bannerData.imageUrl?.startsWith('data:') ? 'Yes' : 'No',
      imageLength: bannerData.imageUrl?.length || 0
    });
    
    // Create banner document with Base64 image directly (same as products)
    const bannerRef = await addDoc(collection(db, "banners"), {
      name: bannerData.name,
      description: bannerData.description || '',
      imageUrl: bannerData.imageUrl || '', // Store Base64 string directly
      status: bannerData.status || 'Active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      uploadedBy: 'BlackPheonix'
    });

    console.log("✅ Banner document created with ID:", bannerRef.id);

    const newBannerDoc = await getDoc(doc(db, "banners", bannerRef.id));
    const newBannerData = { id: bannerRef.id, ...newBannerDoc.data() };
    
    console.log("✅ Banner added successfully with Base64 image:", {
      id: newBannerData.id,
      name: newBannerData.name,
      hasImage: !!newBannerData.imageUrl,
      imageType: typeof newBannerData.imageUrl
    });
    
    return { success: true, data: newBannerData };

  } catch (error) {
    console.error("💥 Error adding banner:");
    console.error("💥 Error message:", error.message);
    console.error("💥 Error code:", error.code);
    console.error("💥 Full error:", error);
    
    if (error.code === 'permission-denied') {
      return { success: false, error: "Permission denied. Please check authentication and Firestore rules." };
    } else if (error.code === 'unavailable') {
      return { success: false, error: "Firestore is currently unavailable." };
    } else if (error.code === 'unauthenticated') {
      return { success: false, error: "User not authenticated." };
    }
    
    return { success: false, error: error.message };
  }
};

export const updateBanner = async (bannerId, bannerData) => {
  try {
    console.log("🔄 Updating banner at 2025-08-07 20:42:58");
    console.log("🔄 Banner ID:", bannerId);
    console.log("🔄 Current user: BlackPheonix");
    console.log("📸 Banner data:", {
      name: bannerData.name,
      description: bannerData.description,
      status: bannerData.status,
      hasImage: !!bannerData.imageUrl,
      imageType: typeof bannerData.imageUrl,
      isBase64: bannerData.imageUrl?.startsWith('data:') ? 'Yes' : 'No',
      imageLength: bannerData.imageUrl?.length || 0
    });
    
    const bannerDoc = await getDoc(doc(db, "banners", bannerId));
    if (!bannerDoc.exists()) {
      console.error("❌ Banner not found with ID:", bannerId);
      return { success: false, error: "Banner not found" };
    }

    // Update banner document with Base64 image directly (same as products)
    const updateData = {
      name: bannerData.name,
      description: bannerData.description || '',
      imageUrl: bannerData.imageUrl || '', // Store Base64 string directly
      status: bannerData.status || 'Active',
      updatedAt: serverTimestamp(),
      lastUpdatedBy: 'BlackPheonix'
    };

    console.log("🔄 Updating banner document with:", {
      name: updateData.name,
      hasImage: !!updateData.imageUrl,
      imageType: typeof updateData.imageUrl,
      status: updateData.status
    });

    await updateDoc(doc(db, "banners", bannerId), updateData);

    // Get updated banner data
    const updatedBannerDoc = await getDoc(doc(db, "banners", bannerId));
    const updatedBannerData = { id: bannerId, ...updatedBannerDoc.data() };
    
    console.log("✅ Banner updated successfully:", {
      id: updatedBannerData.id,
      name: updatedBannerData.name,
      hasImage: !!updatedBannerData.imageUrl,
      imageType: typeof updatedBannerData.imageUrl
    });
    
    return { success: true, data: updatedBannerData };
  } catch (error) {
    console.error("💥 Error updating banner:");
    console.error("💥 Error message:", error.message);
    console.error("💥 Error code:", error.code);
    console.error("💥 Full error:", error);
    return { success: false, error: error.message };
  }
};

export const deleteBanner = async (bannerId) => {
  try {
    console.log("🗑️ Deleting banner at 2025-08-07 20:42:58");
    console.log("🗑️ Banner ID:", bannerId);
    console.log("🗑️ Current user: BlackPheonix");
    
    const bannerDoc = await getDoc(doc(db, "banners", bannerId));
    if (!bannerDoc.exists()) {
      console.error("❌ Banner not found with ID:", bannerId);
      return { success: false, error: "Banner not found" };
    }
    
    const banner = bannerDoc.data();
    console.log("📄 Banner to delete:", {
      id: bannerId,
      name: banner.name,
      hasImage: !!banner.imageUrl,
      imageType: typeof banner.imageUrl
    });

    // Delete the banner document (no storage cleanup needed for Base64)
    console.log("🗑️ Deleting banner document from Firestore...");
    await deleteDoc(doc(db, "banners", bannerId));
    
    console.log("✅ Banner document deleted successfully");
    console.log("✅ Banner deletion completed for ID:", bannerId);
    return { success: true };
  } catch (error) {
    console.error("💥 Error deleting banner:");
    console.error("💥 Error message:", error.message);
    console.error("💥 Error code:", error.code);
    console.error("💥 Full error:", error);
    return { success: false, error: error.message };
  }
};

// ===== LEGACY ALIASES FOR COMPATIBILITY =====

export const getAllCustomers = getAllUsers;
export const updateCustomer = updateUserData;
export const getCustomerStatistics = getUserStatistics;
export const getCustomerChatMessages = getUserChatMessages;
export const sendChatMessage = sendUserChatMessage;

// Export all functions for easy importing
export default {
  // Product functions
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  
  // User functions
  getAllUsers,
  updateUserData,
  getUserStatistics,
  getAllCustomers,
  updateCustomer,
  getCustomerStatistics,
  
  // Order functions
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
  getUserOrders,
  
  // Dashboard functions
  getDashboardData,
  
  // Cart functions
  addToCart,
  getUserCartItems,
  updateCartItemQuantity,
  removeFromCart,
  clearUserCart,
  
  // Chat functions
  getUserChatMessages,
  sendUserChatMessage,
  getCustomerChatMessages,
  sendChatMessage,
  
  // Banner functions
  getAllBanners,
  addBanner,
  updateBanner,
  deleteBanner
};