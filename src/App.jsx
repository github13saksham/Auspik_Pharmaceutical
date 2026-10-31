import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import CareerApplication from './pages/CareerApplication';
import Admin from './pages/Admin';

import { getSettings } from './services/pharmaService';

function AdminRedirect() {
  useEffect(() => {
    // If someone visits /admin on the main site, redirect to the subdomain
    window.location.replace('https://admin.auspikpharmaceuticals.com');
  }, []);
  return null;
}

function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  // Check if user is accessing through the admin subdomain (admin.auspikpharmaceuticals.com or admin.localhost)
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isSubdomainAdmin = hostname.startsWith('admin.');

  // On the admin subdomain, ONLY serve the Admin Portal at root
  if (isSubdomainAdmin) {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }

  // On the main public website (auspikpharmaceuticals.com):
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout settings={settings} />}>
            <Route index element={<Home settings={settings} />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="about" element={<About settings={settings} />} />
            <Route path="careers" element={<Careers />} />
            <Route path="careers/apply/:jobId" element={<CareerApplication />} />
            <Route path="contact" element={<Contact settings={settings} />} />
          </Route>

          {/* /admin is removed from the main site and redirects directly to the admin subdomain */}
          <Route path="/admin" element={<AdminRedirect />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;