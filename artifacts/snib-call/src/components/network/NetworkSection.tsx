import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const NODES = [
  { id: 'NYC', x: 300, y: 250, r: 14, name: 'NYC' },
  { id: 'LON', x: 180, y: 160, r: 12, name: 'LON' },
  { id: 'TKY', x: 480, y: 170, r: 12, name: 'TKY' },
  { id: 'SYD', x: 460, y: 380, r: 10, name: 'SYD' },
  { id: 'SFO', x: 80, y: 220, r: 11, name: 'SFO' },
  { id: 'BER', x: 210, y: 140, r: 9, name: 'BER' },
  { id: 'DXB', x: 380, y: 310, r: 10, name: 'DXB' },
  { id: 'SGP', x: 470, y: 310, r: 9, name: 'SGP' },
  { id: 'CDG', x: 190, y: 200, r: 8, name: 'CDG' },
  { id: 'MUM', x: 400, y: 270, r: 9, name: 'MUM' },
  { id: 'GRU', x: 200, y: 380, r: 8, name: 'GRU' },
  { id: 'JNB', x: 280, y: 400, r: 7, name: 'JNB' },
];

const EDGES = [
  ['NYC', 'LON'], ['NYC', 'SFO'], ['NYC', 'GRU'], ['LON', 'BER'], 
  ['LON', 'CDG'], ['BER', 'DXB'], ['DXB', 'MUM'], ['MUM', 'SGP'],
  ['SGP', 'TKY'], ['SGP', 'SYD'], ['TKY', 'SFO'], ['GRU', 'JNB'],
  ['DXB', 'JNB'], ['NYC', 'CDG']
];

function NetworkVisualization() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 600;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    setMousePos({ x, y });

    let closest = null;
    let minDist = 40; // threshold
    NODES.forEach(n => {
      const dist = Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2));
      if (dist < minDist) {
        minDist = dist;
        closest = n.id;
      }
    });
    setHoveredNode(closest);
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] flex items-center justify-center relative">
      <svg 
        viewBox="0 0 600 500" 
        className="w-full h-auto max-w-[600px] overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="nodeFill">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#6C7DFF" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {EDGES.map(([srcId, tgtId], idx) => {
          const src = NODES.find(n => n.id === srcId)!;
          const tgt = NODES.find(n => n.id === tgtId)!;
          const d = `M ${src.x} ${src.y} L ${tgt.x} ${tgt.y}`;
          
          return (
            <g key={`edge-${idx}`}>
              <motion.path
                d={d}
                stroke="#6C7DFF"
                strokeWidth="1"
                opacity="0.3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.5, delay: 1 + (idx * 0.1), ease: "easeOut" }}
              />
              {/* Traveling Pulse */}
              {isInView && (
                <motion.circle
                  r="2"
                  fill="#5EF2D6"
                  filter="url(#nodeGlow)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ 
                    duration: 3 + Math.random() * 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 2 + Math.random() * 2
                  }}
                  style={{ offsetPath: `path("${d}")` }}
                />
              )}
            </g>
          );
        })}

        {/* Ripples */}
        {NODES.map((node) => (
          <motion.circle
            key={`ripple-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.id === hoveredNode ? 30 : 0}
            fill="none"
            stroke="#5EF2D6"
            strokeWidth="1"
            initial={{ opacity: 0, r: node.r }}
            animate={
              node.id === hoveredNode 
                ? { opacity: [0.8, 0], r: [node.r, node.r + 30] } 
                : { opacity: 0, r: node.r }
            }
            transition={{ duration: 1, repeat: node.id === hoveredNode ? Infinity : 0 }}
          />
        ))}

        {/* Nodes */}
        {NODES.map((node, idx) => (
          <motion.g 
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: idx * 0.08 }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r + 4}
              fill="none"
              stroke="#6C7DFF"
              strokeWidth="1"
              opacity="0.5"
              filter="url(#nodeGlow)"
              style={{
                r: node.id === hoveredNode ? node.r + 8 : node.r + 4,
                stroke: node.id === hoveredNode ? "#5EF2D6" : "#6C7DFF",
                opacity: node.id === hoveredNode ? 1 : 0.5,
                transition: "all 0.3s ease"
              }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="url(#nodeFill)"
            />
            <text
              x={node.x}
              y={node.y + node.r + 14}
              fill="rgba(255,255,255,0.6)"
              fontSize="10"
              textAnchor="middle"
              fontFamily="sans-serif"
              style={{
                fill: node.id === hoveredNode ? "#fff" : "rgba(255,255,255,0.6)",
                fontWeight: node.id === hoveredNode ? "bold" : "normal",
              }}
            >
              {node.name}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function NetworkSection() {
  return (
    <section id="network" className="py-32 relative z-10 w-full overflow-hidden border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-[40%] flex flex-col items-start">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6"
            >
              A Living Network
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/70 mb-10 leading-relaxed"
            >
              Every message travels across our intelligent routing fabric. Real-time, adaptive, and always-on.
            </motion.p>

            <div className="flex flex-col gap-6 w-full">
              {[
                "Adaptive Routing — finds the fastest path in milliseconds",
                "Signal Redundancy — 99.99% uptime guarantee",
                "Edge Computing — processing happens closer to you"
              ].map((bullet, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="flex items-start gap-4 relative"
                >
                  <div className="w-1 h-full absolute left-0 top-0 bottom-0 bg-primary/20 rounded-full" />
                  <div className="w-1 h-6 absolute left-0 top-0 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" />
                  <p className="text-white/80 pl-6">{bullet}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[60%] flex justify-center mt-10 lg:mt-0">
            <NetworkVisualization />
          </div>

        </div>
      </div>
    </section>
  );
}
