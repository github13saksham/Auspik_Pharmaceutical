import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Award, Sparkles } from 'lucide-react';
import './CategoryDetailModal.css';

export default function CategoryDetailModal({ category, onClose }) {
  const navigate = useNavigate();

  if (!category) return null;

  const handleViewProducts = () => {
    onClose();
    navigate(`/products?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <div className="category-modal-backdrop" onClick={onClose}>
      <div className="category-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="category-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="cat-modal-header">
          <div className="cat-modal-badge">
            <Sparkles size={14} />
            <span>Therapeutic Division Overview</span>
          </div>
          <h2>{category.name}</h2>
          <p className="cat-modal-subtitle">{category.description}</p>
        </div>

        {/* Modal Body Grid */}
        <div className="cat-modal-body">
          {/* Highlights Box */}
          <div className="cat-modal-section">
            <h3><Award size={18} className="sec-icon" /> Manufacturing Standards</h3>
            <ul className="cat-modal-list">
              <li>
                <CheckCircle2 size={16} className="list-icon" />
                <span>Formulated to rigorous standards delivering high quality medicines</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="list-icon" />
                <span>Rigorous stability and dissolution testing at every batch</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="list-icon" />
                <span>High bioavailability formulations with optimized disintegration</span>
              </li>
            </ul>
          </div>

          {/* Formulations / Dosage Forms offered */}
          <div className="cat-modal-section">
            <h3><ShieldCheck size={18} className="sec-icon" /> Key Formulations & Variations</h3>
            <div className="cat-modal-tags-grid">
              {category.tags.map((tag, idx) => (
                <div key={idx} className="cat-modal-tag-item">
                  <span className="dot"></span>
                  {tag}
                </div>
              ))}
              <div className="cat-modal-tag-item">
                <span className="dot"></span>
                Custom Formulations
              </div>
              <div className="cat-modal-tag-item">
                <span className="dot"></span>
                Blister & Strip Packaging
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="cat-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Preview
          </button>
          <button className="btn btn-primary btn-modal-cta" onClick={handleViewProducts}>
            <span>View All {category.name} Products</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
