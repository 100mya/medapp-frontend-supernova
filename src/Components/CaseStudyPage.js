import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaLungs, FaSyringe, FaStethoscope, FaBone, FaPlus } from 'react-icons/fa';
import './CaseStudyPage.css';
import Header from './Header';

const CaseStudyPage = () => {
  const navigate = useNavigate();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isPremiumPlan, setIsPremiumPlan] = useState(false);


  const handleNavigate = (category) => {
    navigate(`/simulator?category=${category}`);
  };

  useEffect(() => {
    const handleLoginWithStoredCredentials = async () => {
      try {
        const storedCredentials = localStorage.getItem('rx_chatbot_credentials');
        const storedSubscriptionStatus = localStorage.getItem('isSubscribed');

        if (storedSubscriptionStatus) {
          setIsSubscribed(JSON.parse(storedSubscriptionStatus));
        }
        if (!storedCredentials) {
          throw new Error('No stored credentials found');
        }

        const { email, password } = JSON.parse(storedCredentials);
        const storedPlanStatus = localStorage.getItem('isPremiumPlan');
        console.log(storedPlanStatus);
        if (storedPlanStatus) {
          setIsPremiumPlan(JSON.parse(storedPlanStatus));
        }
        const loginResponse = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('Logged in successfully:', loginData);
          setIsLoggedIn(true);
          setUserEmail(email);
        } else {
          throw new Error('Failed to login with stored credentials');
        }
      } catch (error) {
        console.error('Error logging in with stored credentials:', error);
      }
    };
    handleLoginWithStoredCredentials();
  }, []);

  const cardData = [
    { title: 'Cardiovascular', description: 'Explore interactive case studies on cardiovascular health.', icon: <FaHeartbeat className="case-page-card-icon" /> },
    { title: 'Respiratory', description: 'Engage with respiratory case studies and scenarios.', icon: <FaLungs className="case-page-card-icon" /> },
    { title: 'Gastrointestinal', description: 'Interactive studies focusing on gastrointestinal conditions.', icon: <FaSyringe className="case-page-card-icon" /> },
    { title: 'Hematology', description: 'Dive into hematology with interactive case studies.', icon: <FaStethoscope className="case-page-card-icon" /> },
    { title: 'Musculoskeletal', description: 'Study musculoskeletal disorders through interactive cases.', icon: <FaBone className="case-page-card-icon" /> },
    { title: 'All Categories', description: 'Access interactive case study from all categories.', icon: <FaPlus className="case-page-card-icon" /> },
  ];

  return (
      <div>
          <Header />
    <div className="case-page">
      <h1 className="case-page-heading">Interactive Medical <span style={{color: "#ff416c"}}>Case Studies</span></h1>
      {isLoggedIn && isSubscribed ? (
      <div className="case-page-card-container">
        {cardData.map((card) => (
          <div className="case-page-card" key={card.title}>
            <div className="case-page-card-icon-container">
              {card.icon}
            </div>
            <div className="case-page-card-content">
              <h2 className="case-page-card-title">{card.title}</h2>
              <p className="case-page-card-description">{card.description}</p>
              <button className="case-page-card-button" onClick={() => handleNavigate(card.title.toLowerCase())}>
                Start
              </button>
            </div>
          </div>
        ))}
      </div>) : (
          <p>Please login and subscribe to acsess interactive case studies.</p>
        )}
    </div>
    </div>
  );
};

export default CaseStudyPage;
