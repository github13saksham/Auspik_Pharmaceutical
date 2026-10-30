import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Truck, FileText, ChevronRight, ChevronLeft, Info,
  Star, ThumbsUp, Sparkles, Check, HeartPulse,
  Clock, Shield, ArrowRight, UserCheck, Play, Award, Zap
} from 'lucide-react';
import { getProducts } from '../services/pharmaService';
import './Home.css';
import InquiryModal from '../components/InquiryModal';
import HeroSection from '../components/HeroSection';
import FeaturedFormulations from '../components/FeaturedFormulations';
import WhyUsSection from '../components/WhyUsSection';
import OperationalPillars from '../components/OperationalPillars';
import MissionVision from '../components/MissionVision';

const HERO_FRAME_URLS = Object.entries(
  import.meta.glob('../assets/Capsule_motion_video_frames/*/frame_*.png', {
    eager: true,
    query: '?url',
    import: 'default',
  })
)
  .sort(([a], [b]) => {
    const frameA = Number(a.match(/frame_(\d+)\.png$/)[1]);
    const frameB = Number(b.match(/frame_(\d+)\.png$/)[1]);
    return frameA - frameB;
  })
  .map(([, url]) => url);
const MOBILE_HERO_FRAME_URLS = Object.entries(
  import.meta.glob('../assets/hero-phone-frames/frame_*.jpg', {
    eager: true,
    query: '?url',
    import: 'default',
  })
)
  .sort(([a], [b]) => {
    const frameA = Number(a.match(/frame_(\d+)\.jpg$/)[1]);
    const frameB = Number(b.match(/frame_(\d+)\.jpg$/)[1]);
    return frameA - frameB;
  })
  .map(([, url]) => url);

export default function Home({ settings }) {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHoveredFormulation, setIsHoveredFormulation] = useState(false);
  const [activeDirector, setActiveDirector] = useState(0);

  // Parallax Scroll Sequence State
  const heroSequenceRef = useRef(null);
  const heroCanvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => window.innerWidth <= 768
  );
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(1);

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 768px)');
    const updateViewport = () => setIsMobileViewport(breakpoint.matches);

    breakpoint.addEventListener('change', updateViewport);
    return () => breakpoint.removeEventListener('change', updateViewport);
  }, []);

  // Preload and render image sequence
  useEffect(() => {
    let isMounted = true;
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const isMobile = isMobileViewport;
    const frameUrls = isMobile ? MOBILE_HERO_FRAME_URLS : HERO_FRAME_URLS;
    const totalFrames = frameUrls.length;
    imagesRef.current = [];
    currentFrameRef.current = 1;
    const ctx = canvas.getContext('2d');

    const drawFrame = (img) => {
      if (!img || !img.complete || !img.naturalWidth || !canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (!w || !h) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Fill the entire canvas viewport cleanly without letterboxing black bars
      const scale = Math.max(w / iw, h / ih);
      const nw = iw * scale;
      const nh = ih * scale;

      const cx = isMobile ? (w - nw) / 2 : Math.min(0, w - nw);
      const cy = (h - nh) / 2;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, Math.round(cx), Math.round(cy), Math.round(nw), Math.round(nh));
    };

    const preloadRemainingFrames = () => {
      for (let i = 2; i <= totalFrames; i++) {
        if (imagesRef.current[i]) continue;
        const img = new Image();
        imagesRef.current[i] = img;
        img.onload = () => {
          if (!isMounted) return;
          if (currentFrameRef.current === i) {
            drawFrame(img);
          }
        };
        img.onerror = () => console.error(`Unable to load homepage hero frame ${i}.`);
        img.src = frameUrls[i - 1];
      }
    };

    const updateCanvasSize = () => {
      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      const targetW = Math.round(w * dpr);
      const targetH = Math.round(h * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const curImg = imagesRef.current[currentFrameRef.current] || imagesRef.current[1];
      if (curImg) {
        drawFrame(curImg);
      }
      preloadRemainingFrames();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initial load first frame immediately
    const firstImg = new Image();
    firstImg.src = frameUrls[0];
    firstImg.onload = () => {
      if (!isMounted) return;
      imagesRef.current[1] = firstImg;
      drawFrame(firstImg);
    };
    firstImg.onerror = () => console.error('Unable to load the first homepage hero frame.');

    // Scroll listener with requestAnimationFrame smoothing
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const section = heroSequenceRef.current;
          if (!section) {
            ticking = false;
            return;
          }
          const rect = section.getBoundingClientRect();
          const totalScroll = section.offsetHeight - window.innerHeight;
          let progress = -rect.top / Math.max(totalScroll, 1);
          progress = Math.min(Math.max(progress, 0), 1);
          setScrollProgress(progress);

          // Calculate frame index from scroll progress.
          const frameIndex = Math.min(
            totalFrames,
            Math.max(1, Math.floor(progress * (totalFrames - 1)) + 1)
          );
          currentFrameRef.current = frameIndex;

          const imgToDraw = imagesRef.current[frameIndex] || imagesRef.current[1];
          if (imgToDraw) {
            drawFrame(imgToDraw);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      isMounted = false;
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileViewport]);

  const productCount = featuredProducts.length;

  useEffect(() => {
    if (productCount > 0) {
      setSliderIndex(productCount);
    }
  }, [productCount]);

  const slideTo = (nextIdx) => {
    if (productCount === 0) return;
    setIsTransitioning(true);
    setSliderIndex(nextIdx);
    setActiveProductIndex(((nextIdx % productCount) + productCount) % productCount);
  };

  const handleNext = () => {
    slideTo(sliderIndex + 1);
  };

  const handlePrev = () => {
    slideTo(sliderIndex - 1);
  };

  const handleTransitionEnd = () => {
    if (productCount === 0) return;
    if (sliderIndex >= productCount * 2) {
      setIsTransitioning(false);
      setSliderIndex(sliderIndex - productCount);
    } else if (sliderIndex < productCount) {
      setIsTransitioning(false);
      setSliderIndex(sliderIndex + productCount);
    }
  };

  const [reviewPage, setReviewPage] = useState(0);
  const REVIEWS_PER_PAGE = 3;

  // Autoswipe for Featured Formulations (calling handleNext for smooth sliding)
  useEffect(() => {
    if (featuredProducts.length <= 1 || isHoveredFormulation) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [featuredProducts.length, isHoveredFormulation, sliderIndex]);

  // Managing Directors data
  const directors = [
    {
      id: 1,
      name: 'Anand Mohan',
      role: 'Managing Director & Founder',
      credentials: 'Leader in Pharmaceutical Formulation & Quality Governance',
      image: '/anand-mohan.jpg',
      period: 'Leadership & Formulation Science',
      statement: 'At Auspik, pharmaceutical manufacturing is our solemn commitment to human well-being. Every medicine is engineered with uncompromising precision and rigorous scientific ethics to make premium healthcare accessible across borders.',
      focus: 'Pioneering formulation excellence, strict quality benchmarks, and therapeutic syrups, creams and pain relief oils.'
    },
    {
      id: 2,
      name: 'Lalit Arora',
      role: 'Managing Director & Operations Head',
      credentials: 'Head of Operations, Supply Chain & Strategic Alliances',
      image: '/lalit-arora.jpg',
      period: 'Strategic Expansion & Supply Chain',
      statement: 'Sustainable pharmaceutical growth thrives on trust, supply-chain resilience, and empowering our distribution network. We build lasting value by ensuring seamless quality and reliability from our facility to patient.',
      focus: 'Scaling cleanroom production units, digital compliance, and expanding distribution networks.'
    }
  ];

  // Autoswipe for Managing Directors carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDirector((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const all = await getProducts();
      setFeaturedProducts(all.slice(0, 6)); // Top 6 formulations
      setLoading(false);
    };
    fetchProducts();
  }, []);



  const handleInquire = (product) => {
    setSelectedProduct(product);
    setShowInquiryModal(true);
  };

  // Why Us? (First 3 points from user image)
  const whyUsPoints = [
    {
      id: 1,
      title: 'Uncompromising Quality',
      description: 'Every product undergoes rigorous testing and adheres to stringent pharmaceutical quality standards to ensure safety and efficacy.'
    },
    {
      id: 2,
      title: 'Wide Product Range',
      description: 'From pharmaceutical syrups to creams and pain relief oils, we offer a comprehensive portfolio to address various therapeutic needs.'
    },
    {
      id: 3,
      title: 'Timely Delivery',
      description: 'We understand the importance of prompt service, which is why we ensure reliable and timely delivery to all our clients.'
    }
  ];

  // Operational Strengths (Remaining 3 points in 3 distinct boxes)
  const strengthBoxes = [
    {
      id: 1,
      number: '01',
      title: 'Experienced Team',
      description: 'Our team comprises qualified pharmacists, researchers, and industry experts who are passionate about healthcare and innovation.',
      highlight: 'Qualified Pharmacists & Researchers'
    },
    {
      id: 2,
      number: '02',
      title: 'Customer-Centric Approach',
      description: 'We prioritize the needs of our customers and build lasting relationships based on trust, transparency, and mutual growth.',
      highlight: 'Trust, Transparency & Mutual Growth'
    },
    {
      id: 3,
      number: '03',
      title: 'Affordable Solutions',
      description: 'Our competitive pricing ensures that high-quality healthcare is within reach of all sections of society.',
      highlight: 'Accessible Healthcare for Everyone'
    }
  ];

  // Authentic Ratings & Reviews (From verified buyer screenshot)
  const customerReviews = [
    {
      id: 1,
      name: 'MANAB',
      location: 'Nalbari, Assam',
      rating: 5,
      date: '05-September-26',
      product: 'Calcium K27',
      comment: 'Very dependable calcium formulation with excellent absorption. Consistent quality and fast response.'
    },
    {
      id: 2,
      name: 'Mannu Rai',
      location: 'Sirsa, Haryana',
      rating: 4,
      date: '25-April-26',
      product: 'Hydroquinone Mometasone Furoate Tretinoin Cream',
      comment: 'Effective formulation for dermatological patients. Quality packaging and genuine composition.'
    },
    {
      id: 3,
      name: 'Halima',
      location: 'New Delhi, Delhi',
      rating: 5,
      date: '21-December-25',
      product: 'AUSPIK FACELITE CREAM',
      hasQualityBadge: true,
      comment: 'Ausptik Facelite cream provides superior dermatological results. Authentic quality guaranteed.'
    },
    {
      id: 4,
      name: 'Salman',
      location: 'Haridwar, Uttarakhand',
      rating: 5,
      date: '18-December-25',
      product: 'Hydroquinone Mometasone Furoate Tretinoin Cream',
      comment: 'This tube outstanding results'
    },
    {
      id: 5,
      name: 'Animashaun Pepper Rice',
      location: 'Nigeria',
      rating: 4,
      date: '08-March-26',
      product: 'Pharmaceutical Syrups & Oils',
      comment: 'Very professional healthcare export quality and reliable delivery timelines.'
    },
    {
      id: 6,
      name: 'RAJBALA',
      location: 'Karnal, Haryana',
      rating: 5,
      date: '13-February-26',
      product: 'Allopathic Liver Tonic',
      comment: 'Great tonic for appetite and liver support. Highly effective patient feedback.'
    },
    {
      id: 7,
      name: 'Mohammad Ilyash',
      location: 'Palwal, Haryana',
      rating: 5,
      date: '23-October-25',
      product: 'Appetite Stimulant Syrup',
      comment: 'Very positive results for children and adults. Reliable syrup formulation.'
    },
    {
      id: 8,
      name: 'PUJA KHRE',
      location: 'Gwalior, Madhya Pradesh',
      rating: 5,
      date: '08-September-25',
      product: 'Pain Relief Oils & Creams',
      comment: 'Excellent pain relief action. Fast dispatch and trustworthy service.'
    },
    {
      id: 9,
      name: 'Umar',
      location: 'Raipur, Chhattisgarh',
      rating: 5,
      date: '18-August-25',
      product: 'Hydroquinone Mometasone Furoate Tretinoin Cream',
      comment: 'Very good formulation and prompt service from Auspik team.'
    }
  ];

  const ratingBreakdown = [
    { stars: '5 ★', pct: 70 },
    { stars: '4 ★', pct: 20 },
    { stars: '3 ★', pct: 0 },
    { stars: '2 ★', pct: 0 },
    { stars: '1 ★', pct: 10 }
  ];

  const totalReviewPages = Math.ceil(customerReviews.length / REVIEWS_PER_PAGE);
  const handlePrevReviews = () => {
    setReviewPage((prev) => (prev === 0 ? totalReviewPages - 1 : prev - 1));
  };
  const handleNextReviews = () => {
    setReviewPage((prev) => (prev === totalReviewPages - 1 ? 0 : prev + 1));
  };
  const visibleReviews = customerReviews.slice(
    reviewPage * REVIEWS_PER_PAGE,
    (reviewPage + 1) * REVIEWS_PER_PAGE
  );

  return (
    <div className="home-page">
      {/* ========================================================
          HERO SECTION (SCROLL-SCRUBBED CAPSULE FRAME SEQUENCE)
          ======================================================== */}
      <HeroSection />

      {/* ========================================================
          MISSION & VISION (COMPACT INTERACTIVE SHOWCASE)
          ======================================================== */}
      <MissionVision />

      {/* ========================================================
          OPERATIONAL PILLARS & STRENGTHS
          ======================================================== */}
      <OperationalPillars />

      {/* Spacer track that allows the Director section to be revealed from behind the operational layer */}
      <div className="director-reveal-track">
        {/* ========================================================
            MANAGING DIRECTORS & LEADERSHIP SHOWCASE (RESTORED)
            Positioned fixed/sticky behind the Operational section
            ======================================================== */}
        <section className="section director-section sticky-reveal-section" aria-label="Leadership & Governance">
          <div className="container">
            <div className="director-section-header text-center">
              <span className="director-subheading">Leadership & Governance</span>
              <h2 className="director-main-heading">From the Desk of Managing Directors</h2>
            </div>

          <div className="director-showcase">
            {/* Left: Director Portrait & Credentials */}
            <div className="director-profile-col">
              <div className="director-photo-wrap">
                <img 
                  key={directors[activeDirector].image}
                  src={directors[activeDirector].image} 
                  alt={directors[activeDirector].name} 
                  className="director-portrait-img"
                />
              </div>

              <div className="director-name-nav-row">
                <button 
                  type="button"
                  className="director-arrow-btn" 
                  onClick={() => setActiveDirector(activeDirector === 0 ? 1 : 0)}
                  aria-label="Previous Director"
                >
                  <ChevronLeft size={18} />
                </button>
                <h3 className="director-person-name">{directors[activeDirector].name}</h3>
                <button 
                  type="button"
                  className="director-arrow-btn" 
                  onClick={() => setActiveDirector(activeDirector === 0 ? 1 : 0)}
                  aria-label="Next Director"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <p className="director-person-role">{directors[activeDirector].role}</p>
              <span className="director-person-creds">{directors[activeDirector].credentials}</span>
            </div>

            {/* Right: Statement & Controls */}
            <div className="director-content-col">
              <p className="director-quote-text">
                "{directors[activeDirector].statement}"
              </p>

              <p className="director-focus-text">
                <strong>Focus Area:</strong> {directors[activeDirector].focus}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>

      {/* ========================================================
          FEATURED MEDICINE FORMULATIONS (AUTO-SCROLLING SHOWCASE)
          ======================================================== */}
      <FeaturedFormulations />

      {/* ========================================================
          WHY US? (Interactive Spotlight Grid with Pure White Background)
          ======================================================== */}
      <WhyUsSection />

      {/* ========================================================
          RATINGS & REVIEWS (Verified Buyer Feedback)
          ======================================================== */}
      <section className="section reviews-feedback-section" aria-label="Customer Reviews">
        <div className="container">
          <div className="section-title text-center">
            <span className="section-eyebrow">Verified Buyer Feedback</span>
            <h2>Ratings & Reviews</h2>
            <p>Read what healthcare providers, distributors, and customers say about our formulations and service.</p>
          </div>

          {/* Rating Summary Bar */}
          <div className="reviews-summary-card">
            <div className="summary-left">
              <div className="overall-score-display">
                <div className="stars-row">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={22} className="star-filled" />
                  ))}
                  <Star size={22} className="star-filled half-accent" />
                </div>
                <div className="score-numbers">
                  <span className="score-main">4.4</span>
                  <span className="score-scale">/ 5</span>
                </div>
                <span className="total-ratings-count">10 Verified Ratings</span>
              </div>
            </div>

            <div className="summary-middle">
              <div className="rating-bars-list">
                {ratingBreakdown.map((bar, idx) => (
                  <div key={idx} className="rating-bar-row">
                    <span className="bar-label">{bar.stars}</span>
                    <div className="bar-track">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${bar.pct}%` }}
                      ></div>
                    </div>
                    <span className="bar-pct">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-right">
              <div className="satisfaction-badge-box">
                <div className="user-satisfaction-header">
                  <ThumbsUp size={16} />
                  <span>User Satisfaction</span>
                </div>
                <div className="circular-meter">
                  <span className="meter-number">100%</span>
                </div>
                <span className="meter-label">Quality Approved</span>
              </div>
            </div>
          </div>

          {/* Reviews Navigation Bar */}
          <div className="reviews-carousel-bar">
            <div className="reviews-count-badge">
              <span>Showing <strong>{reviewPage * REVIEWS_PER_PAGE + 1}–{Math.min((reviewPage + 1) * REVIEWS_PER_PAGE, customerReviews.length)}</strong> of {customerReviews.length} Verified Reviews</span>
            </div>
            <div className="reviews-nav-controls">
              <button 
                type="button" 
                className="review-nav-arrow" 
                onClick={handlePrevReviews}
                aria-label="Previous Reviews"
                title="Previous Reviews"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="review-nav-dots" role="tablist" aria-label="Review page selectors">
                {[...Array(totalReviewPages)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`review-nav-dot ${i === reviewPage ? 'active' : ''}`}
                    onClick={() => setReviewPage(i)}
                    aria-label={`Go to review group ${i + 1}`}
                  />
                ))}
              </div>
              <button 
                type="button" 
                className="review-nav-arrow" 
                onClick={handleNextReviews}
                aria-label="Next Reviews"
                title="Next Reviews"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Review Cards Grid - 3 Active Items */}
          <div className="reviews-list-grid reviews-carousel-grid" key={`rev-page-${reviewPage}`}>
            {visibleReviews.map((rev) => (
              <div key={rev.id} className="customer-review-card animate-fade-in">
                <div className="rev-header">
                  <div className="rev-user-info">
                    <h4 className="rev-name">{rev.name}</h4>
                    <span className="rev-separator">|</span>
                    <span className="rev-location">{rev.location}</span>
                  </div>
                  <div className="rev-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={15} 
                        className={i < rev.rating ? "star-filled" : "star-muted"} 
                      />
                    ))}
                  </div>
                </div>

                <div className="rev-meta-line">
                  <span className="rev-date">{rev.date}</span>
                  <span className="rev-dot">•</span>
                  <span className="rev-product-label">Product Name: <strong>{rev.product}</strong></span>
                </div>

                {rev.comment && (
                  <p className="rev-comment-text">"{rev.comment}"</p>
                )}

                {rev.hasQualityBadge && (
                  <div className="rev-quality-pill">
                    <ThumbsUp size={13} />
                    <span>Quality</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
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
