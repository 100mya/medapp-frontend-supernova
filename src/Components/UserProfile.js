import React, { useEffect, useState } from 'react';
import './UserProfile.css'; // Import the CSS file for UserProfile styles
import defaultImg from './default.jpeg';
import { FaEdit, FaTrash, FaStream, FaUser, FaSearch, FaBell } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';
// Import components
import CommunityHeader from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Post from './UserPost';
import { json } from 'react-router-dom';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false); // State for edit popup
    const [editFormData, setEditFormData] = useState({
        name: '',
        cellNumber: '',
        collegeName: '',
        country: '',
        bio: '',
        profilePic: '',
    });

    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'profile') {
            navigate("/community/user-profile");
          } else if (activeTab === 'search') {
            navigate("/community/search");
          } else if (activeTab === 'notifications') {
            navigate("/community/notifications");
          } else if (activeTab === 'feed') {
            navigate("/community");
          }
    }, [activeTab]);

    useEffect(() => {
        // Fetch email from local storage (rx_chatbot_credentials)
        const fetchEmail = () => {
            const credentials = localStorage.getItem('rx_chatbot_credentials');
            if (credentials) {
                const { email } = JSON.parse(credentials);
                setEmail(email);
            } else {
                setError('No credentials found in localStorage.');
            }
        };

        fetchEmail();
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('/api/fetch-user-by-id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email_id: email }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const profile = await response.json();
                const profileData = JSON.parse(profile);
                setUserProfile(profileData); // Set the profile data directly
                setEditFormData({
                    name: profileData.name || '',
                    cellNumber: profileData.cellNumber || '',
                    collegeName: profileData.collegeName || '',
                    country: profileData.country || '',
                    bio: profileData.bio || '',
                    profilePic: profileData.profilePic || '', // Use the profilePic URL directly
                });
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to fetch user profile. Please try again later.');
            }
        };

        if (email) {
            fetchUserProfile();
        }
    }, [email]);

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

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('name', editFormData.name);
            formData.append('cellNumber', editFormData.cellNumber);
            formData.append('collegeName', editFormData.collegeName);
            formData.append('country', editFormData.country);
            formData.append('bio', editFormData.bio);

            // Append profilePic file if it exists
            if (editFormData.profilePic instanceof File) {
                formData.append('profilePic', editFormData.profilePic, 'profile_pic.jpg');
            }

            const response = await fetch('/api/update-profile', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update user info');
            }

            const result = await response.json();
            alert(result.message);
            setIsEditing(false);

            // Update userProfile state with updated data
            setUserProfile((prevState) => ({
                ...prevState,
                name: editFormData.name,
                cellNumber: editFormData.cellNumber,
                collegeName: editFormData.collegeName,
                country: editFormData.country,
                bio: editFormData.bio,
                profilePic: editFormData.profilePic, // Update with the updated profilePic URL or file
            }));
        } catch (error) {
            console.error('Error updating user info:', error);
            setError('Failed to update user info. Please try again later.');
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch('/api/delete-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: postId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            const result = await response.json();
            alert(result.message);
            setUserPosts((prevState) => prevState.filter((post) => post._id === postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post. Please try again later.');
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        setEditFormData((prevState) => ({
            ...prevState,
            profilePic: file, // Store the File object directly
        }));
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
                            <img src={mediaUrl('jpeg', editFormData.profilePic) || userProfile.profilePic || defaultImg} alt="Profile" />
                        </div>
                        <div className="userDetails">
                            <h2>{userProfile.name}</h2>
                            <p>{userProfile.bio}</p>
                            <p>College Name: {userProfile.collegeName}</p>
                            <p>Country: {userProfile.country}</p>
                            <p className="followers-p" style={{ fontSize: '1.2rem' }}>
                                Followers: {userProfile.followers ? userProfile.followers.length : 0} &nbsp;|&nbsp; Following: {userProfile.following ? userProfile.following.length : 0}
                            </p>
                            <button className='edit-b' onClick={() => setIsEditing(true)}><FaEdit /> Edit Profile</button>
                        </div>
                    </div>
                )}
                {isEditing && (
                    <div className="editPopup">
                        <form onSubmit={handleEditSubmit}>
                            <label>
                                Name:
                                <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} />
                            </label>
                            <label>
                                Cell Number:
                                <input type="text" name="cellNumber" value={editFormData.cellNumber} onChange={handleEditChange} />
                            </label>
                            <label>
                                College Name:
                                <input type="text" name="collegeName" value={editFormData.collegeName} onChange={handleEditChange} />
                            </label>
                            <label>
                                Country:
                                <input type="text" name="country" value={editFormData.country} onChange={handleEditChange} />
                            </label>
                            <label>
                                Bio:
                                <textarea name="bio" value={editFormData.bio} onChange={handleEditChange}></textarea><br /><br />
                            </label>
                            <label>
                                Profile Picture:<br />
                                <input type="file" accept="image/*" onChange={handleProfilePicChange} />
                            </label>
                            <div className='edit-button-container'>
                                <button className='update-b' type="submit"><FaEdit /> Update</button>
                                <button className='cancel-b' type="button" onClick={() => setIsEditing(false)}><FaTrash /> Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
                <div className="userPosts">
                    {userPosts.map((post) => (
                        <Post key={post._id} post={post} onDelete={() => handleDeletePost(post._id)} />
                    ))}
                </div>
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
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default UserProfile;
