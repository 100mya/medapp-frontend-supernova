import React, { useState, useEffect } from 'react';
import './UploadDashboard.css'; // Import the associated CSS file

function UploadDashboard() {
    const [filenames, setFilenames] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status

    useEffect(() => {
        const handleLoginWithStoredCredentials = async () => {
            try {
                const storedCredentials = localStorage.getItem('rx_chatbot_credentials');
                if (!storedCredentials) {
                    throw new Error('No stored credentials found');
                }
                const { email, password } = JSON.parse(storedCredentials);

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
                    // Optionally clear stored credentials if you want
                    // localStorage.removeItem('rx_chatbot_credentials');

                    // Fetch filenames if login is successful
                    const filenamesResponse = await fetch(`/api/dashboard?email=${email}`, {
                        method: 'GET',
                        credentials: 'include' // Include cookies for session management
                    });

                    if (filenamesResponse.ok) {
                        const filenamesData = await filenamesResponse.json();
                        setFilenames(filenamesData.filenames || []);
                    } else {
                        throw new Error('Failed to fetch filenames');
                    }
                } else {
                    throw new Error('Failed to login with stored credentials');
                }
            } catch (error) {
                console.error('Error logging in with stored credentials:', error);
                // Optionally handle login failure (e.g., clear local storage)
                // localStorage.removeItem('rx_chatbot_credentials');
            }
        };

        // Attempt login with stored credentials when component mounts
        handleLoginWithStoredCredentials();
    }, []);

    const handleFileDelete = (filename) => {
        console.log('Deleting file:', filename);
        fetch(`/api/delete_file/${filename}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('File deleted successfully:', filename);
                // Update state or reload file list as needed
                setFilenames(prevFilenames => prevFilenames.filter(name => name !== filename));
            } else {
                console.error('Error deleting file:', data.error);
                // Handle error display or logging
            }
        })
        .catch(error => {
            console.error('Error deleting file:', error);
        });
    };

    return (
        <div className="upload-dashboard">
            <h1>Dashboard</h1>

            {isLoggedIn ? (
                // Render upload form and file list if logged in
                <div id="upload-form">
                    <h5>Current files</h5>
                    {filenames && filenames.length > 0 ? (
                        <ul className="file-list">
                            {filenames.map((file, index) => (
                                <li key={index}>
                                    <span>{file}</span>
                                    <i
                                        className="fas fa-trash-alt delete-icon"
                                        data-filename={file}
                                        onClick={() => handleFileDelete(file)}
                                    ></i>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No files found.</p>
                    )}
                    <form action="/upload" method="post" encType="multipart/form-data">
                        <input type="file" name="files[]" multiple />
                        <button id="btnUploadMore">
                            Upload more files
                        </button>
                    </form>
                </div>
            ) : (
                // Render login prompt or redirect if not logged in
                <p>Please login to view your dashboard.</p>
            )}
        </div>
    );
}

export default UploadDashboard;
