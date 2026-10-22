import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  ShieldCheck, 
  FileCheck2, 
  Package, 
  Send, 
  Share2, 
  Check, 
  ChevronRight,
  AlertCircle,
  Truck,
  RotateCcw,
  Building2,
  Clock
} from 'lucide-react';
import { getProducts } from '../services/pharmaService';
import InquiryModal from '../components/InquiryModal';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadProductData = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        const found = allProducts.find(p => String(p.id) === String(id));
        setProduct(found || null);

        if (found) {
          const related = allProducts
            .filter(p => String(p.id) !== String(id) && (p.category === found.category || p.dosageForm === found.dosageForm))
            .slice(0, 4);
          
          if (related.length < 4) {
            const extra = allProducts
              .filter(p => String(p.id) !== String(id) && !related.some(r => r.id === p.id))
              .slice(0, 4 - related.length);
            setRelatedProducts([...related, ...extra]);
          } else {
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="az-product-page">
        <div className="az-product-container">
          <div className="az-skeleton-layout">
            <div className="az-sk-img shimmer"></div>
            <div className="az-sk-info">
              <div className="az-sk-line title shimmer"></div>
              <div className="az-sk-line sub shimmer"></div>
              <div className="az-sk-line text shimmer"></div>
              <div className="az-sk-line text shimmer"></div>
            </div>
            <div className="az-sk-buybox shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found-container">
        <div className="not-found-card">
          <AlertCircle size={48} className="text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Medicine Formulation Not Found</h2>
          <p className="text-slate-600 mb-6">The requested product does not exist in our current pharmaceutical catalog or may have been updated.</p>
          <Link to="/products" className="btn btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="az-product-page">
      {/* Amazon-style Breadcrumbs Bar */}
      <div className="az-breadcrumbs-bar">
        <div className="az-product-container">
          <nav className="az-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/products" className="az-back-crumb">
              <ArrowLeft size={14} /> Back to results
            </Link>
            <span className="az-crumb-sep">|</span>
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <Link to="/products">Pharmaceutical Catalog</Link>
            <ChevronRight size={12} />
            {product.category && (
              <>
                <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
                  {product.category}
                </Link>
                <ChevronRight size={12} />
              </>
            )}
            <span className="az-current-crumb">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="az-product-container">
        {/* Amazon 3-Column Native Product Showcase */}
        <div className="az-product-layout">
          
          {/* COLUMN 1: Visual Sticky Gallery */}
          <div className="az-image-column">
            <div className="az-sticky-image-wrap">
              <div className="az-main-image-viewport">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="az-product-img"
                  loading="eager"
                />
              </div>
              <p className="az-image-caption">Hover or tap on image to inspect formulation details</p>
            </div>
          </div>

          {/* COLUMN 2: Center Center Product Details */}
          <div className="az-details-column">
            {/* Title & Brand */}
            <div className="az-title-block">
              <Link to="/about" className="az-brand-link">
                Brand: Auspik Pharmaceuticals Pvt. Ltd.
              </Link>
              <h1 className="az-product-title">{product.name}</h1>
              <p className="az-generic-subtitle">{product.genericName}</p>
            </div>

            <div className="az-divider"></div>

            {/* Structured Specifications Table (Amazon 'About this item' attribute table) */}
            <div className="az-spec-table">
              <div className="az-spec-row">
                <span className="az-spec-key">Dosage Form</span>
                <span className="az-spec-val">{product.dosageForm}</span>
              </div>
              {product.packaging && (
                <div className="az-spec-row">
                  <span className="az-spec-key">Package Size</span>
                  <span className="az-spec-val">{product.packaging}</span>
                </div>
              )}
              <div className="az-spec-row">
                <span className="az-spec-key">Therapeutic Segment</span>
                <span className="az-spec-val">{product.category}</span>
              </div>
              <div className="az-spec-row">
                <span className="az-spec-key">Formulation Standard</span>
                <span className="az-spec-val">IP / BP / USP Pharmaceutical Quality</span>
              </div>
              <div className="az-spec-row">
                <span className="az-spec-key">Manufacturer</span>
                <span className="az-spec-val">WHO-GMP Compliant State-of-the-Art Cleanroom</span>
              </div>
            </div>

            <div className="az-divider"></div>

            {/* Clinical Indications Callout */}
            {product.indications && (
              <div className="az-indications-block">
                <span className="az-section-label">Medical Indications & Therapeutic Action</span>
                <div className="az-indications-box">
                  <p>{product.indications}</p>
                </div>
              </div>
            )}

            {/* Amazon 'About this item' Bullet Points */}
            <div className="az-about-item-block">
              <h3 className="az-section-heading">About this formulation</h3>
              <ul className="az-bullets-list">
                <li>
                  <strong>Active Pharmaceutical Formulation:</strong> {product.genericName}.
                </li>
                <li>
                  <strong>Targeted Therapeutic Utility:</strong> {product.description}
                </li>
                <li>
                  <strong>High Quality Assurance:</strong> Fully compliant with WHO-GMP manufacturing and rigorous analytical pharmacopeial assay tests.
                </li>
                <li>
                  <strong>Packaging & Distribution:</strong> High barrier protective Alu-Alu / Blister / HDPE packaging preserving chemical stability and shelf life.
                </li>
                <li>
                  <strong>Direct Inquiry:</strong> Available for PCD Pharma Franchise, third-party manufacturing, hospital orders, and ethical distributor partnerships across India.
                </li>
              </ul>
            </div>
          </div>

          {/* COLUMN 3: Amazon Right Buy / Inquiry Box */}
          <div className="az-buybox-column">
            <div className="az-buybox-card">
              <div className="az-buybox-status">
                <span className="az-in-stock">Available for Supply</span>
                <span className="az-supply-type">PCD Franchise & Third-Party Manufacturing</span>
              </div>

              <div className="az-buybox-meta">
                <div className="az-meta-line">
                  <span className="az-meta-k">Brand</span>
                  <span className="az-meta-v">Auspik Pharmaceuticals</span>
                </div>
                <div className="az-meta-line">
                  <span className="az-meta-k">Ships from</span>
                  <span className="az-meta-v">Karnal, Haryana</span>
                </div>
                <div className="az-meta-line">
                  <span className="az-meta-k">Packaging</span>
                  <span className="az-meta-v">{product.packaging || 'Standard Export Pack'}</span>
                </div>
              </div>

              <div className="az-buybox-actions">
                <button 
                  type="button" 
                  className="az-btn-primary"
                  onClick={() => setShowInquiryModal(true)}
                >
                  <Send size={16} />
                  <span>Request Quotation</span>
                </button>

                <button 
                  type="button" 
                  className={`az-btn-secondary ${copied ? 'copied' : ''}`}
                  onClick={handleShare}
                >
                  {copied ? <Check size={16} /> : <Share2 size={16} />}
                  <span>{copied ? 'Link Copied!' : 'Share Product'}</span>
                </button>
              </div>

              <div className="az-buybox-perks">
                <div className="az-perk-item">
                  <ShieldCheck size={16} className="az-perk-icon" />
                  <span>100% Genuine Certified Formulation</span>
                </div>
                <div className="az-perk-item">
                  <Truck size={16} className="az-perk-icon" />
                  <span>Prompt Nationwide Temperature-Safe Dispatch</span>
                </div>
                <div className="az-perk-item">
                  <Building2 size={16} className="az-perk-icon" />
                  <span>Direct Corporate Manufacturer Price</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amazon-style "Customers Also Viewed" Product Row */}
        {relatedProducts.length > 0 && (
          <div className="az-related-section">
            <div className="az-related-header">
              <h3>Related Formulations in {product.category}</h3>
              <Link to="/products" className="az-view-all">
                See all products <ChevronRight size={14} />
              </Link>
            </div>

            <div className="az-related-grid">
              {relatedProducts.map(rel => (
                <Link 
                  to={`/products/${rel.id}`} 
                  key={rel.id} 
                  className="az-related-item"
                >
                  <div className="az-related-thumb">
                    <img src={rel.image} alt={rel.name} loading="lazy" />
                  </div>
                  <div className="az-related-desc">
                    <h4 className="az-rel-name">{rel.name}</h4>
                    <span className="az-rel-cat">{rel.dosageForm}</span>
                    <p className="az-rel-generic">{rel.genericName}</p>
                    <span className="az-rel-cta">View Formulation &rsaquo;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <InquiryModal 
          product={product} 
          onClose={() => setShowInquiryModal(false)} 
        />
      )}
    </div>
  );
}
