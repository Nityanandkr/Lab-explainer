import { motion } from 'framer-motion';

export default function AtomicViewer({ elementInfo, show }) {
  if (!show || !elementInfo) return null;

  const { name, symbol, electrons, protons, neutrons, atomicNumber } = elementInfo;
  const shellColors = ['#00f5ff', '#ffaa00', '#ff3a3a', '#00ff88', '#a855f7', '#ec4899'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-card p-4"
      style={{ minWidth: 240 }}
    >
      <h4 className="text-sm font-bold mb-3" style={{ color: '#00f5ff', fontFamily: 'Syne' }}>
        ⚛️ Atomic Structure: {name} ({symbol})
      </h4>

      {/* Atom visualization */}
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 200, margin: '0 auto' }}>
        {/* Nucleus */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            background: 'radial-gradient(circle, #ff6b35, #d63031)',
            boxShadow: '0 0 15px rgba(255,107,53,0.5)',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 8, color: '#fff', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
            {protons}p
          </span>
        </motion.div>

        {/* Electron shells */}
        {electrons && electrons.map((count, shellIdx) => {
          const radius = 35 + shellIdx * 25;
          const color = shellColors[shellIdx % shellColors.length];

          return (
            <g key={shellIdx}>
              {/* Shell ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: radius * 2,
                  height: radius * 2,
                  border: `1px dashed ${color}33`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              {/* Electrons on this shell */}
              {Array.from({ length: Math.min(count, 8) }, (_, eIdx) => {
                const angle = (eIdx / Math.min(count, 8)) * 2 * Math.PI;
                return (
                  <motion.div
                    key={`${shellIdx}-${eIdx}`}
                    className="absolute rounded-full"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3 + shellIdx * 1.5,
                      ease: 'linear',
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                      top: `calc(50% + ${Math.sin(angle) * radius}px - 4px)`,
                      left: `calc(50% + ${Math.cos(angle) * radius}px - 4px)`,
                      zIndex: 5,
                    }}
                  />
                );
              })}
            </g>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-xs" style={{ fontFamily: 'JetBrains Mono' }}>
          <span style={{ color: '#94a3b8' }}>Atomic Number</span>
          <span style={{ color: '#00f5ff' }}>{atomicNumber}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ fontFamily: 'JetBrains Mono' }}>
          <span style={{ color: '#94a3b8' }}>Protons</span>
          <span style={{ color: '#ff6b35' }}>{protons}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ fontFamily: 'JetBrains Mono' }}>
          <span style={{ color: '#94a3b8' }}>Neutrons</span>
          <span style={{ color: '#94a3b8' }}>{neutrons}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ fontFamily: 'JetBrains Mono' }}>
          <span style={{ color: '#94a3b8' }}>Electrons</span>
          <span style={{ color: '#00f5ff' }}>{electrons?.join(', ')}</span>
        </div>
      </div>
    </motion.div>
  );
}
