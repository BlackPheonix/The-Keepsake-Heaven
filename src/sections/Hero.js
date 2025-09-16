import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import './Hero.css';

const heroSlides = [
  { type: 'video', src: '/images/banner0.mp4' },
  { type: 'image', src: '/images/banner1.jpg' },
  { type: 'image', src: '/images/banner2.png' },
  { type: 'image', src: '/images/banner3.jpg' },
  { type: 'image', src: '/images/banner4.png' },
  { type: 'image', src: '/images/banner5.png' },
];

const Hero = () => {
  const [search, setSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className="hero">
      <div className="hero-slider">
        {heroSlides.map((slide, index) =>
          slide.type === 'image' ? (
            <img
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              src={slide.src}
              alt={`slide-${index + 1}`}
            />
          ) : (
            <video
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              src={slide.src}
              autoPlay
              muted
              loop
              playsInline
            />
          )
        )}
      </div>

      <form className="hero-searchbar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for what you desire"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">
          <FiSearch size={20} />
        </button>
      </form>

      <div className="slider-dots">
        {heroSlides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
