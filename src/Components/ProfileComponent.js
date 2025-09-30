import React, { useState, useEffect } from 'react';
import { FaBell, FaUser, FaCog } from 'react-icons/fa';
import './ProfileComponent.css';

const ProfileComponent = ({ handleLogout }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    cellNumber: '',
    collegeName: '',
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    cellNumber: '',
    collegeName: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // New state for active tab

  // Fetch user profile details from backend on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const storedCredentials = localStorage.getItem('rx_chatbot_credentials');
      if (!storedCredentials) {
        // Handle unauthorized or redirect to login
        return;
      }
      const { email } = JSON.parse(storedCredentials);

      const response = await fetch('/api/get-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.profile);
        setFormData(data.profile); // Initialize form data
      } else {
        console.error('Failed to fetch profile:', data.error);
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Handle error
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const eformData = new FormData();
            eformData.append('email', user.email);
            eformData.append('name', formData.name);
            eformData.append('cellNumber', formData.cellNumber);
            eformData.append('collegeName', formData.collegeName);
            eformData.append('country', formData.country);

      const response = await fetch('/api/update-profile', {
        method: 'POST',
        body: eformData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
        setUser(formData);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNotificationClick = () => {
    setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen);
  };

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const handleUpdatePassword = async () => {
    // Frontend validation for password fields
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('New password and confirm new password must match.');
      return;
    }
    try {
      const storedCredentials = localStorage.getItem('rx_chatbot_credentials');
      if (!storedCredentials) {
        // Handle unauthorized or redirect to login
        return;
      }
      const { email } = JSON.parse(storedCredentials);
  
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }
  
      const data = await response.json();
      if (data.success) {
        const storedCredentials = JSON.parse(localStorage.getItem('rx_chatbot_credentials'));
      localStorage.setItem('rx_chatbot_credentials', JSON.stringify({
        ...storedCredentials,
        password: formData.newPassword, // Update password here
      }));
        setFormData((prevData) => ({
          ...prevData,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }));
        alert('Password updated successfully!');
      } else {
        alert(`Failed to update password: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert(`Error updating password: ${error.message}`);
    }
  };
  

  return (
    <div className="profile-header-container">
      <a href="/" className="profile-header-homepage-link">Home</a>
      <h1 className='ph-h'>
        Welcome, <span style={{ color: '#ff416c' }}>{user.name}</span>
      </h1>
      <div className="profile-header-icons">
        <div className="profile-header-icon" onClick={handleNotificationClick}>
          {/*<FaBell />*/}
          {notifications.length > 0 && <span className="profile-header-notification-count">{notifications.length}</span>}
          {isNotificationsDropdownOpen && (
            <div className="profile-header-notifications-dropdown">
              {notifications.map((notification, index) => (
                <div key={index} className="profile-header-notification-item">
                  {notification}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="profile-header-icon" onClick={handleSettingsClick}>
          {/*<FaCog />*/}
        </div>
        <div className="profile-header-icon" onClick={handleProfileClick}>
          <FaUser />
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {isProfileModalOpen && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-container">
            <div className="profile-modal-close-button" onClick={closeProfileModal}></div>
            <div className="profile-modal-tabs">
              <button
                className={`profile-modal-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Information
              </button>
              <button
                className={`profile-modal-tab ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                Change Password
              </button>
            </div>
            {activeTab === 'profile' && (
              <div className="profile-modal-content">
                <h2 className="profile-modal-title">Profile</h2>
                <form className="profile-modal-form">
                  <div className="profile-modal-form-group">
                    <label className="profile-modal-label">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="profile-modal-input"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="profile-modal-form-group">
                    <label className="profile-modal-label">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      className="profile-modal-input"
                      disabled
                    />
                  </div>

                  <div className="profile-modal-form-group">
                    <label className="profile-modal-label">Cell Number:</label>
                    <input
                      type="text"
                      name="cellNumber"
                      value={formData.cellNumber}
                      onChange={handleInputChange}
                      className="profile-modal-input"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="profile-modal-form-group">
                    <label className="profile-modal-label">College Name:</label>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      className="profile-modal-input"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="profile-modal-form-group">
                    <label className="profile-modal-label">Country:</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="profile-modal-input"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="profile-modal-buttons">
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={handleSaveClick}
                        className="profile-modal-button profile-modal-save-button"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleEditClick}
                        className="profile-modal-button profile-modal-edit-button"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
            {activeTab === 'password' && (
              <div className="profile-modal-content">
                <h2 className="profile-modal-title">Change Password</h2>
                <form className="profile-modal-form">
                  <div className="profile-modal-form-group">
                    <label className="profile-modal-label">Current Password:</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="profile-modal-input"
                    />
                  </div>

                  <div className="profile-modal-form-group">
                    <label className="profile-modal-label">New Password:</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="profile-modal-input"
                    />
                  </div>

                  <div className="profile-modal-form-group">
                    <label className="profile-modal-label">Confirm New Password:</label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleInputChange}
                      className="profile-modal-input"
                    />
                  </div>

                  <div className="profile-modal-buttons">
                    <button
                      type="button"
                      onClick={handleUpdatePassword}
                      className="profile-modal-button profile-modal-save-button"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {isSettingsModalOpen && (
        <div className="settings-modal-overlay">
          <div className="settings-modal-container">
            <div className="settings-modal-close-button" onClick={closeSettingsModal}></div>
            <h2 className="settings-modal-title">Settings</h2>
            <p>Settings content goes here...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
