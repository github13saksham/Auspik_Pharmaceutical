import React, { useEffect, useRef, useState } from 'react';
import salaryBg from '../assets/pharma_careers/career_pharma_salary.jpg';
import growthBg from '../assets/pharma_careers/career_pharma_growth.jpg';
import cultureBg from '../assets/pharma_careers/career_pharma_culture.jpg';
import benefitsBg from '../assets/pharma_careers/career_pharma_benefits.jpg';

/* ---------- SVG Helper & Pixel-Exact Icons Matching Reference ---------- */
const Svg = ({ size = 22, sw = 1.9, children, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ICONS = {
  tag: (
    <>
      <path d="M3 12V4h8l10 10-8 8L3 12z" />
      <circle cx="7.5" cy="8.5" r="1.2" />
    </>
  ),
  growth: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3 20v-1.5a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4V20" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M21 20v-1.5a4 4 0 0 0-3-3.9" />
    </>
  ),
  heart: (
    <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />
  ),
  building: (
    <>
      <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
      <path d="M14 9h5a1 1 0 0 1 1 1v11M3 21h18M8 8h2M8 12h2M8 16h2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.7 2.7L16 9.5" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />
};

/* ---------- Content Data Matching Reference ---------- */
const perks = [
  {
    id: 1,
    icon: 'tag',
    tile: '#1d4fd7',
    bgImage: salaryBg,
    label: 'Competitive Salary',
    title: 'Competitive Salary',
    description: 'We value talent and reward performance with competitive salaries, timely payments, and performance incentives.',
    spotlight: {
      eyebrow: 'SPOTLIGHT ADVANTAGE',
      title: 'Competitive Salary Insights',
      points: [
        'Bi-annual performance bonuses',
        'Timely scheduled salary disbursement',
        'Transparent growth appraisal ladder'
      ]
    }
  },
  {
    id: 2,
    icon: 'growth',
    tile: '#0e9f6e',
    bgImage: growthBg,
    label: 'Career Growth',
    title: 'Career Growth',
    description: 'Build a rewarding trajectory with continuous learning, skill enhancement, and promotions across departments.',
    spotlight: {
      eyebrow: 'SPOTLIGHT ADVANTAGE',
      title: 'Career Growth Insights',
      points: [
        'Specialized formulation training',
        'Cross-departmental transition pathways',
        'Mentorship from industry pioneers'
      ]
    }
  },
  {
    id: 3,
    icon: 'users',
    tile: '#7c3aed',
    bgImage: cultureBg,
    label: 'Positive Work Environment',
    title: 'Positive Work Environment',
    description: 'Work alongside dedicated pharma leaders in a supportive, team-oriented culture that empowers collaboration.',
    spotlight: {
      eyebrow: 'SPOTLIGHT ADVANTAGE',
      title: 'Work Culture Insights',
      points: [
        'Zero-politics collaborative mindset',
        'Cleanroom-first safety standards',
        'Open-door management approach'
      ]
    }
  },
  {
    id: 4,
    icon: 'heart',
    tile: '#e11d48',
    bgImage: benefitsBg,
    label: 'Employee Benefits',
    title: 'Employee Benefits',
    description: 'Enjoy employee-friendly policies, health coverage, recognition programs, and a work culture that genuinely values you.',
    spotlight: {
      eyebrow: 'SPOTLIGHT ADVANTAGE',
      title: 'Employee Benefits Insights',
      points: [
        'Comprehensive family healthcare',
        'Paid leave & annual holiday breaks',
        'Employee merit recognition awards'
      ]
    }
  }
];

export default function CareersHeroSection() {
  const [activeId, setActiveId] = useState(1);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const active = perks.find((p) => p.id === activeId) || perks[0];

  return (
    <section
      ref={sectionRef}
      className={`careers-section ${inView ? 'careers-in-view' : ''}`}
      aria-label="Careers at Auspik Pharmaceuticals"
    >
      <div className="container">
        <div className="careers-grid">
          {/* ---------- Left: Intro Headline, Text, CTA & Meta ---------- */}
          <div className="careers-intro">
            <h2>
              Build a Career <span>You'll Love</span>
            </h2>
            <p>
              At Auspik Pharmaceuticals, we believe our people are our greatest asset. We are committed to
              creating a workplace that fosters growth, innovation, and excellence. Join our team and become a
              part of a fast-growing pharmaceutical organization dedicated to delivering high quality medicines
              that improve lives.
            </p>
            <a className="careers-cta" href="#openings">
              <span>Explore Open Positions</span>
              <Svg size={18} sw={2.2}>{ICONS.arrow}</Svg>
            </a>
            <div className="careers-facility">
              <Svg size={18} sw={1.8}>{ICONS.building}</Svg>
              <span>Facility: HSIIDC, Sector-3, Karnal, Haryana</span>
            </div>
          </div>

          {/* ---------- Right: Feature Card & Perk Selector Tiles ---------- */}
          <div className="careers-explorer">
            <div
              className="careers-feature"
              data-perk={active.id}
              role="region"
              aria-live="polite"
              aria-label={`Details for ${active.title}`}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(10, 26, 63, 0.92) 0%, rgba(10, 26, 63, 0.82) 50%, rgba(8, 20, 50, 0.94) 100%), url(${active.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Ghost watermark icon in bottom-right */}
              <div className="careers-ghost" key={`ghost-${active.id}`} aria-hidden="true">
                <Svg size={210} sw={1.2}>{ICONS[active.icon]}</Svg>
              </div>

              {/* Feature card content */}
              <div className="careers-feature-body" key={active.id}>
                <span className="careers-feature-icon">
                  <Svg size={26} sw={2}>{ICONS[active.icon]}</Svg>
                </span>
                <h3>{active.title}</h3>
                <p className="careers-feature-desc">{active.description}</p>

                {active.spotlight && (
                  <div className="careers-spotlight">
                    <div className="careers-spotlight-title">
                      <small>{active.spotlight.eyebrow}</small>
                      <strong>{active.spotlight.title}</strong>
                    </div>
                    <ul className="careers-checks">
                      {active.spotlight.points.map((pt) => (
                        <li key={pt}>
                          <Svg size={18} sw={2}>{ICONS.check}</Svg>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 4 Perk Selector Tiles */}
            <div className="careers-tiles">
              {perks.map((p) => {
                const isActive = p.id === activeId;
                return (
                  <button
                    type="button"
                    key={p.id}
                    className={`careers-tile ${isActive ? 'is-active' : ''}`}
                    style={{ '--tile': p.tile }}
                    onClick={() => setActiveId(p.id)}
                    onMouseEnter={() => setActiveId(p.id)}
                    aria-pressed={isActive}
                  >
                    <span className="careers-tile-icon">
                      <Svg size={20} sw={2}>{ICONS[p.icon]}</Svg>
                    </span>
                    <span className="careers-tile-label">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
