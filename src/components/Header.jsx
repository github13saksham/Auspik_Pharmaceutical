import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, Award, Activity, ArrowRight } from 'lucide-react';
import companyLogo from '../assets/Project_images/Pharma_Company_logo.jpeg';
import './Header.css';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Header({ settings }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const phoneNum = settings?.phone || '8222844644, 8053022283';
  const emailAddr = settings?.email || 'auspikpharma@gmail.com';
  const companyName = settings?.companyName || 'Auspik Pharmaceuticals Pvt. Ltd.';
  const firstPhoneNum = phoneNum.split(',')[0].trim();

  return (
    <header className="header-wrapper">
      {/* Top Announcement & Info Bar */}
      <div className="top-bar">
        <div className="container top-bar-container">
          <div className="top-bar-left">
            <a href={`mailto:${emailAddr}`} className="top-bar-item link">
              <Mail size={14} />
              <span>{emailAddr}</span>
            </a>
          </div>
          <div className="top-bar-right">
            
            <a href={`tel:${firstPhoneNum}`} className="top-bar-item link font-semibold">
              <Phone size={14} />
              <span>{phoneNum}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`main-header ${isScrolled ? 'scrolled glass' : ''}`}>
        <div className="container header-container">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <img src={companyLogo} alt="Company Logo" className="header-logo-img" style={{ height: '55px', objectFit: 'contain' }} />
          </Link>

          <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/products" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMenu}>
              Products & Formulations
            </NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMenu}>
              About Us
            </NavLink>
            <NavLink to="/careers" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMenu}>
              Careers
            </NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMenu}>
              Contact Us
            </NavLink>
            {isAdminLoggedIn && (
              <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-item admin-tag' : 'nav-item admin-tag'} onClick={closeMenu}>
                Portal Admin
              </NavLink>
            )}
          </div>

          <div className="header-actions">
            <Link to="/contact" className="btn btn-primary nav-cta">
              <span>Quick Inquiry</span>
              <ArrowRight size={16} />
            </Link>
            <button className="mobile-toggle-btn" onClick={toggleMenu} aria-label="Toggle menu">
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Page Reading Progress Indicator */}
      <div className="reading-progress-track" aria-hidden="true">
        <div 
          className="reading-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}
