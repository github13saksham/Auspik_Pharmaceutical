import { X, CheckCircle } from 'lucide-react';
import './Modal.css';

export default function ProductDetailModal({ product, onClose, onInquire }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-detail-modal-wrapper animate-fade-in" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="product-modal-grid">
          <div className="product-modal-image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-modal-info">
            <h2 className="product-title">{product.name}</h2>
            <h4 className="generic-name">{product.genericName}</h4>
            
            <div className="product-details-list">
              <div className="detail-item">
                <span className="detail-label">Dosage Form:</span>
                <span className="detail-value">{product.dosageForm}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Indications:</span>
                <span className="detail-value">{product.indications}</span>
              </div>
            </div>
            
            <div className="product-features">
              <div className="feature"><CheckCircle size={16} /> WHO-GMP Certified</div>
              <div className="feature"><CheckCircle size={16} /> Export Quality</div>
              <div className="feature"><CheckCircle size={16} /> Clinically Tested</div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-primary w-full"
                onClick={() => {
                  onClose();
                  onInquire(product);
                }}
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
