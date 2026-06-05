import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KaboomOverlay({ show, safetyExplanation, onDismiss }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      const p = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        dx: (Math.random() - 0.5) * 800,
        dy: (Math.random() - 0.5) * 800,
        size: Math.random() * 20 + 5,
        color: ['#ff4500', '#ff6600', '#ffaa00', '#ff0000', '#ff8800'][Math.floor(Math.random() * 5)],
        duration: Math.random() * 0.8 + 0.5,
      }));
      setParticles(p);

      const timer = setTimeout(() => onDismiss(), 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="kaboom-overlay"
          style={{ cursor: 'pointer' }}
          onClick={onDismiss}
        >
          {/* Particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: p.dx, y: p.dy, scale: 0, opacity: 0 }}
              transition={{ duration: p.duration, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: p.color,
                top: '50%',
                left: '50%',
                boxShadow: `0 0 10px ${p.color}`,
              }}
            />
          ))}

          {/* Center content */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-center z-10 px-8"
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              💥
            </motion.div>
            <h1
              className="text-5xl font-black mb-4"
              style={{
                fontFamily: 'Syne',
                color: '#ffaa00',
                textShadow: '0 0 40px rgba(255,170,0,0.8), 0 0 80px rgba(255,68,0,0.5)',
              }}
            >
              KABOOM!
            </h1>
            <p className="text-lg mb-6 max-w-lg mx-auto" style={{ color: '#ffd4a8', fontFamily: 'Syne' }}>
              Don't mix highly reactive metals carelessly!
            </p>
            <div
              className="glass-card p-4 max-w-lg mx-auto mb-6"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,170,0,0.3)' }}
            >
              <p className="text-sm" style={{ color: '#e2e8f0', lineHeight: 1.7, fontFamily: 'JetBrains Mono' }}>
                {safetyExplanation || 'Always handle reactive chemicals with proper safety equipment and apparatus!'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDismiss}
              className="btn-accent text-sm"
            >
              ↩ Undo & Continue
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
