import React, { useState, useEffect, useRef } from 'react';
import './SimulatorPage.css';
import CaseStudy from './CaseStudy';
import ReactMarkdown from 'react-markdown';

const SimulatorPage = () => {
  const [selectedTab, setSelectedTab] = useState('patient-information'); // Default tab set to 'patient-information'
  const [responses, setResponses] = useState([]); // To store the responses
  const [isLoading, setIsLoading] = useState(false);
  
  const responseEndRef = useRef(null); // Ref to track the end of the responses container

  // Function to scroll to the bottom of the response window
  const scrollToBottom = () => {
    responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add a new response
  const addResponse = (userMessage, botMessage = null) => {
    // Display the user's message immediately
    setResponses((prevHistory) => [
      ...prevHistory,
      { sender: 'user', message: userMessage },
    ]);
  
    // If the botMessage is passed, display it (this will happen after the response is fetched)
    if (botMessage) {
      setResponses((prevHistory) => [
        ...prevHistory,
        { sender: 'bot', message: botMessage },
      ]);
      setIsLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Scroll to the bottom whenever the responses change
  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  return (
    <div className="simulator-page">
      <div className="left-window">
        <button onClick={() => handleTabChange('patient-information')}>Patient Information</button>
        <button onClick={() => handleTabChange('preparation')}>Preparation</button>
        <button onClick={() => handleTabChange('history-taking')}>History Taking</button>
        <button onClick={() => handleTabChange('physical-examination')}>Physical Examination</button>
        <button onClick={() => handleTabChange('differential-diagnosis')}>Differential Diagnosis</button>
        <button onClick={() => handleTabChange('stabilization-actions')}>Stabilization Actions</button>
        <button onClick={() => handleTabChange('clinical-interventions')}>Interventions</button>
        <button onClick={() => handleTabChange('investigations')}>Investigations</button>
        <button onClick={() => handleTabChange('consultations')}>Consultations</button>
        <button onClick={() => handleTabChange('patient-handover')}>Patient Handover</button>
      </div>

      <div className="middle-window">
        <CaseStudy selectedPanel={selectedTab} addResponse={addResponse} setIsLoading={setIsLoading} responses={responses} />
      </div>

      <div className="right-window">
        <h2>Response <span style={{color: "#ff416c"}}>Window</span></h2>
        {responses.map((response, index) => (
          <div key={index} className={`response ${response.sender}`}>
            {response.sender === 'user' && response.message != null ? (
              <p className="cs-user-response">{response.message}</p>
            ) : (
              <div className="cs-bot-response">
                <ReactMarkdown>{response.message}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="loader">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
        {/* Scroll target */}
        <div ref={responseEndRef} />
      </div>
    </div>
  );
};

export default SimulatorPage;
