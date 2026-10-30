import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mail } from 'lucide-react';
import './Careers.css';
import { careerOpenings } from '../services/careerOpenings';
import CareersHeroSection from '../components/CareersHeroSection';

export default function Careers() {
  const [searchFilter, setSearchFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

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
          NEW INTERACTIVE CAREERS HERO SECTION
          ======================================================== */}
      <CareersHeroSection />

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
