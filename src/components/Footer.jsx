import { Link } from 'react-router-dom';
import { HeartPulse, Mail, Phone, MapPin } from 'lucide-react';
import companyLogo from '../assets/Project_images/Pharma_Company_logo.jpeg';
import './Footer.css';

export default function Footer({ settings }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={companyLogo} alt="Company Logo" className="footer-logo-img" style={{ height: '55px', objectFit: 'contain' }} />
            </Link>
            <p className="footer-tagline">{settings?.tagline || 'Advancing Global Healthcare'}</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Twitter">TW</a>
              <a href="#" aria-label="LinkedIn">IN</a>
              <a href="#" aria-label="Instagram">IG</a>
            </div>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-categories">
            <h3>Therapeutic Areas</h3>
            <ul>
              <li><Link to="/products?category=Cardiology">Cardiology</Link></li>
              <li><Link to="/products?category=Neurology">Neurology</Link></li>
              <li><Link to="/products?category=Gasology">Gasology</Link></li>
              <li><Link to="/products?category=Neutraceutical">Neutraceutical</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>{settings?.address || '167-B sector 3 industrial area karnal haryana 132001'}</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>{settings?.phone || '8222844644, 8053022283'}</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>{settings?.email || 'auspikpharma@gmail.com'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {settings?.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
