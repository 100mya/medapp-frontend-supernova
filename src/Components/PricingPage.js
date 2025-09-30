import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PricingPage.css';

const PricingPage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    script.onload = () => {
      console.log('Stripe script loaded successfully.');
      if (window.StripeBuyButton) {
        // This line ensures the StripeBuyButton is available and mounts it to the DOM
        document.querySelectorAll('stripe-buy-button').forEach(button => {
          window.StripeBuyButton.mount(button);
        });
      } else {
        console.error('StripeBuyButton is not available. Check if the script loaded correctly.');
      }
    };
    script.onerror = () => {
      console.error('Failed to load Stripe script. Check the script URL and network connection.');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup the script from the DOM when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <Header />
      <div className="unique-pricing-page">
        <div className="unique-pricing-container">
          <header className="unique-pricing-header">
            <h1>
              Choose Your <span style={{ color: '#ff416c' }}>Plan</span>
            </h1>
            <p>
              Find the right plan for your needs and elevate your study experience with MedicoEd.
            </p>
          </header>

          <div className="unique-pricing-plans">
            {/* Stripe Buy Button container */}
            <div id="stripe-buy-button-container">
            <stripe-buy-button
              buy-button-id="buy_btn_1Qwd4nKVV0DxAE32PBDHjPuL"
              publishable-key="pk_live_51Qf3SNKVV0DxAE32lMWfeqDWfo2HQ7cdVOgTkUnYPwGZrzNTQjMU2K8Q6yxfGhZgr26F9U7lIQ12SaK8bgU9ctFs00tM0KomlG"
            >
            </stripe-buy-button>
            <div>
              <p className="product-description">
                Unlimited PDF uploads, Generating up to 500 flashcards/month, Mind map creation, and question generation.
              </p>
            </div>
            </div>
            <div id="stripe-buy-button-container2">
            <stripe-buy-button
            buy-button-id="buy_btn_1Qwd3dKVV0DxAE32BJzZllfV"
            publishable-key="pk_live_51Qf3SNKVV0DxAE32lMWfeqDWfo2HQ7cdVOgTkUnYPwGZrzNTQjMU2K8Q6yxfGhZgr26F9U7lIQ12SaK8bgU9ctFs00tM0KomlG"
            >
            </stripe-buy-button>
            <div>
              <p className="product-description">
                All Standard features, Unlimited access to all tools, Chat with documents and case studies, Advanced AI tools for personalized recommendations, and Certificate of completion for case studies.
              </p>
            </div>
            </div>
            <div className="unique-pricing-plan unique-custom-plan">
              <h2>Universities</h2>
              <p className="unique-custom-info">
                Personalized plan tailored to your specific needs. Get in touch to discuss your requirements and pricing.
              </p>
              <button className="unique-btn-contact">Contact Us</button>
              <p>Custom checkout coming soon...</p>
            </div>
          </div>
          <div className="unique-reload-message">
            <p>Please refresh the page once the payment is completed to ensure all changes are applied.</p>
          </div>
        </div>
        <div className="unique-manage-subscription">
            <Link to="https://billing.stripe.com/p/login/bIY6qw7XH5U7axW4gg" className="unique-manage-subscription-link">
              Manage Subscription
            </Link>
          </div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
