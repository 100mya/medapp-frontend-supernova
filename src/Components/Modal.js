import React, { useState, useEffect } from 'react';
import './Modal.css';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import subscribedEmails from './subscribedEmails.json'; // Import JSON file

const Modal = ({ toggleModal, setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true); // Default to login view
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    invitation_code: '',
    country: '',
    password: ''
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-fill form with saved credentials from localStorage if on login
    const savedCredentials = localStorage.getItem('rx_chatbot_credentials');
    if (savedCredentials && isLogin) {
      const { email, password } = JSON.parse(savedCredentials);
      setFormData({ ...formData, email, password });
    }

    // Fetch subscription status from local storage
    const storedSubscriptionStatus = localStorage.getItem('isSubscribed');
    if (storedSubscriptionStatus) {
      setIsSubscribed(JSON.parse(storedSubscriptionStatus));
      console.log(isSubscribed);
    }
  }, [isLogin]);

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
          localStorage.setItem('isSubscribed', JSON.stringify(true));
          localStorage.setItem('invitation_code', code);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? '/api/login' : '/api/signup';
    const method = 'POST';
    console.log(isSubscribed);

    const formDataToSend = {
      ...formData,
      cellNumber: `${formData.phoneNumber}`
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(`User ${isLogin ? 'logged in' : 'signed up'} successfully`);

        // Save login credentials to localStorage if logging in

        localStorage.setItem('rx_chatbot_credentials', JSON.stringify(formData));
          localStorage.setItem('follower_id', formData.email);
          localStorage.setItem('invitation_code', formData.invitation_code);

        if (isLogin) {
          localStorage.setItem('rx_chatbot_credentials', JSON.stringify(formData));
          localStorage.setItem('follower_id', formData.email);
          setIsLoggedIn(true); // Set user login status in App component

          const userDetailsResponse = await fetch('/api/fetch-user-by-id', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email_id: formData.email }),
                });

          if (userDetailsResponse.ok) {
            const userDetails = await userDetailsResponse.json();
          
          
          const { invitation_code } = JSON.parse(userDetails);
          console.log(invitation_code);
        
          const isValidate = await validateInvitationCode(invitation_code, formData.email);
          if (isValidate) {
            setIsSubscribed(true); // User is already subscribed
            localStorage.setItem('invitation_code', invitation_code);

          }}
        }

          
          
          const isCodeValid = await validateInvitationCode(formData.invitation_code, formData.email);
          localStorage.setItem('invitation_code', formData.invitation_code);
          if (isCodeValid) {
            setIsSubscribed(true);
            localStorage.setItem('isSubscribed', JSON.stringify(true));
          }

        console.log(isSubscribed);

        // Check if the email is in the subscribedEmails list
        if (subscribedEmails.includes(formData.email)) {
          setIsSubscribed(true);
          localStorage.setItem('isSubscribed', JSON.stringify(true)); // Just a placeholder value
        } 
        
        const subscriptionStatus = localStorage.getItem('isSubscribed') === 'true';
          console.log(subscriptionStatus);

        if (subscriptionStatus) {
          window.location.reload();
        }
        
        if (!subscriptionStatus) {
          navigate('/pricing');
          window.location.reload();
        }
        
      } else {
        // Handle error response
        const data = await response.json();
        console.error(`Error: ${data.message}`);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error);
    }
  };

  const handleClickOutside = (e) => {
    const modalContent = document.querySelector('.custom-modal-content');
    if (modalContent && !modalContent.contains(e.target)) {
      toggleModal();
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('rx_chatbot_credentials');
    localStorage.removeItem('follower_id');
    localStorage.removeItem('isSubscribed');
    localStorage.removeItem('invitation_code');
    setIsSubscribed(false);
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div className="custom-modal-container" onClick={handleClickOutside}>
      <div className={`custom-modal-content ${isLogin ? 'custom-login' : 'custom-signup'}`}>
        <button className="custom-close-button" onClick={toggleModal}>×</button>
        <div className="custom-form-container">
          <form className="custom-form" onSubmit={handleSubmit}>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            {!isLogin && (
              <>
                <input type="text" name="name" placeholder="Name" className="custom-input" value={formData.name} onChange={handleChange} required />
                <div className="custom-phone-container">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={formData.phoneNumber}
                    onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
                    className="custom-phone-input"
                  />
                </div>
                <input type="text" name="invitation_code" placeholder="Invitation Code (optional)" className="custom-input" value={formData.invitation_code} onChange={handleChange} />
              </>
            )}
            <input type="email" name="email" placeholder="Email" className="custom-input" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="custom-input" value={formData.password} onChange={handleChange} required />
            <button type="submit" className="custom-button">{isLogin ? 'Login' : 'Sign Up'}</button>
            {isLogin && <Link to="/forgot-password" className="custom-forgot-password" onClick={toggleModal}>Forgot Password?</Link>}
          </form>
        </div>
        <div className="custom-switch-container">
          <div className="custom-switch-box">
            <h2>{isLogin ? 'New User?' : 'Already Registered?'}</h2>
            <button className="custom-switch-button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
            <button className="custom-switch-button" style={{ marginLeft: '10px' }} onClick={handleLogoutClick}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
