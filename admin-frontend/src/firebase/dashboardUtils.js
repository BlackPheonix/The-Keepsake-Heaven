import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit, 
  where, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./FirebaseConfig";

export const getDashboardData = async () => {
  try {
    // Get total sales and orders count
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    let totalSales = 0;
    let totalOrders = ordersSnapshot.size;
    
    // Process orders for sales data
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
      totalSales += order.amount || 0;

      // Process date for chart data
      let rawDate = null;
      if (order.createdAt) {
        rawDate = order.createdAt.toDate();
        const month = rawDate.toLocaleString('en-US', { month: 'short' });
        if (rawDate >= sixMonthsAgo) {
          monthlySales[month] += order.amount || 0;
        }
      }

      // Collect recent orders
      const formattedOrder = {
        id: doc.id,
        customer: order.customer || 'Unknown',
        date: rawDate ? rawDate.toLocaleDateString() : 'Unknown',
        rawDate, // For internal sorting
        amount: order.amount || 0,
        items: order.items?.length || 0,
        status: order.status || 'Processing'
      };
      
      orders.push(formattedOrder);
    });
    
    // Prepare sales data for chart
    const now = new Date();
    const currentMonth = now.getMonth();
    const salesData = [];
    
    // Get last 6 months in order
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const month = new Date(now.getFullYear(), monthIndex, 1).toLocaleString('en-US', { month: 'short' });
      salesData.push({
        month,
        sales: monthlySales[month],
        target: monthlyTargets[month]
      });
    }
    
    // Get customer count and locations
    const customersSnapshot = await getDocs(collection(db, "users"));
    const totalCustomers = customersSnapshot.size;
    
    // Count customers by location (based on address field)
    const locations = {
      'Colombo': 0,
      'Kandy': 0,
      'Galle': 0,
      'Other': 0
    };
    
    // Count new customers (registered in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    let newCustomers = 0;
    
    customersSnapshot.forEach(doc => {
      const customer = doc.data();
      
      // Process location data
      let location = 'Other';
      if (customer.address) {
        if (customer.address.includes('Colombo')) location = 'Colombo';
        else if (customer.address.includes('Kandy')) location = 'Kandy';
        else if (customer.address.includes('Galle')) location = 'Galle';
      }
      locations[location]++;
      
      // Check if new customer
      if (customer.createdAt && customer.createdAt.toDate() >= thirtyDaysAgo) {
        newCustomers++;
      }
    });
    
    // Format location data for chart
    const customerLocations = Object.keys(locations).map(region => ({
      region,
      value: locations[region]
    }));
    
    // Get low stock products
    const lowStockQuery = query(
      collection(db, "products"),
      where("stock", "<", 6),
      orderBy("stock"),
      limit(5)
    );
    
    const lowStockSnapshot = await getDocs(lowStockQuery);
    const stockAlerts = [];
    
    lowStockSnapshot.forEach(doc => {
      const product = doc.data();
      stockAlerts.push({
        product: product.name,
        category: product.category,
        stock: product.stock
      });
    });
    
    // Get total products count
    const productsSnapshot = await getDocs(collection(db, "products"));
    const totalProducts = productsSnapshot.size;
    
    // Sort recent orders by real date, not string
    const recentOrders = orders
      .sort((a, b) => (b.rawDate?.getTime?.() || 0) - (a.rawDate?.getTime?.() || 0))
      .slice(0, 8);
    
    return {
      success: true,
      data: {
        totalSales,
        totalOrders,
        totalCustomers,
        totalProducts,
        newCustomers,
        salesData,
        customerLocations,
        recentOrders,
        stockAlerts
      }
    };
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    return { success: false, error: error.message };
  }
};