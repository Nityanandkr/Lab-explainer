import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiLogOut, FiVolume2, FiVolumeX } from 'react-icons/fi';

export default function Navbar({ soundEnabled, onToggleSound }) {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 245, 255, 0.08)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <motion.div
          className="text-2xl font-bold"
          style={{ fontFamily: 'Syne, sans-serif', color: '#00f5ff' }}
          whileHover={{ scale: 1.05 }}
        >
          <span style={{ textShadow: '0 0 20px rgba(0,245,255,0.5)' }}>⚗️ Lab</span>
          <span style={{ color: '#ffaa00', textShadow: '0 0 20px rgba(255,170,0,0.5)' }}>Verse</span>
        </motion.div>
      </Link>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Sound toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSound}
          className="p-2 rounded-lg cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: soundEnabled ? '#00f5ff' : '#64748b',
          }}
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
        </motion.button>

        {/* Admin button */}
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin')}
              className="btn-ghost text-sm flex items-center gap-2"
            >
              🛡️ Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="p-2 rounded-lg cursor-pointer"
              style={{
                background: 'rgba(255,58,58,0.1)',
                border: '1px solid rgba(255,58,58,0.2)',
                color: '#ff3a3a',
              }}
              title="Logout"
            >
              <FiLogOut size={16} />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin')}
            className="p-2 rounded-lg cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748b',
            }}
            title="Admin Login"
          >
            <FiLock size={16} />
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}
