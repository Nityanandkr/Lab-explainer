import { createContext, useState, useContext, useCallback } from 'react';

const LabContext = createContext(null);

export function LabProvider({ children }) {
  const [classLevel, setClassLevel] = useState(10);
  const [benchItems, setBenchItems] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [toasts, setToasts] = useState([]);

  const addToBench = useCallback((item) => {
    setBenchItems(prev => {
      const benchId = Date.now() + Math.random();
      const newItem = { ...item, benchId, x: item.x ?? 120, y: item.y ?? 120 };
      const newItems = [...prev, newItem];
      setHistory(h => [...h.slice(0, historyIndex + 1), { items: newItems, reactions }]);
      setHistoryIndex(i => i + 1);
      return newItems;
    });
  }, [historyIndex, reactions]);

  const updateItemPosition = useCallback((benchId, x, y) => {
    setBenchItems(prev => prev.map(it => it.benchId === benchId ? { ...it, x, y } : it));
  }, []);

  const removeFromBench = useCallback((benchId) => {
    setBenchItems(prev => {
      const newItems = prev.filter(i => i.benchId !== benchId);
      setHistory(h => [...h.slice(0, historyIndex + 1), { items: newItems, reactions }]);
      setHistoryIndex(i => i + 1);
      return newItems;
    });
  }, [historyIndex, reactions]);

  const transformReactantsToProducts = useCallback((reactantBenchIds, newProducts) => {
    setBenchItems(prev => {
      const newItems = prev.filter(i => !reactantBenchIds.includes(i.benchId));
      const formattedProducts = newProducts.map(p => ({
        ...p, benchId: Date.now() + Math.random()
      }));
      const finalItems = [...newItems, ...formattedProducts];
      setHistory(h => [...h.slice(0, historyIndex + 1), { items: finalItems, reactions }]);
      setHistoryIndex(i => i + 1);
      return finalItems;
    });
  }, [historyIndex, reactions]);

  const clearBench = useCallback(() => {
    setHistory(h => [...h.slice(0, historyIndex + 1), { items: [], reactions: [] }]);
    setHistoryIndex(i => i + 1);
    setBenchItems([]);
    setReactions([]);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setBenchItems(prev.items);
      setReactions(prev.reactions);
      setHistoryIndex(i => i - 1);
    }
  }, [historyIndex, history]);

  const addReaction = useCallback((reaction) => {
    setReactions(prev => [...prev, reaction]);
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const getLabContext = useCallback(() => ({
    chemicals: benchItems.filter(i => i.category !== 'apparatus').map(i => i.name),
    apparatus: benchItems.filter(i => i.category === 'apparatus').map(i => i.name),
    reactions: reactions.map(r => r.description),
    classLevel
  }), [benchItems, reactions, classLevel]);

  return (
    <LabContext.Provider value={{
      classLevel, setClassLevel,
      benchItems, addToBench, removeFromBench, clearBench, updateItemPosition, transformReactantsToProducts,
      reactions, addReaction,
      history, undo,
      toasts, addToast,
      getLabContext
    }}>
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  const ctx = useContext(LabContext);
  if (!ctx) throw new Error('useLab must be used within LabProvider');
  return ctx;
}
