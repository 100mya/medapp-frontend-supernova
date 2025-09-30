import React from 'react';
import Typical from 'react-typical';
import './LandingSection.css';
import { useNavigate } from 'react-router-dom';

function LandingSection({ isLoggedIn, handleGetStartedClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard/upload-papers');
    } else {
      handleGetStartedClick();
    }
  };

  return (
    <div className="landing-section">
      <div className="landing-content">
        <h1>
          <Typical
            steps={['Revolutionize Your Medical Education with', 3000]}
            loop={1}
            wrapper="span"
            className="head-span"
            showCursor={false}
          />
          <span>
            <Typical
              steps={['', 3000, 'MedicoEd', 1000]}
              loop={1}
              wrapper="span"
              className="rx-span"
              showCursor={true}
            />
          </span>
        </h1>
        <p>Upload your PDFs and start your research journey with AI-powered tools.</p>
        <button className="research-cta-mobile" onClick={handleClick}>Get Started</button>
      </div>
    </div>
  );
}

export default LandingSection;
