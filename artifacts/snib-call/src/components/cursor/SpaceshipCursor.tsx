import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

const STAR_COLORS = [
  "#ffffff",
  "#c8d8ff",
  "#a0b4ff",
  "#5EF2D6",
  "#9A6BFF",
];

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

export default function SpaceshipCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const springConfig = { stiffness: 200, damping: 22, mass: 0.6 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [isMoving, setIsMoving] = useState(false);
  const [angle, setAngle] = useState(0);
  const [stars] = useState(() => generateStars(120));
  const [mouseNorm, setMouseNorm] = useState({ x: 0.5, y: 0.5 });
  const lastPos = useRef({ x: -200, y: -200 });
  const movingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;

      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        const deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        setAngle(deg);
      }

      cursorX.set(x);
      cursorY.set(y);
      lastPos.current = { x, y };

      setMouseNorm({
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      });

      setIsMoving(true);
      if (movingTimer.current) clearTimeout(movingTimer.current);
      movingTimer.current = setTimeout(() => setIsMoving(false), 120);
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (movingTimer.current) clearTimeout(movingTimer.current);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`* { cursor: none !important; }`}</style>

      {/* Starfield layer */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 9998 }}
        aria-hidden="true"
      >
        {stars.map((star) => {
          const parallaxX = (mouseNorm.x - 0.5) * star.speed * 200;
          const parallaxY = (mouseNorm.y - 0.5) * star.speed * 200;
          return (
            <motion.div
              key={star.id}
              className="absolute rounded-full"
              animate={{
                x: parallaxX,
                y: parallaxY,
              }}
              transition={{ type: "spring", stiffness: 30, damping: 20 }}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                opacity: star.opacity,
                boxShadow: star.size > 2 ? `0 0 ${star.size * 2}px ${star.color}` : "none",
              }}
            />
          );
        })}
      </div>

      {/* Spaceship cursor */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: angle,
          zIndex: 9999,
        }}
      >
        {/* Engine glow trail when moving */}
        {isMoving && (
          <motion.div
            className="absolute rounded-full"
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 2.5 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              width: 10,
              height: 10,
              bottom: -4,
              left: "50%",
              translateX: "-50%",
              background: "radial-gradient(circle, #5EF2D6 0%, #6C7DFF 60%, transparent 100%)",
              filter: "blur(3px)",
            }}
          />
        )}

        {/* SVG Spaceship */}
        <svg
          width="32"
          height="40"
          viewBox="0 0 32 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 0 6px rgba(108,125,255,0.9))" }}
        >
          {/* Engine exhaust glow */}
          {isMoving && (
            <ellipse
              cx="16"
              cy="36"
              rx="4"
              ry="5"
              fill="url(#exhaustGrad)"
              opacity="0.85"
            />
          )}

          {/* Main body */}
          <path
            d="M16 1 C12 8, 7 14, 6 22 L10 22 L10 30 L22 30 L22 22 L26 22 C25 14, 20 8, 16 1Z"
            fill="url(#bodyGrad)"
            stroke="rgba(200,210,255,0.6)"
            strokeWidth="0.5"
          />

          {/* Cockpit window */}
          <ellipse
            cx="16"
            cy="14"
            rx="4.5"
            ry="6"
            fill="url(#cockpitGrad)"
            stroke="rgba(94,242,214,0.5)"
            strokeWidth="0.5"
          />

          {/* Cockpit reflection */}
          <ellipse
            cx="14.5"
            cy="12"
            rx="1.5"
            ry="2.5"
            fill="rgba(255,255,255,0.3)"
          />

          {/* Left wing */}
          <path
            d="M10 22 L3 28 L6 30 L10 30Z"
            fill="url(#wingGrad)"
            stroke="rgba(108,125,255,0.4)"
            strokeWidth="0.5"
          />

          {/* Right wing */}
          <path
            d="M22 22 L29 28 L26 30 L22 30Z"
            fill="url(#wingGrad)"
            stroke="rgba(108,125,255,0.4)"
            strokeWidth="0.5"
          />

          {/* Wing accent left */}
          <path
            d="M10 24 L4.5 28.5 L6.5 29.5Z"
            fill="rgba(94,242,214,0.4)"
          />

          {/* Wing accent right */}
          <path
            d="M22 24 L27.5 28.5 L25.5 29.5Z"
            fill="rgba(94,242,214,0.4)"
          />

          {/* Engine nozzles */}
          <rect x="11.5" y="29" width="4" height="4" rx="1" fill="url(#nozzleGrad)" />
          <rect x="16.5" y="29" width="4" height="4" rx="1" fill="url(#nozzleGrad)" />

          {/* Body accent stripe */}
          <path
            d="M16 6 L16 20"
            stroke="rgba(94,242,214,0.5)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />

          {/* Side lights */}
          <circle cx="9" cy="22" r="1.2" fill="#5EF2D6" opacity="0.9" />
          <circle cx="23" cy="22" r="1.2" fill="#5EF2D6" opacity="0.9" />

          <defs>
            <radialGradient id="exhaustGrad" cx="50%" cy="30%">
              <stop offset="0%" stopColor="#5EF2D6" />
              <stop offset="50%" stopColor="#6C7DFF" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <linearGradient id="bodyGrad" x1="16" y1="1" x2="16" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#dde4ff" />
              <stop offset="40%" stopColor="#b0bcf0" />
              <stop offset="100%" stopColor="#6C7DFF" />
            </linearGradient>

            <linearGradient id="cockpitGrad" x1="16" y1="8" x2="16" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a8b8ff" />
              <stop offset="60%" stopColor="#6C7DFF" />
              <stop offset="100%" stopColor="#3a2d8f" />
            </linearGradient>

            <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#5a6acc" />
              <stop offset="100%" stopColor="#8090e0" />
            </linearGradient>

            <linearGradient id="nozzleGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#5EF2D6" />
              <stop offset="100%" stopColor="#3a9e90" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </>
  );
}
