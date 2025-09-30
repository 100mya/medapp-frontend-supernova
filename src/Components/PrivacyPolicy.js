import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div>
      <Header />
      <h1 className="medicoed-privacy-title">Privacy <span style={{color: "#ff416c"}}>Policy</span></h1>
      <div className="medicoed-privacy-container">
        <div className="medicoed-privacy-content">
          <section className="medicoed-privacy-section">
            <h2 className="medicoed-privacy-heading">Introduction</h2>
            <p className="medicoed-privacy-paragraph">
              MedicoEd ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information when you use our Platform.
            </p>
          </section>
          <section className="medicoed-privacy-section">
            <h2 className="medicoed-privacy-heading">1. Information We Collect</h2>
            <h3 className="medicoed-privacy-subheading">1.1. Personal Information</h3>
            <p className="medicoed-privacy-paragraph">We may collect personal information that you provide to us, such as your name, email address, and payment information when you register for an account or make a purchase.</p>
            <h3 className="medicoed-privacy-subheading">1.2. Usage Data</h3>
            <p className="medicoed-privacy-paragraph">We collect information about your interactions with the Platform, including the pages you visit, the features you use, and the actions you take.</p>
            <h3 className="medicoed-privacy-subheading">1.3. Device Information</h3>
            <p className="medicoed-privacy-paragraph">We collect information about the device you use to access the Platform, including the device's IP address, operating system, and browser type.</p>
          </section>
          <section className="medicoed-privacy-section">
            <h2 className="medicoed-privacy-heading">2. How We Use Your Information</h2>
            <h3 className="medicoed-privacy-subheading">2.1. Provide and Improve the Platform</h3>
            <p className="medicoed-privacy-paragraph">We use your information to operate, maintain, and improve the Platform, including providing customer support and processing transactions.</p>
            <h3 className="medicoed-privacy-subheading">2.2. Communications</h3>
            <p className="medicoed-privacy-paragraph">We may use your information to send you updates, newsletters, and promotional materials. You can opt-out of receiving these communications at any time.</p>
            <h3 className="medicoed-privacy-subheading">2.3. Analytics</h3>
            <p className="medicoed-privacy-paragraph">We use analytics tools to understand how users interact with the Platform and to improve our services.</p>
          </section>
          <section className="medicoed-privacy-section">
            <h2 className="medicoed-privacy-heading">3. How We Share Your Information</h2>
            <h3 className="medicoed-privacy-subheading">3.1. Service Providers</h3>
            <p className="medicoed-privacy-paragraph">We may share your information with third-party service providers who perform services on our behalf, such as payment processing and data analysis.</p>
            <h3 className="medicoed-privacy-subheading">3.2. Legal Requirements</h3>
            <p className="medicoed-privacy-paragraph">We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>
            <h3 className="medicoed-privacy-subheading">3.3. Business Transfers</h3>
            <p className="medicoed-privacy-paragraph">In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
          </section>
          <section className="medicoed-privacy-section">
            <h2 className="medicoed-privacy-heading">4. Data Security</h2>
            <p className="medicoed-privacy-paragraph">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
          </section>
          <section className="medicoed-privacy-section">
            <h2 className="medicoed-privacy-heading">5. Your Rights</h2>
            <h3 className="medicoed-privacy-subheading">5.1. Access and Correction</h3>
            <p className="medicoed-privacy-paragraph">You have the right to access and correct your personal information. You can update your account information through your profile settings.</p>
            <h3 className="medicoed-privacy-subheading">5.2. Deletion</h3>
            <p className="medicoed-privacy-paragraph">You have the right to request the deletion of your personal information. Please contact us if you wish to exercise this right.</p>
          </section>
          <section className="medicoed-privacy-section">
            <h2 className="medicoed-privacy-heading">6. Children's Privacy</h2>
            <p className="medicoed-privacy-paragraph">The Platform is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.</p>
          </section>
          <section className="medicoed-privacy-section">
            <h2 className="medicoed-privacy-heading">7. Changes to the Privacy Policy</h2>
            <p className="medicoed-privacy-paragraph">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the Platform. Your continued use of the Platform after such changes constitutes your acceptance of the updated Privacy Policy.</p>
          </section>
          <section className="medicoed-privacy-section">
            <h2 className="medicoed-privacy-heading">8. Contact Us</h2>
            <p className="medicoed-privacy-paragraph">If you have any questions or concerns about this Privacy Policy, please contact us at privacy@medicoed.com.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
