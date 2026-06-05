import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubjectPage from './pages/SubjectPage';
import ExperimentLab from './pages/ExperimentLab';
import AdminPortal from './pages/AdminPortal';
import useSound from './hooks/useSound';

// FAAAH explosion screen if not React (Easter egg — always shows React is working)
function NotReactCheck() {
  return null; // React is loaded, no explosion needed 🎉
}

function AppRoutes() {
  const location = useLocation();
  const { soundEnabled, setSoundEnabled } = useSound();
  const isLabPage = location.pathname.startsWith('/experiment/');
  const isAdminPage = location.pathname === '/admin';

  return (
    <>
      {/* Show navbar except on full-screen lab and admin pages */}
      {!isLabPage && !isAdminPage && (
        <Navbar
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />
      )}

      {/* Mobile banner */}
      <div
        className="mobile-banner fixed top-0 left-0 right-0 z-[100] items-center justify-center p-4 text-center"
        style={{
          background: 'rgba(255,170,0,0.15)',
          borderBottom: '1px solid rgba(255,170,0,0.3)',
          color: '#ffaa00',
          fontFamily: 'Syne',
          fontSize: '0.85rem',
          display: 'none', // shown via CSS media query
        }}
      >
        📱 For the best experience, use a desktop browser
      </div>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/subject/:subject" element={<SubjectPage />} />
          <Route path="/experiment/:id" element={<ExperimentLab />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </AnimatePresence>

      <NotReactCheck />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
