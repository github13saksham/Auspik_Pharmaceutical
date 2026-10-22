import './WebsiteSkeleton.css';

export default function WebsiteSkeleton({ isLoaded }) {
  return (
    <div 
      className={`website-skeleton-overlay ${isLoaded ? 'is-loaded' : ''}`}
      aria-hidden={isLoaded ? 'true' : 'false'}
      role="status"
      aria-label="Loading page content"
    >
      {/* Top Navigation Bar Skeleton */}
      <div className="sk-header">
        <div className="sk-block sk-header-logo"></div>
        <div className="sk-header-nav">
          <div className="sk-block sk-nav-item"></div>
          <div className="sk-block sk-nav-item"></div>
          <div className="sk-block sk-nav-item"></div>
          <div className="sk-block sk-nav-item"></div>
          <div className="sk-block sk-nav-item"></div>
        </div>
        <div className="sk-block sk-header-btn"></div>
      </div>

      {/* Main Body Skeleton */}
      <div className="sk-body-stage">
        {/* Hero Section Skeleton */}
        <div className="sk-hero">
          <div className="sk-hero-text">
            <div className="sk-block sk-pill-tag"></div>
            <div className="sk-block sk-title-line-1"></div>
            <div className="sk-block sk-title-line-2"></div>
            <div className="sk-block sk-paragraph-1"></div>
            <div className="sk-block sk-paragraph-2"></div>
            <div className="sk-hero-btns">
              <div className="sk-block sk-hero-btn"></div>
              <div className="sk-block sk-hero-btn"></div>
            </div>
          </div>
          <div className="sk-block sk-hero-img"></div>
        </div>

        {/* Content Cards Grid Skeleton */}
        <div className="sk-cards-section">
          <div className="sk-section-header">
            <div className="sk-block sk-sec-title"></div>
            <div className="sk-block sk-sec-desc"></div>
          </div>
          <div className="sk-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="sk-card">
                <div className="sk-block sk-card-img"></div>
                <div className="sk-card-info">
                  <div className="sk-block sk-card-badge"></div>
                  <div className="sk-block sk-card-title"></div>
                  <div className="sk-block sk-card-desc"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

