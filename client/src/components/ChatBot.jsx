import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiCpu } from 'react-icons/fi';
import { useGemini } from '../hooks/useGemini';
import { useLab } from '../context/LabContext';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your LabVerse AI Assistant 🧪 Ask me anything about your experiment!' }
  ]);
  const [input, setInput] = useState('');
  const { chat, generateQuiz, loading } = useGemini();
  const { getLabContext, classLevel } = useLab();
  const messagesEndRef = useRef(null);
  const [quizActive, setQuizActive] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await chat(
        newMessages.filter(m => m.role !== 'system'),
        getLabContext()
      );
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Sorry, I couldn\'t process that. Check if the API key is configured.' }]);
    }
  };

  const handleQuiz = async () => {
    setQuizActive(true);
    setQuizIndex(0);
    setQuizScore(0);
    setMessages(prev => [...prev, { role: 'assistant', content: '🧠 Generating a quiz based on your lab work...' }]);
    try {
      const quiz = await generateQuiz(getLabContext(), classLevel);
      setQuizData(quiz);
      setMessages(prev => [...prev, { role: 'assistant', content: `📝 Quiz ready! ${quiz.length} questions. Let's go!`, quiz: true }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Couldn\'t generate quiz. Try again!' }]);
      setQuizActive(false);
    }
  };

  const answerQuiz = (selectedIndex) => {
    if (!quizData) return;
    const q = quizData[quizIndex];
    const correct = selectedIndex === q.correctIndex;
    if (correct) setQuizScore(s => s + 1);

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: correct
        ? `✅ Correct! ${q.explanation}`
        : `❌ Wrong! The answer was: ${q.options[q.correctIndex]}. ${q.explanation}`,
    }]);

    if (quizIndex + 1 < quizData.length) {
      setQuizIndex(i => i + 1);
    } else {
      const finalScore = correct ? quizScore + 1 : quizScore;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🎉 Quiz complete! Score: ${finalScore}/${quizData.length} ${finalScore === quizData.length ? '🏆 Perfect!' : finalScore >= quizData.length / 2 ? '👏 Great job!' : '📚 Keep practicing!'}`,
      }]);
      setQuizActive(false);
      setQuizData(null);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #00f5ff, #00a8b0)',
          color: '#0a0e1a',
          border: 'none',
          boxShadow: '0 0 30px rgba(0,245,255,0.3)',
        }}
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-40 flex flex-col"
            style={{
              width: 380,
              height: 520,
              background: 'rgba(10, 14, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,245,255,0.15)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0,245,255,0.1)' }}>
              <div className="flex items-center gap-2">
                <FiCpu size={16} style={{ color: '#00f5ff' }} />
                <span className="font-bold text-sm" style={{ color: '#00f5ff', fontFamily: 'Syne' }}>
                  AI Lab Assistant
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuiz}
                disabled={loading || quizActive}
                className="text-xs px-3 py-1 rounded-lg cursor-pointer font-semibold"
                style={{
                  background: 'rgba(255,170,0,0.15)',
                  border: '1px solid rgba(255,170,0,0.3)',
                  color: '#ffaa00',
                  fontFamily: 'Syne',
                  opacity: loading || quizActive ? 0.5 : 1,
                }}
              >
                🧠 Quiz Me
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: 'thin' }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="px-3 py-2 rounded-xl max-w-xs text-sm"
                    style={{
                      background: m.role === 'user' ? 'rgba(0,245,255,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${m.role === 'user' ? 'rgba(0,245,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                      color: '#e2e8f0',
                      lineHeight: 1.6,
                      fontFamily: 'Syne',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Quiz question */}
              {quizActive && quizData && quizData[quizIndex] && (
                <div className="glass-card p-3 mt-2">
                  <p className="text-sm font-semibold mb-3" style={{ color: '#ffaa00', fontFamily: 'Syne' }}>
                    Q{quizIndex + 1}: {quizData[quizIndex].question}
                  </p>
                  <div className="flex flex-col gap-2">
                    {quizData[quizIndex].options.map((opt, oi) => (
                      <motion.button
                        key={oi}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => answerQuiz(oi)}
                        className="text-left text-xs px-3 py-2 rounded-lg cursor-pointer"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#e2e8f0',
                          fontFamily: 'JetBrains Mono',
                        }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', color: '#64748b' }}>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      Thinking...
                    </motion.span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(0,245,255,0.1)' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your experiment..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: '#e2e8f0', fontFamily: 'Syne' }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="p-2 rounded-lg cursor-pointer"
                style={{
                  background: input.trim() ? 'rgba(0,245,255,0.15)' : 'transparent',
                  border: 'none',
                  color: input.trim() ? '#00f5ff' : '#64748b',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <FiSend size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
