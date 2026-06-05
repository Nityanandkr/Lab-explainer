import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiSend } from 'react-icons/fi';
import axios from 'axios';
import staticData from '../data/experiments.json';
import SearchBar from '../components/SearchBar';
import ExperimentCard from '../components/ExperimentCard';

const subjectMeta = {
  chemistry: { label: 'Chemistry', icon: '🧪', color: '#00f5ff', banner: 'Explore the world of reactions, elements, and chemical bonds' },
  physics: { label: 'Physics', icon: '⚡', color: '#ffaa00', banner: 'Discover the forces and laws that govern the universe' },
  cs: { label: 'Computer Science', icon: '💻', color: '#a855f7', banner: 'Visualize algorithms, data structures, and computational thinking' },
};

const classLevels = [6, 7, 8, 9, 10, 11, 12];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const statuses = ['Live', 'Coming Soon'];

export default function SubjectPage() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const meta = subjectMeta[subject] || subjectMeta.chemistry;
  const isLocked = subject !== 'chemistry';

  const [experiments, setExperiments] = useState([]);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqForm, setReqForm] = useState({ title: '', description: '', classLevel: 10, studentName: '', studentEmail: '' });
  const [reqSent, setReqSent] = useState(false);

  useEffect(() => {
    axios.get(`/experiments?subject=${subject}`)
      .then(res => setExperiments(res.data))
      .catch(() => {
        // Fallback for static deploys (like Netlify) without a running backend
        const localExps = staticData.experiments.filter(e => e.subject === subject);
        setExperiments(localExps);
      });
  }, [subject]);

  // Filter experiments
  const filtered = experiments.filter(e => {
    if (search) {
      const q = search.toLowerCase();
      const match = e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags?.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filterClass && !e.classLevel.includes(filterClass)) return false;
    if (filterDifficulty && e.difficulty !== filterDifficulty) return false;
    if (filterStatus && e.status !== filterStatus) return false;
    return true;
  });

  const handleRequest = async () => {
    if (!reqForm.title || !reqForm.description) return;
    try {
      await axios.post('/experiments/request', { ...reqForm, subject });
      setReqSent(true);
      setTimeout(() => { setShowRequestModal(false); setReqSent(false); setReqForm({ title: '', description: '', classLevel: 10, studentName: '', studentEmail: '' }); }, 2000);
    } catch { alert('Failed to submit request.'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 pb-24">
      {/* Subject Header */}
      <section className="px-6 py-12 text-center relative overflow-hidden">
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-5xl mb-4">
          {meta.icon}
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: 'Syne', color: meta.color }}>
          {meta.label}
        </h1>
        <p className="text-sm" style={{ color: '#94a3b8', fontFamily: 'Syne' }}>{meta.banner}</p>

        {/* Animated underline */}
        <motion.div
          className="mx-auto mt-6"
          animate={{ width: ['0%', '40%', '20%', '30%'] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ height: 2, background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)` }}
        />
      </section>

      {/* Search + Filters */}
      <section className="px-6 mb-8">
        <div className="max-w-3xl mx-auto">
          <SearchBar value={search} onChange={setSearch} placeholder={`Search ${meta.label} experiments...`} />

          {/* Filter chips */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {/* Class levels */}
            {classLevels.map(cl => (
              <motion.button key={cl} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setFilterClass(filterClass === cl ? null : cl)}
                className="text-xs px-3 py-1.5 rounded-full cursor-pointer"
                style={{
                  background: filterClass === cl ? `${meta.color}20` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${filterClass === cl ? `${meta.color}40` : 'rgba(255,255,255,0.06)'}`,
                  color: filterClass === cl ? meta.color : '#64748b',
                  fontFamily: 'JetBrains Mono',
                }}>
                Class {cl}
              </motion.button>
            ))}
            <span style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
            {difficulties.map(d => (
              <motion.button key={d} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setFilterDifficulty(filterDifficulty === d ? null : d)}
                className="text-xs px-3 py-1.5 rounded-full cursor-pointer"
                style={{
                  background: filterDifficulty === d ? 'rgba(255,170,0,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${filterDifficulty === d ? 'rgba(255,170,0,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  color: filterDifficulty === d ? '#ffaa00' : '#64748b',
                  fontFamily: 'Syne',
                }}>
                {d}
              </motion.button>
            ))}
            <span style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
            {statuses.map(s => (
              <motion.button key={s} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                className="text-xs px-3 py-1.5 rounded-full cursor-pointer"
                style={{
                  background: filterStatus === s ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${filterStatus === s ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  color: filterStatus === s ? '#00ff88' : '#64748b',
                  fontFamily: 'Syne',
                }}>
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Experiment Grid */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: '#64748b' }}>No experiments found.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {filtered.map(exp => (
                  <ExperimentCard
                    key={exp.id}
                    experiment={exp}
                    locked={isLocked || exp.status !== 'Live'}
                    onClick={() => {
                      if (exp.status === 'Live' && !isLocked) {
                        navigate(`/experiment/${exp.id}`);
                      }
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Sticky Request Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowRequestModal(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 btn-accent flex items-center gap-2 shadow-lg"
        style={{ boxShadow: '0 4px 30px rgba(255,170,0,0.3)' }}
      >
        <FiPlus size={16} /> Request an Experiment
      </motion.button>

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowRequestModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: '#ffaa00', fontFamily: 'Syne' }}>Request an Experiment</h3>
                <button onClick={() => setShowRequestModal(false)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={20} /></button>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="Experiment name *" value={reqForm.title} onChange={e => setReqForm({ ...reqForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontFamily: 'Syne' }} />
                <textarea placeholder="Description *" rows={3} value={reqForm.description} onChange={e => setReqForm({ ...reqForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontFamily: 'Syne' }} />
                <select value={reqForm.classLevel} onChange={e => setReqForm({ ...reqForm, classLevel: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontFamily: 'Syne' }}>
                  {classLevels.map(cl => <option key={cl} value={cl}>Class {cl}</option>)}
                  <option value={13}>College</option>
                </select>
                <input type="text" placeholder="Your name" value={reqForm.studentName} onChange={e => setReqForm({ ...reqForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontFamily: 'Syne' }} />
                <input type="email" placeholder="Your email" value={reqForm.studentEmail} onChange={e => setReqForm({ ...reqForm, studentEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontFamily: 'Syne' }} />
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleRequest} disabled={reqSent}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                <FiSend size={14} /> {reqSent ? '✓ Submitted!' : 'Submit Request'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
