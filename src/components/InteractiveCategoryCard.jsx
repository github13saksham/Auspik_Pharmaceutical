import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './InteractiveCategoryCard.css';

// Custom modern 3D SVG Illustrations for each category
const CategoryIcons = {
  Tablets: () => (
    <svg viewBox="0 0 100 100" className="cat-svg-illustration">
      <defs>
        <linearGradient id="tabGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="tabGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="shadowTab" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1E40AF" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Background aura ring */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="#E0F2FE" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
      {/* Main 3D Tablet 1 (Oblong) */}
      <g filter="url(#shadowTab)" transform="rotate(-25 50 50)">
        <rect x="24" y="38" width="52" height="24" rx="12" fill="url(#tabGrad1)" />
        <rect x="26" y="40" width="48" height="10" rx="5" fill="#93C5FD" opacity="0.4" />
        <line x1="50" y1="38" x2="50" y2="62" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2 2" />
      </g>
      {/* Round Tablet 2 */}
      <g filter="url(#shadowTab)">
        <circle cx="68" cy="65" r="14" fill="url(#tabGrad2)" />
        <path d="M 58 65 A 10 10 0 0 1 78 65" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.5" />
        <line x1="60" y1="65" x2="76" y2="65" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      </g>
      {/* Molecule sparkles */}
      <circle cx="25" cy="25" r="3" fill="#60A5FA" />
      <circle cx="78" cy="28" r="2" fill="#3B82F6" />
      <circle cx="28" cy="72" r="2.5" fill="#93C5FD" />
    </svg>
  ),

  Capsules: () => (
    <svg viewBox="0 0 100 100" className="cat-svg-illustration">
      <defs>
        <linearGradient id="capTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="capBot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <filter id="shadowCap" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#4C1D95" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Orbital ring */}
      <ellipse cx="50" cy="50" rx="42" ry="20" fill="none" stroke="#DDD6FE" strokeWidth="2.5" transform="rotate(-30 50 50)" opacity="0.7" />
      <circle cx="20" cy="35" r="2.5" fill="#A78BFA" />
      <circle cx="80" cy="65" r="3" fill="#22D3EE" />
      {/* 3D Capsule */}
      <g filter="url(#shadowCap)" transform="rotate(35 50 50)">
        {/* Top Half */}
        <path d="M 32 20 L 68 20 A 18 18 0 0 1 68 50 L 32 50 A 18 18 0 0 1 32 20 Z" fill="url(#capTop)" />
        <path d="M 36 24 L 64 24" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* Bottom Half */}
        <path d="M 32 50 L 68 50 A 18 18 0 0 1 68 80 L 32 80 A 18 18 0 0 1 32 50 Z" fill="url(#capBot)" />
        <path d="M 36 54 L 64 54" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* Join Ring */}
        <rect x="30" y="47" width="40" height="6" rx="3" fill="#FFFFFF" opacity="0.9" />
      </g>
    </svg>
  ),

  LiquidsOrals: () => (
    <svg viewBox="0 0 100 100" className="cat-svg-illustration">
      <defs>
        <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(209,250,229,0.3)" />
        </linearGradient>
        <filter id="shadowLiq" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#047857" floodOpacity="0.2" />
        </filter>
      </defs>
      {/* Background glow circle */}
      <circle cx="50" cy="50" r="38" fill="#ECFDF5" />
      {/* Glass Bottle Body */}
      <g filter="url(#shadowLiq)">
        <path d="M 40 18 L 60 18 L 60 28 L 72 45 L 72 80 A 8 8 0 0 1 64 88 L 36 88 A 8 8 0 0 1 28 80 L 28 45 L 40 28 Z" fill="url(#glassGrad)" stroke="#10B981" strokeWidth="2" />
        {/* Bottle Cap */}
        <rect x="36" y="12" width="28" height="8" rx="2" fill="#047857" />
        {/* Liquid Inside */}
        <path d="M 30 52 C 40 48, 60 56, 70 52 L 70 80 A 6 6 0 0 1 64 86 L 36 86 A 6 6 0 0 1 30 80 Z" fill="url(#liquidGrad)" />
        {/* Rising Bubbles */}
        <circle cx="42" cy="74" r="3" fill="#A7F3D0" opacity="0.8" />
        <circle cx="56" cy="66" r="4" fill="#A7F3D0" opacity="0.9" />
        <circle cx="48" cy="58" r="2.5" fill="#ECFDF5" opacity="0.9" />
        {/* Glass highlight */}
        <path d="M 33 46 L 33 80" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      </g>
    </svg>
  ),

  EyeDrops: () => (
    <svg viewBox="0 0 100 100" className="cat-svg-illustration">
      <defs>
        <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="rippleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
        <filter id="shadowDrop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#0369A1" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Concentric ripples */}
      <ellipse cx="50" cy="72" rx="36" ry="12" fill="none" stroke="#BAE6FD" strokeWidth="2" opacity="0.5" />
      <ellipse cx="50" cy="72" rx="24" ry="8" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.7" />
      <ellipse cx="50" cy="72" rx="12" ry="4" fill="url(#rippleGrad)" opacity="0.8" />
      {/* Dropper Pipette Tip */}
      <path d="M 44 10 L 56 10 L 54 30 L 50 40 L 46 30 Z" fill="#94A3B8" />
      <rect x="42" y="8" width="16" height="4" rx="1" fill="#475569" />
      {/* Main 3D Water Droplet */}
      <g filter="url(#shadowDrop)">
        <path d="M 50 36 C 50 36, 68 58, 68 68 A 18 18 0 0 1 32 68 C 32 58, 50 36, 50 36 Z" fill="url(#dropGrad)" />
        {/* Curved shine highlight */}
        <path d="M 44 56 A 12 12 0 0 1 58 56" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <circle cx="56" cy="62" r="2" fill="#FFFFFF" opacity="0.9" />
      </g>
    </svg>
  ),

  Powders: () => (
    <svg viewBox="0 0 100 100" className="cat-svg-illustration">
      <defs>
        <linearGradient id="jarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="powderDust" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <filter id="shadowPow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#B45309" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Floating particles */}
      <circle cx="22" cy="30" r="3" fill="#FBBF24" opacity="0.8" />
      <circle cx="30" cy="22" r="2" fill="#F59E0B" opacity="0.7" />
      <circle cx="76" cy="28" r="3.5" fill="#FCD34D" opacity="0.9" />
      <circle cx="82" cy="40" r="2" fill="#FBBF24" opacity="0.6" />
      {/* Powder Jar */}
      <g filter="url(#shadowPow)">
        {/* Lid */}
        <rect x="30" y="24" width="40" height="12" rx="3" fill="#78350F" />
        <rect x="32" y="26" width="36" height="3" rx="1.5" fill="#B45309" />
        {/* Container Body */}
        <path d="M 28 36 L 72 36 L 75 80 A 6 6 0 0 1 69 86 L 31 86 A 6 6 0 0 1 25 80 Z" fill="url(#jarGrad)" />
        {/* Front Label */}
        <rect x="33" y="46" width="34" height="28" rx="4" fill="#FFFBEB" />
        <rect x="37" y="52" width="26" height="4" rx="2" fill="#D97706" />
        <rect x="41" y="60" width="18" height="3" rx="1.5" fill="#F59E0B" />
        {/* Measuring Scoop */}
        <path d="M 68 50 L 88 42 L 86 38 L 68 45 Z" fill="#92400E" />
        <ellipse cx="87" cy="40" rx="4" ry="2.5" fill="#D97706" />
      </g>
    </svg>
  ),

  Herbals: () => (
    <svg viewBox="0 0 100 100" className="cat-svg-illustration">
      <defs>
        <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <filter id="shadowHerbal" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#14532D" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Sunburst background ring */}
      <circle cx="50" cy="50" r="38" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2" strokeDasharray="8 4" />
      {/* Leaves composition */}
      <g filter="url(#shadowHerbal)">
        {/* Secondary Leaf */}
        <path d="M 30 65 C 20 40, 45 25, 65 35 C 55 60, 40 70, 30 65 Z" fill="url(#leafGrad2)" opacity="0.85" />
        {/* Main Leaf */}
        <path d="M 70 75 C 80 42, 52 18, 30 30 C 35 62, 55 82, 70 75 Z" fill="url(#leafGrad1)" />
        {/* Central Vein */}
        <path d="M 30 30 C 45 45, 58 58, 70 75" fill="none" stroke="#DCFCE7" strokeWidth="2.5" strokeLinecap="round" />
        {/* Side Veins */}
        <path d="M 40 38 C 48 38, 52 34, 52 34" fill="none" stroke="#DCFCE7" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 48 48 C 58 48, 62 43, 62 43" fill="none" stroke="#DCFCE7" strokeWidth="1.5" strokeLinecap="round" />
        {/* Dew drop */}
        <circle cx="50" cy="38" r="3" fill="#FFFFFF" opacity="0.8" />
      </g>
    </svg>
  )
};

export default function InteractiveCategoryCard({ category }) {
  const navigate = useNavigate();
  const IconComponent = CategoryIcons[category.id] || CategoryIcons.Tablets;
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    navigate(`/products?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <div 
      className={`cat-flip-container ${isFlipped ? 'flipped' : ''}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={handleClick}
    >
      <div className="cat-flip-inner">
        {/* FRONT FACE - Only the symbol & category title */}
        <div className="cat-card-face cat-card-front">
          <div className="cat-front-content">
            <div className="cat-illustration-box">
              <IconComponent />
            </div>
            <h3 className="cat-card-title">{category.name}</h3>
            <span className="cat-hover-hint">Hover to explore</span>
          </div>
        </div>

        {/* BACK FACE - Flipped view showing description with smooth fade-in motion */}
        <div className="cat-card-face cat-card-back">
          <div className="cat-back-content">
            <h3 className="cat-back-title">{category.name}</h3>
            <div className="cat-fadein-container">
              <p className="cat-card-desc cat-desc-fadein">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
