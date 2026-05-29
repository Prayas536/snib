import { motion, useTransform } from 'framer-motion';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import AstronautMascot from './AstronautMascot';
import FloatingCards from './FloatingCards';

export default function HeroSection() {
  const { springX, springY } = useMouseParallax();

  // Background blobs layer 1
  const bgX = useTransform(springX, [-1, 1], [-20, 20]);
  const bgY = useTransform(springY, [-1, 1], [-20, 20]);

  // Grid layer 2
  const gridX = useTransform(springX, [-1, 1], [-10, 10]);
  const gridY = useTransform(springY, [-1, 1], [-10, 10]);

  // Mascot layer 5 — amplified movement
  const mascotX = useTransform(springX, [-1, 1], [-55, 55]);
  const mascotY = useTransform(springY, [-1, 1], [-40, 40]);
  const rotateX = useTransform(springY, [-1, 1], [18, -18]);
  const rotateY = useTransform(springX, [-1, 1], [-18, 18]);

  // Specular flares layer 8
  const flareX = useTransform(springX, [-1, 1], [-40, 40]);
  const flareY = useTransform(springY, [-1, 1], [-40, 40]);

  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center overflow-hidden pt-20">
      {/* Background gradients */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[100px]" />
      </motion.div>

      {/* Grid layer */}
      <motion.div
        style={{ x: gridX, y: gridY, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, #fff 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, #fff 50px)' }}
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
      />

      {/* Particles layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.4 + 0.1,
              scale: Math.random() * 2 + 1
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, Math.random() * 0.6 + 0.2, Math.random() * 0.4 + 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ width: 2, height: 2 }}
          />
        ))}
      </div>

      <div className="max-w-[1280px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <div className="flex flex-col items-start pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(108,125,255,0.2)]"
          >
            Next Generation Communication
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="text-[clamp(4rem,8vw,7rem)] leading-[1.05] font-extrabold text-white tracking-tight mb-6"
          >
            Connect<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Beyond</span><br />
            Screens
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="text-lg text-white/70 max-w-[520px] mb-10 leading-relaxed"
          >
            Experience immersive conversations designed for the next era of digital interaction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-black font-semibold text-lg hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48 }}
            className="flex items-center gap-4 text-sm font-medium text-white/50 tracking-wide uppercase"
          >
            <span>Secure</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>Fast</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>Global</span>
          </motion.div>
        </div>

        {/* Right Content - 2.5D Parallax */}
        <div className="relative h-[600px] w-full flex items-center justify-center">
          {/* Orbit rings layer 4 */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-[480px] h-[480px] rounded-full border border-white/5 border-dashed" />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-primary/10 border-dashed" />
          </motion.div>

          {/* Main Astronaut Layer 5 */}
          <motion.div
            style={{ x: mascotX, y: mascotY, rotateX, rotateY }}
            className="relative z-10 perspective-[1000px] w-full h-full flex items-center justify-center"
          >
            <AstronautMascot />
            <FloatingCards />
          </motion.div>

          {/* Specular flares layer 8 */}
          <motion.div
            style={{ x: flareX, y: flareY }}
            className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
          >
             <div className="absolute top-[20%] left-[30%] w-16 h-16 rounded-full bg-accent/30 blur-2xl" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
