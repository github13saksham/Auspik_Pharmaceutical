import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, MapPin, Send, ShieldCheck, UploadCloud, X } from 'lucide-react';
import { careerOpenings } from '../services/careerOpenings';
import { submitCareerApplication } from '../services/careerService';
import './CareerApplication.css';

const initialApplicant = {
  fullName: '',
  email: '',
  phone: '',
  experience: '',
  currentLocation: '',
  coverNote: ''
};

export default function CareerApplication() {
  const { jobId } = useParams();
  const job = careerOpenings.find((opening) => opening.id === jobId);
  const [applicant, setApplicant] = useState(initialApplicant);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const resumeInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setApplicant((current) => ({ ...current, [name]: value }));
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] || null;
    setResumeError('');
    if (!file) {
      setResumeFile(null);
      return;
    }

    const validExtension = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!validExtension || file.size > 600 * 1024) {
      setResumeFile(null);
      setResumeError('Choose a PDF or Word document smaller than 600 KB.');
      event.target.value = '';
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!job || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await submitCareerApplication({ job, applicant, resumeFile });
      setSubmitted(true);
    } catch (error) {
      console.error('Unable to submit career application:', error);
      setErrorMessage('We could not submit your application. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <main className="career-application-page career-application-not-found">
        <div className="career-application-card">
          <p className="career-application-eyebrow">Careers at Auspik</p>
          <h1>This position is no longer available</h1>
          <p>Please return to our careers page to explore current opportunities.</p>
          <Link to="/careers" className="career-application-back-link">
            <ArrowLeft size={17} /> Back to careers
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="career-application-page">
        <section className="career-application-success" aria-live="polite">
          <span className="career-application-success-icon"><CheckCircle2 size={34} /></span>
          <p className="career-application-eyebrow">Application received</p>
          <h1>Thank you, {applicant.fullName}.</h1>
          <p>
            Your application for <strong>{job.title}</strong> has been sent to our HR team.
            A confirmation email has been queued for <strong>{applicant.email}</strong>.
          </p>
          <Link to="/careers" className="career-application-submit">
            Return to careers <ArrowLeft size={17} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="career-application-page">
      <div className="career-application-shell">
        <Link to="/careers" className="career-application-back-link">
          <ArrowLeft size={17} /> All open positions
        </Link>

        <div className="career-application-layout">
          <aside className="career-application-role-panel">
            <p className="career-application-eyebrow">Your next chapter</p>
            <h1>Make a difference with Auspik.</h1>
            <p className="career-application-role-intro">
              Tell us a little about yourself. Our team will review your application and get in touch.
            </p>

            <div className="career-application-role-card">
              <span className="career-application-role-icon"><BriefcaseBusiness size={20} /></span>
              <div>
                <span className="career-application-role-label">Applying for</span>
                <h2>{job.title}</h2>
              </div>
            </div>

            <div className="career-application-role-meta">
              <span><MapPin size={16} /> {job.location}</span>
              <span><BriefcaseBusiness size={16} /> {job.department}</span>
            </div>

            <div className="career-application-requirements">
              <h3>What you’ll bring</h3>
              <ul>
                {job.requirements.slice(0, 3).map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div className="career-application-privacy">
              <ShieldCheck size={18} />
              <span>Your details are shared only with our hiring team.</span>
            </div>
          </aside>

          <section className="career-application-form-panel">
            <div className="career-application-form-heading">
              <p className="career-application-eyebrow">Application form</p>
              <h2>Let’s get to know you</h2>
              <p>Fields marked with * are required.</p>
            </div>

            {errorMessage && (
              <div className="career-application-error" role="alert">{errorMessage}</div>
            )}

            <form className="career-application-form" onSubmit={handleSubmit}>
              <div className="career-application-fields">
                <label className="career-application-field">
                  <span>Full name *</span>
                  <input
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    maxLength={100}
                    value={applicant.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label className="career-application-field">
                  <span>Email address *</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    maxLength={254}
                    value={applicant.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="career-application-field">
                  <span>Phone number *</span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    maxLength={30}
                    value={applicant.phone}
                    onChange={handleChange}
                    placeholder="Your contact number"
                    required
                  />
                </label>

                <label className="career-application-field">
                  <span>Relevant experience *</span>
                  <input
                    type="text"
                    name="experience"
                    maxLength={80}
                    value={applicant.experience}
                    onChange={handleChange}
                    placeholder="e.g. 3 years"
                    required
                  />
                </label>

                <label className="career-application-field career-application-field-wide">
                  <span>Current city</span>
                  <input
                    type="text"
                    name="currentLocation"
                    autoComplete="address-level2"
                    maxLength={100}
                    value={applicant.currentLocation}
                    onChange={handleChange}
                    placeholder="Where are you based?"
                  />
                </label>

                <label className="career-application-field career-application-field-wide">
                  <span>Resume or CV (optional)</span>
                  <div className={`career-application-upload ${resumeFile ? 'has-file' : ''}`}>
                    <input
                      id="career-resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      ref={resumeInputRef}
                      onChange={handleResumeChange}
                    />
                    {resumeFile ? (
                      <span className="career-application-file-name">
                        <UploadCloud size={18} />
                        {resumeFile.name}
                        <button
                          type="button"
                          aria-label="Remove resume"
                          onClick={() => {
                            setResumeFile(null);
                            setResumeError('');
                            if (resumeInputRef.current) resumeInputRef.current.value = '';
                          }}
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ) : (
                      <span className="career-application-upload-prompt">
                        <UploadCloud size={19} /> Add a PDF or Word file (up to 600 KB)
                      </span>
                    )}
                  </div>
                  {resumeError && <span className="career-application-upload-error" role="alert">{resumeError}</span>}
                </label>

                <label className="career-application-field career-application-field-wide">
                  <span>Note for our hiring team</span>
                  <textarea
                    name="coverNote"
                    rows={5}
                    maxLength={1000}
                    value={applicant.coverNote}
                    onChange={handleChange}
                    placeholder="Share a little about your experience, skills, or availability."
                  />
                </label>
              </div>

              <div className="career-application-form-footer">
                <span>We’ll email a copy of your application to you.</span>
                <button type="submit" className="career-application-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Submit application'}
                  <Send size={17} />
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
