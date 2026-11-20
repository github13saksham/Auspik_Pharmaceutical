import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, ChevronLeft, ChevronDown, PackageCheck } from 'lucide-react';
import { getProducts } from '../services/pharmaService';
import InquiryModal from '../components/InquiryModal';
import productsHeroImg from '../assets/pharma_careers/products_hero_banner.jpg';
import './Products.css';

const TINT_PALETTE = ['#D6EEC9', '#C9E3F6', '#F6D2DE', '#FBDFAA', '#F7C9C9', '#CDDEFA'];

const getProductTint = (form = '', index = 0) => {
  const f = (form || '').toLowerCase();
  if (f.includes('syrup') || f.includes('tonic') || f.includes('ras') || f.includes('liquid') || f.includes('suspension')) {
    return '#D6EEC9'; // soft kiwi green
  }
  if (f.includes('softgel') || f.includes('drop')) {
    return '#C9E3F6'; // soft sky blue
  }
  if (f.includes('tablet')) {
    return index % 2 === 0 ? '#CDDEFA' : '#F7C9C9'; // soft periwinkle or soft coral
  }
  if (f.includes('capsule')) {
    return '#FBDFAA'; // warm light peach
  }
  if (f.includes('cream') || f.includes('oil') || f.includes('gel') || f.includes('ointment')) {
    return '#F6D2DE'; // soft rose
  }
  return TINT_PALETTE[index % TINT_PALETTE.length];
};

const ArrowRight = ({ size = 14, className = '' }) => (
  <svg
    className={className}
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// Scope of Business Categories:
// Marketing, Trading, Distribution, and Supply of Medicinal and Pharmaceutical Preparations
export const SCOPE_OF_BUSINESS_CATEGORIES = [
  'All Categories',
  'Tablets',
  'Capsules',
  'Injectables',
  'Sterile Pharmaceutical Preparations',
  'Ophthalmic Preparations (Eye Drops & Eye Ointments)',
  'Syrups',
  'Oral Liquids',
  'Food Supplements',
  'Nutraceuticals',
  'Vitamins',
  'Minerals',
  'Medical Devices',
  'Medical Equipment',
  'Orthopaedic Supports, Braces & Belts',
  'Rehabilitation Aids'
];

export const matchesScopeCategory = (p, cat) => {
  if (!cat || cat === 'All' || cat === 'All Categories') return true;
  const c = cat.toLowerCase();
  const form = (p.dosageForm || '').toLowerCase();
  const category = (p.category || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  const generic = (p.genericName || '').toLowerCase();
  const comp = (p.composition || '').toLowerCase();
  const indications = Array.isArray(p.indications)
    ? p.indications.join(' ').toLowerCase()
    : (p.indications || '').toLowerCase();

  if (c.includes('tablet')) {
    return form.includes('tablet') || category.includes('tablet');
  }
  if (c.includes('capsule')) {
    return form.includes('capsule') || category.includes('capsule');
  }
  if (c.includes('injectable')) {
    return form.includes('inject') || category.includes('inject');
  }
  if (c.includes('sterile')) {
    return form.includes('sterile') || form.includes('inject') || form.includes('drop') || category.includes('sterile') || category.includes('ophthalmic') || form.includes('ophthalmic');
  }
  if (c.includes('ophthalmic') || c.includes('eye drop') || c.includes('eye ointment')) {
    return form.includes('eye') || form.includes('ophthalmic') || form.includes('drop') || category.includes('eye drop') || category.includes('ophthalmic');
  }
  if (c === 'syrups' || c === 'syrup') {
    return form.includes('syrup') || category.includes('syrup') || form.includes('tonic');
  }
  if (c.includes('oral liquid')) {
    return form.includes('oral') || form.includes('liquid') || form.includes('syrup') || form.includes('tonic') || form.includes('ras') || form.includes('suspension') || category.includes('liquid') || category.includes('syrup');
  }
  if (c.includes('food supplement')) {
    return category.includes('nutra') || form.includes('softgel') || indications.includes('supplement') || indications.includes('nutritional') || indications.includes('deficiency') || generic.includes('vitamin');
  }
  if (c.includes('nutraceutical')) {
    return category.includes('nutra') || form.includes('softgel') || name.includes('ev-pik') || generic.includes('vitamin') || generic.includes('cholecalciferol') || generic.includes('tocopherol');
  }
  if (c.includes('vitamin')) {
    return generic.includes('vitamin') || name.includes('vit') || generic.includes('cholecalciferol') || generic.includes('tocopherol') || generic.includes('methylcobalamin') || generic.includes('d3') || indications.includes('vitamin');
  }
  if (c.includes('mineral')) {
    return generic.includes('zinc') || generic.includes('calcium') || generic.includes('ferrous') || generic.includes('iron') || generic.includes('mineral') || generic.includes('magnesium') || comp.includes('zinc') || comp.includes('calcium') || comp.includes('iron');
  }
  if (c.includes('medical device')) {
    return category.includes('device') || form.includes('device');
  }
  if (c.includes('medical equipment')) {
    return category.includes('equipment') || form.includes('equipment');
  }
  if (c.includes('orthopaedic') || c.includes('brace') || c.includes('belt')) {
    const isGel = form === 'gel' || (form.includes('gel') && !form.includes('softgel') && !form.includes('gelatin'));
    return category.includes('ortho') || form.includes('brace') || form.includes('belt') || (form.includes('oil') && category.includes('oint')) || isGel || name.includes('curcuflex');
  }
  if (c.includes('rehabilitation')) {
    return category.includes('rehab') || form.includes('rehab');
  }
  return category.includes(c) || form.includes(c);
};

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const dropdownRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Pagination & Transition States
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (categoryParam) {
      const match = SCOPE_OF_BUSINESS_CATEGORIES.find(
        c => c.toLowerCase() === categoryParam.toLowerCase() || c.toLowerCase().includes(categoryParam.toLowerCase())
      );
      setSelectedCategory(match || categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      const all = await getProducts();
      setProducts(all);
      setFilteredProducts(all);
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    
    if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'All Categories') {
      result = result.filter(p => matchesScopeCategory(p, selectedCategory));
    }
    
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.genericName.toLowerCase().includes(lowerTerm) ||
        (p.category && p.category.toLowerCase().includes(lowerTerm)) ||
        (p.dosageForm && p.dosageForm.toLowerCase().includes(lowerTerm))
      );
    }
    
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products]);

  const categories = SCOPE_OF_BUSINESS_CATEGORIES;

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    setIsTransitioning(true);
    setCurrentPage(page);
    const anchor = document.getElementById('products-section-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="products-page">
      {/* Ambient Floating Discs Matching Homepage Theme */}
      <span className="products-page-circle products-page-circle--a" aria-hidden="true" />
      <span className="products-page-circle products-page-circle--b" aria-hidden="true" />

      {/* Header Banner */}
      <div 
        className="page-header products-page-header" 
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(11, 36, 71, 0.94) 0%, rgba(30, 58, 138, 0.88) 100%), url(${productsHeroImg})` 
        }}
      >
        <div className="container">
          <div className="products-head-bars" aria-hidden="true">
            <span />
            <span />
          </div>
          <h1 className="animate-slide-up">Our Medicine <span>Formulations</span></h1>
          <p className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            High-bioavailability pharmaceutical syrups, creams, pain relief oils, tablets, capsules, and oral therapeutics formulated under strict quality compliance.
          </p>
        </div>
      </div>

      <div className="container section" id="products-section-anchor">
        <div className="products-layout-horizontal">
          {/* Horizontal Filters */}
          <div className="filters-bar-container">
            <div className="filters-row">
              <div className="search-box-flex">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search formulations by brand or composition..." 
                  className="modern-input-flex"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="category-dropdown-container" ref={dropdownRef}>
                <button 
                  type="button"
                  className="category-dropdown-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                >
                  <div className="dropdown-btn-content">
                    <Filter size={16} className="filter-icon" />
                    <span className="selected-text">
                      {selectedCategory}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="category-dropdown-menu animate-fade-in">
                    <ul className="dropdown-list">
                      {categories.map((category) => {
                        const count = category === 'All Categories'
                          ? products.length
                          : products.filter(p => matchesScopeCategory(p, category)).length;
                        return (
                          <li key={category}>
                            <button
                              type="button"
                              className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsDropdownOpen(false);
                              }}
                            >
                              <span className="cat-name">{category}</span>
                              <span className="count">{count}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formulations Grid */}
          <div className="products-main">
            {loading ? (
              <div className="modern-grid" role="list" aria-busy="true" aria-label="Loading products">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div key={`sk-load-${i}`} className="ff-prod-card ff-prod-card--sk" aria-hidden="true">
                    <div className="ff-prod-stage ff-sk-stage">
                      <span className="ff-sk-disc" />
                    </div>
                    <div className="ff-prod-body">
                      <span className="ff-sk-line ff-sk-form" />
                      <span className="ff-sk-line ff-sk-name" />
                      <span className="ff-sk-line ff-sk-comp" />
                      <div className="ff-sk-link-row">
                        <span className="ff-sk-line ff-sk-text" />
                        <span className="ff-sk-go" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div 
                  className="modern-grid" 
                  role="list" 
                  aria-busy={isTransitioning}
                >
                  {currentProducts.map((product, idx) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="ff-prod-card"
                      aria-label={`View formulation: ${product.name}`}
                    >
                      <div 
                        className="ff-prod-stage" 
                        style={{ "--tint": getProductTint(product.dosageForm || product.category, idx) }}
                      >
                        <span className="ff-prod-disc" aria-hidden="true" />
                        <img 
                          className="ff-prod-img" 
                          src={product.image} 
                          alt={`${product.name} pack`} 
                          loading="lazy" 
                        />
                      </div>

                      <div className="ff-prod-body">
                        <span className="ff-prod-form">
                          {product.dosageForm || product.category || 'Formulation'}
                        </span>
                        <h3 className="ff-prod-name">{product.name}</h3>
                        <p className="ff-prod-comp">
                          {product.genericName || product.composition || 'Pharmaceutical Formulation Active Complex'}
                        </p>
                        <span className="ff-prod-link">
                          View Formulation
                          <span className="ff-prod-go">
                            <ArrowRight size={14} />
                          </span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="products-pagination-container">
                    <div className="pagination-info">
                      <span>
                        Showing <strong>{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> formulations
                      </span>
                    </div>

                    <nav className="pagination-nav" aria-label="Products page navigation">
                      <button 
                        type="button"
                        className="pagination-btn pagination-prev"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Previous Page"
                      >
                        <ChevronLeft size={16} />
                        <span>Previous</span>
                      </button>

                      <div className="pagination-pages">
                        {getPageNumbers().map((page, idx) => (
                          typeof page === 'number' ? (
                            <button
                              key={idx}
                              type="button"
                              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                              onClick={() => handlePageChange(page)}
                              aria-label={`Go to page ${page}`}
                              aria-current={currentPage === page ? 'page' : undefined}
                            >
                              {page}
                            </button>
                          ) : (
                            <span key={idx} className="pagination-ellipsis">...</span>
                          )
                        ))}
                      </div>

                      <button 
                        type="button"
                        className="pagination-btn pagination-next"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-label="Next Page"
                      >
                        <span>Next</span>
                        <ChevronRight size={16} />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : selectedCategory !== 'All Categories' && !searchTerm ? (
              <div className="no-results animate-fade-in scope-procurement-state">
                <div className="no-results-content">
                  <div className="scope-icon-pill" style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', marginBottom: '16px' }}>
                    <PackageCheck size={38} className="no-results-icon" style={{ margin: 0, color: '#2563eb' }} />
                  </div>
                  <h3>{selectedCategory}</h3>
                  <p style={{ maxWidth: '580px', margin: '0 auto 20px', color: 'var(--ff-muted)', lineHeight: '1.6' }}>
                    This segment is an authorized part of our <strong>Scope of Business</strong> (Marketing, Trading, Distribution &amp; Supply). We supply certified high-grade formulations on institutional contract and custom orders.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      className="pagination-btn"
                      style={{ background: 'var(--ff-accent)', color: '#fff', border: 'none' }}
                      onClick={() => {
                        setSelectedProduct({ name: `${selectedCategory} Supply Inquiry`, category: selectedCategory });
                        setShowInquiryModal(true);
                      }}
                    >
                      Inquire for Institutional Supply
                    </button>
                    <button 
                      type="button"
                      className="pagination-btn"
                      style={{ background: '#f1f5f9', color: 'var(--ff-ink)', border: '1px solid var(--ff-border)' }}
                      onClick={() => { setSearchTerm(''); setSelectedCategory('All Categories'); }}
                    >
                      View All Formulations
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-results animate-fade-in">
                <div className="no-results-content">
                  <Search size={44} className="no-results-icon" />
                  <h3>No formulations found</h3>
                  <p>Try adjusting your search keywords or choosing another category filter.</p>
                  <button 
                    type="button"
                    className="pagination-btn"
                    style={{ background: 'var(--ff-accent)', color: '#fff', border: 'none', margin: '0 auto' }}
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All Categories'); }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
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
