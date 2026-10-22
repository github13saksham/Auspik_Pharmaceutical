import { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppWidget from './WhatsAppWidget';
import CookieConsent from './CookieConsent';
import WelcomeModal from './WelcomeModal';
import WebsiteSkeleton from './WebsiteSkeleton';

export default function Layout({ settings }) {
  const location = useLocation();
  const [isPageReady, setIsPageReady] = useState(false);
  // Track visited routes so skeleton shows ONLY ONCE per page
  const visitedRoutes = useRef(new Set());

  useEffect(() => {
    const currentPath = location.pathname;

    if (!visitedRoutes.current.has(currentPath)) {
      // First time visiting this page: show skeleton first, content stays hidden
      setIsPageReady(false);
      visitedRoutes.current.add(currentPath);

      const skeletonTimer = setTimeout(() => {
        setIsPageReady(true);
      }, 950);

      return () => clearTimeout(skeletonTimer);
    } else {
      // Page has already been visited: show immediately without re-triggering skeleton
      setIsPageReady(true);
    }
  }, [location.pathname]);

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
      {/* Global Website Skeleton Preloader Crossfade */}
      <WebsiteSkeleton isLoaded={isPageReady} />

      {/* Actual Website Content: Completely HIDDEN until skeleton crossfade activates */}
      <div 
        className="website-real-content"
        style={{
          opacity: isPageReady ? 1 : 0,
          visibility: isPageReady ? 'visible' : 'hidden',
          transition: 'opacity 0.4s ease-in',
          pointerEvents: isPageReady ? 'auto' : 'none'
        }}
      >
        <Header settings={settings} />
        <main style={{ minHeight: 'calc(100vh - 350px)', paddingTop: '92px' }}>
          <Outlet />
        </main>
        <WhatsAppWidget phone={settings?.phone} />
        <CookieConsent />
        <WelcomeModal isReady={isPageReady} />
        <Footer settings={settings} />
      </div>
    </div>
  );
}
