import React, { useState, useEffect, useRef } from 'react';
import './OperationalPillars.css';

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

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ChevronIcon = ({ dir }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

export default function OperationalPillars() {
  const [activePillar, setActivePillar] = useState(null);
  const [pillarsVisible, setPillarsVisible] = useState(false);
  const pillarsRef = useRef(null);

  // Entrance stagger animation when the section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPillarsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (pillarsRef.current) observer.observe(pillarsRef.current);
    return () => observer.disconnect();
  }, []);

  const activeIndex = strengthBoxes.findIndex((b) => b.id === activePillar);
  const activeItem = activeIndex >= 0 ? strengthBoxes[activeIndex] : null;

  const step = (delta) => {
    const next = (activeIndex + delta + strengthBoxes.length) % strengthBoxes.length;
    setActivePillar(strengthBoxes[next].id);
  };

  const handlePillarClick = (id) => {
    // Tapping on the strip or arrow opens the card
    setActivePillar(id);
  };

  return (
    <section
      ref={pillarsRef}
      className={`section operational-strengths-section ${pillarsVisible ? 'pillars-in-view' : ''}`}
      aria-label="Our Operational Pillars & Strengths"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-title text-center">
          <span className="section-eyebrow dark-eyebrow">GUIDING VALUES</span>
          <h2>Our Operational Pillars &amp; Strengths</h2>
          <p>Dedicated to excellence through people, partnerships, and accessible affordability.</p>
        </div>

        <div className={`pillars-strips-wrapper ${activeItem ? 'has-active-pillar' : ''}`}>
          {/* 3 wide strips → collapse into number-only buttons when one is open */}
          <div className="pillars-strips-list">
            {strengthBoxes.map((box, idx) => {
              const isExpanded = activePillar === box.id;
              return (
                <div
                  key={box.id}
                  className={`pillar-strip-item ${isExpanded ? 'is-expanded' : ''}`}
                  style={{ '--strip-index': idx }}
                  onClick={() => handlePillarClick(box.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePillarClick(box.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                  aria-label={`Pillar ${box.number}: ${box.title}`}
                  title={box.title}
                >
                  <div className="strip-collapsed-bar">
                    <div className="strip-left-meta">
                      <span className="strip-number">{box.number}</span>
                      <span className="strip-bar-divider" />
                      <div className="strip-text">
                        <span className="strip-title">{box.title}</span>
                        <span className="strip-hint">{box.highlight}</span>
                      </div>
                    </div>
                    <div 
                      className="strip-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePillarClick(box.id);
                      }}
                      title="Open pillar details"
                    >
                      <ArrowIcon />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded detail card */}
          {activeItem && (
            <div
              key={activeItem.id}
              className="pillar-expanded-card"
              role="region"
              aria-live="polite"
              aria-label={`Details for ${activeItem.title}`}
            >
              <button
                type="button"
                className="pillar-card-close"
                onClick={() => setActivePillar(null)}
                aria-label="Close and show all pillars"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <div className="pillar-card-content">
                <div className="pillar-card-top">
                  <span className="pillar-card-number">{activeItem.number}</span>
                  {activeItem.highlight && (
                    <span className="pillar-card-badge">{activeItem.highlight}</span>
                  )}
                </div>
                <h3 className="pillar-card-title">{activeItem.title}</h3>
                <p className="pillar-card-desc">{activeItem.description}</p>

                <div className="pillar-card-footer">
                  <span className="pillar-card-counter">
                    {activeItem.number} / {String(strengthBoxes.length).padStart(2, '0')}
                  </span>
                  <button type="button" className="pillar-card-nav" onClick={() => step(-1)} aria-label="Previous pillar">
                    <ChevronIcon dir="left" />
                  </button>
                  <button type="button" className="pillar-card-nav" onClick={() => step(1)} aria-label="Next pillar">
                    <ChevronIcon dir="right" />
                  </button>
                </div>
              </div>

              <div className="pillar-card-watermark" aria-hidden="true">
                {activeItem.number}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
