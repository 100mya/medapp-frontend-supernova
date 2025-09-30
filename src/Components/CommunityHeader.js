import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CommunityHeader.css';

const CommunityHeader = ( {handleLogout} ) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCredentials = localStorage.getItem('rx_chatbot_credentials');
    if (storedCredentials) {
      const { email, password } = JSON.parse(storedCredentials);
      // Check if stored credentials are valid
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then(response => {
          if (response.ok) {
            setIsLoggedIn(true);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="community-header">
      <div className="community-logo">MedicoEd</div>
      <div className="community-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard/upload-papers" className="nav-link">Dashboard</Link>
        <Link to="/exam" className="nav-link">Exam</Link>
        <Link to="/case-studies" className="nav-link">Case Study</Link>
        <Link to="/pricing" className="nav-link">Pricing</Link>
        <Link to="/community" className="nav-link">Community</Link>
      </div>
      <div>{isLoggedIn && <button className="community-cta" onClick={handleLogout}>Logout</button>}</div>
      <div className="mobile-menu">
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          ☰
        </button>
        {isMobileMenuOpen && (
          <div className="mobile-dropdown">
            <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>Home</Link>
            <Link to="/dashboard/upload-papers" className="mobile-nav-link" onClick={toggleMobileMenu}>Dashboard</Link>
            <Link to="/exam" className="mobile-nav-link" onClick={toggleMobileMenu}>Exam</Link>
            <Link to="/case-studies" className="mobile-nav-link" onClick={toggleMobileMenu}>Case Study</Link>
            <Link to="/pricing" className="mobile-nav-link" onClick={toggleMobileMenu}>Pricing</Link>
            <Link to="/community" className="mobile-nav-link" onClick={toggleMobileMenu}>Community</Link>
            {isLoggedIn && <button className="mobile-cta" onClick={() => { handleLogout(); toggleMobileMenu(); }}>Logout</button>}
          </div>
        )}
      </div>
    </header>
  );
};

export default CommunityHeader;
