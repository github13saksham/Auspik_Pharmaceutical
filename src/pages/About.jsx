import { ShieldCheck, Globe, Building, Users, Award, FlaskConical, CheckCircle2 } from 'lucide-react';
import './About.css';

export default function About({ settings }) {
  const companyName = settings?.companyName || 'Ausptik Pharmaceuticals';

  return (
    <div className="about-page">
      {/* Hero Header Section with High Res Image & White Text */}
      <div className="page-header about-header">
        <div className="container">
          <h1>About {companyName}</h1>
          <p>Committed to providing world-class pharmaceutical products & formulations worldwide.</p>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text animate-fade-in">
              <h2  style={{marginBottom: '20px'}}>WELLNESS THE AUSPICIOUS WAY.</h2>
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

      {/* Core Values */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-title">
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
          <div className="about-grid reverse">
            <div className="about-text">
              <h2>The Road Ahead</h2>
              <p>
                Through a thoughtfully curated portfolio, an evolving presence across therapeutic segments, and a relentless pursuit of quality, we are shaping Auspik to be agile in its thinking, uncompromising in its standards, and purposeful in its impact.
              </p>
              <p className="mt-3">
                We regard our relationships as the cornerstone of our journey. Healthcare professionals, channel partners, associates, and customers are not merely participants in our ecosystem; they are custodians of the trust upon which our growth is built.
              </p>
              <p className="mt-3">
                We envision an Auspik that transcends conventional boundaries—where innovation is purposeful, partnerships are enduring, and excellence is not an aspiration but an ethos.
              </p>
              
              <div className="mt-4 p-4" style={{ backgroundColor: 'var(--bg-color)', borderRadius: '12px', borderLeft: '4px solid var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>This is more than a relaunch. It is the beginning of a new legacy.</strong>
                <div className="mt-3">
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
