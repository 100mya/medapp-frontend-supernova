import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="research-footer">
      <div className="research-footer-content">
        <div className="footer-links-icons">
          <Link to="/about" className="footer-link">About Us</Link>
          <span className="footer-separator"> </span>
          <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <span className="footer-separator"> </span>
          <Link to="/terms-of-service" className="footer-link">Terms And Conditions</Link>
          <span className="footer-separator"> </span>
          {/*<Link to="/contact" className="footer-link">Contact</Link>
          <span className="footer-separator"> </span>
          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <FaInstagram />
            </a>
          </div>
          <span className="footer-separator"></span>*/}
  </div>
        <div className="research-footer-legal">
          © 2024 MedicoEd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
