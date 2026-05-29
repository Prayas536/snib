import { motion } from 'framer-motion';
import AstronautMascot from '../hero/AstronautMascot';

export default function CTASection() {
  return (
    <section className="py-32 md:py-40 relative z-10 w-full overflow-hidden border-t border-white/5 bg-[#050816]">
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1000px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        <div className="relative w-full h-[280px] flex items-center justify-center mb-8 pointer-events-none">
          {/* Pulsing rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-[200px] h-[200px] rounded-full border border-primary/30"
              animate={{
                scale: [1, 1.8],
                opacity: [0.8, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut"
              }}
            />
          ))}
          
          <div className="relative -mt-10">
            <AstronautMascot scale={0.6} />
          </div>
        </div>

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
          className="text-xl text-white/60 max-w-2xl mb-12"
        >
          Join 2.4 million people already using SNIB Call. The future of communication is here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-black font-semibold text-lg hover:opacity-90 transition-opacity">
            Get Started — It's Free
          </button>
          <button className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
            Watch the Demo
          </button>
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
