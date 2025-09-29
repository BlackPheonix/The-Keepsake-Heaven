import React from 'react';
import '../styles/AboutUs.css';
import bannerImage from '../assets/banner.jpg';

const AboutUs = () => (
  <div className="aboutus-outer">
    <div className="aboutus-banner">
      <img src={bannerImage} alt="The Keepsake Heaven storefront" />
    </div>
    <div className="aboutus-tab">ABOUT US</div>
    <div className="aboutus-center-box">
      <p>
        At Keepsake Heaven, we believe every gift tells a story. Our carefully selected collection of unique, heartfelt items is designed to help you celebrate life's special moments – big or small.
      </p>
      <p>
        Whether you're looking for something <b>sentimental</b>, <b>charming</b>, or just a little bit <b>magical</b>, we've got something special waiting for you.
      </p>
      <p>
        More than just a shop, it's a feeling.
      </p>
      <p>
        We take pride in offering gifts that bring joy, comfort, and lasting memories. From handcrafted keepsakes to personalized treasures, each item is chosen with love and care. Thank you for letting us be a part of your most meaningful moments.
      </p>
    </div>
  </div>
);

export default AboutUs;