import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div>
            <Header />
    <h1 className="medicoed-terms-title">Terms and <span style={{color: "#ff416c"}}>Conditions</span></h1>
    <div className="medicoed-terms-container">
      <div className="medicoed-terms-content">
        <section className="medicoed-terms-section">
          <h2 className="medicoed-terms-heading">Introduction</h2>
          <p className="medicoed-terms-paragraph">
            Welcome to MedicoEd! These Terms and Conditions ("Terms") govern your use of our platform, accessible via our website and mobile application ("Platform"). By accessing or using MedicoEd, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use our Platform.
          </p>
        </section>
        <section className="medicoed-terms-section">
          <h2 className="medicoed-terms-heading">1. Use of the Platform</h2>
          <h3 className="medicoed-terms-subheading">1.1. Eligibility</h3>
          <p className="medicoed-terms-paragraph">You must be at least 18 years old to use MedicoEd. By using the Platform, you represent and warrant that you meet this requirement.</p>
          <h3 className="medicoed-terms-subheading">1.2. Account Registration</h3>
          <p className="medicoed-terms-paragraph">To access certain features, you may need to register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          <h3 className="medicoed-terms-subheading">1.3. Acceptable Use</h3>
          <p className="medicoed-terms-paragraph">You agree to use the Platform only for lawful purposes and in accordance with these Terms. You must not use the Platform:</p>
          <ul className="medicoed-terms-list">
            <li className="medicoed-terms-list-item">To engage in any unlawful or fraudulent activity.</li>
            <li className="medicoed-terms-list-item">To infringe on the intellectual property rights of others.</li>
            <li className="medicoed-terms-list-item">To transmit harmful or malicious content.</li>
          </ul>
        </section>
        <section className="medicoed-terms-section">
          <h2 className="medicoed-terms-heading">2. User Content</h2>
          <h3 className="medicoed-terms-subheading">2.1. Content Ownership</h3>
          <p className="medicoed-terms-paragraph">You retain ownership of any content you upload to the Platform ("User Content"). By uploading User Content, you grant MedicoEd a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with the Platform.</p>
          <h3 className="medicoed-terms-subheading">2.2. Content Responsibility</h3>
          <p className="medicoed-terms-paragraph">You are solely responsible for your User Content. MedicoEd does not endorse or assume any responsibility for User Content.</p>
        </section>
        <section className="medicoed-terms-section">
          <h2 className="medicoed-terms-heading">3. Intellectual Property</h2>
          <h3 className="medicoed-terms-subheading">3.1. Ownership</h3>
          <p className="medicoed-terms-paragraph">All content on the Platform, including text, graphics, logos, and software, is the property of MedicoEd or its licensors and is protected by intellectual property laws.</p>
          <h3 className="medicoed-terms-subheading">3.2. License</h3>
          <p className="medicoed-terms-paragraph">MedicoEd grants you a limited, non-exclusive, non-transferable license to access and use the Platform for your personal, non-commercial use.</p>
        </section>
        <section className="medicoed-terms-section">
          <h2 className="medicoed-terms-heading">4. Privacy Policy</h2>
          <p className="medicoed-terms-paragraph">Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information.</p>
        </section>
        <section className="medicoed-terms-section">
          <h2 className="medicoed-terms-heading">5. Disclaimers and Limitation of Liability</h2>
          <h3 className="medicoed-terms-subheading">5.1. No Warranty</h3>
          <p className="medicoed-terms-paragraph">The Platform is provided "as is" without warranties of any kind. MedicoEd does not warrant that the Platform will be error-free or uninterrupted.</p>
          <h3 className="medicoed-terms-subheading">5.2. Limitation of Liability</h3>
          <p className="medicoed-terms-paragraph">To the maximum extent permitted by law, MedicoEd shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the Platform.</p>
        </section>
        <section className="medicoed-terms-section">
          <h2 className="medicoed-terms-heading">6. Changes to the Terms</h2>
          <p className="medicoed-terms-paragraph">MedicoEd reserves the right to modify these Terms at any time. We will notify you of any changes by posting the updated Terms on the Platform. Your continued use of the Platform after such changes constitutes your acceptance of the new Terms.</p>
        </section>
        <section className="medicoed-terms-section">
          <h2 className="medicoed-terms-heading">7. Governing Law</h2>
          <p className="medicoed-terms-paragraph">These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which MedicoEd operates.</p>
        </section>
        <section className="medicoed-terms-section">
          <h2 className="medicoed-terms-heading">8. Contact Us</h2>
          <p className="medicoed-terms-paragraph">If you have any questions or concerns about these Terms, please contact us at support@medicoed.com.</p>
        </section>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default TermsOfService;
