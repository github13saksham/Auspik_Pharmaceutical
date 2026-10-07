import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader } from 'lucide-react';
import { addInquiry } from '../services/pharmaService';
import './Contact.css';

export default function Contact({ settings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'General Inquiry',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

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
      setFormData({ name: '', email: '', phone: '', type: 'General Inquiry', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page page-padding">
      <div className="page-header contact-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with our team for bulk exports, contract manufacturing, or general inquiries.</p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-card">
              <h3>Corporate Office</h3>
              <p className="text-muted mb-4">Reach out to us directly through any of the following channels.</p>
              
              <ul className="info-list">
                <li>
                  <div className="icon-circle"><MapPin size={20} /></div>
                  <div>
                    <strong>Address</strong>
                    <p>{settings?.address || '167-B sector 3 industrial area karnal haryana 132001'}</p>
                  </div>
                </li>
                <li>
                  <div className="icon-circle"><Phone size={20} /></div>
                  <div>
                    <strong>Phone / WhatsApp</strong>
                    <p>{settings?.phone || '8222844644, 8053022283'}</p>
                  </div>
                </li>
                <li>
                  <div className="icon-circle"><Mail size={20} /></div>
                  <div>
                    <strong>Email Address</strong>
                    <p>{settings?.email || 'auspikpharma@gmail.com'}</p>
                  </div>
                </li>
              </ul>
              
              <div className="map-placeholder mt-4">
                <iframe 
                  title="Ausptik Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1683015555555!5m2!1sen!2sin" 
                  width="100%" 
                  height="220" 
                  style={{ border: 0, borderRadius: '12px' }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <div className="form-card">
              <h2>Send Us a Direct Message</h2>
              <p className="mb-4">Fill out the form below and our team will get back to you within 24 hours.</p>
              
              {status === 'success' && (
                <div className="alert success-alert">
                  Thank you! Your message has been submitted successfully. Our representative will contact you soon.
                </div>
              )}
              
              {status === 'error' && (
                <div className="alert error-alert">
                  Failed to send message. Please try again or reach out on WhatsApp directly.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} placeholder="e.g. Dr. Rajesh Sharma" />
                </div>
                
                <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} placeholder="name@company.com" />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" name="phone" className="form-control" required value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Inquiry Type</label>
                  <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                    <option value="Distribution">Partnership / Distribution</option>
                    <option value="Third Party Manufacturing">Third Party / Contract Manufacturing</option>
                    <option value="Export Inquiry">Bulk Export Inquiry</option>
                    <option value="General Inquiry">General Product Inquiry</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Message / Requirement Details *</label>
                  <textarea name="message" className="form-control" rows="4" required value={formData.message} onChange={handleChange} placeholder="Specify product categories, target location, or volume requirements..."></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader className="spinner-icon" size={18} /> Submitting...</> : <><Send size={18} /> Submit Inquiry</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
