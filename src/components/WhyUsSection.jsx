import React, { useEffect, useRef, useState } from 'react';
import './WhyUsSection.css';

/* ---------- Small SVG helpers ---------- */
const iconProps = { fill: 'none', stroke: '#fff', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const ICONS = {
  check:   <path d="M5 12l4.5 4.5L19 7" />,
  bottle:  <path d="M10 3h4v3l2 2.5V19a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 19V8.5L10 6V3z" />,
  tube:    <><path d="M6 3.5h12V8H6z" /><path d="M8 8h8l-1 12H9L8 8z" /></>,
  drop:    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  bolt:    <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />,
  clock:   <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
  grid:    <><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>,
  truck:   <><path d="M2 6h12v10H2z" /><path d="M14 9h4l3 3v4h-7" /><circle cx="6.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></>
};

const Chip = ({ x, y, w, label, icon, delay = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className="wu-float" style={{ animationDelay: `${delay}s` }}>
      <rect width={w} height="48" rx="24" fill="#12306b" stroke="rgba(157,184,255,.38)" />
      <circle cx="24" cy="24" r="14" fill="#1d4fd7" />
      <g transform="translate(16.8 16.8) scale(.6)" {...iconProps}>{ICONS[icon]}</g>
      <text x="48" y="29.5" fill="#fff" fontSize="15" fontWeight="600">{label}</text>
    </g>
  </g>
);

/* ---------- Scenes (520 × 480 canvas) ---------- */
const QualityScene = () => (
  <svg className="wu-svg" viewBox="0 0 520 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <circle className="wu-spin" cx="260" cy="240" r="190" fill="none" stroke="rgba(157,184,255,.28)" strokeDasharray="4 12" />
    <circle cx="260" cy="240" r="150" fill="none" stroke="rgba(157,184,255,.16)" />
    <circle className="wu-spin-rev" cx="260" cy="240" r="110" fill="none" stroke="rgba(157,184,255,.4)" strokeDasharray="2 10" />
    <circle className="wu-pulse" cx="260" cy="240" r="96" fill="none" stroke="#4c7dff" strokeWidth="2" />
    <g className="wu-pop">
      <g transform="translate(260 240) scale(7.4) translate(-12 -12.4)">
        <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" fill="rgba(76,125,255,.22)" stroke="#9db8ff" strokeWidth=".4" strokeLinejoin="round" />
        <path className="wu-draw" pathLength="1" d="M8.2 12l2.7 2.7 4.9-5.4" fill="none" stroke="#fff" strokeWidth=".7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
    <Chip x={24}  y={70}  w={206} label="Rigorous testing" icon="check" />
    <Chip x={376} y={160} w={118} label="Safety"           icon="check" delay={0.8} />
    <Chip x={60}  y={390} w={130} label="Efficacy"         icon="check" delay={1.6} />
  </svg>
);

const RangeScene = () => (
  <svg className="wu-svg" viewBox="0 0 520 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g fill="none" stroke="rgba(157,184,255,.5)" strokeWidth="1.5">
      <line className="wu-flow" x1="260" y1="240" x2="99"  y2="84"  />
      <line className="wu-flow" x1="260" y1="240" x2="412" y2="114" />
      <line className="wu-flow" x1="260" y1="240" x2="248" y2="404" />
    </g>
    <circle className="wu-pulse" cx="260" cy="240" r="54" fill="none" stroke="#4c7dff" strokeWidth="2" />
    <g className="wu-pop">
      <circle cx="260" cy="240" r="54" fill="#1d4fd7" />
      <circle cx="260" cy="240" r="54" fill="none" stroke="rgba(255,255,255,.35)" />
      <g transform="translate(236 216) scale(2)" {...iconProps} strokeWidth="1.6">{ICONS.grid}</g>
    </g>
    <text x="260" y="324" textAnchor="middle" fill="#9db8ff" fontSize="14" fontWeight="600" letterSpacing=".06em">VARIOUS THERAPEUTIC NEEDS</text>
    <Chip x={40}  y={60}  w={118} label="Syrups"           icon="bottle" />
    <Chip x={350} y={90}  w={124} label="Creams"           icon="tube"   delay={0.9} />
    <Chip x={150} y={380} w={196} label="Pain Relief Oils" icon="drop"   delay={1.8} />
  </svg>
);

const ROUTE = 'M70 340 C 170 340 170 200 260 220 C 350 240 360 130 450 140';

const DeliveryScene = () => (
  <svg className="wu-svg" viewBox="0 0 520 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <path d={ROUTE} fill="none" stroke="rgba(157,184,255,.18)" strokeWidth="10" strokeLinecap="round" />
    <path className="wu-flow" d={ROUTE} fill="none" stroke="rgba(157,184,255,.7)" strokeWidth="2" strokeLinecap="round" />
    <g>
      <circle cx="70" cy="340" r="12" fill="#1d4fd7" stroke="#fff" strokeWidth="3" />
      <text x="70" y="378" textAnchor="middle" fill="#c9d6f5" fontSize="14" fontWeight="600">Auspik</text>
    </g>
    <g>
      <circle cx="450" cy="140" r="12" fill="#1d4fd7" stroke="#fff" strokeWidth="3" />
      <text x="450" y="112" textAnchor="middle" fill="#c9d6f5" fontSize="14" fontWeight="600">Clients</text>
    </g>
    <g>
      <circle r="22" fill="#1d4fd7" stroke="rgba(255,255,255,.5)" strokeWidth="2" />
      <g transform="translate(-10 -10) scale(.83)" {...iconProps} strokeWidth="1.8">{ICONS.truck}</g>
      <animateMotion dur="5s" repeatCount="indefinite" path={ROUTE} />
    </g>
    <Chip x={28}  y={56}  w={186} label="Prompt service"  icon="bolt" />
    <Chip x={338} y={262} w={130} label="Reliable"        icon="check" delay={0.9} />
    <Chip x={150} y={398} w={192} label="Timely delivery" icon="clock" delay={1.8} />
  </svg>
);

/* ---------- Content ---------- */
const reasons = [
  {
    id: 1,
    number: '01',
    title: 'Uncompromising Quality',
    description: 'Every product undergoes rigorous testing and adheres to stringent pharmaceutical quality standards to ensure safety and efficacy.',
    Scene: QualityScene
  },
  {
    id: 2,
    number: '02',
    title: 'Wide Product Range',
    description: 'From pharmaceutical syrups to creams and pain relief oils, we offer a comprehensive portfolio to address various therapeutic needs.',
    Scene: RangeScene
  },
  {
    id: 3,
    number: '03',
    title: 'Timely Delivery',
    description: 'We understand the importance of prompt service, which is why we ensure reliable and timely delivery to all our clients.',
    Scene: DeliveryScene
  }
];

export default function WhyUsSection() {
  const [activeId, setActiveId] = useState(1);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

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

  // When the progress bar finishes, move to the next reason.
  // (Hovering the section pauses it — see the CSS.)
  const handleProgressEnd = (e) => {
    if (e.animationName !== 'wuFill') return;
    setActiveId((id) => (id % reasons.length) + 1);
  };

  const active = reasons.find((r) => r.id === activeId) || reasons[0];
  const { Scene } = active;

  return (
    <section
      ref={sectionRef}
      className={`section why-us-section ${inView ? 'why-in-view' : ''}`}
      aria-label="Why choose us"
    >
      <div className="container">
        <div className="section-title text-center">
          <span className="section-eyebrow">OUR DISTINCT ADVANTAGE</span>
          <h2>Why Us?</h2>
          <p>Delivering reliable healthcare solutions rooted in innovation, stringent testing, and patient wellness.</p>
        </div>

        <div className="wu-stage">
          <div className="wu-list">
            {reasons.map((r) => {
              const isActive = r.id === activeId;
              return (
                <button
                  type="button"
                  key={r.id}
                  className={`wu-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveId(r.id)}
                  onMouseEnter={() => setActiveId(r.id)}
                  onAnimationEnd={isActive ? handleProgressEnd : undefined}
                  aria-pressed={isActive}
                >
                  <span className="wu-item-head">
                    <span className="wu-num">{r.number}</span>
                    <span className="wu-item-title">{r.title}</span>
                  </span>
                  <span className="wu-item-body">
                    <span className="wu-desc">{r.description}</span>
                  </span>
                  <span className="wu-progress" aria-hidden="true"><i /></span>
                </button>
              );
            })}
          </div>

          {/* key remounts the scene so its animations replay on every switch */}
          <div className="wu-visual" aria-hidden="true">
            <div className="wu-scene" key={activeId}>
              <Scene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
