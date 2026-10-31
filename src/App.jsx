import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  // Check if user is accessing through the admin subdomain (e.g. admin.auspikpharmaceuticals.com or admin.localhost)
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isSubdomainAdmin = hostname.startsWith('admin.');

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {isSubdomainAdmin ? (
          /* When on admin.auspikpharmaceuticals.com, serve the Admin Portal exclusively at root */
          <Routes>
            <Route path="/*" element={<Admin />} />
          </Routes>
        ) : (
          /* Normal public website routes */
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
            
            {/* Direct fallback route for local development */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
