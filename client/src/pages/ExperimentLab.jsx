import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { LabProvider, useLab } from '../context/LabContext';
import ElementPanel from '../components/ElementPanel';
import WorkBench from '../components/WorkBench';
import ChatBot from '../components/ChatBot';

function LabContent() {
  const { classLevel, setClassLevel } = useLab();
  const navigate = useNavigate();
  const classOptions = [6, 7, 8, 9, 10, 11, 12, 'College'];

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0a0e1a' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ background: 'rgba(10,14,26,0.95)', borderBottom: '1px solid rgba(0,245,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/subject/chemistry')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontFamily: 'Syne' }}>
            <FiArrowLeft size={12} /> Back
          </motion.button>
          <h2 className="text-sm font-bold" style={{ color: '#00f5ff', fontFamily: 'Syne' }}>
            🧪 Metals, Non-Metals & Reactions
          </h2>
        </div>

        {/* Class level selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: '#64748b', fontFamily: 'Syne' }}>Class Level:</span>
          <select
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value === 'College' ? 13 : parseInt(e.target.value))}
            className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{
              background: 'rgba(0,245,255,0.08)',
              border: '1px solid rgba(0,245,255,0.2)',
              color: '#00f5ff',
              fontFamily: 'JetBrains Mono',
            }}
          >
            {classOptions.map(cl => (
              <option key={cl} value={cl} style={{ background: '#0a0e1a', color: '#e2e8f0' }}>
                {cl === 'College' ? 'College' : `Class ${cl}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main lab area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Element Panel */}
        <div className="w-72 shrink-0 overflow-hidden">
          <ElementPanel />
        </div>

        {/* Center: Work Bench */}
        <WorkBench />
      </div>

      {/* Chatbot (floating) */}
      <ChatBot />
    </div>
  );
}

export default function ExperimentLab() {
  return (
    <LabProvider>
      <LabContent />
    </LabProvider>
  );
}
