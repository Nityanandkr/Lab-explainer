import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Search experiments...' }) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className="relative w-full max-w-xl mx-auto"
      animate={{
        boxShadow: focused
          ? '0 0 30px rgba(0, 245, 255, 0.15)'
          : '0 0 0px rgba(0, 245, 255, 0)',
      }}
      style={{ borderRadius: 14 }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background: 'rgba(17, 24, 39, 0.7)',
          border: `1.5px solid ${focused ? 'rgba(0, 245, 255, 0.4)' : 'rgba(255,255,255,0.08)'}`,
          backdropFilter: 'blur(10px)',
          transition: 'border-color 0.3s',
        }}
      >
        <FiSearch size={18} style={{ color: focused ? '#00f5ff' : '#64748b', flexShrink: 0, transition: 'color 0.3s' }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm"
          style={{
            color: '#e2e8f0',
            fontFamily: 'Syne, sans-serif',
            fontSize: '0.95rem',
          }}
        />
        {value && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => onChange('')}
            className="p-1 rounded-full cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: 'none' }}
          >
            <FiX size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
