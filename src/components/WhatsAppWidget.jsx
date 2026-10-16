import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, CheckCheck, ExternalLink, Sparkles } from 'lucide-react';
import './WhatsAppWidget.css';

export default function WhatsAppWidget({ phone }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  const targetPhone = '919671240000';

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const initialMessages = [
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! 👋 Welcome to Auspik Pharmaceuticals. How can we assist you today?',
      time: '10:00 AM',
      buttons: [
        { id: 'btn_prod', label: 'Inquire about Products' },
        { id: 'btn_serv', label: 'Inquire about Services' },
        { id: 'btn_gen', label: 'General Inquiry' }
      ]
    }
  ];

  const [messages, setMessages] = useState(initialMessages);

  // Auto-scroll to bottom of chat body whenever messages change or typing state updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const openWhatsAppUrl = (customText) => {
    const textToSend = customText || "Hello Auspik Pharmaceuticals, I would like to inquire about your pharmaceutical products and services.";
    const encoded = encodeURIComponent(textToSend);
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const processBotReply = (userQuery) => {
    const query = userQuery.toLowerCase();
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let replyButtons = [];

      if (query.includes('product') || query.includes('medicine') || query.includes('syrup') || query.includes('cream') || query.includes('oil')) {
        replyText = 'We specialize in formulating high-quality pharmaceutical syrups, creams, pain relief oils, tablets, and capsules at our HSIIDC Karnal facility.';
        replyButtons = [
          { id: 'nav_prod', label: 'Browse Medicine Directory', action: 'navigate', url: '/products' },
          { id: 'wa_prod', label: 'Inquire on WhatsApp', action: 'whatsapp', query: 'Inquire about medicine formulations' }
        ];
      } else if (query.includes('service') || query.includes('manufacturing') || query.includes('third party') || query.includes('distribution')) {
        replyText = 'We provide advanced formulation development, third-party contract manufacturing, and pan-India distribution meeting stringent national and international standards.';
        replyButtons = [
          { id: 'nav_about', label: 'About Our Facility', action: 'navigate', url: '/about' },
          { id: 'wa_serv', label: 'Inquire on WhatsApp', action: 'whatsapp', query: 'Inquire about manufacturing services' }
        ];
      } else if (query.includes('location') || query.includes('address') || query.includes('karnal') || query.includes('where') || query.includes('contact')) {
        replyText = 'Our modern facility is located at HSIIDC, Sector-3, Karnal, Haryana. You can reach out directly via our contact directory or WhatsApp.';
        replyButtons = [
          { id: 'nav_contact', label: 'View Contact Page', action: 'navigate', url: '/contact' },
          { id: 'wa_dir', label: 'Inquire on WhatsApp', action: 'whatsapp', query: 'Location & contact inquiry' }
        ];
      } else if (query.includes('general')) {
        replyText = 'Auspik Pharmaceuticals Pvt. Ltd. is dedicated to accessible, reliable healthcare through continuous research and patient-centric formulations.';
        replyButtons = [
          { id: 'nav_prod2', label: 'Explore Products', action: 'navigate', url: '/products' },
          { id: 'wa_gen', label: 'Inquire on WhatsApp', action: 'whatsapp', query: 'General inquiry for Auspik Pharmaceuticals' }
        ];
      } else {
        replyText = `Thank you for your message! You can explore our formulations right here on the website or message us directly on WhatsApp.`;
        replyButtons = [
          { id: 'nav_prod3', label: 'Explore Products', action: 'navigate', url: '/products' },
          { id: 'wa_custom', label: 'Inquire on WhatsApp', action: 'whatsapp', query: userQuery }
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          text: replyText,
          time: formatTime(),
          buttons: replyButtons
        }
      ]);
      setIsTyping(false);
    }, 650);
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: formatTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    processBotReply(text.trim());
  };

  const handleButtonClick = (btn) => {
    if (btn.action === 'navigate') {
      navigate(btn.url);
      setIsOpen(false);
    } else if (btn.action === 'whatsapp') {
      openWhatsAppUrl(btn.query);
    } else {
      // Default: send as chat message
      handleSendMessage(btn.label);
    }
  };

  return (
    <div className="whatsapp-widget-container">
      {/* WhatsApp Chat Popup Window */}
      <div className={`whatsapp-chat-popup ${isOpen ? 'active' : ''}`}>
        {/* Chat Header */}
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
            type="button"
            className="chat-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`chat-bubble ${msg.sender === 'user' ? 'outgoing' : 'incoming'} ${msg.buttons ? 'has-buttons' : ''}`}
            >
              <div className="bubble-content">
                <p>{msg.text}</p>
                <div className="bubble-footer">
                  <span className="chat-time">{msg.time}</span>
                  {msg.sender === 'user' && (
                    <CheckCheck size={13} className="chat-ticks" />
                  )}
                </div>
              </div>

              {/* Dynamic Interactive Quick Buttons */}
              {msg.buttons && msg.buttons.length > 0 && (
                <div className="whatsapp-buttons">
                  {msg.buttons.map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => handleButtonClick(btn)}
                    >
                      <span>{btn.label}</span>
                      {btn.action === 'navigate' ? (
                        <ExternalLink size={13} className="btn-icon-right" />
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-bubble incoming typing-indicator-bubble">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Interactive Input Footer */}
        <div className="chat-footer">
          <form 
            className="whatsapp-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input 
              type="text"
              className="whatsapp-real-input"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit" 
              className="whatsapp-send-circle"
              disabled={!inputText.trim()}
              aria-label="Send message"
            >
              <Send size={16} fill="currentColor" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <button 
        type="button"
        className="whatsapp-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle WhatsApp chat"
      >
        <MessageCircle size={28} />
        <span className="pulse-ring"></span>
        <span className="unread-badge">1</span>
      </button>
    </div>
  );
}
