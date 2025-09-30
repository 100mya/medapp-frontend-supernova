import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiList, FiMessageCircle, FiEdit, FiMap, FiClipboard, FiShare2, FiBookOpen, FiUsers, FiUpload, FiLayers, FiZap } from 'react-icons/fi';
import './FeaturesSection.css';
import Modal from './Modal'; // Adjust the import path as per your directory structure

function FeaturesSection({ setIsLoggedIn }) {
  const [showModal, setShowModal] = useState(false); // State for managing modal visibility
  const [isLoggedIn, setIsLoggedInState] = useState(false); // State to track login status

  useEffect(() => {
    // Check for credentials in local storage
    const storedCredentials = localStorage.getItem('rx_chatbot_credentials');
    if (storedCredentials) {
      setIsLoggedInState(true); // Set isLoggedIn to true if credentials are found
    } else {
      setIsLoggedInState(false); // Set isLoggedIn to false if credentials are not found
    }
  }, []); // Only run once on component mount

  const handleFeatureClick = (linkTo) => {
    if (!isLoggedIn) {
      setShowModal(true); // Open modal if user is not logged in
    } else {
      window.location.href = linkTo; // Redirect using window.location.href if user is logged in
    }
  };

  return (
    <div className="features-container">
      {/* Existing Features */}
      <div className="feature-card">
        <div className="feature">
          <FiFileText className="feature-icon" />
          <p className="feature-title">Summary Generation</p>
          <p className="feature-description">Utilize advanced AI algorithms to automatically generate concise summaries of research documents.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature">
          <FiList className="feature-icon" />
          <p className="feature-title">Compare Summaries</p>
          <p className="feature-description">Analyze and compare multiple summaries to extract key insights and findings.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature">
          <FiMessageCircle className="feature-icon" />
          <p className="feature-title">Interactive PDF Chat</p>
          <p className="feature-description">Engage in dynamic conversations with an AI chatbot to discuss and query document content.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature">
          <FiEdit className="feature-icon" />
          <p className="feature-title">Generate and Save Notes</p>
          <p className="feature-description">Organize your research by simultaneously generating detailed, structured notes and save them.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature">
          <FiMap className="feature-icon" />
          <p className="feature-title">Compare and Chat</p>
          <p className="feature-description">Interact with an AI chatbot to compare insights across multiple documents efficiently.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature">
          <FiClipboard className="feature-icon" />
          <p className="feature-title">Question Generator</p>
          <p className="feature-description">Create insightful and thought-provoking questions based on your document content.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature">
          <FiShare2 className="feature-icon" />
          <p className="feature-title">Mind Mapping</p>
          <p className="feature-description">Generate comprehensive mind maps to visually organize and connect ideas from your documents.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature">
          <FiBookOpen className="feature-icon" />
          <p className="feature-title">Exam Quiz Generator</p>
          <p className="feature-description">Prepare for exams like FMGE and USMLE with custom quizzes tailored to various medical curricula.</p>
        </div>
      </div>

      {/* New Features */}
      <div className="feature-card">
        <div className="feature">
          <FiUpload className="feature-icon" />
          <p className="feature-title">Medical Case Studies</p>
          <p className="feature-description">Generate interactive medical case studies and simulate complete treatment workflows.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature">
          <FiZap className="feature-icon" />
          <p className="feature-title">AI-Generated Flashcards</p>
          <p className="feature-description">Automatically generate flashcards from documents you upload for effective study and revision.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature">
          <FiLayers className="feature-icon" />
          <p className="feature-title">Bulk Upload Documents</p>
          <p className="feature-description">Upload multiple documents in bulk and treat them as one combined document for processing.</p>
        </div>
      </div>

      {/* Community Feature */}
      <div className="feature-card">
        <div className="feature">
          <FiUsers className="feature-icon" />
          <p className="feature-title">Community Page</p>
          <p className="feature-description">Connect with peers, share insights, and explore discussions within a vibrant community.</p>
        </div>
      </div>

      {showModal && (
        <Modal toggleModal={() => setShowModal(false)} setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default FeaturesSection;
