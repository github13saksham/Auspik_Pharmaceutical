import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Truck, FileText, ChevronRight, ChevronLeft, Info,
  Star, ThumbsUp, Sparkles, Check, HeartPulse,
  Clock, Shield, ArrowRight, UserCheck
} from 'lucide-react';
import { getProducts } from '../services/pharmaService';
import './Home.css';
import InquiryModal from '../components/InquiryModal';

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

  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const pillarsRef = useRef(null);
  const [missionVisible, setMissionVisible] = useState(false);
  const [visionVisible, setVisionVisible] = useState(false);
  const [pillarsVisible, setPillarsVisible] = useState(false);
  const [activePillar, setActivePillar] = useState(null);

  const [reviewPage, setReviewPage] = useState(0);
  const REVIEWS_PER_PAGE = 3;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === missionRef.current && entry.isIntersecting) {
          setMissionVisible(true);
        }
        if (entry.target === visionRef.current && entry.isIntersecting) {
          setVisionVisible(true);
        }
        if (entry.target === pillarsRef.current && entry.isIntersecting) {
          setPillarsVisible(true);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    if (missionRef.current) observer.observe(missionRef.current);
    if (visionRef.current) observer.observe(visionRef.current);
    if (pillarsRef.current) observer.observe(pillarsRef.current);

    return () => observer.disconnect();
  }, []);

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
          SECTION 1: HERO SECTION
          ======================================================== */}
      <section className="hero-section" aria-label="Hero Overview">
        <div className="hero-overlay"></div>
        <div className="container hero-container text-center">
          <div className="hero-text-block hero-text-centered">
            <h1 className="hero-main-title">
              Advancing Global Healthcare Through <span className="hero-highlight-text">Scientific Excellence</span>
            </h1>
            <p className="hero-subtitle">
              Dedicated to manufacturing high-quality, pharmaceutical products for global markets.
            </p>
          </div>
        </div>

        {/* Quality Standard Strip: "delivering high quality medicines in less time" */}
        <div className="hero-trust-bar-wrapper">
          <div className="container">
            <div className="hero-trust-bar">
              <div className="trust-flex">
                <div className="trust-box">
                  <HeartPulse size={22} className="trust-icon" />
                  <div>
                    <h4>High Quality Medicines</h4>
                    <p>Rigorous Testing Standards</p>
                  </div>
                </div>
                <div className="trust-box">
                  <Clock size={22} className="trust-icon" />
                  <div>
                    <h4>Delivering In Less Time</h4>
                    <p>Express Dispatch & Supply</p>
                  </div>
                </div>
                <div className="trust-box">
                  <Building2 size={22} className="trust-icon" />
                  <div>
                    <h4>HSIIDC Karnal</h4>
                    <p>State-of-the-Art Facility</p>
                  </div>
                </div>
                <div className="trust-box">
                  <Truck size={22} className="trust-icon" />
                  <div>
                    <h4>Prompt Delivery</h4>
                    <p>Pan-India Distribution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MISSION & VISION: TARGET BOARD 3D ILLUSTRATION LAYOUT
          (Matching user provided target reference:
          "What is Our Mission?" with big 3D target board above/beside,
          clean L-shaped line border, and Vision with description on right)
          ======================================================== */}
      {/* ========================================================
          MISSION & VISION: 3D DARTBOARD & BINOCULARS SHOWCASE
          (Scroll Effects:
           - Mission slides in from LEFT as you scroll
           - Vision slides/fades in from RIGHT as you scroll down
           - Binoculars interchanged: Vision Description on LEFT, Binoculars on RIGHT
           - Next dark section slides over with smooth scroll stacking effect)
          ======================================================== */}
      {/* ========================================================
          MISSION SECTION
          ======================================================== */}
      <section className="section mission-target-section" aria-label="Our Mission">
        <div className="container">
          <div 
            ref={missionRef}
            className={`mv-presentation-row mission-presentation scroll-from-left ${missionVisible ? 'in-view' : ''}`}
          >
            <div className="mv-media-col">
              <div className="mv-png-wrap">
                <img 
                  src="https://cdn3d.iconscout.com/3d/premium/thumb/target-3d-icon-download-in-png-blend-fbx-gltf-file-formats--dartboard-goal-aim-focus-management-vol-2-pack-business-icons-5588787.png?f=webp" 
                  alt="Our Mission - 3D Dartboard Target" 
                  className="mv-3d-png-img dartboard-img"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mv-content-col">
              <div className="mv-target-title-block">
                <h3 className="mv-target-headline">
                  <span className="headline-dark">What is</span>
                  <span className="headline-highlight">Our Mission?</span>
                </h3>
              </div>

              <div className="mv-target-desc-box mission-desc-box">
                <p>
                  To make healthcare accessible and affordable while maintaining excellence in every aspect of our operations. Through continuous research, superior raw materials, and cutting-edge technology, we endeavor to cater to the diverse needs of healthcare providers and patients alike.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          VISION & OPERATIONAL CURTAIN CONTAINER
          Sticky behavior is confined strictly to this container.
          When the operational section scrolls up over Vision,
          the container ends, so Vision unpins and does NOT stay
          stuck underneath any subsequent sections.
          ======================================================== */}
      <div className="vision-curtain-container">
        {/* Vision Section: Screen stays here in full view */}
        <section className="section vision-target-section sticky-vision-screen" aria-label="Our Vision">
          <div className="container">
            <div 
              ref={visionRef}
              className={`mv-presentation-row vision-presentation scroll-from-right ${visionVisible ? 'in-view' : ''}`}
            >
              {/* Description on LEFT */}
              <div className="mv-content-col">
                <div className="mv-target-title-block">
                  <h3 className="mv-target-headline">
                    <span className="headline-dark">What is</span>
                    <span className="headline-highlight-cyan">Our Vision?</span>
                  </h3>
                </div>

                <div className="mv-target-desc-box vision-desc-box">
                  <p>
                    With a state-of-the-art facility at <strong>HSIIDC, Sector-3, Karnal</strong>, and a team of seasoned professionals, our commitment is rooted in innovation, stringent quality standards, and a patient-centric approach—ensuring that every syrup, cream, and pain relief oil we deliver meets national and international standards.
                  </p>
                </div>
              </div>

              {/* Binoculars image on RIGHT */}
              <div className="mv-media-col">
                <div className="mv-png-wrap">
                  <img 
                    src="https://static.vecteezy.com/system/resources/thumbnails/039/145/613/small/binoculars-travel-3d-illustration-for-web-app-infographic-etc-png.png" 
                    alt="Our Vision - 3D Binoculars" 
                    className="mv-3d-png-img binoculars-img"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operational Section: Scrolls up over Vision */}
        <section 
          ref={pillarsRef}
          className={`section operational-strengths-section black-slide-layer ${pillarsVisible ? 'pillars-in-view' : ''}`} 
          aria-label="Our Core Pillars"
        >
          <div className="container">
            <div className="section-title text-center">
              <span className="section-eyebrow dark-eyebrow">Guiding Values</span>
              <h2>Our Operational Pillars & Strengths</h2>
              <p>Dedicated to excellence through people, partnerships, and accessible affordability.</p>
            </div>

            <div className="pillars-strips-wrapper">
              <div className="pillars-strips-list">
                {strengthBoxes.map((box, idx) => {
                  const isExpanded = activePillar === box.id;
                  return (
                    <div 
                      key={box.id} 
                      className={`pillar-strip-item ${isExpanded ? 'is-expanded' : ''}`}
                      style={{ '--strip-index': idx }}
                      onClick={() => setActivePillar(isExpanded ? null : box.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActivePillar(isExpanded ? null : box.id);
                        }
                      }}
                      aria-expanded={isExpanded}
                    >
                      {/* Bar Header */}
                      <div className="strip-collapsed-bar">
                        <div className="strip-left-meta">
                          <span className="strip-number">{box.number}</span>
                          <div className="strip-bar-divider"></div>
                          <h3 className="strip-title">{box.title}</h3>
                        </div>
                      </div>

                      {/* Expanded Rectangle Content (opened on click) */}
                      <div className="strip-expanded-panel">
                        <div className="strip-expanded-inner">
                          <p className="strip-full-desc">{box.description}</p>
                          <div className="strip-bottom-meta">
                            <span className="strip-number-watermark">{box.number}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

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
              <h3 className="director-person-name">{directors[activeDirector].name}</h3>
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

              <div className="director-controls">
                

                <div className="director-nav-arrows">
                  <button 
                    type="button"
                    className="director-arrow-btn" 
                    onClick={() => setActiveDirector(activeDirector === 0 ? 1 : 0)}
                    aria-label="Previous Director"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    type="button"
                    className="director-arrow-btn" 
                    onClick={() => setActiveDirector(activeDirector === 0 ? 1 : 0)}
                    aria-label="Next Director"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

      {/* ========================================================
          FEATURED MEDICINE FORMULATIONS (AUTO-SCROLLING SHOWCASE)
          ======================================================== */}
      <section className="section formulations-modern-section" aria-label="Featured Formulations">
        <div className="container">
          <div className="formulations-centered-header">
            <h2 className="formulations-title">Featured Medicine Formulations</h2>
            <p className="formulations-desc">
              High-bioavailability pharmaceutical syrups, creams, pain relief oils, and oral therapeutics formulated under strict quality compliance.
            </p>

            {featuredProducts.length > 0 && (
              <div className="formulations-quick-nav">
                <button
                  type="button"
                  className="card-nav-arrow-btn"
                  onClick={handlePrev}
                  aria-label="Previous product"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="card-nav-dots">
                  {featuredProducts.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`card-nav-dot ${activeProductIndex === i ? 'active' : ''}`}
                      onClick={() => slideTo(productCount + i)}
                      aria-label={`Go to product ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="card-nav-arrow-btn"
                  onClick={handleNext}
                  aria-label="Next product"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="container" aria-busy="true" aria-label="Loading featured medicines">
            <div className="featured-stage-container">
              <div className="featured-stage-track" style={{ justifyContent: 'center', gap: '1.5rem', display: 'flex' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="ref-medicine-card is-active-card" style={{ pointerEvents: 'none' }}>
                    <div className="sk-block" style={{ width: '100%', height: '220px', borderRadius: '12px 12px 0 0' }}></div>
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div className="sk-block" style={{ width: '70%', height: '22px', borderRadius: '6px' }}></div>
                      <div className="sk-block" style={{ width: '90%', height: '14px', borderRadius: '6px' }}></div>
                      <div className="sk-block" style={{ width: '50%', height: '14px', borderRadius: '6px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div 
              className="featured-stage-container"
              onMouseEnter={() => setIsHoveredFormulation(true)}
              onMouseLeave={() => setIsHoveredFormulation(false)}
            >
              <div 
                className="featured-stage-track"
                onTransitionEnd={handleTransitionEnd}
                style={{
                  transform: `translateX(calc(-${sliderIndex} * (var(--card-unit, 270px) + var(--card-gap, 32px)) - (var(--card-unit, 270px) / 2)))`,
                  transition: isTransitioning ? 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
                }}
              >
                {productCount > 0 && [0, 1, 2].flatMap((setIdx) => 
                  featuredProducts.map((item, originalIdx) => {
                    const globalIdx = setIdx * productCount + originalIdx;
                    const isActive = globalIdx === sliderIndex;

                    return (
                      <div
                        key={`product-${item.id || originalIdx}-set-${setIdx}`}
                        className={`ref-medicine-card ${isActive ? 'is-active-card' : ''}`}
                        onClick={() => slideTo(globalIdx)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            slideTo(globalIdx);
                          }
                        }}
                        role="button"
                        aria-pressed={isActive}
                        aria-label={item.name}
                      >
                        <div className="ref-card-img-box">
                          <img src={item.image} alt={item.name} loading="lazy" />
                        </div>

                        <div className="ref-card-body">
                          <h3 className="ref-card-title">{item.name}</h3>
                          <p className="ref-card-dosage">{item.dosageForm}</p>
                          <p className="ref-card-generic">
                            {item.genericName || 'Pharmaceutical Formulation Active Complex'}
                          </p>

                          <span 
                            className="ref-card-cta"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products/${item.id}`);
                            }}
                          >
                            View Formulation &rsaquo;
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="container">
              <div className="formulations-footer-nav text-center">
                <Link to="/products" className="btn btn-primary">
                  <span>Explore Full Formulations Directory</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ========================================================
          WHY US? (Points 1-3 from user image)
          ======================================================== */}
      <section className="section why-us-section" aria-label="Why Choose Auspik">
        <div className="container">
          <div className="section-title text-center">
            <span className="section-eyebrow">Our Distinct Advantage</span>
            <h2>Why Us?</h2>
            <p>Delivering reliable healthcare solutions rooted in innovation, stringent testing, and patient wellness.</p>
          </div>

          <div className="why-us-grid">
            {whyUsPoints.map((point) => (
              <div key={point.id} className="why-us-card">
                <div className="why-us-top">
                  <div className="why-us-check-icon">
                    <Check size={20} />
                  </div>
                </div>
                <h3 className="why-us-card-title">{point.title}</h3>
                <p className="why-us-card-text">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
