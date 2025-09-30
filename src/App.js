import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import LandingSection from './Components/LandingSection';
import UploadsSection from './Components/UploadsSection';
import FeaturesSection from './Components/FeaturesSection';
import TestimonialSection from './Components/TestimonialSection';
import Footer from './Components/Footer';
import Dashboard from './Components/Dashboard';
import Modal from './Components/Modal';
import ForgotPassword from './Components/ForgotPassword';
import About from './Components/About';
import Contact from './Components/Contact';
import PrivacyPolicy from './Components/PrivacyPolicy';
import TermsOfService from './Components/TermsOfService';
import CommunityPage from './Components/CommunityPage';
import Profile from './Components/Profile';
import UserProfile from './Components/UserProfile';
import Search from './Components/SearchPage';
import Notifications from './Components/Notifications';
import Exam from './Components/ExamPage';
import Pricing from './Components/PricingPage';
import SimulatorPage from './Components/SimulatorPage';
import CaseStudyPage from './Components/CaseStudyPage';

import subscribedEmails from './Components/subscribedEmails.json';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPremiumPlan, setIsPremiumPlan] = useState(false);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const handleLoginWithStoredCredentials = async () => {
      try {
        const storedCredentials = localStorage.getItem('rx_chatbot_credentials');
        const storedInvitationCode = localStorage.getItem('invitation_code');
        console.log(storedInvitationCode);

        if (!storedCredentials) {
          throw new Error('No stored credentials found');
        }

        const { email, password } = JSON.parse(storedCredentials);
        setUserEmail(email);

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

          // Fetch user details and subscription status
          const fetchUserDetails = async () => {
            try {
              const userDetailsResponse = await fetch('/api/fetch-user-by-id', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_id: email }),
              });

              if (userDetailsResponse.ok) {
                const userDetails = await userDetailsResponse.json();
                const { invitation_code } = JSON.parse(userDetails);
                const invitationCode = invitation_code;

                const { subscription_status } = JSON.parse(userDetails);
                const status = subscription_status;

                const {plan} = JSON.parse(userDetails);
                const found_plan = plan;

                setIsPremiumPlan(found_plan === 'PREMIUM');
                localStorage.setItem('isPremiumPlan', JSON.stringify(found_plan === 'PREMIUM'));

                console.log(status);
                
                // Assuming the subscription status is part of the user details response
                const isSubscribedStatus = status === 'active';
                setIsSubscribed(isSubscribedStatus);
                localStorage.setItem('isSubscribed', JSON.stringify(isSubscribedStatus));
                console.log('Fetched Subscription Status:', isSubscribedStatus);

                // Check subscription status in the subscribedEmails list
                if (!isSubscribedStatus) {
                  if (subscribedEmails.includes(email.toLowerCase())) {
                    setIsSubscribed(true);
                    setIsPremiumPlan(found_plan === 'PREMIUM');
                    localStorage.setItem('isPremiumPlan', JSON.stringify(found_plan === 'PREMIUM'));
                    localStorage.setItem('isSubscribed', JSON.stringify(true));
                    console.log('Email is in subscribedEmails list');
                  } else if (storedInvitationCode) {
                    const isValid = await validateInvitationCode(storedInvitationCode, email);
                    console.log('Invitation Code Valid:', isValid);
                    if (isValid) {
                      setIsSubscribed(true);
                      localStorage.setItem('isSubscribed', JSON.stringify(true));
                      console.log('Invitation code is valid');
                    } }else if (invitationCode) {
                      const isValid = await validateInvitationCode(invitationCode, email);
                      console.log('Invitation Code Valid:', isValid);
                      if (isValid) {
                        setIsSubscribed(true);
                        localStorage.setItem('isSubscribed', JSON.stringify(true));
                        console.log('Invitation code is valid');
                      } }else {
                      console.log('Invitation code is not valid');
                    }
                  }
              } else {
                console.error('Failed to fetch user details');
              }
            } catch (error) {
              console.error('Error fetching user details:', error);
            }
          };

          fetchUserDetails();

        } else {
          throw new Error('Failed to login with stored credentials');
        }
      } catch (error) {
        console.error('Error logging in with stored credentials:', error);
        // Handle error, e.g., show error message, redirect to login page
      }
      console.log('Final Subscription Status:', isSubscribed);
    };

    const validateInvitationCode = async (code, user_id) => {
      try {
        const response = await fetch('/api/validate-invitation-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, user_id }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          if (data.success) {
            setIsSubscribed(true);
            localStorage.setItem('isSubscribed', 'true');
            console.log('Invitation code is valid');
          } else {
            console.log('Invitation code is not valid');
          }
          return data.success;
        } else {
          console.error(`Error: ${data.message}`);
          return false;
        }
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    };

    handleLoginWithStoredCredentials();
  }, []);

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      setMessage('You are already logged in!');
    } else {
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rx_chatbot_credentials');
    localStorage.removeItem('follower_id');
    localStorage.removeItem('subscriptionID');
    localStorage.removeItem('invitation_code');
    localStorage.removeItem('isPremiumPlan');
    setIsLoggedIn(false);
    window.location.href = '/';
    console.log('Logged out successfully');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Header isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />
              <LandingSection isLoggedIn={isLoggedIn} handleGetStartedClick={handleGetStartedClick} />
              <FeaturesSection />
              <TestimonialSection />
              <Footer />
            </>
          } />
          <Route path="/dashboard/*" element={<Dashboard isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} handleLogout={handleLogout}/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/community" element={<CommunityPage isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} handleLogout={handleLogout} />} />
          <Route path="/community/user-profile" element={<UserProfile isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/community/profile" element={<Profile isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/community/search" element={<Search isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/community/notifications" element={<Notifications isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/exam" element={<Exam isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/pricing" element={<Pricing isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/simulator" element={<SimulatorPage isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/case-studies" element={<CaseStudyPage isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
        </Routes>
        {showModal && <Modal toggleModal={() => setShowModal(false)} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />}
        {message && <div className="logged-in-message">{message}</div>}
      </div>
    </Router>
  );
}

export default App;
