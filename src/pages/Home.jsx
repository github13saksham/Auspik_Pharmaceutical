import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Globe, FlaskConical, ArrowRight, Award, 
  CheckCircle2, Pill, Syringe, TestTube, Truck, FileText, BarChart3, ChevronRight 
} from 'lucide-react';
import { getProducts } from '../services/pharmaService';
import './Home.css';
import ProductDetailModal from '../components/ProductDetailModal';
import InquiryModal from '../components/InquiryModal';

export default function Home({ settings }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const all = await getProducts();
      setFeaturedProducts(all.slice(0, 6)); // Show top 6 for a complete layout
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleInquire = (product) => {
    setSelectedProduct(product);
    setShowInquiryModal(true);
  };

  const companyName = settings?.companyName || 'Ausptik Pharmaceuticals';

  return (
    <div className="home-page">
      {/* Immersive Hero Section with High-Res Background Image & White Text */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-container">
          <div className="hero-text-block">
            <h1 className="hero-main-title">
              Advancing Global Healthcare Through <span className="hero-highlight-text">Scientific Excellence</span>
            </h1>
            
            <p className="hero-subtitle">
              Dedicated to manufacturing high-quality, pharmaceutical products for global markets.
            </p>
            
          </div>
        </div>
        {/* Trust & Certifications Bar (Aligned with Heading) */}
        <div className="hero-trust-wrapper">
          <div className="container">
            <div className="hero-trust-bar">
              <div className="trust-flex">
                <div className="trust-box">
                  <Award size={24} className="trust-icon" />
                  <div>
                    <h4>WHO-GMP</h4>
                    <p>Certified Quality</p>
                  </div>
                </div>
                <div className="trust-box">
                  <ShieldCheck size={24} className="trust-icon" />
                  <div>
                    <h4>ISO 9001:2015</h4>
                    <p>Strict QC Testing</p>
                  </div>
                </div>
                <div className="trust-box">
                  <Truck size={24} className="trust-icon" />
                  <div>
                    <h4>24-48 HR</h4>
                    <p>Express Dispatch</p>
                  </div>
                </div>
                <div className="trust-box">
                  <Globe size={24} className="trust-icon" />
                  <div>
                    <h4>Global Exporter</h4>
                    <p>30+ Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Legacy & Overview Section */}
      <section className="section overview-section">
        <div className="container grid-2 align-center">
          <div className="overview-image-wrapper">
            <div className="modern-image-composition">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80" 
                alt="Auspik Pharmaceuticals Laboratory" 
                className="overview-img main-img"
              />
              <div className="floating-stat-card">
                <div className="stat-icon-wrapper">
                  <Award size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">A New Legacy</span>
                  <span className="stat-label">Excellence in Healthcare</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overview-content">
            <h2 className="section-heading">WELLNESS THE AUSPICIOUS WAY.</h2>
            <p className="lead-p">
              <strong>{companyName}</strong> stands at the threshold of a new era in healthcare—one shaped by ambition, guided by purpose, and anchored in an unwavering commitment to excellence.
            </p>
            <p>
              As we embark upon our relaunch, we are not merely renewing a brand; we are ushering in a new paradigm of pharmaceutical enterprise—one founded upon intellectual rigour, progressive thinking, and an enduring belief in the transformative power of healthcare.
            </p>
            <p>
              We are building a pharmaceutical enterprise where experience meets ambition, heritage meets innovation, and relationships evolve into enduring partnerships.
            </p>

            <div className="highlights-grid mt-4">
              <div className="hl-item">
                <CheckCircle2 size={18} className="hl-icon" />
                <div>
                  <strong>High Efficacy Formulations</strong>
                  <p>Superior bioavailability and therapeutic action.</p>
                </div>
              </div>
            </div>

            <Link to="/about" className="btn btn-secondary mt-4">
              <span>Learn More About Us</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Therapeutic Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-title text-center">
            <h2>Therapeutic & Product Divisions</h2>
            <p>Offering a complete portfolio of healthcare formulations across multiple specialized branches.</p>
          </div>

          <div className="categories-asymmetric-grid">
            <div className="category-card">
              <div className="cat-icon-circle"><Pill size={26} /></div>
              <h3>Tablets & Hard Capsules</h3>
              <p>Film-coated, sustained-release, dispersible, and enteric-coated formulations.</p>
            </div>

            <div className="category-card">
              <div className="cat-icon-circle"><TestTube size={26} /></div>
              <h3>Oral Liquids & Syrups</h3>
              <p>Pediatric and adult syrups, suspensions, and dry syrup formulations with pleasant flavors.</p>
            </div>

            <div className="category-card">
              <div className="cat-icon-circle"><Syringe size={26} /></div>
              <h3>Sterile Injectables</h3>
              <p>Liquid and dry powder sterile injectables manufactured in aseptic cleanrooms.</p>
            </div>

            <div className="category-card">
              <div className="cat-icon-circle"><FlaskConical size={26} /></div>
              <h3>Ointments & Topical Gels</h3>
              <p>Dermatological creams, anti-fungal ointments, and pain-relief gels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Medicine Formulations */}
      <section className="section bg-light-tint">
        <div className="container">
          <div className="section-title text-center">
            <h2>Featured Formulations</h2>
            <p>Discover our top-tier medicines manufactured under strict quality standards.</p>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="grid-3">
              {featuredProducts.map(product => (
                <div key={product.id} className="medicine-card">
                  <div className="med-img-box">
                    <img src={product.image} alt={product.name} />
                    <span className="med-category-pill">{product.category}</span>
                  </div>

                  <div className="med-details">
                    <h3 className="med-title">{product.name}</h3>
                    <p className="med-generic">{product.genericName}</p>

                    <div className="med-meta">
                      <span className="med-dosage-tag">{product.dosageForm || 'Formulation'}</span>
                    </div>

                    <div className="med-actions">
                      <button 
                        className="btn btn-secondary w-full"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <span>Specifications & Quote</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4" style={{ paddingTop: '2.5rem' }}>
            <Link to="/products" className="btn btn-primary">
              <span>View Full Product Directory</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* 4-Step Quality Control Workflow */}
      <section className="section qc-section">
        <div className="container">
          <div className="section-title text-center">
            <h2>Our 4-Step Quality Assurance Pipeline</h2>
            <p>Ensuring absolute purity, efficacy, and stability in every dosage form.</p>
          </div>

          <div className="pipeline-steps">
            <div className="step-card">
              <div className="step-num">01</div>
              <h4>API Inspection</h4>
              <p>Strict physical and chemical testing of active raw materials before processing.</p>
            </div>

            <div className="step-card">
              <div className="step-num">02</div>
              <h4>Precision Compounding</h4>
              <p>Automated cleanroom manufacturing adhering to WHO-GMP sanitation protocols.</p>
            </div>

            <div className="step-card">
              <div className="step-num">03</div>
              <h4>Analytical Testing</h4>
              <p>HPLC, dissolution testing, and assay analysis for dosage accuracy.</p>
            </div>

            <div className="step-card">
              <div className="step-num">04</div>
              <h4>Batch Release</h4>
              <p>Final quality sign-off and tamper-evident barrier packaging.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="home-cta-banner">
        <div className="container cta-flex">
          <div className="cta-left">
            <h2>Experience Superior Quality Pharmaceuticals</h2>
            <p>Get in touch with us for bulk orders, general inquiries, or contract manufacturing.</p>
          </div>
          <div className="cta-right">
            <Link to="/contact" className="btn btn-cta-primary">
              <span>Contact Us Today</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedProduct && !showInquiryModal && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onInquire={handleInquire}
        />
      )}
      
      {showInquiryModal && (
        <InquiryModal 
          product={selectedProduct} 
          onClose={() => {
            setShowInquiryModal(false);
            setSelectedProduct(null);
          }} 
        />
      )}
    </div>
  );
}
