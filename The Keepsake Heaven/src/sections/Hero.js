import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicBanners } from '../firebase/firebaseUtils';
import './Hero.css';

// Fallback slides - used if no banners are available
const fallbackSlides = [
  { type: 'video', src: '/images/banner0.mp4' },
  { type: 'image', src: '/images/banner1.jpg' },
  { type: 'image', src: '/images/banner2.png' },
  { type: 'image', src: '/images/banner3.jpg' },
  { type: 'image', src: '/images/banner4.png' },
  { type: 'image', src: '/images/banner5.png' },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState(fallbackSlides);
  const [loading, setLoading] = useState(true);
  const [usingFirebaseBanners, setUsingFirebaseBanners] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🏠 Hero component mounted at 2025-08-08 17:15:02");
    console.log("👤 Current user login: BlackPheonix");
    console.log("🌐 Initializing banner fetch for public display...");
    
    fetchBannersFromFirebase();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const fetchBannersFromFirebase = async () => {
    try {
      console.log("🖼️ Starting banner fetch process at 2025-08-08 17:15:02...");
      console.log("👤 User: BlackPheonix");
      setLoading(true);
      setError(null);
      
      console.log("📡 Calling getPublicBanners() function...");
      const result = await getPublicBanners();
      
      console.log("📦 Banner fetch result received at 2025-08-08 17:15:02:", result);
      
      if (result.success && result.data && result.data.length > 0) {
        console.log("✅ Processing", result.data.length, "Firebase banners...");
        
        // Convert Firebase banners to slide format
        const firebaseSlides = result.data.map((banner, index) => {
          console.log(`🖼️ Converting banner ${index + 1}:`, {
            id: banner.id,
            name: banner.name,
            hasImage: !!banner.imageUrl,
            imageType: banner.imageUrl?.startsWith('data:') ? 'Base64' : 'Firebase Storage URL'
          });
          
          return {
            type: 'image',
            src: banner.imageUrl,
            name: banner.name,
            description: banner.description,
            id: banner.id,
            status: banner.status
          };
        });
        
        setHeroSlides(firebaseSlides);
        setUsingFirebaseBanners(true);
        setCurrentSlide(0);
        console.log("🎉 Firebase banners loaded and set successfully at 2025-08-08 17:15:02!");
        
      } else if (result.success && (!result.data || result.data.length === 0)) {
        console.log("⚠️ No active banners found, falling back to default slides");
        setHeroSlides(fallbackSlides);
        setUsingFirebaseBanners(false);
        
      } else {
        console.log("❌ Banner fetch failed at 2025-08-08 17:15:02:", result.error);
        setError(result.error || "Failed to fetch banners");
        setHeroSlides(fallbackSlides);
        setUsingFirebaseBanners(false);
      }
      
    } catch (error) {
      console.error("💥 Exception in banner fetch at 2025-08-08 17:15:02:", error);
      setError("Failed to load banners: " + error.message);
      setHeroSlides(fallbackSlides);
      setUsingFirebaseBanners(false);
    } finally {
      setLoading(false);
      console.log("🏁 Banner fetch process completed at 2025-08-08 17:15:02");
    }
  };

  const handleSlideClick = (slideIndex) => {
    console.log("🖱️ Slide clicked at 2025-08-08 17:15:02:", slideIndex);
    setCurrentSlide(slideIndex);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="hero">
      {/* Loading Overlay */}
      {loading && (
        <div className="hero-loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>🖼️ Loading banners...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="hero-error-message">
          <span>⚠️ {error}</span>
          <button onClick={fetchBannersFromFirebase}>🔄 Retry</button>
        </div>
      )}

      <div className="hero-slider">
        {heroSlides.map((slide, index) => {
          // Handle video slides
          if (slide.type === 'video') {
            return (
              <video
                key={slide.id || `fallback-${index}`}
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                src={slide.src}
                autoPlay
                muted
                loop
                playsInline
                onLoadStart={() => console.log(`📹 Video slide ${index} loading started at 2025-08-08 17:15:02`)}
                onCanPlay={() => console.log(`✅ Video slide ${index} ready to play`)}
                onError={(e) => console.error(`❌ Video slide ${index} error:`, e)}
              />
            );
          } 
          // Handle Firebase banners - NO TEXT OVERLAY
          else if (usingFirebaseBanners) {
            return (
              <div
                key={slide.id || `banner-${index}`}
                className={`hero-slide firebase-banner ${index === currentSlide ? 'active' : ''}`}
                style={{
                  backgroundImage: `url(${slide.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            );
          } 
          // Handle fallback image slides
          else {
            return (
              <div key={`fallback-${index}`} className={`hero-slide fallback-slide ${index === currentSlide ? 'active' : ''}`}>
                <img
                  src={slide.src}
                  alt={`slide-${index + 1}`}
                  onLoad={() => console.log(`✅ Fallback slide ${index} loaded at 2025-08-08 17:15:02`)}
                  onError={(e) => {
                    console.error(`❌ Fallback slide ${index} failed to load:`, slide.src);
                    e.target.style.display = 'none';
                  }}
                />
                {/* Overlay for fallback slides */}
                <div className="fallback-slide-overlay">
                  <div className="fallback-slide-content">
                    <h1>🎁 Welcome to The Keepsake Heaven</h1>
                    <p>Discover beautiful gifts and memories that last forever</p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Slider Navigation Dots */}
      <div className="slider-dots">
        {heroSlides.map((slide, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => handleSlideClick(idx)}
            title={usingFirebaseBanners ? slide.name : `Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;