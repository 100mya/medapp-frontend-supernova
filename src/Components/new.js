import React, { useState, useEffect } from 'react';
import './NotesGenerator.css';
import ReactMarkdown from 'react-markdown';

const NotesGenerator = () => {
  const [filenames, setFilenames] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ title: '', tags: '', msgContent: '' });
  const [userMessage, setUserMessage] = useState('');

  const languages = [
    { code: 'en', name: 'English' },
    // ... (Other language options)
  ];

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
          setUserEmail(email);

          const filenamesResponse = await fetch(`/api/get-filenames?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const filenamesData = await filenamesResponse.json();
          setFilenames(filenamesData.filenames || []);
        } else {
          throw new Error('Failed to login with stored credentials');
        }
      } catch (error) {
        console.error('Error logging in with stored credentials:', error);
      }
    };

    handleLoginWithStoredCredentials();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-generated-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedFile,
          language: selectedLanguage,
          email: userEmail,
          content: userMessage
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();

      if (data.success) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { type: 'user', content: userMessage },
          { type: 'bot', content: data.notes }
        ]);
      } else {
        console.error('Failed to generate notes:', data.error);
      }

      setIsLoading(false);
      setUserMessage('');  // Clear the input field after submission

    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSelectedFile(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const openPopup = (msgContent) => {
    setPopupData({ title: '', tags: '', msgContent });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handlePopupSave = async () => {
    const summaryData = {
      text: popupData.msgContent,
      title: popupData.title,
      tags: popupData.tags.split(',').map(tag => tag.trim()),
      type: 'notes',
    };

    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(summaryData),
      });

      if (!response.ok) {
        throw new Error('Failed to save message.');
      }

      console.log('Message saved successfully!');
      closePopup();
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  return (
    <div className="NotesGenerator-container">
      <h1 className="NotesGenerator-heading">Generate <span>Notes</span></h1>
      {isLoggedIn ? (
        <div className="NotesGenerator-chat-container">
          <div className="NotesGenerator-chat">
            {chatMessages.map((message, index) => (
              <div key={index} className={`NotesGenerator-message ${message.type}`}>
                <div className="NotesGenerator-message-content">
                  {message.type === 'user' ? (
                    <p>{message.content}</p>
                  ) : (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  )}
                </div>
                {message.type === 'bot' && (
                  <button
                    className="NotesGenerator-save-button"
                    onClick={() => openPopup(message.content)}
                  >
                    Save
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="NotesGenerator-form-section">
            <form id="chat-individual-notes-form" onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <select
                id="filename"
                name="filename"
                className="NotesGenerator-select"
                value={selectedFile}
                onChange={handleInputChange}
              >
                <option value="">Select a file</option>
                {filenames.map((filename, index) => (
                  <option key={index} value={filename}>{filename}</option>
                ))}
              </select>
              <select
                id="language"
                name="language"
                className="NotesGenerator-select"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
              <textarea
                id="userMessage"
                name="userMessage"
                className="NotesGenerator-textarea"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Enter your message here..."
                required
              ></textarea>
              <button type="submit" className="NotesGenerator-button" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Generate Notes'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p>Please login to view your dashboard.</p>
      )}
      {showPopup && (
        <div className="NotesGenerator-popup">
          <div className="NotesGenerator-popup-content">
            <h2>Save Message</h2>
            <input
              type="text"
              placeholder="Title"
              value={popupData.title}
              onChange={(e) => setPopupData({ ...popupData, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={popupData.tags}
              onChange={(e) => setPopupData({ ...popupData, tags: e.target.value })}
            />
            <button onClick={handlePopupSave}>Save</button>
            <button onClick={closePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesGenerator;
