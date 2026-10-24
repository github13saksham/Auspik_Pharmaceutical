import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Users, HeartHandshake, Tag, Search, TrendingUp,
  Building2, Zap, Mail
} from 'lucide-react';
import './Careers.css';
import { careerOpenings } from '../services/careerOpenings';

export default function Careers() {
  const [searchFilter, setSearchFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const [activePerkIndex, setActivePerkIndex] = useState(0);

  const careerPerks = [
    {
      id: 'salary',
      tag: 'Compensation',
      title: 'Competitive Salary',
      subtitle: 'Attractive Compensation Package',
      shortText: 'We value talent and reward performance with competitive salaries, timely payments, and performance incentives.',
      icon: Tag,
      accentColor: '#2563eb',
      accentBg: '#eff6ff',
      highlights: ['Bi-annual performance bonuses', 'Timely scheduled salary disbursement', 'Transparent growth appraisal ladder']
    },
    {
      id: 'growth',
      tag: 'Advancement',
      title: 'Career Growth',
      subtitle: 'Continuous Learning',
      shortText: 'Build a rewarding trajectory with continuous learning, skill enhancement, and promotions across departments.',
      icon: TrendingUp,
      accentColor: '#059669',
      accentBg: '#ecfdf5',
      highlights: ['Specialized formulation training', 'Cross-departmental transition pathways', 'Mentorship from industry pioneers']
    },
    {
      id: 'culture',
      tag: 'Culture',
      title: 'Positive Work Environment',
      subtitle: 'Supportive Culture',
      shortText: 'Work alongside dedicated pharma leaders in a supportive, team-oriented culture that empowers collaboration.',
      icon: Users,
      accentColor: '#7c3aed',
      accentBg: '#f5f3ff',
      highlights: ['Zero-politics collaborative mindset', 'Cleanroom-first safety standards', 'Open-door management approach']
    },
    {
      id: 'benefits',
      tag: 'Well-being',
      title: 'Employee Benefits',
      subtitle: 'Recognition & Well-being',
      shortText: 'Enjoy employee-friendly policies, health coverage, recognition programs, and a work culture that genuinely values you.',
      icon: HeartHandshake,
      accentColor: '#e11d48',
      accentBg: '#fff1f2',
      highlights: ['Comprehensive family healthcare', 'Paid leave & annual holiday breaks', 'Employee merit recognition awards']
    }
  ];

  const filteredJobs = careerOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesDept = departmentFilter === 'All' || job.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(careerOpenings.map(j => j.department))];

  return (
    <div className="careers-page">
      {/* Standard Page Header Matching About, Products, Contact */}
      <div className="page-header careers-page-header">
        <div className="container">
          <h1 className="animate-slide-up">Careers at Auspik</h1>
          <p className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Build a meaningful healthcare career with a fast-growing pharmaceutical leader delivering high quality medicines.
          </p>
        </div>
      </div>

      {/* ========================================================
      {/* ========================================================
          CAREERS HERO SECTION
          Left: Bold Title, Narrative, CTA, & Dynamic Spotlight Box
          Right: 4 Clean Interactive Perk Cards
          ======================================================== */}
      <section className="careers-hero-clean-section">
        <div className="container">
          <div className="careers-hero-split-grid">
            {/* Left Column (Shifted up with direct spotlight reveal under button) */}
            <div className="careers-hero-left">
              <h1 className="careers-headline">
                Build a Career <br />
                <span className="careers-headline-accent">You'll Love</span>
              </h1>
              <p className="careers-lead-text">
                At Auspik Pharmaceuticals, we believe our people are our greatest asset. We are committed to creating a workplace that fosters growth, innovation, and excellence. Join our team and become a part of a fast-growing pharmaceutical organization dedicated to delivering high quality medicines that improve lives.
              </p>

              <div className="careers-action-group">
                <div className="careers-action-top-row">
                  <a href="#openings" className="btn btn-primary careers-explore-btn">
                    <span>Explore Open Positions</span>
                    <ArrowRight size={18} />
                  </a>
                  <div className="careers-facility-meta">
                    <Building2 size={16} />
                    <span>Facility: HSIIDC, Sector-3, Karnal, Haryana</span>
                  </div>
                </div>

                {/* Spotlight Box on the Left Under Button Area */}
                <div 
                  className="studio-spotlight-drawer"
                  style={{
                    '--accent': careerPerks[activePerkIndex].accentColor,
                    '--accent-bg': careerPerks[activePerkIndex].accentBg
                  }}
                >
                  <div className="drawer-header">
                    <div className="drawer-icon-wrap">
                      <Zap size={16} />
                    </div>
                    <div>
                      <span className="drawer-eyebrow">SPOTLIGHT ADVANTAGE</span>
                      <h4 className="drawer-title">{careerPerks[activePerkIndex].title} Insights</h4>
                    </div>
                  </div>

                  <div className="drawer-pills-list">
                    {careerPerks[activePerkIndex].highlights.map((item, hIdx) => (
                      <div key={hIdx} className="drawer-pill-item">
                        <CheckCircle2 size={15} className="drawer-check-icon" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive 2x2 Clean Perk Cards (No badges, no extra subheadings) */}
            <div className="careers-interactive-studio">
              <div className="studio-tiles-quad">
                {careerPerks.map((perk, idx) => {
                  const Icon = perk.icon;
                  const isSelected = activePerkIndex === idx;

                  return (
                    <div
                      key={perk.id}
                      className={`studio-perk-card ${isSelected ? 'is-active-perk' : ''}`}
                      onClick={() => setActivePerkIndex(idx)}
                      style={{
                        '--accent': perk.accentColor,
                        '--accent-bg': perk.accentBg
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActivePerkIndex(idx);
                        }
                      }}
                    >
                      <div className="studio-card-top">
                        <div className="studio-icon-bubble">
                          <Icon size={20} />
                        </div>
                      </div>

                      <h3 className="studio-card-title">{perk.title}</h3>
                      <p className="studio-card-desc">{perk.shortText}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          JOB OPENINGS LIST
          ======================================================== */}
      <section className="careers-openings-section" id="openings">
        <div className="container">
          <div className="careers-openings-header">
            <div>
              <h2 className="openings-section-title">Current Openings</h2>
              <p className="openings-section-desc">Explore active roles at our Karnal facility and apply directly.</p>
            </div>
            <span className="openings-count-badge">{filteredJobs.length} Positions Available</span>
          </div>

          {/* Clean Search & Category Filter */}
          <div className="openings-controls-row">
            <div className="openings-search-input">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search job title..." 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>

            <div className="openings-dept-filter">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  className={`dept-filter-btn ${departmentFilter === dept ? 'active' : ''}`}
                  onClick={() => setDepartmentFilter(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Rows Matching User Requirements */}
          <div className="openings-clean-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="opening-row-item">
                  <div className="opening-info">
                    <h3 className="opening-title">{job.title}</h3>
                    <div className="opening-meta">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.experience}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                    <p className="opening-desc">{job.description}</p>
                  </div>
                  <div className="opening-btn-wrap">
                    <Link to={`/careers/apply/${job.id}`} className="opening-apply-btn">
                      <span>APPLY NOW</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="openings-empty-state">
                <p>No open positions match your search filter.</p>
              </div>
            )}
          </div>

          {/* Direct HR Support */}
          <div className="careers-direct-hr-box">
            <div className="direct-hr-content">
              <h3>Looking for another opportunity?</h3>
              <p>Send your curriculum vitae directly to our human resources team at Auspik Pharmaceuticals.</p>
            </div>
            <a href="mailto:auspikpharma@gmail.com?subject=Job%20Application%20-%20Auspik%20Pharmaceuticals" className="btn-direct-mail">
              <Mail size={16} />
              <span>Email CV to HR</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
