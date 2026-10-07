import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { addInquiry } from '../services/pharmaService';
import './Modal.css';

export default function InquiryModal({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Product Inquiry',
    product: product?.name || '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addInquiry(formData);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content success-content animate-fade-in" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
          <div className="success-icon-large">✓</div>
          <h3>Inquiry Sent Successfully!</h3>
          <p>Our team will get back to you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="inquiry-header">
          <h3>Request a Quote</h3>
          <p>Fill out the form below to inquire about {product ? <strong>{product.name}</strong> : 'our products'}.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="inquiry-form">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
          </div>
          
          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="form-label">Email Address *</label>
              <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Phone Number *</label>
              <input type="tel" name="phone" className="form-control" required value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Product of Interest</label>
            <input type="text" name="product" className="form-control" value={formData.product} readOnly={!!product} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Additional Message</label>
            <textarea name="message" className="form-control" rows="4" value={formData.message} onChange={handleChange}></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? <><Loader className="spinner-icon" size={18} /> Submitting...</> : 'Send Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
