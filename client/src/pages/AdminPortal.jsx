import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiFile, FiChevronDown, FiChevronRight, FiSave, FiTrash2, FiCheck, FiX, FiEdit, FiInbox } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AdminPortal() {
  const { isAdmin, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [experiments, setExperiments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [editJson, setEditJson] = useState('');
  const [activeTab, setActiveTab] = useState('experiments');
  const [expandedFolders, setExpandedFolders] = useState({ chemistry: true, physics: false, cs: false });

  const token = localStorage.getItem('labverse_token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [expRes, subRes] = await Promise.all([
        axios.get('/experiments'),
        axios.get('/admin/submissions', authHeaders),
      ]);
      setExperiments(expRes.data);
      setSubmissions(subRes.data);
    } catch { /* ignore */ }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await login(username, password);
    } catch {
      setLoginError('Invalid credentials');
    }
  };

  const selectExperiment = (exp) => {
    setSelectedExp(exp);
    setEditJson(JSON.stringify(exp, null, 2));
  };

  const saveExperiment = async () => {
    if (!selectedExp) return;
    try {
      const data = JSON.parse(editJson);
      await axios.put(`/admin/experiments/${selectedExp.id}`, data, authHeaders);
      await fetchData();
      alert('Saved!');
    } catch { alert('Invalid JSON or save failed.'); }
  };

  const approveSubmission = async (id) => {
    try {
      await axios.put(`/admin/submissions/${id}/approve`, {}, authHeaders);
      await fetchData();
    } catch { alert('Failed to approve.'); }
  };

  const rejectSubmission = async (id) => {
    try {
      await axios.delete(`/admin/submissions/${id}`, authHeaders);
      await fetchData();
    } catch { alert('Failed to reject.'); }
  };

  const toggleFolder = (key) => {
    setExpandedFolders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // LOGIN SCREEN
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0a0e1a' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <span className="text-3xl">🔐</span>
            <h2 className="text-xl font-bold mt-2" style={{ fontFamily: 'Syne', color: '#e2e8f0' }}>Admin Portal</h2>
            <p className="text-xs mt-1" style={{ color: '#64748b' }}>LabVerse Control Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontFamily: 'JetBrains Mono' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontFamily: 'JetBrains Mono' }} />
            {loginError && <p className="text-xs" style={{ color: '#ff3a3a' }}>{loginError}</p>}
            <button type="submit" className="btn-primary w-full">{authLoading ? 'Logging in...' : 'Login'}</button>
          </form>
          <button onClick={() => navigate('/')} className="w-full mt-3 text-xs text-center cursor-pointer" style={{ color: '#64748b', background: 'none', border: 'none' }}>
            ← Back to LabVerse
          </button>
        </motion.div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  const groupedExperiments = {
    chemistry: experiments.filter(e => e.subject === 'chemistry'),
    physics: experiments.filter(e => e.subject === 'physics'),
    cs: experiments.filter(e => e.subject === 'cs'),
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: '#1e1e2e' }}>
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ background: '#181825', borderBottom: '1px solid #2d2d3d' }}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color: '#00f5ff', fontFamily: 'JetBrains Mono' }}>⚗️ LabVerse Admin</span>
          <div className="flex gap-1 ml-4">
            <button onClick={() => setActiveTab('experiments')} className="text-xs px-3 py-1 rounded cursor-pointer"
              style={{ background: activeTab === 'experiments' ? '#2d2d3d' : 'transparent', color: activeTab === 'experiments' ? '#e2e8f0' : '#64748b', border: 'none', fontFamily: 'JetBrains Mono' }}>
              Experiments
            </button>
            <button onClick={() => setActiveTab('submissions')} className="text-xs px-3 py-1 rounded cursor-pointer relative"
              style={{ background: activeTab === 'submissions' ? '#2d2d3d' : 'transparent', color: activeTab === 'submissions' ? '#e2e8f0' : '#64748b', border: 'none', fontFamily: 'JetBrains Mono' }}>
              Pending {submissions.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center" style={{ background: '#ff3a3a', color: '#fff', fontSize: 9 }}>{submissions.length}</span>}
            </button>
          </div>
        </div>
        {selectedExp && (
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} onClick={saveExperiment}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded cursor-pointer"
              style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88', fontFamily: 'JetBrains Mono' }}>
              <FiSave size={12} /> Save
            </motion.button>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar — file tree */}
        <div className="admin-sidebar w-64 shrink-0 overflow-y-auto p-2">
          {activeTab === 'experiments' ? (
            <div>
              <p className="text-xs px-3 py-2 uppercase" style={{ color: '#64748b', letterSpacing: '1px' }}>Explorer</p>
              {Object.entries(groupedExperiments).map(([subject, exps]) => (
                <div key={subject}>
                  <button onClick={() => toggleFolder(subject)} className="file-tree-item w-full" style={{ border: 'none', background: 'none' }}>
                    {expandedFolders[subject] ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
                    <FiFolder size={12} style={{ color: subject === 'chemistry' ? '#00f5ff' : subject === 'physics' ? '#ffaa00' : '#a855f7' }} />
                    <span className="capitalize">{subject === 'cs' ? 'Computer Science' : subject}</span>
                    <span className="ml-auto" style={{ color: '#475569', fontSize: 10 }}>{exps.length}</span>
                  </button>
                  {expandedFolders[subject] && exps.map(exp => (
                    <button key={exp.id} onClick={() => selectExperiment(exp)}
                      className={`file-tree-item w-full pl-8 ${selectedExp?.id === exp.id ? 'active' : ''}`}
                      style={{ border: 'none', background: selectedExp?.id === exp.id ? 'rgba(0,245,255,0.1)' : 'none', fontSize: '0.75rem' }}>
                      <FiFile size={11} />
                      <span className="truncate">{exp.title}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-xs px-3 py-2 uppercase" style={{ color: '#64748b', letterSpacing: '1px' }}>
                <FiInbox size={12} className="inline mr-1" /> Pending Submissions
              </p>
              {submissions.length === 0 ? (
                <p className="text-xs px-3 py-4" style={{ color: '#475569' }}>No pending submissions</p>
              ) : (
                submissions.map(sub => (
                  <div key={sub.id} className="p-3 mb-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#e2e8f0' }}>{sub.title}</p>
                    <p className="text-xs mb-2" style={{ color: '#64748b' }}>{sub.description?.slice(0, 80)}...</p>
                    <p className="text-xs mb-2" style={{ color: '#475569' }}>By: {sub.studentName || 'Anonymous'}</p>
                    <div className="flex gap-2">
                      <button onClick={() => approveSubmission(sub.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded cursor-pointer"
                        style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88' }}>
                        <FiCheck size={10} /> Approve
                      </button>
                      <button onClick={() => rejectSubmission(sub.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded cursor-pointer"
                        style={{ background: 'rgba(255,58,58,0.1)', border: '1px solid rgba(255,58,58,0.2)', color: '#ff3a3a' }}>
                        <FiX size={10} /> Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: Editor */}
        <div className="admin-editor flex-1 overflow-hidden flex flex-col">
          {selectedExp ? (
            <>
              <div className="px-4 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid #2d2d3d' }}>
                <FiEdit size={12} style={{ color: '#00f5ff' }} />
                <span className="text-xs" style={{ color: '#e2e8f0' }}>{selectedExp.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full ml-2" style={{
                  background: selectedExp.status === 'Live' ? 'rgba(0,255,136,0.1)' : 'rgba(255,170,0,0.1)',
                  color: selectedExp.status === 'Live' ? '#00ff88' : '#ffaa00',
                  fontSize: 10,
                }}>{selectedExp.status}</span>
              </div>
              <textarea
                value={editJson}
                onChange={(e) => setEditJson(e.target.value)}
                className="flex-1 w-full p-4 outline-none resize-none"
                style={{
                  background: '#0d1117',
                  color: '#e2e8f0',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  border: 'none',
                }}
                spellCheck={false}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg mb-2" style={{ color: '#2d2d3d' }}>⚗️</p>
                <p className="text-sm" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>
                  Select an experiment to edit
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
