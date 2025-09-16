// Sample product data
const sampleProducts = [ 
  {
    id: 1,
    name: 'Premium Rose Bouquet',
    price: 45.99,
    category: 'flowers',
    image: 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg',
    rating: 5,
    description: 'Beautiful premium roses arranged in an elegant bouquet perfect for any special occasion.',
    inStock: true,
    featured: true,
    newProduct: true,
  },
  {
    id: 2,
    name: 'Luxury Chocolate Box',
    price: 35.50,
    category: 'chocolates',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    rating: 4,
    description: 'Premium assorted chocolates in an elegant gift box.',
    inStock: true,
    featured: true,
    specialOffer: true,
  },
  {
    id: 3,
    name: 'Soft Teddy Bear',
    price: 28.99,
    category: 'soft-toys',
    image: 'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg',
    rating: 5,
    description: 'Adorable soft teddy bear perfect for kids and baby gifts.',
    inStock: true,
    featured: true,
  },
  {
    id: 4,
    name: 'Gold Jewelry Set',
    price: 89.99,
    category: 'jewelry',
    image: 'https://images.pexels.com/photos/1458884/pexels-photo-1458884.jpeg',
    rating: 5,
    description: 'Elegant gold jewelry set with necklace and earrings.',
    inStock: true,
    featured: true,
  },
  {
    id: 5,
    name: 'Designer Handbag',
    price: 125.00,
    category: 'handbags',
    image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg',
    rating: 4,
    description: 'Stylish designer handbag perfect for fashion enthusiasts.',
    inStock: true,
    newProduct: true,
  },
  {
    id: 6,
    name: 'Premium Perfume',
    price: 67.50,
    category: 'perfumes',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
    rating: 5,
    description: 'Luxurious fragrance with long-lasting scent.',
    inStock: true,
    specialOffer: true,
  },
  {
    id: 7,
    name: 'Home Decor Vase',
    price: 42.00,
    category: 'home-decor',
    image: 'https://images.pexels.com/photos/6510343/pexels-photo-6510343.jpeg',
    rating: 4,
    description: 'Beautiful decorative vase for home decoration.',
    inStock: true,
  },
  {
    id: 8,
    name: 'Handmade Greeting Card',
    price: 12.99,
    category: 'greeting-cards',
    image: 'https://images.pexels.com/photos/6985048/pexels-photo-6985048.jpeg',
    rating: 5,
    description: 'Beautiful handmade greeting card for special occasions.',
    inStock: true,
    newProduct: true,
  },
];

const categories = [
  { id: 'beauty', name: 'Beauty/Cosmetics & Skin Care', image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg', count: 15 },
  { id: 'chocolates', name: 'Chocolates', image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg', count: 24 },
  { id: 'flowers', name: 'Flowers', image: 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg', count: 18 },
  { id: 'soft-toys', name: 'Soft Toys/Kids & Baby', image: 'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg', count: 32 },
  { id: 'gift-boxes', name: 'Gift Box/Personalized Gifts', image: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg', count: 21 },
  { id: 'greeting-cards', name: 'Handmade Greeting Cards', image: 'https://images.pexels.com/photos/6985048/pexels-photo-6985048.jpeg', count: 12 },
  { id: 'jewelry', name: 'Jewelry/Watches', image: 'https://images.pexels.com/photos/1458884/pexels-photo-1458884.jpeg', count: 28 },
  { id: 'handbags', name: 'Hand Bags/Fashion/Shoes', image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg', count: 35 },
  { id: 'perfumes', name: 'Perfumes/Fragrances', image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg', count: 16 },
  { id: 'home-decor', name: 'Home Decor & Homewares', image: 'https://images.pexels.com/photos/6510343/pexels-photo-6510343.jpeg', count: 42 },
  { id: 'gift-vouchers', name: 'Gift Vouchers', image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg', count: 8 },
  { id: 'resin-products', name: 'Resin Products', image: 'https://images.pexels.com/photos/6985260/pexels-photo-6985260.jpeg', count: 19 },
];

const initialState = {
  products: sampleProducts,
  categories: categories,
  filteredProducts: sampleProducts,
  selectedCategory: null,
  loading: false,
  error: null,
  searchQuery: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      if (action.payload) {
        state.filteredProducts = state.products.filter(
          product => product.category === action.payload
        );
      } else {
        state.filteredProducts = state.products;
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      if (action.payload) {
        state.filteredProducts = state.products.filter(product =>
          product.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          product.description.toLowerCase().includes(action.payload.toLowerCase())
        );
      } else {
        state.filteredProducts = state.selectedCategory
          ? state.products.filter(product => product.category === state.selectedCategory)
          : state.products;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    filterByType: (state, action) => {
      const type = action.payload; // 'featured', 'newProduct', 'specialOffer'
      switch (type) {
        case 'new':
          state.filteredProducts = state.products.filter(product => product.newProduct);
          break;
        case 'offers':
          state.filteredProducts = state.products.filter(product => product.specialOffer);
          break;
        case 'featured':
          state.filteredProducts = state.products.filter(product => product.featured);
          break;
        default:
          state.filteredProducts = state.products;
      }
    },
  },
});

export const {
  setProducts,
  setSelectedCategory,
  setSearchQuery,
  setLoading,
  setError,
  filterByType,
} = productsSlice.actions;

export default productsSlice.reducer;