import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
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

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Pagination & Transition States
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
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
    
    if (selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase();
      result = result.filter(p => 
        (p.category && p.category.toLowerCase().includes(catLower)) ||
        (p.dosageForm && p.dosageForm.toLowerCase().includes(catLower))
      );
    }
    
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.genericName.toLowerCase().includes(lowerTerm) ||
        (p.category && p.category.toLowerCase().includes(lowerTerm))
      );
    }
    
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products]);

  const defaultCategories = ['All', 'Tablets', 'Capsules', 'Liquids Orals', 'Eye Drops', 'Powders', 'Herbals'];
  const categories = Array.from(new Set([...defaultCategories, ...products.map(p => p.category).filter(Boolean)]));

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
              
              <div className="category-dropdown-container">
                <button 
                  type="button"
                  className="category-dropdown-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                >
                  <div className="dropdown-btn-content">
                    <Filter size={16} className="filter-icon" />
                    <span className="selected-text">
                      {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="category-dropdown-menu animate-fade-in">
                    <ul className="dropdown-list">
                      {categories.map((category) => (
                        <li key={category}>
                          <button
                            type="button"
                            className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="cat-name">{category === 'All' ? 'All Categories' : category}</span>
                            {category !== 'All' && (
                              <span className="count">
                                {products.filter(p => p.category === category).length}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
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
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
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
