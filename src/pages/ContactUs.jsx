import React from "react";
import "../styles/ContactUs.css";

const ContactUs = () => (
  <main className="contactus-container">
    <h1 className="contactus-title">Contact Us</h1>
    <div className="contactus-flex">
      <div className="contactus-info">
        <h2>The Keepsake Heaven</h2>
        <address>
          No 2/1,<br />
          Somawathiya Road,<br />
          Hospital Junction,<br />
          Polonnaruwa,<br />
          Sri Lanka, 51000
        </address>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:Thekeepsakeheaven0120@gmail.com">
            Thekeepsakeheaven0120@gmail.com
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a href="tel:+94771415286">+94 77 141 5286</a>
        </p>
      </div>
      <div className="contactus-map">
        <iframe
          title="Keepsake Heaven Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.525407230329!2d81.00879717568557!3d7.9445305050194275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb450064b0ce13%3A0x8426f0d23a060b41!2sThe%20keepsake%20heaven!5e0!3m2!1sen!2slk!4v1752300612729!5m2!1sen!2slk"
          width="100%"
          height="320"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </main>
);

export default ContactUs;