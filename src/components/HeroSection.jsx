import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const pad = (n) => String(n).padStart(3, '0');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function HeroSection() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const loaderRef = useRef(null);
  const scrollHintRef = useRef(null);
  
  const [activeBeat, setActiveBeat] = useState(0);
  const [stepProgress, setStepProgress] = useState([0, 0, 0]);
  const [calloutsOn, setCalloutsOn] = useState([false, false, false]);
  const [calloutPositions, setCalloutPositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  const calloutMeta = [
    { v: 'up', h: 'right', x: 0.605, y: 0.37, title: 'Tested Raw Materials', desc: 'Every input is qualified before use' },
    { v: 'down', h: 'left', x: 0.725, y: 0.475, title: 'Uniform Dose', desc: 'Same strength in every unit' },
    { v: 'down', h: 'left', x: 0.885, y: 0.62, title: 'Stable Shell', desc: 'Protects the formulation until use' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const count = 60;
    const imgs = new Array(count);
    let loaded = 0;
    let target = 0;
    let current = 0;
    let drawn = -1;
    let w = 0;
    let h = 0;
    let isDisposed = false;

    const isMobile = () => window.innerWidth <= 900;
    const getFocal = () => (isMobile() ? [0.8, 0.5] : [0.5, 0.5]);

    const load = (i) =>
      new Promise((res) => {
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => {
          imgs[i] = im;
          loaded++;
          res();
        };
        im.onerror = res;
        im.src = `/assets/capsule/${pad(i + 1)}.webp`;
      });

    function resize() {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.round(r.width * d);
      h = canvas.height = Math.round(r.height * d);
      drawn = -1;
    }

    function nearest(i) {
      for (let k = 0; k < count; k++) {
        if (imgs[i - k]) return imgs[i - k];
        if (imgs[i + k]) return imgs[i + k];
      }
      return null;
    }

    function geom(img) {
      const f = getFocal();
      const s = Math.max(w / img.width, h / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      return { s, dx: (w - dw) * f[0], dy: (h - dh) * f[1], dw, dh };
    }

    function draw(force = false) {
      const i = Math.round(current);
      if (i === drawn && !force) return;
      const img = nearest(i);
      if (!img || !w) return;
      const g = geom(img);
      ctx.drawImage(img, g.dx, g.dy, g.dw, g.dh);
      drawn = i;
    }

    function project(x, y) {
      const img = imgs[0];
      if (!img) return null;
      const d = Math.min(window.devicePixelRatio || 1, 2);
      const g = geom(img);
      return { x: (g.dx + x * g.dw) / d, y: (g.dy + y * g.dh) / d };
    }

    function updateCallouts() {
      const pos = calloutMeta.map((c) => {
        const p = project(c.x, c.y);
        return p ? { x: p.x, y: p.y } : { x: 0, y: 0 };
      });
      setCalloutPositions(pos);
    }

    async function init() {
      resize();
      await load(0);
      draw(true);
      if (loaderRef.current) {
        loaderRef.current.classList.add('done');
      }
      updateCallouts();

      // Progressive load remaining frames
      const order = [];
      for (let s = 4; s >= 1; s = s >> 1) {
        for (let i = 0; i < count; i += s) {
          if (!order.includes(i)) order.push(i);
        }
      }
      for (let k = 0; k < order.length; k += 6) {
        if (isDisposed) break;
        await Promise.all(order.slice(k, k + 6).filter((i) => !imgs[i]).map(load));
      }
      drawn = -1;
    }

    init();

    let animId;
    function loop() {
      current += (target - current) * 0.22;
      if (Math.abs(target - current) < 0.01) current = target;
      draw();
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);

    function onScroll() {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      const hp = clamp(-r.top / (r.height - window.innerHeight));
      target = hp * (count - 1);

      const beat = hp < 0.34 ? 0 : hp < 0.67 ? 1 : 2;
      setActiveBeat(beat);

      setStepProgress([
        clamp(hp * 3),
        clamp((hp - 1 / 3) * 3),
        clamp((hp - 2 / 3) * 3),
      ]);

      setCalloutsOn([
        hp > 0.8,
        hp > 0.85,
        hp > 0.9,
      ]);

      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = hp > 0.04 ? 0 : 1;
      }
    }

    function onResize() {
      resize();
      draw(true);
      updateCallouts();
      onScroll();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const waitTimer = setInterval(() => {
      if (project(0, 0)) {
        updateCallouts();
        clearInterval(waitTimer);
      }
    }, 150);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearInterval(waitTimer);
    };
  }, []);

  return (
    <section className="hero hero-capsule-section" id="hero" ref={heroRef} aria-label="Introduction">
      <div className="hero-stage">
        <canvas id="capsuleCanvas" ref={canvasRef} aria-hidden="true" />
        <div className="hero-veil" />
        <div className="loader" id="loader" ref={loaderRef}>
          <img src="/assets/mark.png" alt="" />
        </div>

        {/* 3 Interactive Callouts pointing to capsule features */}
        {calloutMeta.map((c, i) => (
          <div
            key={i}
            className={`callout ${calloutsOn[i] ? 'on' : ''}`}
            data-v={c.v}
            data-h={c.h}
            style={{
              left: `${calloutPositions[i].x}px`,
              top: `${calloutPositions[i].y}px`,
            }}
          >
            <span className="dot" />
            <span className="rule" />
            <span className="tag">
              <b>{c.title}</b>
              {c.desc}
            </span>
          </div>
        ))}

        {/* 3 Narrative Beats synchronized to scroll position */}
        <div className="hero-copy">
          <div className="wrap">
            <div className={`beat ${activeBeat === 0 ? 'on' : ''}`} data-beat="0">
              <p className="eyebrow">Pharmaceutical manufacturer in Karnal, Haryana</p>
              <h1 className="h-display">Advancing Healthcare With Precision &amp; Quality</h1>
              <p className="lede">
                Syrups, tablets, capsules, softgels and creams for distributors, wholesalers and healthcare providers across India. High quality medicines, delivered in less time.
              </p>
              <div className="actions">
                <Link className="btn btn-primary" to="/products">Browse products</Link>
                
              </div>
              <div className="hero-meta">
                <div><strong>4.4 / 5</strong>Verified buyer rating</div>
                <div><strong>5</strong>Dosage forms</div>
                <div><strong>HSIIDC</strong>Sector-3, Karnal</div>
              </div>
            </div>

            <div className={`beat ${activeBeat === 1 ? 'on' : ''}`} data-beat="1">
              <p className="eyebrow">Our mission</p>
              <h2 className="h-display">Accessible, Affordable, Uncompromising</h2>
              <p className="lede">
                We make healthcare accessible and affordable while keeping excellence in every part of our operations. Continuous research, superior raw materials and modern technology go into what we make for providers and patients.
              </p>
            </div>

            <div className={`beat ${activeBeat === 2 ? 'on' : ''}`} data-beat="2">
              <p className="eyebrow">Inside every dose</p>
              <h2 className="h-display">Quality Starts Where You Can't See It</h2>
              <p className="lede">
                Each formulation is built to meet national and international standards, so what reaches your shelf performs the way it should.
              </p>
              <div className="actions">
                <Link className="btn btn-primary" to="/products">Explore formulations</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-hint" id="scrollHint" ref={scrollHintRef}>
          <span className="mouse" />
          Scroll to open the capsule
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="hero-progress" aria-hidden="true">
          <div className={`hp-step ${activeBeat >= 0 ? 'on' : ''}`}>
            <div className="hp-bar">
              <i style={{ width: `${stepProgress[0] * 100}%` }} />
            </div>
            Precision
          </div>
          <div className={`hp-step ${activeBeat >= 1 ? 'on' : ''}`}>
            <div className="hp-bar">
              <i style={{ width: `${stepProgress[1] * 100}%` }} />
            </div>
            Mission
          </div>
          <div className={`hp-step ${activeBeat >= 2 ? 'on' : ''}`}>
            <div className="hp-bar">
              <i style={{ width: `${stepProgress[2] * 100}%` }} />
            </div>
            Inside the dose
          </div>
        </div>
      </div>
    </section>
  );
}
