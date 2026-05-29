import { motion, useTransform } from 'framer-motion';
import { useMouseParallax } from '@/hooks/useMouseParallax';

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 11v4" />
        <path d="M12 7h.01" />
      </svg>
    ),
    title: "Military-Grade Security",
    body: "End-to-end encryption with zero-knowledge architecture. Your conversations remain private, always.",
    stat: "256-bit AES",
    depth: 10,
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
        <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9Z" />
        <path d="M12 12v.01" />
        <path d="m8.5 8.5 2 2" />
        <path d="m15.5 8.5-2 2" />
        <path d="m8.5 15.5 2-2" />
        <path d="m15.5 15.5-2-2" />
      </svg>
    ),
    title: "AI-Powered Intelligence",
    body: "Real-time transcription, sentiment analysis, and smart meeting summaries powered by our AI engine.",
    stat: "98.7% Accuracy",
    depth: 16,
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Global Infrastructure",
    body: "Distributed across 180+ cities worldwide for sub-20ms latency anywhere on Earth.",
    stat: "180+ Cities",
    depth: 7,
  }
];

export default function WhySnibSection() {
  const { springX, springY } = useMouseParallax();

  // Background glow parallax
  const glowX = useTransform(springX, [-1, 1], [-30, 30]);
  const glowY = useTransform(springY, [-1, 1], [-30, 30]);

  // Heading subtle shift
  const headingX = useTransform(springX, [-1, 1], [-5, 5]);
  const headingY = useTransform(springY, [-1, 1], [-3, 3]);

  // Per-card parallax transforms (each at a unique depth)
  const card0X = useTransform(springX, [-1, 1], [-features[0].depth, features[0].depth]);
  const card0Y = useTransform(springY, [-1, 1], [-features[0].depth * 0.6, features[0].depth * 0.6]);
  const card1X = useTransform(springX, [-1, 1], [-features[1].depth, features[1].depth]);
  const card1Y = useTransform(springY, [-1, 1], [-features[1].depth * 0.6, features[1].depth * 0.6]);
  const card2X = useTransform(springX, [-1, 1], [-features[2].depth, features[2].depth]);
  const card2Y = useTransform(springY, [-1, 1], [-features[2].depth * 0.6, features[2].depth * 0.6]);

  const cardTransforms = [
    { x: card0X, y: card0Y },
    { x: card1X, y: card1Y },
    { x: card2X, y: card2Y },
  ];

  return (
    <section id="features" className="py-32 relative z-10 w-full overflow-hidden">
      {/* Parallax background glow */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px]" />
      </motion.div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">

        <div className="text-center mb-20">
          <motion.div style={{ x: headingX, y: headingY }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
            >
              Built for the Future
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/60 max-w-2xl mx-auto"
            >
              SNIB Call is engineered from the ground up for the next era of human connection.
            </motion.p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              style={{ x: cardTransforms[idx].x, y: cardTransforms[idx].y }}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                whileHover={{
                  y: -10,
                  rotateX: 3,
                  rotateY: idx === 0 ? 3 : idx === 2 ? -3 : 0,
                  boxShadow: '0 0 0 1px hsl(var(--primary)), 0 24px 48px -12px rgba(108,125,255,0.25)',
                  transition: { duration: 0.2 }
                }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm flex flex-col h-full"
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 mb-8 flex-grow leading-relaxed">
                  {feature.body}
                </p>

                <div className="pt-6 border-t border-white/10 mt-auto">
                  <span className="text-sm font-bold uppercase tracking-wider text-white/80">
                    {feature.stat}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
