import { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import './CookieConsent.css';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Show banner smoothly on load
    const timer = setTimeout(() => {
      setShowConsent(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('auspik_cookie_consent', 'accepted');
      }
    } catch (e) {}
    setShowConsent(false);
  };

  const handleDismiss = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('auspik_cookie_consent', 'dismissed');
      }
    } catch (e) {}
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="cookie-long-pill-wrapper" role="region" aria-label="Cookie Consent Notice">
      <div className="cookie-sleek-pill">
        <div className="cookie-pill-left">
          <div className="cookie-pill-icon">
            <Cookie size={16} />
          </div>
          <p className="cookie-pill-text">
            We consume cookies to guarantee high-quality pharmaceutical service and secure formulation inquiries.
          </p>
        </div>

        <div className="cookie-pill-actions">
          <button 
            type="button" 
            className="btn-pill-decline" 
            onClick={handleDismiss}
          >
            Essential Only
          </button>
          <button 
            type="button" 
            className="btn-pill-accept" 
            onClick={handleAccept}
          >
            <Check size={14} />
            <span>Accept All</span>
          </button>
          <button 
            type="button" 
            className="btn-pill-close" 
            onClick={handleDismiss} 
            aria-label="Close cookie alert"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
