import { useState } from 'react';
import { 
  SendHorizontal, 
  Loader, 
  CheckCircle2, 
  MessageCircleMore 
} from 'lucide-react';
import { addInquiry } from '../services/pharmaService';
import './Contact.css';

// Custom 3D SVG Illustrations matching the homepage Therapeutic style
const ContactIllustrations = {
  Phone: () => (
    <svg viewBox="0 0 100 100" className="contact-3d-svg">
      <defs>
        <linearGradient id="phoneGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="phoneScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
        <filter id="shadowPhone" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#0369A1" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Background aura ring */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="#E0F2FE" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.8" />
      {/* WhatsApp/Call wave signals */}
      <path d="M 66 26 A 18 18 0 0 1 78 44" fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      <path d="M 72 20 A 26 26 0 0 1 88 44" fill="none" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      {/* 3D Smartphone Body */}
      <g filter="url(#shadowPhone)" transform="rotate(-12 50 50)">
        <rect x="32" y="18" width="36" height="64" rx="9" fill="url(#phoneGrad1)" />
        {/* Screen */}
        <rect x="36" y="24" width="28" height="50" rx="5" fill="url(#phoneScreen)" />
        {/* Speaker & Mic */}
        <rect x="44" y="20.5" width="12" height="2" rx="1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="50" cy="77" r="2" fill="#FFFFFF" opacity="0.9" />
        {/* Dialogue bubble on screen */}
        <path d="M 42 36 L 58 36 A 4 4 0 0 1 62 40 L 62 46 A 4 4 0 0 1 58 50 L 48 50 L 44 54 L 44 50 A 2 2 0 0 1 42 50 A 4 4 0 0 1 38 46 L 38 40 A 4 4 0 0 1 42 36 Z" fill="#0284C7" />
        <circle cx="46" cy="43" r="1.5" fill="#FFFFFF" />
        <circle cx="50" cy="43" r="1.5" fill="#FFFFFF" />
        <circle cx="54" cy="43" r="1.5" fill="#FFFFFF" />
      </g>
      {/* Particle sparkle */}
      <circle cx="22" cy="30" r="2.5" fill="#38BDF8" />
      <circle cx="26" cy="72" r="2" fill="#0284C7" />
    </svg>
  ),

  Email: () => (
    <svg viewBox="0 0 100 100" className="contact-3d-svg">
      <defs>
        <linearGradient id="mailBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="mailFlap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="letterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0FDF4" />
        </linearGradient>
        <filter id="shadowMail" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#047857" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Ambient background ring */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="#D1FAE5" strokeWidth="2.5" strokeDasharray="6 4" />
      <circle cx="78" cy="24" r="2.5" fill="#10B981" />
      <circle cx="20" cy="68" r="2.5" fill="#34D399" />
      {/* 3D Envelope */}
      <g filter="url(#shadowMail)">
        {/* Letter paper coming out */}
        <rect x="26" y="24" width="48" height="34" rx="4" fill="url(#letterGrad)" stroke="#A7F3D0" strokeWidth="1" />
        <rect x="32" y="30" width="22" height="3" rx="1.5" fill="#059669" opacity="0.8" />
        <rect x="32" y="36" width="36" height="2.5" rx="1" fill="#10B981" opacity="0.6" />
        <rect x="32" y="42" width="28" height="2.5" rx="1" fill="#10B981" opacity="0.6" />
        {/* Main Envelope Body */}
        <path d="M 20 42 L 80 42 L 80 76 A 6 6 0 0 1 74 82 L 26 82 A 6 6 0 0 1 20 76 Z" fill="url(#mailBase)" />
        {/* Envelope folds */}
        <path d="M 20 42 L 50 64 L 80 42" fill="none" stroke="#047857" strokeWidth="1.5" opacity="0.4" />
        <path d="M 20 80 L 44 58" stroke="#047857" strokeWidth="1.5" opacity="0.3" />
        <path d="M 80 80 L 56 58" stroke="#047857" strokeWidth="1.5" opacity="0.3" />
        {/* Top open flap */}
        <path d="M 20 42 L 50 22 L 80 42 Z" fill="url(#mailFlap)" opacity="0.85" />
      </g>
    </svg>
  ),

  Building: () => (
    <svg viewBox="0 0 100 100" className="contact-3d-svg">
      <defs>
        <linearGradient id="bldgMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="bldgSide" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="shadowBldg" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#4C1D95" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Background ring */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="#EDE9FE" strokeWidth="2.5" strokeDasharray="6 4" />
      <circle cx="76" cy="30" r="2.5" fill="#8B5CF6" />
      {/* 3D Facility & Pharma Plant */}
      <g filter="url(#shadowBldg)">
        {/* Secondary Unit Wing */}
        <path d="M 54 36 L 82 36 L 82 82 L 54 82 Z" fill="url(#bldgSide)" />
        {/* Windows on side wing */}
        <rect x="60" y="44" width="6" height="6" rx="1.5" fill="#DDD6FE" />
        <rect x="70" y="44" width="6" height="6" rx="1.5" fill="#DDD6FE" />
        <rect x="60" y="56" width="6" height="6" rx="1.5" fill="#DDD6FE" />
        <rect x="70" y="56" width="6" height="6" rx="1.5" fill="#DDD6FE" />
        <rect x="60" y="68" width="6" height="6" rx="1.5" fill="#DDD6FE" />
        <rect x="70" y="68" width="6" height="6" rx="1.5" fill="#DDD6FE" />

        {/* Main High-Rise Pharma HQ Body */}
        <path d="M 22 22 L 56 22 L 56 82 L 22 82 Z" fill="url(#bldgMain)" />
        {/* High-Rise Windows */}
        <rect x="28" y="30" width="8" height="6" rx="1.5" fill="#FFFFFF" opacity="0.9" />
        <rect x="42" y="30" width="8" height="6" rx="1.5" fill="#FFFFFF" opacity="0.9" />
        <rect x="28" y="42" width="8" height="6" rx="1.5" fill="#C4B5FD" />
        <rect x="42" y="42" width="8" height="6" rx="1.5" fill="#C4B5FD" />
        <rect x="28" y="54" width="8" height="6" rx="1.5" fill="#C4B5FD" />
        <rect x="42" y="54" width="8" height="6" rx="1.5" fill="#C4B5FD" />
        {/* Main Entry Doors */}
        <rect x="34" y="68" width="10" height="14" rx="2" fill="#FFFFFF" />
        <line x1="39" y1="68" x2="39" y2="82" stroke="#6D28D9" strokeWidth="1.5" />
        {/* Medical Cross on Rooftop */}
        <rect x="36" y="12" width="6" height="10" rx="1" fill="#A78BFA" />
        <rect x="34" y="14" width="10" height="6" rx="1" fill="#A78BFA" />
      </g>
    </svg>
  ),

  Clock: () => (
    <svg viewBox="0 0 100 100" className="contact-3d-svg">
      <defs>
        <linearGradient id="clockRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="clockDial" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
        <filter id="shadowClock" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#B45309" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Outer ambient ring */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="#FDE68A" strokeWidth="2.5" strokeDasharray="6 4" />
      <circle cx="22" cy="28" r="2.5" fill="#F59E0B" />
      {/* 3D Clock Body */}
      <g filter="url(#shadowClock)">
        {/* Bezel Ring */}
        <circle cx="50" cy="50" r="32" fill="url(#clockRing)" />
        {/* Dial Face */}
        <circle cx="50" cy="50" r="26" fill="url(#clockDial)" />
        {/* Hour Notches */}
        <circle cx="50" cy="28" r="2" fill="#D97706" />
        <circle cx="72" cy="50" r="2" fill="#D97706" />
        <circle cx="50" cy="72" r="2" fill="#D97706" />
        <circle cx="28" cy="50" r="2" fill="#D97706" />
        {/* Clock Hands showing 9:00 */}
        <line x1="50" y1="50" x2="50" y2="34" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="50" x2="35" y2="50" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" />
        {/* Center pin */}
        <circle cx="50" cy="50" r="3.5" fill="#78350F" />
      </g>
    </svg>
  )
};

export default function Contact({ settings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'General Product Inquiry',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const address = settings?.address || '167-B sector 3 industrial area karnal haryana 132001';
  const phone = settings?.phone || '9671240000, 8222844644, 8053022283';
  const email = settings?.email || 'auspikpharma@gmail.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      await addInquiry(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', type: 'General Product Inquiry', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const encodedAddress = encodeURIComponent(address);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <div className="contact-page-v2 page-padding">
      {/* Page Header matching About & Products */}
      <div className="page-header contact-header">
        <div className="container">
          <h1 className="animate-slide-up">Contact Us</h1>
          <p className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Get in touch with our team for bulk product inquiries, PCD franchise options, or contract manufacturing.
          </p>
        </div>
      </div>

      {/* Main Section: Form & Consolidated Contact Information */}
      <section className="container section contact-main-section">
        <div className="contact-v2-grid">
          {/* Direct Form */}
          <div className="contact-form-card">
            <div className="form-header">
              <h2>Send Us A Message</h2>
              <p>Fill out the form below and our pharmaceutical sales expert will reach out to you within 24 hours.</p>
            </div>

            {status === 'success' && (
              <div className="contact-alert success">
                <CheckCircle2 size={20} />
                <div>
                  <strong>Inquiry Submitted Successfully!</strong>
                  <p>Thank you for reaching out to Auspik Pharmaceuticals. Our representative will contact you shortly.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="contact-alert error">
                <div>
                  <strong>Submission Failed</strong>
                  <p>Unable to send message right now. Please try calling or messaging on WhatsApp directly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-v2-form">
              <div className="form-group-v2">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="" 
                />
              </div>

              <div className="form-row-2">
                <div className="form-group-v2">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="name@company.com" 
                  />
                </div>

                <div className="form-group-v2">
                  <label>Phone / WhatsApp Number *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+91 9XXXXXXX" 
                  />
                </div>
              </div>

              <div className="form-group-v2">
                <label>Inquiry Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="General Product Inquiry">General Product Inquiry</option>
                  <option value="Third Party Manufacturing">Product Issue Enquiry</option>
                  
                </select>
              </div>

              <div className="form-group-v2">
                <label>Message / Order Details *</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  required 
                  value={formData.message} 
                  onChange={handleChange} 
                  placeholder="Please describe your product requirements, volume, or target location..."
                ></textarea>
              </div>

              <div className="form-action-row">
                <button type="submit" className="btn-contact-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader className="spin-icon" size={18} />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <SendHorizontal size={18} />
                    </>
                  )}
                </button>

                <a 
                  href="https://wa.me/919671240000" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-whatsapp-direct"
                >
                  <MessageCircleMore size={18} />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </form>
          </div>

          {/* Consolidated Single Information Box (Symmetrical to Form Card) */}
          <div className="contact-info-card">
            <div className="info-card-header">
              <h2>Contact Information</h2>
              <p>Direct communication channels, corporate offices & manufacturing facilities.</p>
            </div>

            <div className="info-meta-list">
              {/* Phones */}
              <div className="meta-item">
                <div className="meta-illustration-wrapper blue">
                  <ContactIllustrations.Phone />
                </div>
                <div>
                  <strong>Phone & WhatsApp</strong>
                  <p className="meta-value">{phone}</p>
                  <a href="https://wa.me/919671240000" target="_blank" rel="noopener noreferrer" className="unified-link">
                    Chat directly on WhatsApp &rarr;
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="meta-item">
                <div className="meta-illustration-wrapper green">
                  <ContactIllustrations.Email />
                </div>
                <div>
                  <strong>Email Support</strong>
                  <p className="meta-value">{email}</p>
                  <a href={`mailto:${email}`} className="unified-link">
                    Send an email &rarr;
                  </a>
                </div>
              </div>

              {/* Facility Address */}
              <div className="meta-item">
                <div className="meta-illustration-wrapper purple">
                  <ContactIllustrations.Building />
                </div>
                <div>
                  <strong>Manufacturing & Corporate Address</strong>
                  <p className="meta-value">{address}</p>
                  <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="unified-link">
                    Get directions on Google Maps &rarr;
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="meta-item">
                <div className="meta-illustration-wrapper amber">
                  <ContactIllustrations.Clock />
                </div>
                <div>
                  <strong>Operating Hours</strong>
                  <p className="meta-value">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Integrated Map inside the same box */}
            <div className="integrated-map-box">
              <iframe 
                title="Auspik Pharmaceuticals Exact Location Map"
                src={mapEmbedUrl}
                width="100%" 
                height="200" 
                style={{ border: 0, display: 'block' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
