import React from 'react';
import Hero from '../sections/Hero';
import Categories from '../sections/Categories';
import FeaturedProducts from '../sections/FeaturedProducts';
import CustomerReviews from '../sections/CustomerReviews';

const Home = () => (
  <>
    <Hero />
    <Categories />
    <FeaturedProducts />
    <CustomerReviews />
  </>
);

export default Home;