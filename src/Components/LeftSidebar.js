import React, { useEffect, useState } from 'react';
import './LeftSidebar.css';
import defaultProfilePic from './default.jpeg'; // Adjust the path as necessary

const LeftSidebar = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedData = localStorage.getItem('rx_chatbot_credentials');
        if (storedData) {
          const { email } = JSON.parse(storedData);
          localStorage.setItem('follower_id', email);
          const response = await fetch('/api/fetch-user-by-id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email_id: email }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user information');
          }

          const userd = await response.json(); // Parse response as JSON
          const userData = JSON.parse(userd);

          if (userData && !userData.error) {
            const user = {
              name: userData.name || '',
              email: userData.email || '',
              cellNumber: userData.cellNumber || '',
              collegeName: userData.collegeName || '',
              country: userData.country || '',
              bio: userData.bio || '',
              profilePic: getProfilePicUrl(userData.profilePic, userData.profilePicType), // Get profile pic URL based on type
              followersCount: Array.isArray(userData.followers) ? userData.followers.length : 0,
              followingCount: Array.isArray(userData.following) ? userData.following.length : 0,
            };

            setUserInfo(user);
          } else {
            throw new Error(userData.error || 'User data format is incorrect');
          }
        } else {
          throw new Error('No stored data found in local storage');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Function to generate media URL based on type
  const getProfilePicUrl = (profilePic, profilePicType) => {
    if (profilePic) {
      return `data:image/jpeg;base64,${profilePic}`; // Assuming profilePic is base64 encoded JPEG
    } else {
      return defaultProfilePic; // Fallback to default profile picture
    }
  };

  

  return (
    <div className="left-sidebar">
      {userInfo && (
        <div className="profiles-info">
          <div className="profiles-header">
            <img src={userInfo.profilePic} alt="Profile" className="profile-pic" />
            <h3>{userInfo.name}</h3>
            <p className="profiles-email">{userInfo.email}</p>
          </div>
          <div className="profiles-bio">
            <p>{userInfo.bio}</p>
          </div>
          <div className="profiles-details">
            <p className="profiles-info-item">Cell Number: {userInfo.cellNumber}</p>
            <p className="profilse-info-item">College: {userInfo.collegeName}</p>
            <p className="profiles-info-item">Country: {userInfo.country}</p>
          </div>
          <div className="profiles-counts">
            <p>Followers: {userInfo.followersCount}</p>
            <p>Following: {userInfo.followingCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
