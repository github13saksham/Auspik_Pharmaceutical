import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import companyLogo from '../assets/Project_images/Pharma_Company_logo.jpeg';
import './WelcomeModal.css';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal on load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Prevent background scrolling while welcome modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="welcome-modal-overlay" onClick={handleClose}>
      <div 
        className="welcome-modal-landscape-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Welcome Announcement"
      >
        {/* Top Right Close Button */}
        <button 
          type="button" 
          className="welcome-modal-close" 
          onClick={handleClose} 
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Pure Landscape Image with Logo Pill */}
        <div className="welcome-landscape-img-box">
          <img 
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1400&q=85" 
            alt="Auspik Pharmaceuticals" 
            className="welcome-landscape-img"
            loading="eager"
          />
          <div className="welcome-landscape-gradient"></div>
          
          {/* Logo Pill on bottom left */}
          <div className="welcome-landscape-logo-pill">
            <img src={companyLogo} alt="Auspik Logo" className="welcome-landscape-logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
