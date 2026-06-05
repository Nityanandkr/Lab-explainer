import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BetaGenerator from '../components/BetaGenerator';

const subjects = [
  { key: 'chemistry', label: 'Chemistry', icon: '🧪', color: '#00f5ff', desc: 'Explore reactions, elements, and molecular structures' },
  { key: 'physics', label: 'Physics', icon: '⚡', color: '#ffaa00', desc: 'Discover forces, energy, and the laws of nature' },
  { key: 'cs', label: 'Computer Science', icon: '💻', color: '#a855f7', desc: 'Visualize algorithms, data structures, and logic' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pt-20"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="relative px-6 py-24 text-center overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
              style={{
                width: 3 + Math.random() * 4,
                height: 3 + Math.random() * 4,
                background: i % 2 === 0 ? '#00f5ff' : '#ffaa00',
                left: `${Math.random() * 100}%`,
                top: `${60 + Math.random() * 40}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-6xl mb-6"
        >
          ⚗️
        </motion.div>

        <h1
          className="text-5xl md:text-7xl font-black mb-4"
          style={{ fontFamily: 'Syne', lineHeight: 1.1 }}
        >
          <span style={{ color: '#e2e8f0' }}>Welcome to </span>
          <span className="text-glow-primary" style={{ color: '#00f5ff' }}>Lab</span>
          <span className="text-glow-accent" style={{ color: '#ffaa00' }}>Verse</span>
        </h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-8"
          style={{ color: '#94a3b8', fontFamily: 'Syne', lineHeight: 1.7 }}
        >
          Your interactive virtual science lab. Experiment, discover, and learn — 
          without the safety goggles. <span style={{ color: '#ffaa00' }}>(Well, maybe keep them on.)</span>
        </motion.p>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/subject/chemistry')}
          className="btn-primary text-lg px-10 py-4"
        >
          🧪 Start Experimenting
        </motion.button>
      </motion.section>

      {/* Subject Selector */}
      <motion.section variants={itemVariants} className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-3" style={{ fontFamily: 'Syne', color: '#e2e8f0' }}>
          Choose Your Lab
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: '#64748b', fontFamily: 'Syne' }}>
          Select a subject to explore its experiments
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {subjects.map((subj, i) => (
            <motion.div
              key={subj.key}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.03 }}
              onClick={() => navigate(`/subject/${subj.key}`)}
              className="glass-card p-8 cursor-pointer text-center relative overflow-hidden group"
            >
              {/* Glow bg on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at center, ${subj.color}08 0%, transparent 70%)` }} />

              <motion.span
                className="text-5xl block mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 + i * 0.5, ease: 'easeInOut' }}
              >
                {subj.icon}
              </motion.span>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne', color: subj.color }}>
                {subj.label}
              </h3>
              <p className="text-sm" style={{ color: '#94a3b8', lineHeight: 1.6 }}>{subj.desc}</p>

              {/* Bottom glow line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${subj.color}, transparent)` }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Experiment */}
      <motion.section variants={itemVariants} className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="glass-card p-8 relative overflow-hidden cursor-pointer"
            onClick={() => navigate('/experiment/chem-001')}
            style={{
              background: 'linear-gradient(135deg, rgba(0,245,255,0.05) 0%, rgba(255,170,0,0.03) 100%)',
              border: '1px solid rgba(0,245,255,0.15)',
            }}
          >
            <div className="absolute top-4 right-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{
                background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)', fontFamily: 'JetBrains Mono'
              }}>● LIVE</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: '#ffaa00', fontFamily: 'Syne' }}>
              🔬 FEATURED EXPERIMENT
            </span>
            <h3 className="text-2xl font-bold mt-2 mb-2" style={{ fontFamily: 'Syne', color: '#e2e8f0' }}>
              Metals, Non-Metals & Reactions
            </h3>
            <p className="text-sm mb-4" style={{ color: '#94a3b8', lineHeight: 1.7 }}>
              Drag and drop elements onto a virtual lab bench. Watch displacement reactions, neutralization, and even explosions unfold with real-time animations and AI-powered explanations.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Drag & Drop', 'Reactions', 'Animations', 'AI Tutor', 'Quizzes'].map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-md" style={{
                  background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.1)', color: '#00f5ff', fontFamily: 'JetBrains Mono'
                }}>{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Beta Generator Section */}
      <motion.div variants={itemVariants}>
        <div className="max-w-5xl mx-auto px-6">
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.2), transparent)', margin: '0 0 20px 0' }} />
        </div>
        <BetaGenerator />
      </motion.div>

      {/* Footer */}
      <footer className="px-6 py-12 mt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-lg font-bold" style={{ fontFamily: 'Syne' }}>
              <span style={{ color: '#00f5ff' }}>Lab</span>
              <span style={{ color: '#ffaa00' }}>Verse</span>
            </span>
            <p className="text-xs mt-1" style={{ color: '#64748b' }}>Interactive Virtual Science Lab Platform</p>
          </div>
          <div className="flex gap-6 text-sm" style={{ color: '#64748b', fontFamily: 'Syne' }}>
            <span className="cursor-pointer hover:text-cyan-400 transition-colors">About</span>
            <span className="cursor-pointer hover:text-cyan-400 transition-colors">Contact</span>
            <span className="cursor-pointer hover:text-cyan-400 transition-colors">GitHub</span>
          </div>
          <p className="text-xs" style={{ color: '#475569' }}>© 2026 LabVerse. Built with 🧪 and ❤️</p>
        </div>
      </footer>
    </motion.div>
  );
}
