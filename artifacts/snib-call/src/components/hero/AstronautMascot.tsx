import { motion, MotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AstronautMascotProps {
  springX?: MotionValue<number>;
  springY?: MotionValue<number>;
  scale?: number;
}

export default function AstronautMascot({ scale = 1 }: AstronautMascotProps) {
  const [blinkOpacity, setBlinkOpacity] = useState(0.9);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkOpacity(0.7);
      setTimeout(() => setBlinkOpacity(0.9), 100);
    }, Math.random() * 4000 + 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <motion.div
      className="relative z-10 w-[420px] h-[420px] mx-auto origin-center flex items-center justify-center"
      style={{ scale }}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
    >
      <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="suitGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          
          <linearGradient id="visorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(108, 125, 255, 0.9)" />
            <stop offset="40%" stopColor="rgba(154, 107, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(5, 8, 22, 0.9)" />
          </linearGradient>

          <linearGradient id="lensflare" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="30%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Body */}
        <motion.g 
          animate={{ scaleX: [1, 1.015, 1] }} 
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        >
          <path d="M120,200 C120,160 280,160 280,200 C300,280 260,340 200,340 C140,340 100,280 120,200 Z" fill="url(#suitGradient)" />
          
          {/* Accent details */}
          <path d="M160,220 L240,220 L230,260 L170,260 Z" fill="#6C7DFF" opacity="0.8" rx="8" />
          
          {/* SNIB Patch */}
          <rect x="150" y="210" width="36" height="14" rx="4" fill="#050816" />
          <text x="168" y="220" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">SNIB</text>
        </motion.g>

        {/* Left Arm & Glove */}
        <motion.g animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }} style={{ transformOrigin: "120px 200px" }}>
          <path d="M120,200 C90,210 70,240 80,270" fill="none" stroke="url(#suitGradient)" strokeWidth="30" strokeLinecap="round" />
          <circle cx="80" cy="270" r="18" fill="#6C7DFF" />
          <circle cx="80" cy="270" r="14" fill="#ffffff" opacity="0.9" />
        </motion.g>

        {/* Right Arm & Glove */}
        <motion.g animate={{ rotate: [2, -2, 2] }} transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }} style={{ transformOrigin: "280px 200px" }}>
          <path d="M280,200 C310,210 330,240 320,270" fill="none" stroke="url(#suitGradient)" strokeWidth="30" strokeLinecap="round" />
          <circle cx="320" cy="270" r="18" fill="#6C7DFF" />
          <circle cx="320" cy="270" r="14" fill="#ffffff" opacity="0.9" />
        </motion.g>

        {/* Helmet */}
        <g>
          {/* Helmet Base */}
          <circle cx="200" cy="140" r="70" fill="url(#suitGradient)" />
          <circle cx="200" cy="140" r="72" fill="none" stroke="#6C7DFF" strokeWidth="4" opacity="0.5" />
          
          {/* Visor */}
          <motion.g animate={{ opacity: blinkOpacity }}>
            <path d="M145,130 C145,100 255,100 255,130 C260,170 230,195 200,195 C170,195 140,170 145,130 Z" fill="url(#visorGradient)" />
            {/* Lens flare */}
            <path d="M150,130 C150,110 210,110 210,130 C210,150 180,165 170,165 C160,165 150,150 150,130 Z" fill="url(#lensflare)" />
          </motion.g>
        </g>

        {/* Antenna */}
        <g>
          <line x1="200" y1="70" x2="200" y2="40" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <motion.circle 
            cx="200" cy="40" r="6" fill="#5EF2D6" 
            filter="url(#glow)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      </svg>
    </motion.div>
  );
}
