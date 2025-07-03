import React from 'react';
import '../styles/AboutUs.css'; 


// Make sure the path to your image is correct
import bannerImage from '../assets/banner.jpg';

const AboutUs = () => {
  return (
    <main className="about-us-container">
      <div className="banner-section">
        <img src={bannerImage} alt="The Keepsake Heaven store" className="banner-image" />
      </div>

      <div className="content-section">
        <div className="about-us-title-wrapper">
          <h1 className="about-us-title">ABOUT US</h1>
        </div>

        <div className="about-us-description">
          <p>
            At Keepsake Heaven, we believe every gift tells a story. Our carefully selected collection of
            unique, heartfelt items is designed to help you celebrate life's special moments - big or small.
          </p>
          <p>
            Whether you're looking for something <strong>sentimental</strong>, <strong>charming</strong>, or just a little bit <strong>magical</strong>, we've got something special waiting for you.
          </p>
          <p>
            More than just a shop, it's a feeling.
          </p>
          <p>
            We take pride in offering gifts that bring joy, comfort, and lasting memories. From handcrafted keepsakes to personalized treasures, each item is chosen with love and care. Thank you for letting us be part of your most meaningful moments.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;