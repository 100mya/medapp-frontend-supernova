import React, { useEffect, useState } from 'react';
import './UserProfile.css'; // Import the CSS file for UserProfile styles
import defaultImg from './default.jpeg';
import { useLocation } from 'react-router-dom'; // Import useLocation hook to access query parameters
import {FaStream, FaUser, FaSearch, FaBell} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// Import components
import CommunityHeader from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Post from './Post';

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [isFollowing, setIsFollowing] = useState(false); // State for follow toggle
    const [follower, setFollower] = useState(''); // Define follower state

    // Use useLocation hook to get current location object
    const location = useLocation();

    const [activeTab, setActiveTab] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'profile') {
            navigate("/community/user-profile");
          } else if (activeTab === 'search') {
            navigate("/community/search");
          } else if (activeTab === 'notifications') {
            navigate("/community/notifications");
        }
    }, [activeTab]);

    useEffect(() => {
        const follower_id = localStorage.getItem('follower_id');
        if (follower_id) {
            setFollower(follower_id);
        }
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    useEffect(() => {
        // Parse query parameters from location search string
        const searchParams = new URLSearchParams(location.search);
        const userEmail = searchParams.get('email');

        if (userEmail) {
            setEmail(userEmail); // Set email state with query parameter value
        } else {
            setError('Email parameter not found in URL');
        }
    }, [location.search]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const id = localStorage.getItem("id")
                const response = await fetch('/api/fetch-user-by-id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const profileData = await response.json();
                const parsedProfile = JSON.parse(profileData); // Parse the profileData string
                setUserProfile(parsedProfile);
                
                // Check if the current user is following the profile user
                const isFollowing = parsedProfile.followers && parsedProfile.followers.includes(follower);
                setIsFollowing(isFollowing);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to fetch user profile. Please try again later.');
            }
        };

        if (email) {
            fetchUserProfile();
        }
    }, [email, follower]); // Added 'follower' to dependency array

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch('/api/fetch-posts-by-filter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: email }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user posts');
                }

                const postsData = await response.json();
                setUserPosts(JSON.parse(postsData).reverse()); // Reverse the postsData array
            } catch (error) {
                console.error('Error fetching user posts:', error);
                setError('Failed to fetch user posts. Please try again later.');
            }
        };

        if (email) {
            fetchUserPosts();
        }
    }, [email]);

    // Function to handle follow/unfollow toggle
    const handleFollowToggle = async () => {
        try {
            const response = await fetch('/api/toggle-follow-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    follower_id: follower,
                    following_id: email,
                }),
            });
            console.log(follower, email);

            if (!response.ok) {
                throw new Error('Failed to toggle follow status');
            }

            setIsFollowing(!isFollowing); // Toggle follow state locally
        } catch (error) {
            console.error('Error toggling follow status:', error);
            setError('Failed to toggle follow status. Please try again later.');
        }
    };

    // Function to generate media URL
    const mediaUrl = (mediaType, mediaData) => {
        return mediaData ? `data:image/${mediaType};base64,${mediaData}` : null;
    };

    return (
        <div className="userProfileContainer">
            <CommunityHeader /> {/* Include the CommunityHeader component */}
            <div className="user-page-content">
                <LeftSidebar /> {/* Include the LeftSidebar component */}
                {userProfile && (
                    <div className="profileInfo">
                        <div className="profilePicture">
                            <img src={mediaUrl('jpeg', userProfile.profilePic) || defaultImg} alt="Profile" />
                        </div>
                        <div className="userDetails">
                            <h2>{userProfile.name}</h2>
                            <p>{userProfile.bio}</p>
                            <p>College Name: {userProfile.collegeName}</p>
                            <p>Country: {userProfile.country}</p>
                            <p className="followers-p" style={{ fontSize: '1.2rem' }}>
                                Followers: {userProfile.followers ? userProfile.followers.length : 0} &nbsp;|&nbsp; Following: {userProfile.following ? userProfile.following.length : 0}
                            </p>
                            {/* Follow/Unfollow Button */}
                            {email && (
                                <button className='follow-button' onClick={handleFollowToggle}>
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {userPosts.length > 0 && (
                    <div className="userPosts">
                        {userPosts.map((post) => (
                            <Post key={post._id} post={post} />
                        ))}
                    </div>
                )}
                <RightSidebar /> {/* Include the RightSidebar component */}
            </div>
            <div className="bottom-bar">
                <button className={activeTab === 'feed' ? 'active' : ''} onClick={() => setActiveTab('feed')}>
                    <FaStream />
                </button>
                <button className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>
                    <FaSearch />
                </button>
                <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                    <FaUser />
                </button>
                <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
                    <FaBell />
                </button>
            </div>
        </div>
    );
};

export default Profile;
