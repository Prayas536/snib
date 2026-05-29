import { motion, useTransform } from 'framer-motion';
import AstronautMascot from '../hero/AstronautMascot';
import { useMouseParallax } from '@/hooks/useMouseParallax';

export default function CTASection() {
  const { springX, springY } = useMouseParallax();

  // Layered parallax depths
  const glowX  = useTransform(springX, [-1, 1], [-40, 40]);
  const glowY  = useTransform(springY, [-1, 1], [-40, 40]);
  const glow2X = useTransform(springX, [-1, 1], [20, -20]);
  const glow2Y = useTransform(springY, [-1, 1], [20, -20]);

  const astronautX = useTransform(springX, [-1, 1], [-18, 18]);
  const astronautY = useTransform(springY, [-1, 1], [-14, 14]);
  const rotateX    = useTransform(springY, [-1, 1], [5, -5]);
  const rotateY    = useTransform(springX, [-1, 1], [-5, 5]);

  const ringsX = useTransform(springX, [-1, 1], [-10, 10]);
  const ringsY = useTransform(springY, [-1, 1], [-10, 10]);

  const headingX = useTransform(springX, [-1, 1], [-6, 6]);
  const headingY = useTransform(springY, [-1, 1], [-4, 4]);

  const btn1X = useTransform(springX, [-1, 1], [-8, 8]);
  const btn1Y = useTransform(springY, [-1, 1], [-5, 5]);
  const btn2X = useTransform(springX, [-1, 1], [-12, 12]);
  const btn2Y = useTransform(springY, [-1, 1], [-7, 7]);

  return (
    <section className="py-32 md:py-40 relative z-10 w-full overflow-hidden border-t border-white/5 bg-[#050816]">

      {/* Parallax background glows */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[700px] h-[700px] bg-primary/12 rounded-full blur-[130px]" />
      </motion.div>
      <motion.div
        style={{ x: glow2X, y: glow2Y }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
      </motion.div>

      <div className="max-w-[1000px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">

        {/* Astronaut + rings container */}
        <div className="relative w-full h-[280px] flex items-center justify-center mb-8 pointer-events-none">

          {/* Parallax pulsing rings */}
          <motion.div
            style={{ x: ringsX, y: ringsY }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-[200px] h-[200px] rounded-full border border-primary/30"
                animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
              />
            ))}
          </motion.div>

          {/* Parallax astronaut */}
          <motion.div
            style={{ x: astronautX, y: astronautY, rotateX, rotateY }}
            className="relative -mt-10"
            whileHover={{ scale: 1.04, transition: { duration: 0.3 } }}
          >
            <AstronautMascot scale={0.6} />
          </motion.div>
        </div>

        {/* Parallax heading + subheading */}
        <motion.div style={{ x: headingX, y: headingY }} className="w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            Ready to Connect Beyond Screens?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mb-12 mx-auto"
          >
            Join 2.4 million people already using SNIB Call. The future of communication is here.
          </motion.p>
        </motion.div>

        {/* Parallax buttons at different depths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <motion.button
            style={{ x: btn1X, y: btn1Y }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(108,125,255,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-black font-semibold text-lg"
          >
            Get Started — It's Free
          </motion.button>
          <motion.button
            style={{ x: btn2X, y: btn2Y }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-medium text-lg backdrop-blur-sm"
          >
            Watch the Demo
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Trusted by teams at</span>
          <div className="flex items-center gap-8 md:gap-12 text-white/60 font-bold text-xl opacity-80 mix-blend-screen grayscale">
            <span>Acme</span>
            <span>Orion</span>
            <span>Nexus</span>
            <span>Vela</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
