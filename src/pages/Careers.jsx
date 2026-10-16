import { useState } from 'react';
import { 
  Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, 
  Send, User, Mail, Phone, Upload, X, Shield, Users, HeartHandshake, Sparkles,
  Tag, ShoppingBag, ShoppingCart, Percent, Search
} from 'lucide-react';
import './Careers.css';

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    currentLocation: '',
    resumeName: '',
    coverNote: ''
  });

  const jobOpenings = [
    {
      id: 'accountant',
      title: 'Accountant',
      department: 'Finance & Accounts',
      location: 'Karnal, Haryana (HSIIDC Sector-3)',
      type: 'Full Time',
      experience: '2 - 5 Years',
      description: 'Responsible for managing routine ledger accounting, GST filings, TDS compliance, billing verification, bank reconciliations, and financial reporting for pharmaceutical distribution and formulations.',
      requirements: [
        'B.Com / M.Com or equivalent finance degree',
        'Strong expertise in Tally Prime, Excel (Advanced), and ERP systems',
        'Familiarity with GST, TDS, e-way bills, and pharma distributor billing cycles',
        'Detail-oriented with strict adherence to audit standards'
      ]
    },
    {
      id: 'qa-qc-executive',
      title: 'QA & QC Executive',
      department: 'Quality Assurance & Control',
      location: 'Karnal, Haryana (HSIIDC Sector-3)',
      type: 'Full Time',
      experience: '1 - 4 Years',
      description: 'Ensure unyielding compliance with high quality medicine standards, oversee batch documentation, chemical analysis testing, stability studies, and raw material/finished product sampling.',
      requirements: [
        'B.Pharm / M.Pharm / M.Sc Chemistry',
        'In-depth knowledge of quality compliance guidelines, pharmacopoeial protocols (IP/BP/USP)',
        'Hands-on experience with analytical methods, HPLC, UV-Vis spectrophotometry, and stability chambers',
        'Disciplined record keeping and CAPA documentation handling'
      ]
    },
    {
      id: 'purchase-executive',
      title: 'Purchase Executive',
      department: 'Supply Chain & Procurement',
      location: 'Karnal, Haryana (HSIIDC Sector-3)',
      type: 'Full Time',
      experience: '2 - 4 Years',
      description: 'Coordinate strategic procurement of pharmaceutical raw ingredients (APIs, excipients), primary/secondary packaging materials, bottles, vials, and carton packaging at optimal costing and lead-time.',
      requirements: [
        'Graduate in Commerce, Science, or Supply Chain Management',
        'Prior procurement background in pharmaceutical syrups, creams, or oils',
        'Sharp negotiation skills, vendor assessment capability, and purchase order tracking',
        'Proficiency in vendor audit protocols and inventory forecasting'
      ]
    },
    {
      id: 'receptionist',
      title: 'Receptionist',
      department: 'Administration & Front Desk',
      location: 'Karnal, Haryana (HSIIDC Sector-3)',
      type: 'Full Time',
      experience: '1 - 3 Years',
      description: 'Manage corporate reception operations, visitor coordination, telephonic communications, dispatch logs, and front-office executive administrative workflows.',
      requirements: [
        'Graduate with fluent communication in Hindi & English',
        'Polite, articulate verbal etiquette and pleasant professional demeanor',
        'Sound computer literacy (MS Office, Google Workspace, Email dispatch)',
        'Organized front-office visitor log maintenance and courier management'
      ]
    },
    {
      id: 'product-development',
      title: 'Product Development',
      department: 'R&D / Formulations',
      location: 'Karnal, Haryana (HSIIDC Sector-3)',
      type: 'Full Time',
      experience: '2 - 6 Years',
      description: 'Spearhead innovative new product design, formulation stabilization for syrups, creams, ointments, and pain relief oils, excipient compatibility testing, and regulatory technical dossiers.',
      requirements: [
        'M.Pharm (Pharmaceutics) / Ph.D. in Pharmaceutical Sciences',
        'Proven formulation development experience in topical creams, liquid orals, or medicated herbal oils',
        'Deep understanding of regulatory dossiers, scale-up tech transfers, and organoleptic stability',
        'Passion for patient-friendly healthcare innovations'
      ]
    },
    {
      id: 'human-resources',
      title: 'Human Resources (HR)',
      department: 'Human Resources & Talent Management',
      location: 'Karnal, Haryana (HSIIDC Sector-3)',
      type: 'Full Time',
      experience: '2 - 5 Years',
      description: 'Drive end-to-end recruitment for plant and corporate staff, employee onboarding, attendance/payroll coordination, statutory labor compliance, and positive workplace culture initiatives.',
      requirements: [
        'MBA / PGDM in Human Resource Management',
        'Demonstrated track record of hiring technical pharma talent, QA/QC, and plant staff',
        'Sound understanding of statutory compliances (PF, ESI, Factory Act)',
        'Compassionate interpersonal rapport and resolution-focused mindset'
      ]
    },
    {
      id: 'pantry-assistant',
      title: 'Pantry Assistant',
      department: 'Facility Services & Housekeeping',
      location: 'Karnal, Haryana (HSIIDC Sector-3)',
      type: 'Full Time',
      experience: '0 - 2 Years',
      description: 'Maintain corporate office pantry hygiene, provide refreshment service to executive staff and visiting delegates, and supervise pantry inventory levels.',
      requirements: [
        'Punctual, disciplined, and hygiene-conscious professional',
        'Courteous behavior and neat presentation',
        'Prior experience in office pantry, catering, or hospitality preferred',
        'Ability to maintain daily consumable logs'
      ]
    }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesDept = departmentFilter === 'All' || job.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(jobOpenings.map(j => j.department))];

  const handleOpenModal = (job) => {
    setSelectedJob(job);
    setApplicationSubmitted(false);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setApplicationSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      experience: '',
      currentLocation: '',
      resumeName: '',
      coverNote: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resumeName: e.target.files[0].name }));
    }
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setApplicationSubmitted(true);
  };

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
          CAREERS HERO SECTION (MATCHING WEBSITE THEME & SCREENSHOT REFERENCE)
          Left: Bold Title & Introduction | Right: 2x2 Minimal Tile Grid
          ======================================================== */}
      <section className="careers-hero-clean-section">
        <div className="container">
          <div className="careers-hero-split-grid">
            {/* Left Headline Column */}
            <div className="careers-hero-left">
              <h1 className="careers-headline">
                Build a Career <br />
                You'll Love
              </h1>
              <p className="careers-lead-text">
                At Auspik Pharmaceuticals, we believe our people are our greatest asset. We are committed to creating a workplace that fosters growth, innovation, and excellence. Join our team and become a part of a fast-growing pharmaceutical organization dedicated to delivering high quality medicines that improve lives.
              </p>
              <div className="careers-facility-meta">
                <span>Facility: HSIIDC, Sector-3, Karnal, Haryana</span>
              </div>
            </div>

            {/* Right 2x2 Minimal Clean Feature Cards (Reference from User Screenshot) */}
            <div className="careers-hero-tiles-grid">
              {/* Tile 1: Competitive Salary */}
              <div className="career-tile-box">
                <div className="tile-icon-header">
                  <Tag size={22} className="tile-outline-icon" />
                </div>
                <h3 className="tile-title">Competitive Salary</h3>
                <h4 className="tile-subtitle">Attractive Compensation Package</h4>
                <p className="tile-text">
                  We value talent and reward performance with competitive salaries, timely payments, and opportunities for career growth within our formulations team.
                </p>
              </div>

              {/* Tile 2: Career Growth */}
              <div className="career-tile-box">
                <div className="tile-icon-header">
                  <ShoppingBag size={22} className="tile-outline-icon" />
                </div>
                <h3 className="tile-title">Career Growth</h3>
                <h4 className="tile-subtitle">Continuous Learning</h4>
                <p className="tile-text">
                  Build a rewarding career with continuous learning, skill enhancement, and growth opportunities across multiple departments in the pharmaceutical industry.
                </p>
              </div>

              {/* Tile 3: Positive Work Environment */}
              <div className="career-tile-box">
                <div className="tile-icon-header">
                  <ShoppingCart size={22} className="tile-outline-icon" />
                </div>
                <h3 className="tile-title">Positive Work Environment</h3>
                <h4 className="tile-subtitle">Supportive Culture</h4>
                <p className="tile-text">
                  Work alongside experienced professionals in a positive and team-oriented environment that encourages innovation, collaboration, and success.
                </p>
              </div>

              {/* Tile 4: Employee Benefits */}
              <div className="career-tile-box">
                <div className="tile-icon-header">
                  <Percent size={22} className="tile-outline-icon" />
                </div>
                <h3 className="tile-title">Employee Benefits</h3>
                <h4 className="tile-subtitle">Recognition & Well-being</h4>
                <p className="tile-text">
                  Enjoy employee-friendly policies, recognition programs, professional growth opportunities, and a workplace that values your contribution.
                </p>
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
                    <button 
                      type="button" 
                      className="opening-apply-btn" 
                      onClick={() => handleOpenModal(job)}
                    >
                      <span>APPLY NOW</span>
                    </button>
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

      {/* ========================================================
          APPLICATION MODAL
          ======================================================== */}
      {selectedJob && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-container career-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Close modal">
              <X size={20} />
            </button>

            {!applicationSubmitted ? (
              <div className="career-modal-body">
                <div className="modal-header-block">
                  <h2 className="modal-job-title">{selectedJob.title}</h2>
                  <div className="modal-job-meta">
                    <span>{selectedJob.department}</span>
                    <span>•</span>
                    <span>{selectedJob.location}</span>
                    <span>•</span>
                    <span>{selectedJob.experience}</span>
                  </div>
                </div>

                <div className="job-key-requirements">
                  <h4>Role Overview & Requirements:</h4>
                  <ul>
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="req-check-icon" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <form onSubmit={handleSubmitApplication} className="career-apply-form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <div className="input-with-icon">
                        <User size={16} />
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <div className="input-with-icon">
                        <Mail size={16} />
                        <input
                          id="email"
                          type="email"
                          name="email"
                          required
                          placeholder="e.g. rahul@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <div className="input-with-icon">
                        <Phone size={16} />
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          required
                          placeholder="e.g. 98765 43210"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="experience">Relevant Experience *</label>
                      <input
                        id="experience"
                        type="text"
                        name="experience"
                        required
                        placeholder="e.g. 3.5 Years"
                        value={formData.experience}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="currentLocation">Current City / Location</label>
                    <input
                      id="currentLocation"
                      type="text"
                      name="currentLocation"
                      placeholder="e.g. Karnal, Panipat, Kurukshetra, Delhi NCR"
                      value={formData.currentLocation}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="resumeFile">Attach Resume / CV (PDF or Word)</label>
                    <div className="file-upload-box">
                      <input
                        id="resumeFile"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="file-input-hidden"
                      />
                      <label htmlFor="resumeFile" className="file-upload-label">
                        <Upload size={18} />
                        <span>{formData.resumeName || 'Click to select CV document'}</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="coverNote">Brief Note or Message</label>
                    <textarea
                      id="coverNote"
                      rows="3"
                      name="coverNote"
                      placeholder="Share a short note about your expertise and notice period..."
                      value={formData.coverNote}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="modal-actions-bar">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary submit-app-btn">
                      <span>Submit Application</span>
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="application-success-box text-center">
                <div className="success-icon-badge">
                  <CheckCircle2 size={48} />
                </div>
                <h2>Application Submitted!</h2>
                <p>
                  Thank you <strong>{formData.fullName || 'Candidate'}</strong> for applying for the position of <strong>{selectedJob.title}</strong> at Auspik Pharmaceuticals.
                </p>
                <p className="success-note">
                  Our HR team will review your qualifications and connect with you shortly.
                </p>
                <button type="button" className="btn btn-primary" onClick={handleCloseModal}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
