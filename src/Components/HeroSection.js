// src/components/HeroSection.js
import React, { useState } from 'react';
import './HeroSection.css';
import { FaFilePdf, FaUpload } from 'react-icons/fa';

function HeroSection() {
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
  
    const handleUpload = (event) => {
      const files = Array.from(event.target.files);
      setUploadedFiles(files);
      setIsUploaded(true);
    };

  return (
    <div className="research-hero">
      <div className="research-hero-content">
        <h1>Revolutionize Your Research with <span>RX Chatbot</span></h1>
        <p>Upload your PDFs and start your research journey with AI-powered tools.</p>
        <div className="research-upload-area">
          <input type="file" onChange={handleUpload} multiple />
          <button><FaUpload /> Upload PDFs</button>
          {isUploaded && (
            <div className="uploaded-files">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="file-card">
                  <FaFilePdf className="file-icon" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {isUploaded && (
          <div className="research-options">
            <button>Generate Summary</button>
            <button>Compare Summaries</button>
            <button>Chat with PDF</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroSection;
