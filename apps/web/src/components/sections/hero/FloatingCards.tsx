import { motion, useTransform } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { useMouseParallax } from '@/hooks/useMouseParallax';

interface CardProps {
  title: string;
  value: number;
  suffix?: string;
  delay: number;
}

function StatCard({ title, value, suffix = '', delay }: CardProps) {
  const count = useCountUp(value, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      whileHover={{
        scale: 1.06,
        boxShadow: '0 0 0 1px rgba(108,125,255,0.4), 0 12px 40px rgba(108,125,255,0.2)',
        transition: { duration: 0.2 }
      }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[140px]"
    >
      <div className="text-xs text-white/70 font-medium mb-1 uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-bold text-white flex items-baseline gap-1">
        {value % 1 !== 0 ? count + (value - Math.floor(value)).toFixed(1).substring(1) : count}
        <span className="text-sm font-medium text-primary">{suffix}</span>
      </div>
    </motion.div>
  );
}

export default function FloatingCards() {
  const { springX, springY } = useMouseParallax();

  // Each card at a distinct parallax depth — creates real z-depth separation
  const c0x = useTransform(springX, [-1, 1], [-15, 15]);
  const c0y = useTransform(springY, [-1, 1], [-10, 10]);

  const c1x = useTransform(springX, [-1, 1], [-28, 28]);
  const c1y = useTransform(springY, [-1, 1], [-20, 20]);

  const c2x = useTransform(springX, [-1, 1], [-10, 10]);
  const c2y = useTransform(springY, [-1, 1], [-22, 22]);

  const c3x = useTransform(springX, [-1, 1], [-35, 35]);
  const c3y = useTransform(springY, [-1, 1], [-14, 14]);

  return (
    <>
      {/* Latency card — top-left */}
      <motion.div
        style={{ x: c0x, y: c0y }}
        animate={{ y: [0, -8, 0] } as never}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        className="absolute top-[10%] -left-[10%] z-20"
      >
        <StatCard title="Latency" value={18} suffix="ms" delay={0.8} />
      </motion.div>

      {/* AI Processing — top-right */}
      <motion.div
        style={{ x: c1x, y: c1y }}
        animate={{ y: [0, -10, 0] } as never}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[20%] -right-[15%] z-20"
      >
        <StatCard title="AI Processing" value={98.7} suffix="%" delay={1.0} />
      </motion.div>

      {/* Global Network — bottom-left */}
      <motion.div
        style={{ x: c2x, y: c2y }}
        animate={{ y: [0, 8, 0] } as never}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[25%] -left-[5%] z-20"
      >
        <StatCard title="Global Network" value={180} suffix="+ Cities" delay={1.2} />
      </motion.div>

      {/* Active Users — bottom-right */}
      <motion.div
        style={{ x: c3x, y: c3y }}
        animate={{ y: [0, 12, 0] } as never}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-[15%] -right-[5%] z-20"
      >
        <StatCard title="Active Users" value={2.4} suffix="M+" delay={1.4} />
      </motion.div>
    </>
  );
}
