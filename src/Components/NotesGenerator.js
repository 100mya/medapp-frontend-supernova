import React, { useState, useEffect } from 'react';
import './NotesGenerator.css';
import ReactMarkdown from 'react-markdown';

const NotesGenerator = ({ showNotes, setShowNotes }) => {
  const [filenames, setFilenames] = useState([]);
  const [selectedFile, setSelectedFile] = useState(localStorage.getItem('selectedFile') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [chatMessages, setChatMessages] = useState(JSON.parse(localStorage.getItem('chatMessages')) || []);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ title: '', tags: '', msgContent: '' });
  const [userMessage, setUserMessage] = useState(localStorage.getItem('userMessage') || '');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'af', name: 'Afrikaans' },
    { code: 'sq', name: 'Albanian' },
    { code: 'am', name: 'Amharic' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hy', name: 'Armenian' },
    { code: 'az', name: 'Azerbaijani' },
    { code: 'eu', name: 'Basque' },
    { code: 'be', name: 'Belarusian' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bs', name: 'Bosnian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'ca', name: 'Catalan' },
    { code: 'ceb', name: 'Cebuano' },
    { code: 'zh', name: 'Chinese' },
    { code: 'co', name: 'Corsican' },
    { code: 'hr', name: 'Croatian' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'et', name: 'Estonian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
    { code: 'fy', name: 'Frisian' },
    { code: 'gl', name: 'Galician' },
    { code: 'ka', name: 'Georgian' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ht', name: 'Haitian Creole' },
    { code: 'ha', name: 'Hausa' },
    { code: 'haw', name: 'Hawaiian' },
    { code: 'he', name: 'Hebrew' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hmn', name: 'Hmong' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'ig', name: 'Igbo' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ga', name: 'Irish' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'jw', name: 'Javanese' },
    { code: 'kn', name: 'Kannada' },
    { code: 'kk', name: 'Kazakh' },
    { code: 'km', name: 'Khmer' },
    { code: 'rw', name: 'Kinyarwanda' },
    { code: 'ko', name: 'Korean' },
    { code: 'ku', name: 'Kurdish' },
    { code: 'ky', name: 'Kyrgyz' },
    { code: 'lo', name: 'Lao' },
    { code: 'la', name: 'Latin' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'lb', name: 'Luxembourgish' },
    { code: 'mk', name: 'Macedonian' },
    { code: 'mg', name: 'Malagasy' },
    { code: 'ms', name: 'Malay' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mt', name: 'Maltese' },
    { code: 'mi', name: 'Maori' },
    { code: 'mr', name: 'Marathi' },
    { code: 'mn', name: 'Mongolian' },
    { code: 'my', name: 'Myanmar (Burmese)' },
    { code: 'ne', name: 'Nepali' },
    { code: 'no', name: 'Norwegian' },
    { code: 'ny', name: 'Nyanja (Chichewa)' },
    { code: 'or', name: 'Odia (Oriya)' },
    { code: 'ps', name: 'Pashto' },
    { code: 'fa', name: 'Persian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'sm', name: 'Samoan' },
    { code: 'gd', name: 'Scots Gaelic' },
    { code: 'sr', name: 'Serbian' },
    { code: 'st', name: 'Sesotho' },
    { code: 'sn', name: 'Shona' },
    { code: 'sd', name: 'Sindhi' },
    { code: 'si', name: 'Sinhala' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'so', name: 'Somali' },
    { code: 'es', name: 'Spanish' },
    { code: 'su', name: 'Sundanese' },
    { code: 'sw', name: 'Swahili' },
    { code: 'sv', name: 'Swedish' },
    { code: 'tl', name: 'Tagalog (Filipino)' },
    { code: 'tg', name: 'Tajik' },
    { code: 'ta', name: 'Tamil' },
    { code: 'tt', name: 'Tatar' },
    { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' },
    { code: 'tr', name: 'Turkish' },
    { code: 'tk', name: 'Turkmen' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ug', name: 'Uyghur' },
    { code: 'uz', name: 'Uzbek' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'cy', name: 'Welsh' },
    { code: 'xh', name: 'Xhosa' },
    { code: 'yi', name: 'Yiddish' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'zu', name: 'Zulu' },
  ];

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

  useEffect(() => {
    localStorage.setItem('selectedFile', selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('userMessage', userMessage);
  }, [userMessage]);

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
      await new Promise((resolve) => setTimeout(resolve, 100));

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
      email: userEmail,
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

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  const handleClearWindow = () => {
    localStorage.removeItem(chatMessages);
    localStorage.removeItem(userMessage);
    localStorage.removeItem(selectedFile);
    localStorage.removeItem(selectedLanguage);
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`NotesGenerator-container ${showNotes ? 'show' : ''}`}>
      <h1 className="NotesGenerator-heading">Generate <span>Notes</span></h1>
      <p>Promt out the content in the text area and generate notes</p>
      {1 ? (
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
                  {message.type === 'bot' && (
                    <div>
                  <button
                    className="NotesGenerator-save-button"
                    onClick={() => handleCopy(message.content)}
                  >
                    Copy
                  </button>
                  <button
                  className="NotesGenerator-save-button"
                  onClick={() => openPopup(message.content)}
                >
                  Save
                </button></div>
                )}
                </div>
              </div>
            ))}
          </div>
          <div className="NotesGenerator-form-section">
            <form id="chat-individual-notes-form" onSubmit={handleFormSubmit}>
              <label>Select a file (optional)</label>
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
              
              <textarea
                id="userMessage"
                name="userMessage"
                className="NotesGenerator-textarea"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Paste your content here..."
                required
              ></textarea>
              <select
                id="language"
                name="language"
                className="NotesGenerator-select"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                {languages.map((language) => (
                  <option key={language.code} value={language.name}>
                    {language.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="NotesGenerator-button" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Generate Notes'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p>Please login and subscribe to generate notes.</p>
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
