import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search)}`);
  }
  return (
    <section className="hero">
      <img className="hero-poster" src="/images/IMG 3.jpg" alt="poster" />
      <form className="hero-searchbar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for what you desire"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit"><FiSearch size={20} /></button>
      </form>
    </section>
  );
};

export default Hero;