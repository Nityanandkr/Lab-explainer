import { motion } from 'framer-motion';
import { FiClock, FiZap, FiBell } from 'react-icons/fi';

const difficultyColors = {
  Beginner: { bg: 'rgba(0,255,136,0.1)', color: '#00ff88', border: 'rgba(0,255,136,0.2)' },
  Intermediate: { bg: 'rgba(0,245,255,0.1)', color: '#00f5ff', border: 'rgba(0,245,255,0.2)' },
  Advanced: { bg: 'rgba(255,170,0,0.1)', color: '#ffaa00', border: 'rgba(255,170,0,0.2)' },
};

const subjectIcons = { chemistry: '🧪', physics: '⚡', cs: '💻' };

export default function ExperimentCard({ experiment, onClick, locked = false }) {
  const dc = difficultyColors[experiment.difficulty] || difficultyColors.Intermediate;
  const isLive = experiment.status === 'Live';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={!locked ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      onClick={!locked ? onClick : undefined}
      className="glass-card p-5 cursor-pointer relative overflow-hidden"
      style={{
        filter: locked ? 'blur(2px)' : 'none',
        pointerEvents: locked ? 'none' : 'auto',
      }}
    >
      {/* Locked overlay */}
      {locked && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl"
          style={{
            background: 'rgba(10,14,26,0.7)',
            backdropFilter: 'blur(4px)',
            pointerEvents: 'auto',
            filter: 'none',
          }}
        >
          <FiClock size={28} style={{ color: '#ffaa00' }} />
          <span className="text-sm font-semibold" style={{ color: '#ffaa00', fontFamily: 'Syne' }}>
            Coming Soon
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold mt-1"
            style={{
              background: 'rgba(255,170,0,0.15)',
              border: '1px solid rgba(255,170,0,0.3)',
              color: '#ffaa00',
              cursor: 'pointer',
              fontFamily: 'Syne',
            }}
            onClick={(e) => {
              e.stopPropagation();
              alert('🔔 You\'ll be notified when this launches!');
            }}
          >
            <FiBell size={12} /> Notify Me
          </motion.button>
        </div>
      )}

      {/* Top row: subject icon + status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xl">{subjectIcons[experiment.subject]}</span>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{
            background: isLive ? 'rgba(0,255,136,0.1)' : 'rgba(255,170,0,0.1)',
            color: isLive ? '#00ff88' : '#ffaa00',
            border: `1px solid ${isLive ? 'rgba(0,255,136,0.2)' : 'rgba(255,170,0,0.2)'}`,
            fontFamily: 'JetBrains Mono',
          }}
        >
          {isLive ? '● Live' : '◌ Coming Soon'}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-lg font-bold mb-2"
        style={{ fontFamily: 'Syne', color: '#e2e8f0', lineHeight: 1.3 }}
      >
        {experiment.title}
      </h3>

      {/* Description */}
      <p className="text-sm mb-4" style={{ color: '#94a3b8', lineHeight: 1.6 }}>
        {experiment.description}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Class levels */}
        <span
          className="text-xs px-2 py-1 rounded-md"
          style={{
            background: 'rgba(0,245,255,0.06)',
            color: '#00f5ff',
            fontFamily: 'JetBrains Mono',
            border: '1px solid rgba(0,245,255,0.1)',
          }}
        >
          Class {experiment.classLevel[0]}–{experiment.classLevel[experiment.classLevel.length - 1]}
        </span>

        {/* Difficulty */}
        <span
          className="text-xs px-2 py-1 rounded-md flex items-center gap-1"
          style={{
            background: dc.bg,
            color: dc.color,
            border: `1px solid ${dc.border}`,
            fontFamily: 'JetBrains Mono',
          }}
        >
          <FiZap size={10} /> {experiment.difficulty}
        </span>
      </div>

      {/* Hover glow line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)' }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
