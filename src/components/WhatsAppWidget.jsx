import { useState } from 'react';
import { MessageCircle, X, Send, CheckCheck } from 'lucide-react';
import './WhatsAppWidget.css';

export default function WhatsAppWidget({ phone }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use the new number as primary, fallback to settings if needed (but prioritizing the new one)
  const firstPhone = '919671240000'; // Override with the requested number
  const targetPhone = firstPhone.replace(/\D/g, '');
  const defaultMessage = "Hello Auspik Pharmaceuticals, I would like to inquire about your pharmaceutical products and services.";

  const handleOpenWhatsApp = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="whatsapp-widget-container"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* WhatsApp Chat Preview Card (Appears on Hover / Toggle) */}
      <div className={`whatsapp-chat-popup ${isOpen ? 'active' : ''}`}>
        <div className="chat-header">
          <div className="chat-avatar-wrapper">
            <div className="chat-avatar">AP</div>
            <span className="online-indicator"></span>
          </div>
          <div className="chat-header-info">
            <h4>Auspik Pharmaceuticals</h4>
            <p>Typically replies instantly</p>
          </div>
          <button 
            className="chat-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            aria-label="Close preview"
          >
            <X size={16} />
          </button>
        </div>

        <div className="chat-body">
          <div className="chat-bubble incoming has-buttons">
            <div className="bubble-content">
              <p>Hello! 👋 Welcome to Auspik Pharmaceuticals. How can we assist you today?</p>
              <span className="chat-time">10:00 AM</span>
            </div>
            <div className="whatsapp-buttons">
              <button onClick={() => handleOpenWhatsApp("Hello Auspik Pharmaceuticals, I would like to inquire about your products.")}>
                Inquire about Products
              </button>
              <button onClick={() => handleOpenWhatsApp("Hello Auspik Pharmaceuticals, I would like to inquire about your services.")}>
                Inquire about Services
              </button>
              <button onClick={() => handleOpenWhatsApp("Hello Auspik Pharmaceuticals, I have a general inquiry.")}>
                General Inquiry
              </button>
            </div>
          </div>
        </div>

        <div className="chat-footer">
          <div className="whatsapp-input-wrapper" onClick={() => handleOpenWhatsApp("Hello Auspik Pharmaceuticals, I would like to inquire about your pharmaceutical products and services.")}>
            <span className="placeholder">Type a message</span>
          </div>
          <button className="whatsapp-send-circle" onClick={() => handleOpenWhatsApp("Hello Auspik Pharmaceuticals, I would like to inquire about your pharmaceutical products and services.")}>
            <Send size={18} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <button 
        className="whatsapp-floating-btn"
        onClick={handleOpenWhatsApp}
        aria-label="Contact Auspik on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="pulse-ring"></span>
        <span className="unread-badge">1</span>
      </button>
    </div>
  );
}
