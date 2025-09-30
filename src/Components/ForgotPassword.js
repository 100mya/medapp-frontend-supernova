// src/components/ForgotPassword.js
import React, { useState } from 'react';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your logic to send a new password to the email address
    setMessage('A new password has been sent to your email address.');
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your email address and we'll send you a new password.</p>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send New Password</button>
      </form>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default ForgotPassword;
