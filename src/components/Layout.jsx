import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppWidget from './WhatsAppWidget';
import CookieConsent from './CookieConsent';
import WelcomeModal from './WelcomeModal';

export default function Layout({ settings }) {
  const location = useLocation();

  useEffect(() => {
    // Global scroll reveal observer for all sections across whole website
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Give DOM a moment to mount the route components
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll(
        'section:not(.hero-section):not(.sticky-vision-screen):not(.black-slide-layer), .section:not(.hero-section):not(.sticky-vision-screen):not(.black-slide-layer), .page-header, .products-page .section'
      );

      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Only elements genuinely in the top initial fold remain immediately visible
        if (rect.top < window.innerHeight * 0.45) {
          el.classList.add('scroll-in-view');
        } else {
          el.classList.add('scroll-fade-target');
          observer.observe(el);
        }
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <Header settings={settings} />
      <main style={{ minHeight: 'calc(100vh - 350px)', paddingTop: '92px' }}>
        <Outlet />
      </main>
      <WhatsAppWidget phone={settings?.phone} />
      <CookieConsent />
      <WelcomeModal />
      <Footer settings={settings} />
    </div>
  );
}
