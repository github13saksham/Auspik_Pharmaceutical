import React, { useEffect, useRef, useState } from 'react';
import './MissionVision.css';

/* ---------- Old 3D Visual Illustrations (Retained as requested) ---------- */
const TargetArt = () => (
  <img
    src="https://cdn3d.iconscout.com/3d/premium/thumb/target-3d-icon-download-in-png-blend-fbx-gltf-file-formats--dartboard-goal-aim-focus-management-vol-2-pack-business-icons-5588787.png?f=webp"
    alt="Our Mission - 3D Dartboard Target"
    className="mv-old-art dartboard-art"
    loading="lazy"
  />
);

const BinocularsArt = () => (
  <img
    src="https://static.vecteezy.com/system/resources/thumbnails/039/145/613/small/binoculars-travel-3d-illustration-for-web-app-infographic-etc-png.png"
    alt="Our Vision - 3D Binoculars"
    className="mv-old-art binoculars-art"
    loading="lazy"
  />
);

/* depth layer: floating capsules and crosses */
const Capsule = ({ w, h }) => (
  <svg width={w} height={h} viewBox="0 0 72 28" aria-hidden="true">
    <rect className="shell" width="72" height="28" rx="14" />
    <path className="half" d="M14 0H36V28H14A14 14 0 0 1 14 0Z" />
  </svg>
);

const Cross = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 20 20" aria-hidden="true">
    <path className="cross" d="M10 3v14M3 10h14" />
  </svg>
);

const decor = [
  { key: 'c1', style: { left: '9%',  top: '12%', '--d': 34, '--r': '-24deg', '--delay': '0s'   }, node: <Capsule w={72} h={28} /> },
  { key: 'c2', style: { right: '8%', top: '20%', '--d': -26, '--r': '18deg',  '--delay': '1.2s' }, node: <Capsule w={54} h={21} /> },
  { key: 'c3', style: { left: '12%', bottom: '14%', '--d': -40, '--r': '-50deg', '--delay': '2.1s' }, node: <Capsule w={62} h={24} /> },
  { key: 'c4', style: { right: '11%', bottom: '12%', '--d': 22, '--r': '30deg', '--delay': '0.6s' }, node: <Capsule w={46} h={18} /> },
  { key: 'x1', style: { left: '30%', top: '8%',  '--d': 14, '--r': '0deg', '--delay': '1.6s' }, node: <Cross s={18} /> },
  { key: 'x2', style: { right: '24%', bottom: '8%', '--d': -18, '--r': '0deg', '--delay': '0.9s' }, node: <Cross s={16} /> }
];

/* ---------- Content ---------- */
const items = {
  mission: {
    label: 'Mission',
    word: 'Our Mission?',
    Art: TargetArt,
    text: (
      <>
        To make healthcare <mark>accessible and affordable</mark> while maintaining <mark>excellence</mark> in
        every aspect of our operations. Through continuous research, superior raw materials, and cutting-edge
        technology, we endeavor to cater to the diverse needs of healthcare providers and patients alike.
      </>
    )
  },
  vision: {
    label: 'Vision',
    word: 'Our Vision?',
    Art: BinocularsArt,
    text: (
      <>
        With a <mark>state-of-the-art facility</mark> at <strong>HSIIDC, Sector-3, Karnal</strong>, and a team
        of seasoned professionals, our commitment is rooted in innovation, stringent quality standards, and a{' '}
        <mark>patient-centric approach</mark>—ensuring that every syrup, cream, and pain relief oil we deliver
        meets national and international standards.
      </>
    )
  }
};

export default function MissionVision() {
  const [active, setActive] = useState('mission');
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  // Entrance animation when the section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Cursor depth: feeds --px / --py (-1…1) to the stage layers
  const handleMove = (e) => {
    const stage = e.currentTarget.querySelector('.mv-stage');
    if (!stage || !cardRef.current) return;
    const r = stage.getBoundingClientRect();
    const px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    const py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    cardRef.current.style.setProperty('--px', px.toFixed(3));
    cardRef.current.style.setProperty('--py', py.toFixed(3));
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--px', 0);
    cardRef.current.style.setProperty('--py', 0);
  };

  const current = items[active];
  const { Art } = current;

  return (
    <section
      ref={sectionRef}
      className={`section mv-section ${inView ? 'mv-in-view' : ''}`}
      aria-label="Our mission and vision"
    >
      <div className="container">
        <div
          ref={cardRef}
          className={`mv-card is-${active}`}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          {/* ---------- Left ---------- */}
          <div className="mv-left">
            <div className="mv-switch" role="group" aria-label="Choose mission or vision">
              <span className="mv-thumb" aria-hidden="true" />
              {Object.entries(items).map(([id, item]) => (
                <button
                  type="button"
                  key={id}
                  className={`mv-tab ${active === id ? 'is-on' : ''}`}
                  onClick={() => setActive(id)}
                  aria-pressed={active === id}
                >
                  <i />
                  {item.label}
                </button>
              ))}
            </div>

            {/* key remounts the copy so it re-animates on every switch */}
            <div className="mv-copy" key={active} aria-live="polite">
              <h2>
                What is <span>{current.word}</span>
              </h2>
              <p>{current.text}</p>
            </div>
          </div>

          {/* ---------- Right: stage ---------- */}
          <div className="mv-stage" aria-hidden="true">
            <div className="mv-bg" />
            <span className="mv-ring" />
            <span className="mv-disc" />

            {decor.map(({ key, style, node }) => (
              <span key={key} className="mv-cap" style={style}>
                <span>{node}</span>
              </span>
            ))}

            <div className="mv-hero" key={active}>
              <div className="mv-hero-in">
                <Art />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
