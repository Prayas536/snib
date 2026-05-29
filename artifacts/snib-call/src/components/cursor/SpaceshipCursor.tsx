import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/* ─── Types ─────────────────────────────────────────────────── */
interface Star { id: number; x: number; y: number; size: number; opacity: number; speed: number; color: string }
interface Particle { id: number; x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string }

const STAR_COLORS = ["#ffffff","#c8d8ff","#a0b4ff","#5EF2D6","#9A6BFF"];
const FLAME_COLORS = ["#ffffff","#fffde0","#ffe580","#ff9d2f","#5EF2D6","#6C7DFF"];

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.2,
    speed: Math.random() * 0.04 + 0.01,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  }));
}

/* ─── Particle canvas for the exhaust trail ─────────────────── */
function useParticleTrail(smoothX: ReturnType<typeof useSpring>, smoothY: ReturnType<typeof useSpring>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const particleIdRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastShipPos = useRef({ x: -200, y: -200 });
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnParticles = (x: number, y: number, angle: number, speed: number) => {
      const angleRad = (angle * Math.PI) / 180;
      const backX = Math.sin(angleRad);
      const backY = -Math.cos(angleRad);

      const count = Math.min(Math.floor(speed * 0.4) + 1, 6);

      // Left engine exhaust offset
      const leftOff = { x: -Math.cos(angleRad) * 10, y: -Math.sin(angleRad) * 10 };
      // Right engine exhaust offset
      const rightOff = { x: Math.cos(angleRad) * 10, y: Math.sin(angleRad) * 10 };
      // Center engine
      const centerOff = { x: 0, y: 0 };

      [leftOff, rightOff, centerOff].forEach((off) => {
        for (let i = 0; i < count; i++) {
          const spread = (Math.random() - 0.5) * 2.5;
          const speedFactor = (Math.random() * 0.6 + 0.4) * Math.max(speed * 0.12, 1.5);
          particlesRef.current.push({
            id: particleIdRef.current++,
            x: x + off.x + (Math.random() - 0.5) * 4,
            y: y + off.y + (Math.random() - 0.5) * 4,
            vx: backX * speedFactor + spread * 0.4,
            vy: backY * speedFactor + spread * 0.4,
            life: 1,
            maxLife: Math.random() * 0.5 + 0.3,
            size: Math.random() * 3.5 + 1.5,
            color: FLAME_COLORS[Math.floor(Math.random() * FLAME_COLORS.length)],
          });
        }
      });

      // Cap particles
      if (particlesRef.current.length > 600) {
        particlesRef.current = particlesRef.current.slice(-400);
      }
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      const cx = smoothX.get();
      const cy = smoothY.get();

      // Compute velocity
      const dx = cx - lastShipPos.current.x;
      const dy = cy - lastShipPos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      velocityRef.current = { vx: dx, vy: dy };
      if (speed > 0.5) {
        angleRef.current = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      }

      if (speed > 0.3) {
        spawnParticles(cx, cy, angleRef.current, speed);
      }
      lastShipPos.current = { x: cx, y: cy };

      // Draw particles
      const dt = 0.016;
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      for (const p of particlesRef.current) {
        p.life -= dt / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;

        const alpha = Math.max(0, p.life);
        const sz = p.size * alpha;

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 3);
        grad.addColorStop(0, p.color + "ff");
        grad.addColorStop(0.4, p.color + "99");
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha * 0.6;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + (alpha * 0.9) + ")";
        ctx.globalAlpha = 1;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [smoothX, smoothY]);

  return canvasRef;
}

/* ─── Main component ─────────────────────────────────────────── */
export default function SpaceshipCursor() {
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);

  const springConfig = { stiffness: 180, damping: 20, mass: 0.7 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [angle, setAngle]       = useState(0);
  const [speed, setSpeed]       = useState(0);
  const [stars]                 = useState(() => generateStars(120));
  const [mouseNorm, setMouseNorm] = useState({ x: 0.5, y: 0.5 });

  const lastPos   = useRef({ x: -400, y: -400 });
  const speedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useParticleTrail(smoothX, smoothY);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const spd = Math.sqrt(dx * dx + dy * dy);

      if (spd > 0.5) setAngle(Math.atan2(dy, dx) * (180 / Math.PI) + 90);

      cursorX.set(x);
      cursorY.set(y);
      lastPos.current = { x, y };
      setMouseNorm({ x: x / window.innerWidth, y: y / window.innerHeight });
      setSpeed(spd);

      if (speedTimer.current) clearTimeout(speedTimer.current);
      speedTimer.current = setTimeout(() => setSpeed(0), 80);
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (speedTimer.current) clearTimeout(speedTimer.current);
    };
  }, [cursorX, cursorY]);

  const flameScale = Math.min(speed / 12, 1);
  const isMoving   = speed > 0.5;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Particle trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9997 }}
        aria-hidden="true"
      />

      {/* Parallax starfield */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9996 }} aria-hidden="true">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            animate={{ x: (mouseNorm.x - 0.5) * star.speed * 220, y: (mouseNorm.y - 0.5) * star.speed * 220 }}
            transition={{ type: "spring", stiffness: 28, damping: 18 }}
            style={{
              left: `${star.x}%`, top: `${star.y}%`,
              width: star.size, height: star.size,
              backgroundColor: star.color, opacity: star.opacity,
              boxShadow: star.size > 1.8 ? `0 0 ${star.size * 3}px ${star.color}` : "none",
            }}
          />
        ))}
      </div>

      {/* Spaceship */}
      <motion.div
        className="fixed pointer-events-none"
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%", rotate: angle, zIndex: 9999 }}
      >
        <svg
          width="64"
          height="84"
          viewBox="0 0 64 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 0 10px rgba(108,125,255,1)) drop-shadow(0 0 24px rgba(94,242,214,0.5))" }}
          overflow="visible"
        >
          <defs>
            {/* Body gradient */}
            <linearGradient id="sc_body" x1="32" y1="2" x2="32" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#f0f4ff" />
              <stop offset="35%" stopColor="#c8d4ff" />
              <stop offset="75%" stopColor="#7080cc" />
              <stop offset="100%" stopColor="#3a44a8" />
            </linearGradient>

            {/* Wing gradient */}
            <linearGradient id="sc_wing_l" x1="16" y1="30" x2="2" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#8090e8" />
              <stop offset="100%" stopColor="#2a3490" />
            </linearGradient>
            <linearGradient id="sc_wing_r" x1="48" y1="30" x2="62" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#8090e8" />
              <stop offset="100%" stopColor="#2a3490" />
            </linearGradient>

            {/* Cockpit */}
            <radialGradient id="sc_cockpit" cx="42%" cy="30%" r="60%">
              <stop offset="0%"  stopColor="#c8e0ff" />
              <stop offset="40%" stopColor="#7090ff" />
              <stop offset="100%" stopColor="#1a1860" />
            </radialGradient>

            {/* Engine nozzle */}
            <linearGradient id="sc_nozzle" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%"  stopColor="#4a5acc" />
              <stop offset="100%" stopColor="#1a2060" />
            </linearGradient>

            {/* Flame inner — white hot */}
            <linearGradient id="sc_fl_inner" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#fffde0" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#ffe040" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ff8000" stopOpacity="0" />
            </linearGradient>

            {/* Flame mid — orange */}
            <linearGradient id="sc_fl_mid" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%"  stopColor="#ffb040" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ff5500" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff2000" stopOpacity="0" />
            </linearGradient>

            {/* Flame outer — teal/blue */}
            <linearGradient id="sc_fl_outer" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%"  stopColor="#5EF2D6" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#6C7DFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6C7DFF" stopOpacity="0" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="sc_glow" x="-60%" y="-40%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="sc_flame_glow" x="-80%" y="-20%" width="260%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── FLAMES (rendered behind ship) ─────────────── */}
          {isMoving && (
            <g filter="url(#sc_flame_glow)">
              {/* Left engine flames */}
              {/* Outer glow */}
              <motion.path
                d={`M18 60 C14 ${62 + flameScale * 28} 10 ${68 + flameScale * 36} 18 ${72 + flameScale * 44} C26 ${68 + flameScale * 36} 22 ${62 + flameScale * 28} 18 60Z`}
                fill="url(#sc_fl_outer)"
                animate={{ scaleY: [1, 1.15, 0.9, 1.08, 1], scaleX: [1, 0.9, 1.1, 0.95, 1] }}
                transition={{ duration: 0.12, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "18px 60px" }}
              />
              {/* Mid orange */}
              <motion.path
                d={`M18 60 C15 ${63 + flameScale * 18} 12 ${68 + flameScale * 26} 18 ${70 + flameScale * 32} C24 ${68 + flameScale * 26} 21 ${63 + flameScale * 18} 18 60Z`}
                fill="url(#sc_fl_mid)"
                animate={{ scaleY: [1, 1.2, 0.85, 1.1, 1], scaleX: [1, 0.85, 1.15, 0.9, 1] }}
                transition={{ duration: 0.09, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "18px 60px" }}
              />
              {/* Inner core */}
              <motion.path
                d={`M18 60 C16 ${62 + flameScale * 10} 15 ${66 + flameScale * 16} 18 ${68 + flameScale * 20} C21 ${66 + flameScale * 16} 20 ${62 + flameScale * 10} 18 60Z`}
                fill="url(#sc_fl_inner)"
                animate={{ scaleY: [1, 1.25, 0.8, 1.15, 1], scaleX: [1, 0.8, 1.2, 0.85, 1] }}
                transition={{ duration: 0.07, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "18px 60px" }}
              />

              {/* Right engine flames */}
              {/* Outer glow */}
              <motion.path
                d={`M46 60 C42 ${62 + flameScale * 28} 38 ${68 + flameScale * 36} 46 ${72 + flameScale * 44} C54 ${68 + flameScale * 36} 50 ${62 + flameScale * 28} 46 60Z`}
                fill="url(#sc_fl_outer)"
                animate={{ scaleY: [1, 1.1, 0.92, 1.12, 1], scaleX: [1, 0.92, 1.08, 0.96, 1] }}
                transition={{ duration: 0.13, repeat: Infinity, ease: "linear", delay: 0.04 }}
                style={{ transformOrigin: "46px 60px" }}
              />
              {/* Mid */}
              <motion.path
                d={`M46 60 C43 ${63 + flameScale * 18} 40 ${68 + flameScale * 26} 46 ${70 + flameScale * 32} C52 ${68 + flameScale * 26} 49 ${63 + flameScale * 18} 46 60Z`}
                fill="url(#sc_fl_mid)"
                animate={{ scaleY: [1, 1.18, 0.88, 1.08, 1], scaleX: [1, 0.88, 1.12, 0.92, 1] }}
                transition={{ duration: 0.1, repeat: Infinity, ease: "linear", delay: 0.03 }}
                style={{ transformOrigin: "46px 60px" }}
              />
              {/* Inner */}
              <motion.path
                d={`M46 60 C44 ${62 + flameScale * 10} 43 ${66 + flameScale * 16} 46 ${68 + flameScale * 20} C49 ${66 + flameScale * 16} 48 ${62 + flameScale * 10} 46 60Z`}
                fill="url(#sc_fl_inner)"
                animate={{ scaleY: [1, 1.3, 0.78, 1.18, 1], scaleX: [1, 0.78, 1.22, 0.82, 1] }}
                transition={{ duration: 0.08, repeat: Infinity, ease: "linear", delay: 0.02 }}
                style={{ transformOrigin: "46px 60px" }}
              />

              {/* Center booster flame (smaller) */}
              <motion.path
                d={`M32 58 C30 ${60 + flameScale * 14} 28 ${64 + flameScale * 20} 32 ${66 + flameScale * 24} C36 ${64 + flameScale * 20} 34 ${60 + flameScale * 14} 32 58Z`}
                fill="url(#sc_fl_inner)"
                animate={{ scaleY: [1, 1.2, 0.85, 1.1, 1], scaleX: [1, 0.85, 1.1, 0.9, 1] }}
                transition={{ duration: 0.11, repeat: Infinity, ease: "linear", delay: 0.05 }}
                style={{ transformOrigin: "32px 58px" }}
              />
            </g>
          )}

          {/* ── WINGS ─────────────────────────────────────── */}
          {/* Left wing */}
          <path d="M16 30 L2 56 L8 60 L18 52 L16 38Z" fill="url(#sc_wing_l)" />
          {/* Left wing edge accent */}
          <path d="M16 32 L4 54 L8 58Z" fill="rgba(94,242,214,0.25)" />
          {/* Left wing inner panel */}
          <path d="M16 34 L8 50 L14 48 L15 36Z" fill="rgba(255,255,255,0.08)" stroke="rgba(108,125,255,0.3)" strokeWidth="0.5" />
          {/* Left wing-tip light */}
          <motion.circle cx="4" cy="55" r="2" fill="#5EF2D6" filter="url(#sc_glow)"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.4, repeat: Infinity }} />

          {/* Right wing */}
          <path d="M48 30 L62 56 L56 60 L46 52 L48 38Z" fill="url(#sc_wing_r)" />
          {/* Right wing edge accent */}
          <path d="M48 32 L60 54 L56 58Z" fill="rgba(94,242,214,0.25)" />
          {/* Right wing inner panel */}
          <path d="M48 34 L56 50 L50 48 L49 36Z" fill="rgba(255,255,255,0.08)" stroke="rgba(108,125,255,0.3)" strokeWidth="0.5" />
          {/* Right wing-tip light */}
          <motion.circle cx="60" cy="55" r="2" fill="#9A6BFF" filter="url(#sc_glow)"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }} />

          {/* ── MAIN BODY ─────────────────────────────────── */}
          {/* Body shadow depth layer */}
          <path
            d="M32 2 C26 10 18 20 16 30 L16 52 Q16 58 20 60 L44 60 Q48 58 48 52 L48 30 C46 20 38 10 32 2Z"
            fill="rgba(10,15,60,0.5)"
            transform="translate(2,3)"
          />
          {/* Main body */}
          <path
            d="M32 2 C26 10 18 20 16 30 L16 52 Q16 58 20 60 L44 60 Q48 58 48 52 L48 30 C46 20 38 10 32 2Z"
            fill="url(#sc_body)"
            stroke="rgba(200,215,255,0.6)"
            strokeWidth="0.6"
          />
          {/* Body highlight ridge */}
          <path
            d="M32 4 C28 11 22 20 20 30 L20 50"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Body panel line left */}
          <path d="M22 28 L20 52" stroke="rgba(108,125,255,0.4)" strokeWidth="0.6" />
          {/* Body panel line right */}
          <path d="M42 28 L44 52" stroke="rgba(108,125,255,0.4)" strokeWidth="0.6" />
          {/* Horizontal hull ring 1 */}
          <path d="M20 34 Q32 32 44 34" fill="none" stroke="rgba(94,242,214,0.3)" strokeWidth="0.8" />
          {/* Horizontal hull ring 2 */}
          <path d="M18 44 Q32 42 46 44" fill="none" stroke="rgba(108,125,255,0.25)" strokeWidth="0.8" />

          {/* ── COCKPIT ───────────────────────────────────── */}
          {/* Cockpit outer ring glow */}
          <ellipse cx="32" cy="18" rx="9" ry="11" fill="rgba(94,242,214,0.1)" />
          {/* Cockpit glass */}
          <ellipse cx="32" cy="18" rx="7.5" ry="9.5" fill="url(#sc_cockpit)" stroke="rgba(94,242,214,0.7)" strokeWidth="0.8" />
          {/* Cockpit reflection 1 */}
          <ellipse cx="29.5" cy="14.5" rx="2.5" ry="3.5" fill="rgba(255,255,255,0.28)" />
          {/* Cockpit reflection 2 */}
          <ellipse cx="33.5" cy="22" rx="1.2" ry="1.8" fill="rgba(255,255,255,0.12)" />
          {/* Cockpit inner glow */}
          <motion.ellipse cx="32" cy="18" rx="4" ry="5" fill="rgba(94,242,214,0.15)"
            animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 2.5, repeat: Infinity }} />

          {/* ── ENGINES ───────────────────────────────────── */}
          {/* Left engine nacelle */}
          <rect x="12" y="50" width="12" height="12" rx="3" fill="url(#sc_nozzle)" stroke="rgba(108,125,255,0.5)" strokeWidth="0.6" />
          <rect x="13.5" y="51.5" width="5" height="9" rx="2" fill="rgba(255,255,255,0.08)" />
          {/* Left nozzle ring */}
          <rect x="12" y="58" width="12" height="4" rx="2" fill="rgba(94,242,214,0.25)" stroke="rgba(94,242,214,0.5)" strokeWidth="0.5" />
          {/* Left nozzle inner glow */}
          <motion.ellipse cx="18" cy="61" rx="4" ry="1.5" fill="#5EF2D6"
            animate={{ opacity: isMoving ? [0.6, 1, 0.6] : [0.2, 0.4, 0.2] }}
            transition={{ duration: 0.15, repeat: Infinity }} />

          {/* Right engine nacelle */}
          <rect x="40" y="50" width="12" height="12" rx="3" fill="url(#sc_nozzle)" stroke="rgba(108,125,255,0.5)" strokeWidth="0.6" />
          <rect x="41.5" y="51.5" width="5" height="9" rx="2" fill="rgba(255,255,255,0.08)" />
          {/* Right nozzle ring */}
          <rect x="40" y="58" width="12" height="4" rx="2" fill="rgba(94,242,214,0.25)" stroke="rgba(94,242,214,0.5)" strokeWidth="0.5" />
          {/* Right nozzle inner glow */}
          <motion.ellipse cx="46" cy="61" rx="4" ry="1.5" fill="#5EF2D6"
            animate={{ opacity: isMoving ? [0.6, 1, 0.6] : [0.2, 0.4, 0.2] }}
            transition={{ duration: 0.15, repeat: Infinity, delay: 0.07 }} />

          {/* Center engine */}
          <rect x="26" y="52" width="12" height="8" rx="2.5" fill="url(#sc_nozzle)" stroke="rgba(108,125,255,0.4)" strokeWidth="0.5" />
          <rect x="26" y="57" width="12" height="3" rx="1.5" fill="rgba(94,242,214,0.2)" stroke="rgba(94,242,214,0.4)" strokeWidth="0.4" />
          <motion.ellipse cx="32" cy="59.5" rx="4" ry="1.2" fill="#6C7DFF"
            animate={{ opacity: isMoving ? [0.7, 1, 0.7] : [0.2, 0.35, 0.2] }}
            transition={{ duration: 0.18, repeat: Infinity, delay: 0.04 }} />

          {/* ── NOSE TIP ──────────────────────────────────── */}
          <motion.circle cx="32" cy="3" r="2.5" fill="#5EF2D6" filter="url(#sc_glow)"
            animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.6, repeat: Infinity }} />

          {/* ── HULL LIGHTS ───────────────────────────────── */}
          <motion.circle cx="22" cy="30" r="1.5" fill="#5EF2D6" filter="url(#sc_glow)"
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.circle cx="42" cy="30" r="1.5" fill="#9A6BFF" filter="url(#sc_glow)"
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />

          {/* Speed lines when fast */}
          {flameScale > 0.5 && (
            <g opacity={flameScale - 0.5}>
              <motion.line x1="8" y1="20" x2="2" y2="14" stroke="rgba(94,242,214,0.6)" strokeWidth="0.8"
                animate={{ opacity: [0, 0.8, 0] }} transition={{ duration: 0.12, repeat: Infinity }} />
              <motion.line x1="56" y1="20" x2="62" y2="14" stroke="rgba(94,242,214,0.6)" strokeWidth="0.8"
                animate={{ opacity: [0, 0.8, 0] }} transition={{ duration: 0.12, repeat: Infinity, delay: 0.06 }} />
              <motion.line x1="12" y1="28" x2="4" y2="22" stroke="rgba(108,125,255,0.5)" strokeWidth="0.6"
                animate={{ opacity: [0, 0.7, 0] }} transition={{ duration: 0.14, repeat: Infinity, delay: 0.03 }} />
              <motion.line x1="52" y1="28" x2="60" y2="22" stroke="rgba(108,125,255,0.5)" strokeWidth="0.6"
                animate={{ opacity: [0, 0.7, 0] }} transition={{ duration: 0.14, repeat: Infinity, delay: 0.09 }} />
            </g>
          )}
        </svg>
      </motion.div>
    </>
  );
}
