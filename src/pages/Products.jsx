import { useState, useEffect } from 'react';
import { Search, Filter, Info, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { getProducts } from '../services/pharmaService';
import ProductDetailModal from '../components/ProductDetailModal';
import InquiryModal from '../components/InquiryModal';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const all = await getProducts();
      setProducts(all);
      setFilteredProducts(all);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.genericName.toLowerCase().includes(lowerTerm)
      );
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const handleInquire = (product) => {
    setSelectedProduct(product);
    setShowInquiryModal(true);
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

      <div className="container section">
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
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="modern-grid">
                {filteredProducts.map((product, idx) => (
                  <div 
                    key={product.id} 
                    className="product-card animate-fade-in-up"
                    style={{ animationDelay: `${(idx % 6) * 0.1}s` }}
                  >
                    <div className="product-img-wrapper">
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <span className="product-category-tag">{product.category}</span>
                    </div>
                    <div className="product-info">
                      <div className="product-meta-top">
                        <span className="badge-sm">{product.dosageForm}</span>
                      </div>
                      <h3>{product.name}</h3>
                      <p className="generic">{product.genericName}</p>
                      
                      <div className="product-actions mt-auto">
                        <button 
                          className="btn btn-outline flex items-center justify-center gap-2"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Info size={16} /> Details
                        </button>
                        <button 
                          className="btn btn-primary flex items-center justify-center gap-2"
                          onClick={() => handleInquire(product)}
                        >
                          <FileText size={16} /> Get Quote
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
