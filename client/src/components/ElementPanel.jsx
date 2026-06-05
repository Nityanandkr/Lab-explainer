import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { getElementInfo } from './ReactionEngine';

// Image map — real photos stored locally in /public/elements/
const ELEMENT_IMAGES = {
  Na: '/elements/Na.png',
  K:  '/elements/K.png',
  Fe: '/elements/Fe.png',
  Zn: '/elements/Zn.png',
  Mg: '/elements/Mg.png',
  Ca: '/elements/Ca.png',
  Cu: '/elements/Cu.png',
  Au: '/elements/Au.png',
  Ag: '/elements/Ag.png',
  S:  '/elements/S.png',
  C:  '/elements/C.png',
  HCl:     '/elements/HCl.png',
  NaOH:    '/elements/NaOH.png',
  Beaker:        '/elements/beaker.png',
  'Test Tube':   '/elements/test_tube.png',
  'Bunsen Burner': '/elements/bunsen_burner.png',
  'Conical Flask': '/elements/conical_flask.png',
};

// Colour fallbacks for items without photos
const CATEGORY_COLORS = {
  metal:    { bg: 'rgba(0,245,255,0.08)',   border: 'rgba(0,245,255,0.2)',   text: '#00f5ff' },
  nonmetal: { bg: 'rgba(255,170,0,0.08)',   border: 'rgba(255,170,0,0.2)',   text: '#ffaa00' },
  acid:     { bg: 'rgba(255,58,58,0.08)',    border: 'rgba(255,58,58,0.2)',   text: '#ff5555' },
  base:     { bg: 'rgba(0,255,136,0.08)',    border: 'rgba(0,255,136,0.2)',   text: '#00ff88' },
  apparatus:{ bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', text: '#94a3b8' },
};

const ELEMENTS = {
  metals: {
    label: '🔩 Metals', category: 'metal',
    items: [
      { name:'Sodium',    symbol:'Na', category:'metal' },
      { name:'Potassium', symbol:'K',  category:'metal' },
      { name:'Iron',      symbol:'Fe', category:'metal' },
      { name:'Zinc',      symbol:'Zn', category:'metal' },
      { name:'Magnesium', symbol:'Mg', category:'metal' },
      { name:'Calcium',   symbol:'Ca', category:'metal' },
      { name:'Copper',    symbol:'Cu', category:'metal' },
      { name:'Aluminum',  symbol:'Al', category:'metal' },
      { name:'Gold',      symbol:'Au', category:'metal' },
      { name:'Silver',    symbol:'Ag', category:'metal' },
    ],
  },
  nonmetals: {
    label: '💨 Non-Metals', category: 'nonmetal',
    items: [
      { name:'Sulfur',    symbol:'S',   category:'nonmetal' },
      { name:'Carbon',    symbol:'C',   category:'nonmetal' },
      { name:'Chlorine',  symbol:'Cl',  category:'nonmetal' },
      { name:'Oxygen',    symbol:'O₂',  category:'nonmetal' },
      { name:'Nitrogen',  symbol:'N₂',  category:'nonmetal' },
      { name:'Phosphorus',symbol:'P',   category:'nonmetal' },
      { name:'Silicon',   symbol:'Si',  category:'nonmetal' },
      { name:'Bromine',   symbol:'Br',  category:'nonmetal' },
      { name:'Iodine',    symbol:'I',   category:'nonmetal' },
      { name:'Hydrogen',  symbol:'H₂',  category:'nonmetal' },
    ],
  },
  acids: {
    label: '🧪 Acids', category: 'acid',
    items: [
      { name:'Hydrochloric Acid', symbol:'HCl',      category:'acid' },
      { name:'Sulfuric Acid',     symbol:'H₂SO₄',    category:'acid' },
      { name:'Nitric Acid',       symbol:'HNO₃',     category:'acid' },
      { name:'Acetic Acid',       symbol:'CH₃COOH',  category:'acid' },
    ],
  },
  bases: {
    label: '🫧 Bases', category: 'base',
    items: [
      { name:'Sodium Hydroxide',    symbol:'NaOH',    category:'base' },
      { name:'Potassium Hydroxide', symbol:'KOH',     category:'base' },
      { name:'Calcium Hydroxide',   symbol:'Ca(OH)₂', category:'base' },
      { name:'Ammonia',             symbol:'NH₃',     category:'base' },
    ],
  },
  apparatus: {
    label: '🔬 Apparatus', category: 'apparatus',
    items: [
      { name:'Beaker',        symbol:'Beaker',        category:'apparatus' },
      { name:'Test Tube',     symbol:'Test Tube',     category:'apparatus' },
      { name:'Bunsen Burner', symbol:'Bunsen Burner', category:'apparatus' },
      { name:'Conical Flask', symbol:'Conical Flask', category:'apparatus' },
      { name:'Petri Dish',    symbol:'Petri Dish',    category:'apparatus' },
      { name:'Dropper',       symbol:'Dropper',       category:'apparatus' },
      { name:'Stirring Rod',  symbol:'Stirring Rod',  category:'apparatus' },
      { name:'Litmus Paper',  symbol:'Litmus Paper',  category:'apparatus' },
    ],
  },
};

import { createPortal } from 'react-dom';

function PropertyTooltip({ info, category, rect }) {
  if (!info || !rect) return null;
  const hazardColors = { green: '#00ff88', yellow: '#ffaa00', red: '#ff3a3a' };
  
  // Prevent tooltip from overflowing the bottom of the screen
  const safeTop = Math.min(rect.top, window.innerHeight - 200);

  const tooltipContent = (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="fixed z-[9999] p-3 rounded-xl pointer-events-none"
      style={{
        top: safeTop,
        left: rect.right + 12,
        background: 'rgba(10,14,26,0.98)',
        border: '1px solid rgba(0,245,255,0.2)',
        backdropFilter: 'blur(20px)',
        minWidth: 210,
        maxWidth: 240,
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
      }}
    >
      <h5 className="font-bold text-sm mb-2" style={{ color: '#00f5ff', fontFamily: 'Syne' }}>
        {info.name} <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>({info.symbol})</span>
      </h5>
      <div className="space-y-1" style={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}>
        <p><span style={{ color:'#64748b' }}>State: </span><span style={{ color:'#e2e8f0' }}>{info.state}</span></p>
        <p><span style={{ color:'#64748b' }}>Color: </span><span style={{ color:'#e2e8f0' }}>{info.color}</span></p>
        <p><span style={{ color:'#64748b' }}>Reactivity: </span><span style={{ color:'#e2e8f0' }}>{info.reactivity}</span></p>
        <p>
          <span style={{ color:'#64748b' }}>Hazard: </span>
          <span style={{ color: hazardColors[info.hazard] || '#94a3b8' }}>
            {info.hazard === 'red' ? '🔴 High' : info.hazard === 'yellow' ? '🟡 Medium' : '🟢 Low'}
          </span>
        </p>
        <p style={{ color:'#64748b', marginTop: 4 }}>{info.uses}</p>
      </div>
    </motion.div>
  );

  return createPortal(tooltipContent, document.body);
}

/* Individual draggable card in the panel */
function ElementCard({ item }) {
  const imgKey = item.symbol || item.name;
  const imgSrc = ELEMENT_IMAGES[imgKey] || ELEMENT_IMAGES[item.name] || null;
  const col = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.apparatus;
  const [hovered, setHovered] = useState(false);
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);
  const tooltipInfo = item.category !== 'apparatus' ? getElementInfo(item.symbol) : null;

  const handleDragStart = (e) => {
    const payload = { ...item };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
    setHovered(true);
  };

  return (
    <div className="relative" style={{ userSelect: 'none' }} ref={cardRef}>
      <motion.div
        draggable
        onDragStart={handleDragStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-1 p-2 rounded-xl cursor-grab active:cursor-grabbing"
        style={{
          background: hovered ? col.bg : 'rgba(255,255,255,0.02)',
          border: `1px solid ${hovered ? col.border : 'rgba(255,255,255,0.05)'}`,
          transition: 'background 0.2s, border 0.2s',
          width: 72,
        }}
        title={`Drag ${item.name} onto the bench`}
      >
        {/* Image or emoji fallback */}
        <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div
            className="w-full h-full items-center justify-center text-xl hidden"
            style={{ display: imgSrc ? 'none' : 'flex' }}
          >
            {item.category === 'apparatus' ? '🔬' :
             item.category === 'acid'      ? '🧪' :
             item.category === 'base'      ? '🫧' : '⚛️'}
          </div>
        </div>

        {/* Symbol */}
        <span className="font-bold leading-none" style={{ color: col.text, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
          {item.symbol.length > 6 ? item.symbol.slice(0,5)+'…' : item.symbol}
        </span>
        {/* Name */}
        <span className="text-center leading-tight" style={{ color: '#64748b', fontSize: 9, fontFamily: 'Syne', maxWidth: 68 }}>
          {item.name.length > 10 ? item.name.slice(0,9)+'…' : item.name}
        </span>
      </motion.div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && tooltipInfo && <PropertyTooltip info={tooltipInfo} category={item.category} rect={rect} />}
      </AnimatePresence>
    </div>
  );
}

export default function ElementPanel() {
  const [expanded, setExpanded] = useState({ metals: true, nonmetals: true, acids: true, bases: true, apparatus: true });

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: 'rgba(10,14,26,0.7)',
        borderRight: '1px solid rgba(0,245,255,0.08)',
      }}
    >
      <div className="px-3 pt-3 pb-2 shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b', fontFamily: 'Syne' }}>
          🧬 Elements &amp; Apparatus
        </h3>
        <p className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: 'Syne' }}>Drag anything onto the bench</p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4" style={{ scrollbarWidth: 'thin' }}>
        {Object.entries(ELEMENTS).map(([key, section]) => {
          const col = CATEGORY_COLORS[section.category];
          return (
            <div key={key} className="mb-2">
              {/* Section header */}
              <button
                onClick={() => toggle(key)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer mb-1"
                style={{ background: 'none', border: 'none', color: col.text, fontFamily: 'Syne', textAlign: 'left' }}
              >
                {expanded[key] ? <FiChevronDown size={11} /> : <FiChevronRight size={11} />}
                {section.label}
                <span className="ml-auto" style={{ color: '#475569', fontSize: 10 }}>
                  {section.items.length}
                </span>
              </button>

              <AnimatePresence>
                {expanded[key] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-1.5 px-1 pb-1">
                      {section.items.map((item) => (
                        <ElementCard key={item.symbol} item={item} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
