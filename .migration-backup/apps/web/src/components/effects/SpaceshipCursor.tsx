import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ─── Types ──────────────────────────────────────────────────── */
interface Star    { x: number; y: number; size: number; opacity: number; depth: number; color: string }
interface Particle{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; r: number; g: number; b: number }

const STAR_COLORS_RGB: [number, number, number][] = [
  [255, 255, 255],
  [200, 216, 255],
  [160, 180, 255],
  [94,  242, 214],
  [154, 107, 255],
];

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => {
    const rgb = STAR_COLORS_RGB[Math.floor(Math.random() * STAR_COLORS_RGB.length)];
    return {
      x:       Math.random(),
      y:       Math.random(),
      size:    Math.random() * 2.2 + 0.4,
      opacity: Math.random() * 0.6 + 0.25,
      depth:   Math.random() * 0.06 + 0.005, // parallax strength
      color: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`,
    };
  });
}

/* ─── All-in-one canvas: stars + particles ───────────────────── */
function useSceneCanvas(
  smoothX: ReturnType<typeof useSpring>,
  smoothY: ReturnType<typeof useSpring>,
  mouseRef: React.MutableRefObject<{ x: number; y: number }>,
  angleRef: React.MutableRefObject<number>,
  speedRef: React.MutableRefObject<number>,
) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const starsRef   = useRef<Star[]>(generateStars(140));
  const particles  = useRef<Particle[]>([]);
  const pidRef     = useRef(0);
  const rafRef     = useRef(0);
  const lastShip   = useRef({ x: -400, y: -400 });
  const twinkle    = useRef<number[]>([]); // per-star phase offset

  useEffect(() => {
    // init twinkle offsets
    twinkle.current = starsRef.current.map(() => Math.random() * Math.PI * 2);

    const canvas = canvasRef.current!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const FLAME_PALETTES: [number, number, number][] = [
      [255, 255, 255],
      [255, 253, 200],
      [255, 220, 60],
      [255, 140, 30],
      [94,  242, 214],
      [108, 125, 255],
    ];

    function spawnParticles(cx: number, cy: number, angle: number, speed: number) {
      const ar   = (angle * Math.PI) / 180;
      const bx   =  Math.sin(ar);
      const by   = -Math.cos(ar);
      const perx = -Math.cos(ar); // perpendicular
      const pery = -Math.sin(ar);
      const count = Math.min(Math.floor(speed * 0.5) + 1, 8);

      const offsets = [
        { dx: perx * -10, dy: pery * -10 },   // left engine
        { dx: perx *  10, dy: pery *  10 },   // right engine
        { dx: 0,          dy: 0          },   // center
      ];

      for (const off of offsets) {
        for (let i = 0; i < count; i++) {
          const spread  = (Math.random() - 0.5) * 3;
          const spd     = (Math.random() * 0.6 + 0.4) * Math.max(speed * 0.13, 1.8);
          const rgb     = FLAME_PALETTES[Math.floor(Math.random() * FLAME_PALETTES.length)];
          particles.current.push({
            id: pidRef.current++,
            x: cx + off.dx + (Math.random() - 0.5) * 4,
            y: cy + off.dy + (Math.random() - 0.5) * 4,
            vx: bx * spd + spread * 0.3,
            vy: by * spd + spread * 0.3,
            life: 1,
            maxLife: Math.random() * 0.55 + 0.25,
            size: Math.random() * 3.5 + 1.5,
            r: rgb[0], g: rgb[1], b: rgb[2],
          } as unknown as Particle);
        }
      }
      if (particles.current.length > 700) particles.current = particles.current.slice(-500);
    }

    let lastTime = 0;

    function draw(now: number) {
      const dt  = Math.min((now - lastTime) / 1000, 0.033);
      lastTime  = now;

      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const nx = mx / canvas.width;
      const ny = my / canvas.height;

      // ── stars ──
      for (let i = 0; i < starsRef.current.length; i++) {
        const s   = starsRef.current[i];
        const px  = ((s.x + (nx - 0.5) * s.depth * 6 + 1) % 1) * canvas.width;
        const py  = ((s.y + (ny - 0.5) * s.depth * 6 + 1) % 1) * canvas.height;
        const twk = Math.sin(now * 0.001 * (s.depth * 30 + 0.5) + twinkle.current[i]) * 0.25 + 0.75;
        const op  = s.opacity * twk;

        ctx.beginPath();
        ctx.arc(px, py, s.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = op;
        ctx.fill();

        if (s.size > 1.6) {
          ctx.beginPath();
          ctx.arc(px, py, s.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = op * 0.2;
          ctx.fill();
        }
      }

      // ── exhaust particles ──
      const cx = smoothX.get();
      const cy = smoothY.get();
      const dx = cx - lastShip.current.x;
      const dy = cy - lastShip.current.y;
      const spd = Math.sqrt(dx * dx + dy * dy) / Math.max(dt, 0.001) * 0.016;

      if (spd > 0.5) {
        angleRef.current  = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        speedRef.current  = spd;
        spawnParticles(cx, cy, angleRef.current, spd);
      } else {
        speedRef.current = Math.max(speedRef.current - dt * 40, 0);
      }
      lastShip.current = { x: cx, y: cy };

      particles.current = particles.current.filter(p => p.life > 0);
      for (const p of particles.current) {
        (p as any).life -= dt / (p as any).maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.91;
        p.vy *= 0.91;

        const al  = Math.max(0, (p as any).life);
        const sz  = p.size * al;
        const rgb = `${p.r},${p.g},${p.b}`;

        // outer glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 3.5);
        grad.addColorStop(0, `rgba(${rgb},${al * 0.65})`);
        grad.addColorStop(1, `rgba(${rgb},0)`);
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${al * 0.95})`;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [smoothX, smoothY, mouseRef, angleRef, speedRef]);

  return canvasRef;
}

/* ─── Main component ─────────────────────────────────────────── */
export default function SpaceshipCursor() {
  // High-stiffness spring = very responsive, still silky
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);
  const springCfg = { stiffness: 520, damping: 34, mass: 0.55 };
  const smoothX = useSpring(cursorX, springCfg);
  const smoothY = useSpring(cursorY, springCfg);

  const [angle, setAngle] = useState(0);
  const [speed, setSpeed] = useState(0);

  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const angleRef  = useRef(0);
  const speedRef  = useRef(0);
  const lastPos   = useRef({ x: -400, y: -400 });
  const speedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canvasRef = useSceneCanvas(smoothX, smoothY, mouseRef, angleRef, speedRef);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const spd = Math.sqrt(dx * dx + dy * dy);

      if (spd > 0.5) {
        const a = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        setAngle(a);
        angleRef.current = a;
      }

      cursorX.set(x);
      cursorY.set(y);
      lastPos.current   = { x, y };
      mouseRef.current  = { x, y };
      setSpeed(spd);
      speedRef.current  = spd;

      if (speedTimer.current) clearTimeout(speedTimer.current);
      speedTimer.current = setTimeout(() => { setSpeed(0); speedRef.current = 0; }, 80);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (speedTimer.current) clearTimeout(speedTimer.current);
    };
  }, [cursorX, cursorY]);

  const flameScale  = Math.min(speed / 14, 1);
  const isMoving    = speed > 0.8;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Single canvas: stars + particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9997 }}
        aria-hidden="true"
      />

      {/* SVG ship */}
      <motion.div
        className="fixed pointer-events-none"
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%", rotate: angle, zIndex: 9999 }}
      >
        <svg
          width="64" height="84"
          viewBox="0 0 64 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 0 10px rgba(108,125,255,1)) drop-shadow(0 0 24px rgba(94,242,214,0.5))" }}
          overflow="visible"
        >
          <defs>
            <linearGradient id="sc_body" x1="32" y1="2" x2="32" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#f0f4ff" />
              <stop offset="35%"  stopColor="#c8d4ff" />
              <stop offset="75%"  stopColor="#7080cc" />
              <stop offset="100%" stopColor="#3a44a8" />
            </linearGradient>
            <linearGradient id="sc_wing_l" x1="16" y1="30" x2="2" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#8090e8" />
              <stop offset="100%" stopColor="#2a3490" />
            </linearGradient>
            <linearGradient id="sc_wing_r" x1="48" y1="30" x2="62" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#8090e8" />
              <stop offset="100%" stopColor="#2a3490" />
            </linearGradient>
            <radialGradient id="sc_cockpit" cx="42%" cy="30%" r="60%">
              <stop offset="0%"   stopColor="#c8e0ff" />
              <stop offset="40%"  stopColor="#7090ff" />
              <stop offset="100%" stopColor="#1a1860" />
            </radialGradient>
            <linearGradient id="sc_nozzle" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#4a5acc" />
              <stop offset="100%" stopColor="#1a2060" />
            </linearGradient>
            <linearGradient id="sc_fl_inner" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#ffffff"  stopOpacity="1"   />
              <stop offset="40%"  stopColor="#ffe040"  stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ff8000"  stopOpacity="0"   />
            </linearGradient>
            <linearGradient id="sc_fl_mid" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#ffb040"  stopOpacity="0.9" />
              <stop offset="50%"  stopColor="#ff5500"  stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff2000"  stopOpacity="0"   />
            </linearGradient>
            <linearGradient id="sc_fl_outer" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#5EF2D6"  stopOpacity="0.7" />
              <stop offset="50%"  stopColor="#6C7DFF"  stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6C7DFF"  stopOpacity="0"   />
            </linearGradient>
            <filter id="sc_glow" x="-60%" y="-40%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="sc_flame_glow" x="-80%" y="-20%" width="260%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── FLAMES (behind ship) ── */}
          {isMoving && (
            <g filter="url(#sc_flame_glow)">
              {(["left","right","center"] as const).map((side) => {
                const cx = side === "left" ? 18 : side === "right" ? 46 : 32;
                const fy = side === "center" ? 58 : 60;
                const fl = flameScale * (side === "center" ? 0.65 : 1);
                return (
                  <g key={side}>
                    {/* outer */}
                    <motion.path
                      d={`M${cx} ${fy} C${cx-4} ${fy+fl*28+2} ${cx-6} ${fy+fl*36+2} ${cx} ${fy+fl*44+2} C${cx+6} ${fy+fl*36+2} ${cx+4} ${fy+fl*28+2} ${cx} ${fy}Z`}
                      fill="url(#sc_fl_outer)"
                      style={{ transformOrigin: `${cx}px ${fy}px` }}
                      animate={{ scaleY:[1,1.12,0.92,1.08,1], scaleX:[1,0.9,1.1,0.95,1] }}
                      transition={{ duration:0.13, repeat:Infinity, ease:"linear", delay: side==="right"?0.04:side==="center"?0.07:0 }}
                    />
                    {/* mid */}
                    <motion.path
                      d={`M${cx} ${fy} C${cx-3} ${fy+fl*18+2} ${cx-4} ${fy+fl*26+2} ${cx} ${fy+fl*32+2} C${cx+4} ${fy+fl*26+2} ${cx+3} ${fy+fl*18+2} ${cx} ${fy}Z`}
                      fill="url(#sc_fl_mid)"
                      style={{ transformOrigin: `${cx}px ${fy}px` }}
                      animate={{ scaleY:[1,1.2,0.85,1.1,1], scaleX:[1,0.85,1.15,0.9,1] }}
                      transition={{ duration:0.10, repeat:Infinity, ease:"linear", delay: side==="right"?0.03:side==="center"?0.06:0 }}
                    />
                    {/* inner */}
                    <motion.path
                      d={`M${cx} ${fy} C${cx-2} ${fy+fl*10+1} ${cx-2.5} ${fy+fl*16+1} ${cx} ${fy+fl*20+1} C${cx+2.5} ${fy+fl*16+1} ${cx+2} ${fy+fl*10+1} ${cx} ${fy}Z`}
                      fill="url(#sc_fl_inner)"
                      style={{ transformOrigin: `${cx}px ${fy}px` }}
                      animate={{ scaleY:[1,1.3,0.78,1.18,1], scaleX:[1,0.78,1.22,0.82,1] }}
                      transition={{ duration:0.08, repeat:Infinity, ease:"linear", delay: side==="right"?0.02:side==="center"?0.05:0 }}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* ── WINGS ── */}
          <path d="M16 30 L2 56 L8 60 L18 52 L16 38Z" fill="url(#sc_wing_l)" />
          <path d="M16 32 L4 54 L8 58Z" fill="rgba(94,242,214,0.25)" />
          <path d="M16 34 L8 50 L14 48 L15 36Z" fill="rgba(255,255,255,0.08)" stroke="rgba(108,125,255,0.3)" strokeWidth="0.5" />
          <motion.circle cx="4" cy="55" r="2" fill="#5EF2D6" filter="url(#sc_glow)"
            animate={{ opacity:[0.7,1,0.7] }} transition={{ duration:1.4, repeat:Infinity }} />

          <path d="M48 30 L62 56 L56 60 L46 52 L48 38Z" fill="url(#sc_wing_r)" />
          <path d="M48 32 L60 54 L56 58Z" fill="rgba(94,242,214,0.25)" />
          <path d="M48 34 L56 50 L50 48 L49 36Z" fill="rgba(255,255,255,0.08)" stroke="rgba(108,125,255,0.3)" strokeWidth="0.5" />
          <motion.circle cx="60" cy="55" r="2" fill="#9A6BFF" filter="url(#sc_glow)"
            animate={{ opacity:[0.7,1,0.7] }} transition={{ duration:1.4, repeat:Infinity, delay:0.7 }} />

          {/* ── BODY ── */}
          <path d="M32 2 C26 10 18 20 16 30 L16 52 Q16 58 20 60 L44 60 Q48 58 48 52 L48 30 C46 20 38 10 32 2Z"
            fill="rgba(10,15,60,0.5)" transform="translate(2,3)" />
          <path d="M32 2 C26 10 18 20 16 30 L16 52 Q16 58 20 60 L44 60 Q48 58 48 52 L48 30 C46 20 38 10 32 2Z"
            fill="url(#sc_body)" stroke="rgba(200,215,255,0.6)" strokeWidth="0.6" />
          <path d="M32 4 C28 11 22 20 20 30 L20 50" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M22 28 L20 52" stroke="rgba(108,125,255,0.4)" strokeWidth="0.6" />
          <path d="M42 28 L44 52" stroke="rgba(108,125,255,0.4)" strokeWidth="0.6" />
          <path d="M20 34 Q32 32 44 34" fill="none" stroke="rgba(94,242,214,0.3)" strokeWidth="0.8" />
          <path d="M18 44 Q32 42 46 44" fill="none" stroke="rgba(108,125,255,0.25)" strokeWidth="0.8" />

          {/* ── COCKPIT ── */}
          <ellipse cx="32" cy="18" rx="9" ry="11" fill="rgba(94,242,214,0.1)" />
          <ellipse cx="32" cy="18" rx="7.5" ry="9.5" fill="url(#sc_cockpit)" stroke="rgba(94,242,214,0.7)" strokeWidth="0.8" />
          <ellipse cx="29.5" cy="14.5" rx="2.5" ry="3.5" fill="rgba(255,255,255,0.28)" />
          <ellipse cx="33.5" cy="22" rx="1.2" ry="1.8" fill="rgba(255,255,255,0.12)" />
          <motion.ellipse cx="32" cy="18" rx="4" ry="5" fill="rgba(94,242,214,0.15)"
            animate={{ opacity:[0.15,0.35,0.15] }} transition={{ duration:2.5, repeat:Infinity }} />

          {/* ── ENGINES ── */}
          <rect x="12" y="50" width="12" height="12" rx="3" fill="url(#sc_nozzle)" stroke="rgba(108,125,255,0.5)" strokeWidth="0.6" />
          <rect x="13.5" y="51.5" width="5" height="9" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="12" y="58" width="12" height="4" rx="2" fill="rgba(94,242,214,0.25)" stroke="rgba(94,242,214,0.5)" strokeWidth="0.5" />
          <motion.ellipse cx="18" cy="61" rx="4" ry="1.5" fill="#5EF2D6"
            animate={{ opacity: isMoving ? [0.6,1,0.6] : [0.2,0.4,0.2] }} transition={{ duration:0.15, repeat:Infinity }} />

          <rect x="40" y="50" width="12" height="12" rx="3" fill="url(#sc_nozzle)" stroke="rgba(108,125,255,0.5)" strokeWidth="0.6" />
          <rect x="41.5" y="51.5" width="5" height="9" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="40" y="58" width="12" height="4" rx="2" fill="rgba(94,242,214,0.25)" stroke="rgba(94,242,214,0.5)" strokeWidth="0.5" />
          <motion.ellipse cx="46" cy="61" rx="4" ry="1.5" fill="#5EF2D6"
            animate={{ opacity: isMoving ? [0.6,1,0.6] : [0.2,0.4,0.2] }} transition={{ duration:0.15, repeat:Infinity, delay:0.07 }} />

          <rect x="26" y="52" width="12" height="8" rx="2.5" fill="url(#sc_nozzle)" stroke="rgba(108,125,255,0.4)" strokeWidth="0.5" />
          <rect x="26" y="57" width="12" height="3" rx="1.5" fill="rgba(94,242,214,0.2)" stroke="rgba(94,242,214,0.4)" strokeWidth="0.4" />
          <motion.ellipse cx="32" cy="59.5" rx="4" ry="1.2" fill="#6C7DFF"
            animate={{ opacity: isMoving ? [0.7,1,0.7] : [0.2,0.35,0.2] }} transition={{ duration:0.18, repeat:Infinity, delay:0.04 }} />

          {/* ── NOSE & LIGHTS ── */}
          <motion.circle cx="32" cy="3" r="2.5" fill="#5EF2D6" filter="url(#sc_glow)"
            animate={{ opacity:[0.6,1,0.6] }} transition={{ duration:1.6, repeat:Infinity }} />
          <motion.circle cx="22" cy="30" r="1.5" fill="#5EF2D6" filter="url(#sc_glow)"
            animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2, repeat:Infinity }} />
          <motion.circle cx="42" cy="30" r="1.5" fill="#9A6BFF" filter="url(#sc_glow)"
            animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2, repeat:Infinity, delay:1 }} />

          {/* ── SPEED LINES ── */}
          {flameScale > 0.5 && (
            <g opacity={flameScale - 0.5}>
              <motion.line x1="8"  y1="20" x2="2"  y2="14" stroke="rgba(94,242,214,0.6)"  strokeWidth="0.8"
                animate={{ opacity:[0,0.8,0] }} transition={{ duration:0.12, repeat:Infinity }} />
              <motion.line x1="56" y1="20" x2="62" y2="14" stroke="rgba(94,242,214,0.6)"  strokeWidth="0.8"
                animate={{ opacity:[0,0.8,0] }} transition={{ duration:0.12, repeat:Infinity, delay:0.06 }} />
              <motion.line x1="12" y1="28" x2="4"  y2="22" stroke="rgba(108,125,255,0.5)" strokeWidth="0.6"
                animate={{ opacity:[0,0.7,0] }} transition={{ duration:0.14, repeat:Infinity, delay:0.03 }} />
              <motion.line x1="52" y1="28" x2="60" y2="22" stroke="rgba(108,125,255,0.5)" strokeWidth="0.6"
                animate={{ opacity:[0,0.7,0] }} transition={{ duration:0.14, repeat:Infinity, delay:0.09 }} />
            </g>
          )}
        </svg>
      </motion.div>
    </>
  );
}
