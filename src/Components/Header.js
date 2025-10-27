import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Modal from './Modal';
import { FaBars } from 'react-icons/fa'; // Importing the bars icon

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
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
            // Fetch subscription status from localStorage
            const subscriptionStatus = localStorage.getItem('isSubscribed') === 'true';
            setIsSubscribed(subscriptionStatus);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, []);

  const handleDashboardClick = (e) => {
    const subscriptionStatus = localStorage.getItem('isSubscribed') === 'true';
    if (!isLoggedIn) {
      e.preventDefault();
      setShowModal(true);
    } else if (!subscriptionStatus) {
      e.preventDefault();
      navigate('/pricing');
    }
  };

  const handleGetStartedClick = () => {
    const subscriptionStatus = localStorage.getItem('isSubscribed') === 'true';
    if (!isLoggedIn) {
      setShowModal(true);
    } else if (!subscriptionStatus) {
      navigate('/pricing');
    } else {
      navigate('/dashboard/upload-papers');
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="research-header">
      <div className="research-logo">Brainboost</div>
      <button className="mobile-nav-toggle" onClick={toggleNav}>
        <FaBars />
      </button>
      <nav className={`research-nav ${isNavOpen ? 'open' : ''}`}>
        <Link to="/dashboard/upload-papers" >Dashboard</Link>
        <Link to="/case-studies" >Case Study</Link>
        <Link to="/community" >Community</Link>
      </nav>
    </header>
  );
}

export default Header;
