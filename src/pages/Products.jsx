import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Info, FileText, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { getProducts } from '../services/pharmaService';
import InquiryModal from '../components/InquiryModal';
import './Products.css';

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
      // Small timeout to allow the skeleton shimmer crossfade to smoothly resolve
      setTimeout(() => {
        setLoading(false);
      }, 350);
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

  const handleInquire = (product) => {
    setSelectedProduct(product);
    setShowInquiryModal(true);
  };

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
    <div className="products-page page-padding">
      <div className="page-header">
        <div className="container">
          <h1 className="animate-slide-up">Our Premium Products</h1>
          <p className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Comprehensive and advanced solutions across various therapeutic segments.
          </p>
        </div>
      </div>

      <div className="container section" id="products-section-anchor">
        <div className="products-layout-horizontal">
          {/* Horizontal Filters */}
          <div className="filters-bar-container">
            <div className="filters-row">
              <div className="search-box-flex">
                <Search size={20} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search medicines..." 
                  className="modern-input-flex"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="category-dropdown-container">
                <button 
                  className="category-dropdown-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="dropdown-btn-content">
                    <Filter size={18} className="filter-icon" />
                    <span className="selected-text">
                      {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                    </span>
                  </div>
                  <ChevronDown size={18} className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="category-dropdown-menu animate-fade-in-up">
                    <ul className="dropdown-list">
                      {categories.map((category) => (
                        <li key={category}>
                          <button
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

          {/* Product Grid */}
          <div className="products-main">
            {loading ? (
              <div className="modern-grid" role="list" aria-busy="true" aria-label="Loading products">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div key={`sk-load-${i}`} className="product-card ac-11__card" data-ready="false">
                    <div className="ac-11__sk" aria-hidden="true">
                      <span className="ac-11__b ac-11__b--img"></span>
                      <div className="ac-11__sk-body">
                        <span className="ac-11__b ac-11__b--badge"></span>
                        <span className="ac-11__b ac-11__b--title"></span>
                        <span className="ac-11__b ac-11__b--generic"></span>
                        <div className="ac-11__sk-actions">
                          <span className="ac-11__b ac-11__b--btn"></span>
                          <span className="ac-11__b ac-11__b--btn"></span>
                        </div>
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
                  data-grid
                >
                  {currentProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="product-card ac-11__card"
                      data-ready={!isTransitioning}
                    >
                      {/* CodeFronts Skeleton-to-Loaded Shimmer Layer */}
                      <div className="ac-11__sk" aria-hidden="true">
                        <span className="ac-11__b ac-11__b--img"></span>
                        <div className="ac-11__sk-body">
                          <span className="ac-11__b ac-11__b--badge"></span>
                          <span className="ac-11__b ac-11__b--title"></span>
                          <span className="ac-11__b ac-11__b--generic"></span>
                          <div className="ac-11__sk-actions">
                            <span className="ac-11__b ac-11__b--btn"></span>
                            <span className="ac-11__b ac-11__b--btn"></span>
                          </div>
                        </div>
                      </div>

                      {/* Real Card Content - Matching User's Clean Card Design */}
                      <div className="ac-11__real">
                        <Link to={`/products/${product.id}`} className="product-img-wrapper block" title={`View formulation for ${product.name}`}>
                          <img src={product.image} alt={product.name} loading="lazy" />
                        </Link>
                        <div className="product-info">
                          <h3 className="product-card-title">
                            <Link to={`/products/${product.id}`}>
                              {product.name}
                            </Link>
                          </h3>
                          <p className="product-card-dosage">{product.dosageForm}</p>
                          <p className="product-card-generic">{product.genericName}</p>
                          
                          <Link 
                            to={`/products/${product.id}`}
                            className="product-card-cta"
                          >
                            View Formulation &rsaquo;
                          </Link>
                        </div>
                      </div>
                    </div>
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
                  <Search size={48} className="no-results-icon" />
                  <h3>No products found</h3>
                  <p>Try adjusting your search or selecting a different category filter.</p>
                  <button 
                    className="btn btn-primary mt-4"
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
