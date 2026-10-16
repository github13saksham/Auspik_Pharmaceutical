import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
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

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout settings={settings} />}>
            <Route index element={<Home settings={settings} />} />
            <Route path="products" element={<Products />} />
            <Route path="about" element={<About settings={settings} />} />
            <Route path="careers" element={<Careers />} />
            <Route path="contact" element={<Contact settings={settings} />} />
          </Route>
          
          {/* Admin Route outside Layout to avoid header/footer overlap */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
