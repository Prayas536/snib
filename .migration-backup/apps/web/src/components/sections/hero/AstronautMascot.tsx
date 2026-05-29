import { motion, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMouseParallax } from '@/hooks/useMouseParallax';

interface AstronautMascotProps {
  scale?: number;
}

export default function AstronautMascot({ scale = 1 }: AstronautMascotProps) {
  const { springX, springY } = useMouseParallax();
  const [blinkPhase, setBlinkPhase] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  // Internal parallax — different body parts at different depths
  const headX   = useTransform(springX, [-1, 1], [-18, 18]);
  const headY   = useTransform(springY, [-1, 1], [-14, 14]);
  const torsoX  = useTransform(springX, [-1, 1], [-8,  8]);
  const torsoY  = useTransform(springY, [-1, 1], [-5,  5]);
  const armLX   = useTransform(springX, [-1, 1], [-12, 12]);
  const armRX   = useTransform(springX, [-1, 1], [12, -12]);
  const armY    = useTransform(springY, [-1, 1], [-6,  6]);
  const legsX   = useTransform(springX, [-1, 1], [-4,  4]);
  const legsY   = useTransform(springY, [-1, 1], [-2,  2]);

  // Blink effect
  useEffect(() => {
    const scheduleBlink = () => {
      const timeout = setTimeout(() => {
        setBlinkPhase(true);
        setTimeout(() => {
          setBlinkPhase(false);
          scheduleBlink();
        }, 120);
      }, Math.random() * 5000 + 2500);
      return timeout;
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(p => (p + 1) % 60);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative z-10 mx-auto origin-center flex items-center justify-center"
      style={{ scale, width: 400, height: 500 }}
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
    >
      <svg viewBox="0 0 400 500" className="w-full h-full overflow-visible" style={{ filter: 'drop-shadow(0 30px 60px rgba(108,125,255,0.25))' }}>
        <defs>
          {/* Metal sphere gradient — light from top-left */}
          <radialGradient id="metalSphere" cx="32%" cy="28%" r="68%" fx="32%" fy="28%">
            <stop offset="0%"   stopColor="#f0f4ff" />
            <stop offset="35%"  stopColor="#c8d0e8" />
            <stop offset="70%"  stopColor="#8892b8" />
            <stop offset="100%" stopColor="#3a4268" />
          </radialGradient>

          {/* Metal flat gradient — for torso/limbs */}
          <linearGradient id="metalFlat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#e8ecf8" />
            <stop offset="40%"  stopColor="#c0c8df" />
            <stop offset="100%" stopColor="#5a6388" />
          </linearGradient>

          {/* Darker metal for arms/legs side faces */}
          <linearGradient id="metalDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#b0bbd8" />
            <stop offset="100%" stopColor="#2e3660" />
          </linearGradient>

          {/* Accent panel gradient */}
          <linearGradient id="accentPanel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#8090ff" />
            <stop offset="100%" stopColor="#4a56cc" />
          </linearGradient>

          {/* Face screen background */}
          <linearGradient id="screenBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#0a0e24" />
            <stop offset="100%" stopColor="#050816" />
          </linearGradient>

          {/* Power core glow */}
          <radialGradient id="powerCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#5EF2D6" stopOpacity="1" />
            <stop offset="40%"  stopColor="#6C7DFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#050816" stopOpacity="0" />
          </radialGradient>

          {/* Eye glow */}
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#5EF2D6" />
            <stop offset="60%"  stopColor="#6C7DFF" />
            <stop offset="100%" stopColor="#050816" stopOpacity="0" />
          </radialGradient>

          {/* Shoulder sphere — glossy */}
          <radialGradient id="shoulderGrad" cx="35%" cy="28%" r="65%" fx="35%" fy="28%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="25%"  stopColor="#d8e0f8" />
            <stop offset="65%"  stopColor="#7880a8" />
            <stop offset="100%" stopColor="#2a3258" />
          </radialGradient>

          {/* Leg gradient */}
          <linearGradient id="legGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#d0d8f0" />
            <stop offset="60%"  stopColor="#9098c0" />
            <stop offset="100%" stopColor="#404870" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Strong glow filter */}
          <filter id="strongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Drop shadow */}
          <filter id="shadow">
            <feDropShadow dx="4" dy="8" stdDeviation="6" floodColor="#050816" floodOpacity="0.7" />
          </filter>

          {/* Clip for face screen */}
          <clipPath id="screenClip">
            <rect x="148" y="96" width="104" height="76" rx="10" />
          </clipPath>
        </defs>

        {/* ====== LEGS (rendered behind torso) ====== */}
        <motion.g style={{ x: legsX, y: legsY }}>
          {/* Left leg */}
          <rect x="125" y="352" width="58" height="76" rx="12" fill="url(#legGrad)" filter="url(#shadow)" />
          {/* Left leg highlight */}
          <rect x="129" y="356" width="20" height="60" rx="6" fill="rgba(255,255,255,0.12)" />
          {/* Left leg accent stripe */}
          <rect x="125" y="380" width="58" height="6" rx="2" fill="url(#accentPanel)" opacity="0.7" />
          {/* Left foot */}
          <rect x="116" y="416" width="76" height="22" rx="9" fill="url(#metalFlat)" filter="url(#shadow)" />
          <rect x="120" y="419" width="30" height="10" rx="4" fill="rgba(255,255,255,0.15)" />

          {/* Right leg */}
          <rect x="217" y="352" width="58" height="76" rx="12" fill="url(#legGrad)" filter="url(#shadow)" />
          {/* Right leg highlight */}
          <rect x="221" y="356" width="20" height="60" rx="6" fill="rgba(255,255,255,0.12)" />
          {/* Right leg accent stripe */}
          <rect x="217" y="380" width="58" height="6" rx="2" fill="url(#accentPanel)" opacity="0.7" />
          {/* Right foot */}
          <rect x="208" y="416" width="76" height="22" rx="9" fill="url(#metalFlat)" filter="url(#shadow)" />
          <rect x="212" y="419" width="30" height="10" rx="4" fill="rgba(255,255,255,0.15)" />

          {/* Knee joint spheres */}
          <circle cx="154" cy="354" r="12" fill="url(#metalSphere)" />
          <circle cx="246" cy="354" r="12" fill="url(#metalSphere)" />
        </motion.g>

        {/* ====== LEFT ARM (behind torso) ====== */}
        <motion.g
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          style={{ transformOrigin: '88px 232px', x: armLX, y: armY } as never}
        >
          {/* Upper arm */}
          <rect x="60" y="222" width="36" height="80" rx="12" fill="url(#metalFlat)" filter="url(#shadow)" />
          <rect x="63" y="226" width="14" height="64" rx="6" fill="rgba(255,255,255,0.15)" />
          {/* Elbow joint */}
          <circle cx="78" cy="314" r="18" fill="url(#metalSphere)" filter="url(#shadow)" />
          {/* Forearm */}
          <rect x="60" y="312" width="36" height="68" rx="12" fill="url(#metalDark)" filter="url(#shadow)" />
          <rect x="63" y="316" width="12" height="52" rx="5" fill="rgba(255,255,255,0.1)" />
          {/* Forearm accent */}
          <rect x="60" y="340" width="36" height="5" rx="2" fill="url(#accentPanel)" opacity="0.8" />
          {/* Hand */}
          <circle cx="78" cy="394" r="22" fill="url(#shoulderGrad)" filter="url(#shadow)" />
          <circle cx="70" cy="387" r="7" fill="rgba(255,255,255,0.3)" />
          {/* Finger nubs */}
          <rect x="64" y="410" width="10" height="12" rx="4" fill="url(#metalFlat)" />
          <rect x="77" y="412" width="10" height="12" rx="4" fill="url(#metalFlat)" />
          <rect x="90" y="410" width="10" height="12" rx="4" fill="url(#metalFlat)" />
        </motion.g>

        {/* ====== RIGHT ARM (behind torso) ====== */}
        <motion.g
          animate={{ rotate: [3, -3, 3] }}
          transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity }}
          style={{ transformOrigin: '312px 232px', x: armRX, y: armY } as never}
        >
          {/* Upper arm */}
          <rect x="304" y="222" width="36" height="80" rx="12" fill="url(#metalFlat)" filter="url(#shadow)" />
          <rect x="307" y="226" width="14" height="64" rx="6" fill="rgba(255,255,255,0.15)" />
          {/* Elbow joint */}
          <circle cx="322" cy="314" r="18" fill="url(#metalSphere)" filter="url(#shadow)" />
          {/* Forearm */}
          <rect x="304" y="312" width="36" height="68" rx="12" fill="url(#metalDark)" filter="url(#shadow)" />
          <rect x="307" y="316" width="12" height="52" rx="5" fill="rgba(255,255,255,0.1)" />
          {/* Forearm accent */}
          <rect x="304" y="340" width="36" height="5" rx="2" fill="url(#accentPanel)" opacity="0.8" />
          {/* Hand */}
          <circle cx="322" cy="394" r="22" fill="url(#shoulderGrad)" filter="url(#shadow)" />
          <circle cx="314" cy="387" r="7" fill="rgba(255,255,255,0.3)" />
          {/* Finger nubs */}
          <rect x="308" y="410" width="10" height="12" rx="4" fill="url(#metalFlat)" />
          <rect x="321" y="412" width="10" height="12" rx="4" fill="url(#metalFlat)" />
          <rect x="334" y="410" width="10" height="12" rx="4" fill="url(#metalFlat)" />
        </motion.g>

        {/* ====== TORSO ====== */}
        <motion.g
          style={{ x: torsoX, y: torsoY }}
          animate={{ scaleY: [1, 1.012, 1] }}
          transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
        >
          {/* Main body */}
          <rect x="100" y="196" width="200" height="158" rx="24" fill="url(#metalFlat)" filter="url(#shadow)" />

          {/* Body highlight stripe left */}
          <rect x="104" y="200" width="28" height="140" rx="10" fill="rgba(255,255,255,0.1)" />

          {/* Torso side panel lines */}
          <line x1="148" y1="202" x2="148" y2="350" stroke="rgba(108,125,255,0.3)" strokeWidth="1" />
          <line x1="252" y1="202" x2="252" y2="350" stroke="rgba(108,125,255,0.3)" strokeWidth="1" />

          {/* Chest inset panel */}
          <rect x="130" y="218" width="140" height="96" rx="14" fill="rgba(5,8,22,0.6)" />
          <rect x="133" y="221" width="134" height="90" rx="12" fill="rgba(108,125,255,0.06)" stroke="rgba(108,125,255,0.2)" strokeWidth="1" />

          {/* Power core */}
          <motion.g
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="200" cy="264" r="28" fill="rgba(108,125,255,0.15)" />
            <circle cx="200" cy="264" r="20" fill="url(#powerCore)" filter="url(#strongGlow)" />
            <circle cx="200" cy="264" r="10" fill="#5EF2D6" opacity="0.9" />
            <circle cx="196" cy="260" r="4" fill="rgba(255,255,255,0.6)" />
          </motion.g>

          {/* Power core ring */}
          <motion.circle
            cx="200" cy="264" r="26"
            fill="none"
            stroke="#6C7DFF"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '200px 264px' }}
          />

          {/* SNIB badge */}
          <rect x="154" y="226" width="46" height="16" rx="5" fill="#050816" stroke="rgba(108,125,255,0.4)" strokeWidth="1" />
          <text x="177" y="237" fill="#6C7DFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">SNIB</text>

          {/* Status LEDs row */}
          <motion.circle cx="214" cy="234" r="3" fill="#5EF2D6" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} />
          <motion.circle cx="222" cy="234" r="3" fill="#6C7DFF" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} />
          <motion.circle cx="230" cy="234" r="3" fill="#9A6BFF" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }} />

          {/* Bottom vent slats */}
          <rect x="130" y="322" width="140" height="22" rx="6" fill="rgba(5,8,22,0.5)" />
          {[0,1,2,3,4,5].map(i => (
            <rect key={i} x={136 + i * 22} y="326" width="14" height="14" rx="3" fill="rgba(108,125,255,0.15)" stroke="rgba(108,125,255,0.3)" strokeWidth="0.5" />
          ))}

          {/* Waist connection to legs */}
          <rect x="118" y="346" width="164" height="16" rx="6" fill="url(#metalDark)" />
          <rect x="122" y="349" width="156" height="8" rx="3" fill="rgba(255,255,255,0.08)" />

          {/* Shoulder socket recesses */}
          <circle cx="100" cy="224" r="14" fill="rgba(5,8,22,0.5)" />
          <circle cx="300" cy="224" r="14" fill="rgba(5,8,22,0.5)" />
        </motion.g>

        {/* ====== SHOULDER SPHERES ====== */}
        <motion.g style={{ x: torsoX, y: torsoY }}>
          <circle cx="100" cy="224" r="26" fill="url(#shoulderGrad)" filter="url(#shadow)" />
          <circle cx="92" cy="216" r="8" fill="rgba(255,255,255,0.4)" />
          <circle cx="300" cy="224" r="26" fill="url(#shoulderGrad)" filter="url(#shadow)" />
          <circle cx="292" cy="216" r="8" fill="rgba(255,255,255,0.4)" />
        </motion.g>

        {/* ====== NECK ====== */}
        <motion.g style={{ x: headX, y: headY }}>
          <rect x="178" y="170" width="44" height="30" rx="8" fill="url(#metalDark)" />
          <rect x="182" y="174" width="16" height="22" rx="4" fill="rgba(255,255,255,0.1)" />
          {/* Neck rings */}
          <rect x="178" y="176" width="44" height="4" rx="2" fill="rgba(108,125,255,0.3)" />
          <rect x="178" y="185" width="44" height="4" rx="2" fill="rgba(108,125,255,0.2)" />
          <rect x="178" y="194" width="44" height="4" rx="2" fill="rgba(108,125,255,0.15)" />
        </motion.g>

        {/* ====== HEAD ====== */}
        <motion.g style={{ x: headX, y: headY }}>
          {/* Head shell outer */}
          <rect x="126" y="56" width="148" height="120" rx="24" fill="url(#metalFlat)" filter="url(#shadow)" />

          {/* Head highlight — top-left specular */}
          <rect x="130" y="60" width="50" height="90" rx="14" fill="rgba(255,255,255,0.12)" />
          <rect x="134" y="64" width="24" height="50" rx="8" fill="rgba(255,255,255,0.1)" />

          {/* Head top panel */}
          <rect x="148" y="60" width="104" height="18" rx="8" fill="url(#accentPanel)" opacity="0.6" />

          {/* Side ear panels */}
          <rect x="108" y="80" width="20" height="60" rx="8" fill="url(#metalDark)" />
          <rect x="111" y="86" width="8" height="14" rx="3" fill="rgba(94,242,214,0.3)" />
          <motion.circle cx="116" cy="106" r="4" fill="#5EF2D6" filter="url(#glow)" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }} />

          <rect x="272" y="80" width="20" height="60" rx="8" fill="url(#metalDark)" />
          <rect x="281" y="86" width="8" height="14" rx="3" fill="rgba(94,242,214,0.3)" />
          <motion.circle cx="284" cy="106" r="4" fill="#5EF2D6" filter="url(#glow)" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }} />

          {/* ====== FACE SCREEN ====== */}
          <rect x="148" y="82" width="104" height="82" rx="12" fill="url(#screenBg)" />
          {/* Screen border glow */}
          <rect x="148" y="82" width="104" height="82" rx="12" fill="none" stroke="rgba(108,125,255,0.5)" strokeWidth="1.5" />
          <rect x="150" y="84" width="100" height="78" rx="11" fill="none" stroke="rgba(108,125,255,0.2)" strokeWidth="1" />

          {/* Screen glow radial */}
          <ellipse cx="200" cy="123" rx="45" ry="30" fill="rgba(108,125,255,0.08)" />

          {/* Scan line animation */}
          <clipPath id="faceClip">
            <rect x="148" y="82" width="104" height="82" rx="12" />
          </clipPath>
          <line
            x1="148" y1={82 + (scanLine % 82)}
            x2="252" y2={82 + (scanLine % 82)}
            stroke="rgba(94,242,214,0.12)"
            strokeWidth="1.5"
            clipPath="url(#faceClip)"
          />

          {/* EYES */}
          {!blinkPhase ? (
            <>
              {/* Left eye */}
              <motion.g
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                style={{ transformOrigin: '178px 118px' }}
              >
                <circle cx="178" cy="118" r="14" fill="rgba(94,242,214,0.12)" />
                <circle cx="178" cy="118" r="10" fill="url(#eyeGlow)" filter="url(#glow)" />
                <circle cx="178" cy="118" r="6"  fill="#5EF2D6" />
                <circle cx="175" cy="115" r="2.5" fill="rgba(255,255,255,0.7)" />
              </motion.g>

              {/* Right eye */}
              <motion.g
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
                style={{ transformOrigin: '222px 118px' }}
              >
                <circle cx="222" cy="118" r="14" fill="rgba(94,242,214,0.12)" />
                <circle cx="222" cy="118" r="10" fill="url(#eyeGlow)" filter="url(#glow)" />
                <circle cx="222" cy="118" r="6"  fill="#5EF2D6" />
                <circle cx="219" cy="115" r="2.5" fill="rgba(255,255,255,0.7)" />
              </motion.g>
            </>
          ) : (
            <>
              {/* Blink — horizontal line */}
              <rect x="165" y="116" width="26" height="4" rx="2" fill="#5EF2D6" filter="url(#glow)" />
              <rect x="209" y="116" width="26" height="4" rx="2" fill="#5EF2D6" filter="url(#glow)" />
            </>
          )}

          {/* Mouth — animated via scale on wrapping group */}
          <motion.g
            style={{ transformOrigin: '200px 146px' }}
            animate={{ scaleY: [1, 1.18, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M 180 140 Q 200 152 220 140"
              fill="none"
              stroke="#6C7DFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </motion.g>

          {/* Screen corner decorations */}
          <path d="M 152 86 L 158 86 L 158 92" fill="none" stroke="rgba(94,242,214,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 248 86 L 242 86 L 242 92" fill="none" stroke="rgba(94,242,214,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 152 160 L 158 160 L 158 154" fill="none" stroke="rgba(94,242,214,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 248 160 L 242 160 L 242 154" fill="none" stroke="rgba(94,242,214,0.5)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Head bottom accent */}
          <rect x="148" y="168" width="104" height="6" rx="3" fill="url(#accentPanel)" opacity="0.5" />

          {/* Head lower panel */}
          <rect x="152" y="152" width="96" height="14" rx="4" fill="rgba(5,8,22,0.5)" />
          <text x="200" y="162" fill="rgba(94,242,214,0.7)" fontSize="7" textAnchor="middle" fontFamily="monospace" letterSpacing="2">SNIB-OS v4.2</text>
        </motion.g>

        {/* ====== ANTENNA ====== */}
        <motion.g style={{ x: headX, y: headY }}>
          <line x1="200" y1="56" x2="200" y2="24" stroke="url(#metalDark)" strokeWidth="4" strokeLinecap="round" />
          <line x1="200" y1="40" x2="186" y2="30" stroke="url(#metalDark)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="185" cy="29" r="4" fill="#9A6BFF" filter="url(#glow)" />
          <motion.g
            style={{ transformOrigin: '200px 22px' }}
            animate={{ scale: [0.75, 1, 0.75], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="200" cy="22" r="8" fill="#5EF2D6" filter="url(#strongGlow)" />
          </motion.g>
          <circle cx="200" cy="22" r="4" fill="white" opacity="0.9" />
        </motion.g>

        {/* ====== AMBIENT GLOW UNDER ROBOT ====== */}
        <motion.g
          style={{ transformOrigin: '200px 445px' }}
          animate={{ scaleX: [0.94, 1.06, 0.94], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="200" cy="445" rx="90" ry="12" fill="rgba(108,125,255,0.15)" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
