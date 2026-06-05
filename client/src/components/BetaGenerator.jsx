import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZap, FiSend } from 'react-icons/fi';
import { useGemini } from '../hooks/useGemini';
import axios from 'axios';

export default function BetaGenerator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { generateExperiment, loading } = useGemini();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    try {
      const exp = await generateExperiment(input.trim());
      setResult(exp);
      setShowModal(true);
    } catch {
      alert('Failed to generate. Check API key.');
    }
  };

  const handleSubmitToAdmin = async () => {
    if (!result) return;
    try {
      await axios.post('/experiments/request', {
        title: result.title,
        description: result.description,
        subject: result.subject,
        classLevel: result.classLevel?.[0] || 10,
        difficulty: result.difficulty,
        tags: result.tags,
        studentName: 'Beta Lab User',
        studentEmail: '',
      });
      setSubmitted(true);
      setTimeout(() => { setShowModal(false); setSubmitted(false); setResult(null); setInput(''); }, 2000);
    } catch {
      alert('Failed to submit. Try again.');
    }
  };

  return (
    <section className="py-16 px-6 relative" id="beta-lab">
      {/* Beta badge */}
      <div className="flex justify-center mb-6">
        <motion.span
          animate={{ boxShadow: ['0 0 10px rgba(0,245,255,0.2)', '0 0 30px rgba(0,245,255,0.4)', '0 0 10px rgba(0,245,255,0.2)'] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sm font-bold px-4 py-2 rounded-full"
          style={{
            background: 'rgba(0,245,255,0.1)',
            border: '1px solid rgba(0,245,255,0.3)',
            color: '#00f5ff',
            fontFamily: 'JetBrains Mono',
          }}
        >
          ⚗️ BETA
        </motion.span>
      </div>

      <h2 className="text-3xl font-bold text-center mb-2" style={{ fontFamily: 'Syne', color: '#e2e8f0' }}>
        Beta Lab — AI-Generated Experiments
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: '#64748b', fontFamily: 'Syne' }}>
        Experimental Feature: Type any experiment idea and AI will generate a full scaffold
      </p>

      <div className="max-w-xl mx-auto">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g., Electrolysis of water, pH testing of household items..."
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: 'rgba(17,24,39,0.7)',
              border: '1px solid rgba(0,245,255,0.15)',
              color: '#e2e8f0',
              fontFamily: 'Syne',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="btn-primary flex items-center gap-2"
            style={{ opacity: loading || !input.trim() ? 0.5 : 1 }}
          >
            <FiZap size={16} /> {loading ? 'Generating...' : 'Generate'}
          </motion.button>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showModal && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#00f5ff', fontFamily: 'Syne' }}>
                    {result.title}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>{result.description}</p>
                </div>
                <button onClick={() => setShowModal(false)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <FiX size={20} />
                </button>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass-card-subtle p-3">
                  <span className="text-xs" style={{ color: '#64748b' }}>Subject</span>
                  <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{result.subject}</p>
                </div>
                <div className="glass-card-subtle p-3">
                  <span className="text-xs" style={{ color: '#64748b' }}>Difficulty</span>
                  <p className="text-sm font-semibold" style={{ color: '#ffaa00' }}>{result.difficulty}</p>
                </div>
              </div>

              {/* Materials */}
              {result.materials && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold mb-2" style={{ color: '#00f5ff' }}>Materials</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.materials.map((m, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-md" style={{
                        background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.1)', color: '#94a3b8', fontFamily: 'JetBrains Mono'
                      }}>{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Procedure */}
              {result.procedure && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold mb-2" style={{ color: '#ffaa00' }}>Procedure</h4>
                  {result.procedure.map((s, i) => (
                    <div key={i} className="flex gap-3 mb-2">
                      <span className="text-xs font-bold px-2 py-1 rounded-full h-fit" style={{
                        background: 'rgba(255,170,0,0.1)', color: '#ffaa00', fontFamily: 'JetBrains Mono', minWidth: 28, textAlign: 'center'
                      }}>{s.step}</span>
                      <div>
                        <p className="text-sm" style={{ color: '#e2e8f0' }}>{s.instruction}</p>
                        {s.expectedResult && <p className="text-xs mt-1" style={{ color: '#64748b' }}>→ {s.expectedResult}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Safety */}
              {result.safetyWarnings?.length > 0 && (
                <div className="mb-4 glass-card-subtle p-3" style={{ border: '1px solid rgba(255,58,58,0.2)' }}>
                  <h4 className="text-sm font-bold mb-2" style={{ color: '#ff3a3a' }}>⚠️ Safety</h4>
                  {result.safetyWarnings.map((w, i) => (
                    <p key={i} className="text-xs mb-1" style={{ color: '#fca5a5' }}>• {w}</p>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button className="btn-ghost text-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitToAdmin}
                  disabled={submitted}
                  className="btn-accent text-sm flex items-center gap-2"
                >
                  <FiSend size={14} /> {submitted ? '✓ Submitted!' : 'Submit to Admin for Review'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
