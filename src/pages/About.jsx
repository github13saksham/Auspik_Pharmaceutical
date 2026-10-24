import { useState, useEffect } from 'react';
import { ShieldCheck, Globe, Building, Users, Award, FlaskConical, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import './About.css';

export default function About({ settings }) {
  const companyName = settings?.companyName || 'Auspik Pharmaceuticals';

  const founders = [
    {
      id: 1,
      name: 'Anand Mohan',
      role: 'Managing Director & Founder',
      creds: 'Formulation Science & Quality Governance',
      img: '/anand-mohan.jpg'
    },
    {
      id: 2,
      name: 'Lalit Arora',
      role: 'Managing Director & Founder',
      creds: 'Operations, Supply Chain & Alliances',
      img: '/lalit-arora.jpg'
    }
  ];

  const [activeFounder, setActiveFounder] = useState(0);

  // Auto-slide for mobile/tablet carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFounder((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Header Section with High Res Image & White Text */}
      <div className="page-header about-header text-center">
        <div className="container">
          <h1>About {companyName}</h1>
          <p>Committed to providing world-class pharmaceutical products & formulations worldwide.</p>
        </div>
      </div>

      {/* Mission & Purpose Section */}
      <section className="section about-intro-section">
        <div className="container">
          <div className="section-title text-center">
            <h2>Wellness the Auspicious Way</h2>
            <p>A new paradigm of pharmaceutical enterprise founded upon intellectual rigour and progressive thinking.</p>
          </div>

          <div className="about-grid">
            <div className="about-text animate-fade-in">
              <p>
                <strong>Auspik Pharmaceuticals Pvt. Ltd.</strong> stands at the threshold of a new era in healthcare—one shaped by ambition, guided by purpose, and anchored in an unwavering commitment to excellence.
              </p>
              <p className="mt-3">
                As we embark upon our relaunch, we are not merely renewing a brand; we are ushering in a new paradigm of pharmaceutical enterprise—one founded upon intellectual rigour, progressive thinking, and an enduring belief in the transformative power of healthcare.
              </p>
              <p className="mt-3">
                We are building a pharmaceutical enterprise where experience meets ambition, heritage meets innovation, and relationships evolve into enduring partnerships.
              </p>
              <p className="mt-3">
                Our aspiration extends beyond the creation of medicines. We seek to cultivate a distinguished healthcare institution—one that anticipates evolving needs, embraces emerging possibilities, and translates scientific and commercial opportunity into meaningful value.
              </p>
            </div>
            <div className="about-image animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <img 
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80" 
                alt="Pharmaceutical R&D Laboratory" 
                className="rounded-image shadow" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="section founders-section">
        <div className="container">
          <div className="section-title text-center">
            <h2>Founders & Leadership</h2>
            <p className="founders-subheading">Steering Auspik Pharmaceuticals toward global excellence in formulation science and compassionate healthcare.</p>
          </div>

          {/* Founders Grid on Desktop / Slider on Mobile & Tablet */}
          <div className="founders-desktop-grid">
            {founders.map((founder) => (
              <div className="founder-card-item" key={`desktop-${founder.id}`}>
                <div className="founder-photo-wrapper">
                  <img 
                    src={founder.img} 
                    alt={founder.name} 
                    className="founder-photo-img"
                    loading="lazy"
                  />
                </div>
                <div className="founder-meta">
                  <h3 className="founder-person-name">{founder.name}</h3>
                  <span className="founder-person-role">{founder.role}</span>
                  <p className="founder-person-creds">{founder.creds}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Founders Auto-Slider on Mobile & Tablet view only */}
          <div className="founders-mobile-slider-container">
            <div className="founders-slider-viewport">
              <div 
                className="founders-slider-track" 
                style={{ transform: `translateX(-${activeFounder * 100}%)` }}
              >
                {founders.map((founder) => (
                  <div className="founder-slide-item" key={`slide-${founder.id}`}>
                    <div className="founder-photo-wrapper">
                      <img 
                        src={founder.img} 
                        alt={founder.name} 
                        className="founder-photo-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="founder-meta">
                      <h3 className="founder-person-name">{founder.name}</h3>
                      <span className="founder-person-role">{founder.role}</span>
                      <p className="founder-person-creds">{founder.creds}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls & Dots */}
            <div className="founders-slider-controls">
              <button 
                type="button"
                className="founder-arrow-btn" 
                onClick={() => setActiveFounder((prev) => (prev === 0 ? 1 : 0))}
                aria-label="Previous Founder"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="founders-dots">
                {founders.map((_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    type="button"
                    className={`founder-dot ${activeFounder === idx ? 'active' : ''}`}
                    onClick={() => setActiveFounder(idx)}
                    aria-label={`Slide to founder ${idx + 1}`}
                  />
                ))}
              </div>
              <button 
                type="button"
                className="founder-arrow-btn" 
                onClick={() => setActiveFounder((prev) => (prev === 0 ? 1 : 0))}
                aria-label="Next Founder"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Common Shared Description under both Founders */}
          <div className="founders-shared-description text-center">
            <p>
              At Auspik Pharmaceuticals, our vision extends beyond the manufacturing of medicines. Guided by intellectual rigour, progressive thinking, and an unwavering commitment to human well-being, we have built an enterprise where experience meets ambition and heritage meets modern healthcare innovation. Every therapeutic formulation is crafted to the most stringent international quality benchmarks, fostering enduring partnerships and delivering accessible, life-enhancing wellness across communities.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-title text-center">
            <h2>Our Core Values</h2>
            <p>Guided by principles of integrity, quality, and scientific rigor.</p>
          </div>
          <div className="grid-3">
            <div className="value-card">
              <div className="value-icon">
                <ShieldCheck size={32} />
              </div>
              <h3>Quality First</h3>
              <p>We adhere to the highest international standards in manufacturing, ensuring every tablet, capsule, and syrup is safe, pure, and potent.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FlaskConical size={32} />
              </div>
              <h3>R&D Innovation</h3>
              <p>Continuous investment in research and formulation science to bring advanced therapeutic solutions to market.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Users size={32} />
              </div>
              <h3>Partner Centric</h3>
              <p>We empower our distribution partners with exclusive rights, marketing support, and reliable logistics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Road Ahead / Legacy Section */}
      <section className="section">
        <div className="container">
          <div className="section-title text-center">
            <h2>The Road Ahead</h2>
            <p>Shaping Auspik to be agile in its thinking, uncompromising in its standards, and purposeful in its impact.</p>
          </div>

          <div className="about-grid reverse">
            <div className="about-text">
              <p>
                Through a thoughtfully curated portfolio, an evolving presence across therapeutic segments, and a relentless pursuit of quality, we are shaping Auspik to be agile in its thinking, uncompromising in its standards, and purposeful in its impact.
              </p>
              <p className="mt-3">
                We regard our relationships as the cornerstone of our journey. Healthcare professionals, channel partners, associates, and customers are not merely participants in our ecosystem; they are custodians of the trust upon which our growth is built.
              </p>
              <p className="mt-3">
                We envision an Auspik that transcends conventional boundaries—where innovation is purposeful, partnerships are enduring, and excellence is not an aspiration but an ethos.
              </p>
              
              <div className="mt-4 p-4 text-center legacy-banner" style={{ backgroundColor: 'var(--bg-color)', borderRadius: '16px', border: '1px solid var(--border-color)', borderTop: '4px solid var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                  This is more than a relaunch. It is the beginning of a new legacy.
                </strong>
                <div>
                  <span style={{ display: 'block', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px', fontSize: '1.05rem' }}>AUSPIK PHARMACEUTICALS</span>
                  <span style={{ display: 'block', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '1.5px', marginTop: '0.2rem' }}>WELLNESS THE AUSPICIOUS WAY.</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80" 
                alt="High Quality Medicines Formulation Facility" 
                className="rounded-image shadow" 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
