import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRotateCcw, FiTrash2, FiMousePointer, FiTrash, FiInfo, FiChevronDown, FiChevronUp, FiVolume2, FiVolumeX, FiBell, FiBellOff } from 'react-icons/fi';
import { useLab } from '../context/LabContext';
import { checkReaction, getElementInfo } from './ReactionEngine';
import AtomicViewer from './AtomicViewer';
import KaboomOverlay from './KaboomOverlay';
import useSound from '../hooks/useSound';

// Image map same as ElementPanel
const ELEMENT_IMAGES = {
  Na: '/elements/Na.png', K: '/elements/K.png', Fe: '/elements/Fe.png',
  Zn: '/elements/Zn.png', Mg: '/elements/Mg.png', Ca: '/elements/Ca.png',
  Cu: '/elements/Cu.png', Au: '/elements/Au.png', Ag: '/elements/Ag.png',
  S: '/elements/S.png', C: '/elements/C.png',
  HCl: '/elements/HCl.png', NaOH: '/elements/NaOH.png',
  Beaker: '/elements/beaker.png', 'Test Tube': '/elements/test_tube.png',
  'Bunsen Burner': '/elements/bunsen_burner.png', 'Conical Flask': '/elements/conical_flask.png',
};

const CAT_COLORS = {
  metal: '#00f5ff', nonmetal: '#ffaa00', acid: '#ff5555',
  base: '#00ff88', apparatus: '#94a3b8',
  salt: '#f8fafc', liquid: '#3b82f6', gas: '#c084fc',
};

// Bubble particle
function BubbleParticles({ x, y }) {
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y, zIndex: 30 }}>
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
          animate={{ x: (Math.random() - 0.5) * 60, y: -40 - Math.random() * 40, opacity: 0, scale: 0.3 }}
          transition={{ duration: 1.2 + Math.random() * 0.5, delay: i * 0.08 }}
          className="absolute rounded-full"
          style={{ width: 6 + Math.random() * 6, height: 6 + Math.random() * 6,
            background: 'rgba(0,245,255,0.4)', border: '1px solid rgba(0,245,255,0.7)' }} />
      ))}
    </div>
  );
}

// Fire particles
function FireEffect({ x, y }) {
  return (
    <div className="pointer-events-none absolute" style={{ left: x - 20, top: y - 60, zIndex: 30 }}>
      <motion.div animate={{ scaleY: [1, 1.15, 0.9, 1.1, 1], scaleX: [1, 0.9, 1.05, 0.95, 1] }}
        transition={{ repeat: 6, duration: 0.3 }}
        style={{ width: 40, height: 70,
          background: 'radial-gradient(ellipse at bottom, #ff6600 0%, #ff4500 40%, transparent 80%)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', filter: 'blur(2px)' }} />
    </div>
  );
}

// Shimmer effect
function ShimmerEffect({ x, y }) {
  return (
    <motion.div className="pointer-events-none absolute rounded-full" style={{ left: x - 40, top: y - 40, width: 80, height: 80, zIndex: 30 }}
      animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 0.5] }}
      transition={{ duration: 1.5, repeat: 3 }}
    >
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,170,0,0.3), transparent)' }} />
    </motion.div>
  );
}

// A single item placed on the bench — draggable freely
function BenchItem({ item, onRemove, onDragEnd, selectMode, onDoubleClickItem }) {
  const imgKey = item.symbol || item.name;
  const imgSrc = ELEMENT_IMAGES[imgKey] || ELEMENT_IMAGES[item.name] || null;
  const color = CAT_COLORS[item.category] || '#94a3b8';
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: item.x || 100, y: item.y || 100 });
  const [isDragging, setIsDragging] = useState(false);

  const onDoubleClick = (e) => {
    e.stopPropagation();
    if (onDoubleClickItem) onDoubleClickItem(item);
  };

  const onMouseDown = (e) => {
    if (selectMode) { onRemove(item.benchId); return; }
    e.preventDefault();
    dragging.current = true;
    setIsDragging(true);
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    const onMove = (me) => {
      if (!dragging.current) return;
      setPos({ x: me.clientX - offset.current.x, y: me.clientY - offset.current.y });
    };
    const onUp = (me) => {
      dragging.current = false;
      setIsDragging(false);
      const finalPos = { x: me.clientX - offset.current.x, y: me.clientY - offset.current.y };
      setPos(finalPos);
      onDragEnd(item.benchId, finalPos);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      title={item.category !== 'apparatus' && item.category !== 'salt' && item.category !== 'gas' && item.category !== 'liquid' ? "Drag to move. Double-click for atomic view!" : "Drag to move"}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        cursor: selectMode ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 50 : 10,
        userSelect: 'none',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div
        animate={{ scale: isDragging ? 1.1 : 1, boxShadow: isDragging ? `0 8px 30px ${color}40` : `0 2px 8px rgba(0,0,0,0.3)` }}
        className="flex flex-col items-center gap-1 p-2 rounded-xl"
        style={{
          background: 'rgba(10,14,26,0.88)',
          border: `1.5px solid ${color}50`,
          backdropFilter: 'blur(8px)',
          width: 76,
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* Image or fallback */}
        <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          {imgSrc ? (
            <img src={imgSrc} alt={item.name} className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          ) : null}
          <div className="w-full h-full items-center justify-center text-xl"
            style={{ display: imgSrc ? 'none' : 'flex', color }}>
            {item.category === 'apparatus' ? '🔬' : 
             item.category === 'acid' ? '🧪' : 
             item.category === 'base' ? '🫧' : 
             item.category === 'salt' ? '🧂' : 
             item.category === 'liquid' ? '💧' : 
             item.category === 'gas' ? '☁️' : '⚛️'}
          </div>
        </div>
        <span className="font-bold" style={{ color, fontFamily: 'JetBrains Mono', fontSize: 10 }}>
          {item.symbol}
        </span>
        <span className="text-center leading-tight" style={{ color: '#94a3b8', fontSize: 8, fontFamily: 'Syne' }}>
          {item.name.length > 10 ? item.name.slice(0,9)+'…' : item.name}
        </span>
        {selectMode && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: '#ff3a3a', fontSize: 9 }}>✕</div>
        )}
      </motion.div>
    </div>
  );
}

// Procedure guide panel
const PROCEDURE_STEPS = [
  { id: 1, text: 'Select your apparatus (Beaker or Test Tube) from the left panel and drag it onto the bench.' },
  { id: 2, text: 'Pick a chemical — like HCl (acid) or NaOH (base) — and drag it on top of your apparatus.' },
  { id: 3, text: 'Add a second chemical (e.g., Zinc metal). Watch the reaction happen!' },
  { id: 4, text: 'Read the reaction info at the top-right. Click "Quiz Me" in the chat to test yourself.' },
  { id: 5, text: 'Try Na or K + Water for a KABOOM 💥 (stand back!).' },
  { id: 6, text: 'Double-click any pure element on the bench to open its Atomic Structure Viewer! ⚛️' },
];

function ProcedureGuide({ currentReaction, show, onToggle }) {
  return (
    <div className="shrink-0" style={{ borderTop: '1px solid rgba(0,245,255,0.08)' }}>
      {/* Toggle bar */}
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 cursor-pointer"
        style={{ background: 'rgba(0,245,255,0.03)', border: 'none', color: '#00f5ff', fontFamily: 'Syne', fontSize: 12 }}>
        <span>📋 Procedure Guide</span>
        {show ? <FiChevronDown size={14} /> : <FiChevronUp size={14} />}
      </button>

      <AnimatePresence>
        {show && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden">
            <div className="px-4 py-3 flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
              {PROCEDURE_STEPS.map((step) => {
                const active = currentReaction && step.id === 3;
                return (
                  <div key={step.id} className="shrink-0 p-3 rounded-xl flex gap-2"
                    style={{
                      width: 220,
                      background: active ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${active ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
                    }}>
                    <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: active ? '#00f5ff' : 'rgba(255,255,255,0.08)', color: active ? '#0a0e1a' : '#64748b' }}>
                      {step.id}
                    </span>
                    <p style={{ color: active ? '#e2e8f0' : '#94a3b8', fontSize: 11, lineHeight: 1.5, fontFamily: 'Syne' }}>
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Active reaction info */}
            {currentReaction && (
              <div className="mx-4 mb-3 p-3 rounded-xl" style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.1)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#00f5ff', fontFamily: 'JetBrains Mono' }}>
                  ⚗️ Active: {currentReaction.equation}
                </p>
                <p className="text-xs" style={{ color: '#94a3b8', lineHeight: 1.6, fontFamily: 'Syne' }}>
                  {currentReaction.explanation}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WorkBench() {
  const { benchItems, addToBench, removeFromBench, clearBench, undo, updateItemPosition, transformReactantsToProducts,
    classLevel, addReaction, addToast, toasts, reactions } = useLab();
  const { playExplosion, playBubble, playClick, playPour, playSuccess, playFaah, soundEnabled, setSoundEnabled } = useSound();
  const [selectMode, setSelectMode] = useState(false);
  const [kaboom, setKaboom] = useState(null);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [lastReactionKey, setLastReactionKey] = useState('');
  const [showAtomicViewer, setShowAtomicViewer] = useState(false);
  const [atomicElement, setAtomicElement] = useState(null);
  const [effects, setEffects] = useState([]); // { id, type, x, y }
  const [didYouKnow, setDidYouKnow] = useState(null);
  const [showProcedure, setShowProcedure] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const benchRef = useRef(null);

  // Place item at drop position
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = benchRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      playClick();
      addToBench({ ...data, x, y });

      // Safety toast if no apparatus
      if (data.category !== 'apparatus') {
        const hasApparatus = benchItems.some(i => i.category === 'apparatus');
        if (!hasApparatus) {
          addToast('⚠️ Pro tip: Drop a Beaker or Test Tube first, then add chemicals into it!', 'warning');
        }
      }
    } catch { /* ignore */ }
  }, [addToBench, benchItems, addToast, playClick]);

  // Update position when item dragged around bench
  const handleItemDragEnd = useCallback((benchId, newPos) => {
    updateItemPosition(benchId, newPos.x, newPos.y);
  }, [updateItemPosition]);

  const handleItemDoubleClick = useCallback((item) => {
    if (item.category === 'apparatus') return;
    const info = getElementInfo(item.symbol);
    if (info) {
      setAtomicElement(info);
      setShowAtomicViewer(true);
    } else {
      addToast(`Atomic view not available for ${item.name}`, 'info');
    }
  }, [addToast]);

  // Reaction checker
  useEffect(() => {
    if (benchItems.length < 2) return;
    const result = checkReaction(benchItems, classLevel);
    if (!result.found) return;

    const key = benchItems.filter(i => i.category !== 'apparatus').map(i => i.symbol).sort().join('+');
    if (key === lastReactionKey) return;
    setLastReactionKey(key);

    if (result.kaboom) {
      playExplosion();
      setKaboom(result);
      return;
    }

    if (result.type === 'No Reaction') {
      setCurrentReaction(result);
      return; // No further processing for No Reaction
    }

    // Spawn effect at center of bench
    const rect = benchRef.current?.getBoundingClientRect();
    const cx = (rect?.width || 600) / 2;
    const cy = (rect?.height || 400) / 2;
    const eid = Date.now();

    if (result.animation === 'bubbles' || result.animation === 'vigorous_bubbles' || result.animation === 'slow_bubbles') {
      playBubble();
      setEffects(prev => [...prev, { id: eid, type: 'bubbles', x: cx, y: cy }]);
    } else if (result.animation === 'fire' || result.animation === 'explosion') {
      if (result.animation === 'explosion') {
        playExplosion();
      } else {
        playPour();
      }
      setEffects(prev => [...prev, { id: eid, type: 'fire', x: cx, y: cy }]);
    } else if (result.animation === 'heat_shimmer') {
      playPour();
      setEffects(prev => [...prev, { id: eid, type: 'shimmer', x: cx, y: cy }]);
    }

    setTimeout(() => setEffects(prev => prev.filter(ef => ef.id !== eid)), 3000);

    // Swap reactants for products after a short delay (so effects show up over the reactants first)
    setTimeout(() => {
      if (result.products && result.reactantBenchIds) {
        transformReactantsToProducts(result.reactantBenchIds, result.products);
      }
    }, 1200);

    if (result.safetyWarning) addToast('⚠️ Use a Beaker or Test Tube for safety!', 'warning');

    addReaction({ description: result.equation, type: result.type, time: new Date().toLocaleTimeString() });
    setCurrentReaction(result);
    playSuccess();

    if (result.atomicChanges) {
      const info = getElementInfo(benchItems.find(i => i.category !== 'apparatus')?.symbol);
      if (info) { setAtomicElement(info); setShowAtomicViewer(true); }
    }

    if (result.didYouKnow) {
      setTimeout(() => {
        setDidYouKnow(result.didYouKnow);
        setTimeout(() => setDidYouKnow(null), 5000);
      }, 1500);
    }
  }, [benchItems, classLevel]);

  const handleKaboomDismiss = useCallback(() => { setKaboom(null); undo(); setLastReactionKey(''); }, [undo]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0 flex-wrap"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.08)', background: 'rgba(10,14,26,0.5)' }}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={undo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontFamily: 'Syne' }}>
          <FiRotateCcw size={11} /> Undo
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { clearBench(); setCurrentReaction(null); setLastReactionKey(''); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontFamily: 'Syne' }}>
          <FiTrash size={11} /> Clear All
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setSelectMode(!selectMode)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer"
          style={{
            background: selectMode ? 'rgba(255,58,58,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${selectMode ? 'rgba(255,58,58,0.3)' : 'rgba(255,255,255,0.08)'}`,
            color: selectMode ? '#ff3a3a' : '#94a3b8', fontFamily: 'Syne',
          }}>
          <FiMousePointer size={11} /> {selectMode ? 'Cancel Delete Mode' : 'Delete Item'}
        </motion.button>

        {/* Toggles */}
        <div className="flex gap-1 ml-2 border-l pl-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ background: soundEnabled ? 'rgba(0,245,255,0.1)' : 'rgba(255,255,255,0.05)', color: soundEnabled ? '#00f5ff' : '#64748b' }}
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}>
            {soundEnabled ? <FiVolume2 size={12} /> : <FiVolumeX size={12} />}
          </motion.button>
        </div>

        {/* Reaction History Dropdown */}
        <div className="relative ml-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer"
            style={{ background: 'rgba(0,245,255,0.07)', border: '1px solid rgba(0,245,255,0.15)' }}
          >
            <span className="text-xs font-bold flex items-center gap-2" style={{ color: '#00f5ff', fontFamily: 'JetBrains Mono' }}>
              ⚗️ {currentReaction ? currentReaction.equation : 'Past Reactions'} 
              <FiChevronDown size={12} />
            </span>
          </motion.button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 z-50 p-2 rounded-xl shadow-2xl overflow-y-auto"
                style={{ 
                  background: 'rgba(10,14,26,0.98)', border: '1px solid rgba(0,245,255,0.2)', 
                  backdropFilter: 'blur(20px)', width: 300, maxHeight: 300 
                }}
              >
                <h4 className="text-xs font-bold mb-2 pb-1" style={{ color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'Syne' }}>
                  Reaction History
                </h4>
                {reactions.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: '#475569', fontFamily: 'Syne' }}>No reactions yet.</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {[...reactions].reverse().map((r, idx) => (
                      <div key={idx} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <p className="text-xs font-bold" style={{ color: '#e2e8f0', fontFamily: 'JetBrains Mono' }}>{r.description}</p>
                        <div className="flex justify-between mt-1">
                          <span style={{ fontSize: 9, color: '#00f5ff', fontFamily: 'Syne' }}>{r.type}</span>
                          <span style={{ fontSize: 9, color: '#64748b' }}>{r.time || 'Just now'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.1)', color: '#00f5ff', fontFamily: 'JetBrains Mono' }}>
          Class {classLevel}
        </div>
      </div>

      {/* Main canvas + atomic viewer row */}
      <div className="flex-1 flex overflow-hidden">
        {/* FREE CANVAS — the lab bench */}
        <motion.div
          ref={benchRef}
          className="flex-1 relative overflow-hidden"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            background: 'linear-gradient(180deg, #0f1420 0%, #0a0e1a 100%)',
            backgroundImage: `
              linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        >
          {/* Bench surface line */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(0,245,255,0.02))', borderTop: '1px solid rgba(0,245,255,0.06)' }} />

          {/* Empty state */}
          {benchItems.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="text-5xl opacity-20">🧪</motion.div>
              <p className="text-sm opacity-30" style={{ color: '#94a3b8', fontFamily: 'Syne' }}>
                Drag elements &amp; apparatus anywhere on the bench
              </p>
            </div>
          )}

          {/* Delete mode overlay hint */}
          {selectMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full text-xs font-semibold pointer-events-none"
              style={{ background: 'rgba(255,58,58,0.15)', border: '1px solid rgba(255,58,58,0.3)', color: '#ff3a3a', fontFamily: 'Syne' }}>
              🗑️ Click any item to remove it
            </div>
          )}

          {/* Reaction effects */}
          {effects.map(ef => (
            ef.type === 'bubbles' ? <BubbleParticles key={ef.id} x={ef.x} y={ef.y} /> :
            ef.type === 'fire'    ? <FireEffect key={ef.id} x={ef.x} y={ef.y} /> :
                                    <ShimmerEffect key={ef.id} x={ef.x} y={ef.y} />
          ))}

          {/* Bench items — freely placed */}
          {benchItems.map((item) => (
            <BenchItem
              key={item.benchId}
              item={item}
              selectMode={selectMode}
              onRemove={(id) => { removeFromBench(id); playClick(); }}
              onDragEnd={handleItemDragEnd}
              onDoubleClickItem={handleItemDoubleClick}
            />
          ))}

          {/* Did You Know popup */}
          <AnimatePresence>
            {didYouKnow && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 right-4 z-30 p-4 rounded-xl max-w-xs"
                style={{ background: 'rgba(10,14,26,0.95)', border: '1px solid rgba(255,170,0,0.25)', backdropFilter: 'blur(12px)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#ffaa00', fontFamily: 'Syne' }}>💡 Did You Know?</p>
                <p className="text-xs" style={{ color: '#e2e8f0', lineHeight: 1.6, fontFamily: 'Syne' }}>{didYouKnow}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toasts */}
          <div className="absolute bottom-4 right-4 z-40 flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
              {toasts.map(t => (
                <motion.div key={t.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                  className={`toast toast-${t.type} pointer-events-auto`}>{t.message}</motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Atomic viewer side panel */}
        <AnimatePresence>
          {showAtomicViewer && atomicElement && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden shrink-0 flex flex-col"
              style={{ borderLeft: '1px solid rgba(0,245,255,0.08)', background: 'rgba(10,14,26,0.7)' }}>
              <div className="p-3">
                <AtomicViewer elementInfo={atomicElement} show={showAtomicViewer} />
              </div>
              <button onClick={() => setShowAtomicViewer(false)}
                className="mx-3 mb-3 text-xs py-1.5 rounded-lg cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b', fontFamily: 'Syne' }}>
                Close Viewer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Procedure guide at bottom */}
      <ProcedureGuide currentReaction={currentReaction} show={showProcedure} onToggle={() => setShowProcedure(v => !v)} />

      {/* KABOOM */}
      <KaboomOverlay show={!!kaboom} safetyExplanation={kaboom?.safetyExplanation} onDismiss={handleKaboomDismiss} />
    </div>
  );
}
