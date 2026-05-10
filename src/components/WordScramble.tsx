import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, CheckCircle2, XCircle, RotateCcw, Trophy, Zap, Cpu } from 'lucide-react';

interface WordScrambleProps {
  sentence: string;
  onComplete?: (score: number) => void;
}

const WordScramble: React.FC<WordScrambleProps> = ({ sentence, onComplete }) => {
  const [originalWords, setOriginalWords] = useState<string[]>([]);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const words = sentence.trim().split(/\s+/);
    setOriginalWords(words);
    
    // Scramble words
    const scrambled = [...words].sort(() => Math.random() - 0.5);
    // Ensure it's actually scrambled (not by chance in correct order)
    if (scrambled.join(' ') === sentence && words.length > 1) {
      scrambled.reverse();
    }
    
    setScrambledWords(scrambled);
    setCurrentOrder([]);
    setIsCorrect(null);
  }, [sentence]);

  const handleWordClick = (word: string, index: number) => {
    if (isCorrect === true) return;
    
    // Remove from scrambled, add to currentOrder
    const newScrambled = [...scrambledWords];
    newScrambled.splice(index, 1);
    setScrambledWords(newScrambled);
    setCurrentOrder([...currentOrder, word]);
  };

  const handleRemoveClick = (word: string, index: number) => {
    if (isCorrect === true) return;

    // Remove from currentOrder, add back to scrambled
    const newOrder = [...currentOrder];
    newOrder.splice(index, 1);
    setCurrentOrder(newOrder);
    setScrambledWords([...scrambledWords, word]);
  };

  const checkAnswer = () => {
    setAttempts(a => a + 1);
    const result = currentOrder.join(' ') === originalWords.join(' ');
    setIsCorrect(result);
    
    if (result && onComplete) {
      const timeTaken = (Date.now() - startTime) / 1000;
      const score = Math.max(100 - Math.floor(timeTaken) - (attempts * 10), 50);
      onComplete(score);
    }
  };

  const resetGame = () => {
    const scrambled = [...originalWords].sort(() => Math.random() - 0.5);
    setScrambledWords(scrambled);
    setCurrentOrder([]);
    setIsCorrect(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyber-indigo/20 rounded-xl text-cyber-indigo border border-cyber-indigo/30">
            <Shuffle size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Sync Order Protocol</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Type: Sentence_Scramble_V1</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Latency</div>
            <div className="font-bold text-cyber-cyan">{(Date.now() - startTime < 3600000) ? Math.floor((Date.now() - startTime)/1000) : '--'}s</div>
          </div>
          <div className="h-8 w-px bg-white/5"></div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Attempts</div>
            <div className="font-bold text-cyber-pink">{attempts}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-[40px] border border-white/5 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>

        <div className="relative z-10 space-y-12">
          {/* Current Selection Area */}
          <div className="min-h-[80px] p-6 rounded-3xl border-2 border-dashed border-white/5 bg-slate-900/40 flex flex-wrap gap-2 items-center justify-center">
            {currentOrder.length === 0 && (
              <span className="text-slate-600 font-bold italic text-sm">Select blocks below to reconstruct sequence...</span>
            )}
            <AnimatePresence>
              {currentOrder.map((word, i) => (
                <motion.button
                  key={`cur-${i}-${word}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => handleRemoveClick(word, i)}
                  className={`px-5 py-2 rounded-xl font-bold shadow-xl transition-all ${isCorrect === true ? 'bg-green-500 text-white' : 'bg-cyber-indigo text-white hover:bg-cyber-pink'}`}
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Word Pool Area */}
          <div className="flex flex-wrap gap-3 justify-center">
            <AnimatePresence>
              {scrambledWords.map((word, i) => (
                <motion.button
                  key={`pool-${i}-${word}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  onClick={() => handleWordClick(word, i)}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:border-cyber-indigo/50 hover:bg-cyber-indigo/10 transition-all shadow-lg"
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 text-center">O escribe la respuesta completa:</div>
            <input 
              type="text" 
              className="w-full bg-slate-900/60 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-cyber-indigo outline-none transition-all font-sans text-sm"
              placeholder="Escribe la oración aquí..."
              onChange={(e) => {
                const val = e.target.value;
                if (val.trim().toLowerCase() === sentence.trim().toLowerCase()) {
                  setCurrentOrder(originalWords);
                  setIsCorrect(true);
                  if (onComplete) onComplete(100);
                }
              }}
            />
          </div>
        </div>

        {/* Feedback Alpha */}
        <AnimatePresence>
          {isCorrect !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute bottom-0 inset-x-0 p-4 text-center font-black uppercase tracking-[0.3em] text-[10px] ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
            >
              {isCorrect ? 'Synchronization Success' : 'Integrity Failure - Re-Initialize'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center space-x-6">
        <button 
          onClick={resetGame}
          className="p-5 rounded-3xl bg-slate-800 text-white hover:bg-slate-700 transition-all group"
          title="Reset"
        >
          <RotateCcw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
        
        <button 
          onClick={checkAnswer}
          disabled={currentOrder.length !== originalWords.length || isCorrect === true}
          className={`flex-1 max-w-xs py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl flex items-center justify-center space-x-3
            ${currentOrder.length === originalWords.length && isCorrect !== true
              ? 'bg-cyber-indigo text-white hover:scale-105 shadow-cyber-indigo/40' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
        >
          <Zap size={18} />
          <span>Execute Analysis</span>
        </button>
      </div>

      {isCorrect === true && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-10 rounded-[40px] border border-green-500/20 bg-green-500/5 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <Trophy size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">PHASE COMPLETE</h2>
          <p className="text-slate-400 text-sm">Target sentence has been perfectly synchronized. Your linguistic accuracy is within acceptable parameters.</p>
          <div className="flex justify-center items-center space-x-12 pt-4">
            <div className="text-center">
              <div className="text-2xl font-black text-white tracking-wider">100%</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Integrity</div>
            </div>
            <div className="w-px h-10 bg-white/5"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-white tracking-wider">{(Date.now() - startTime < 3600000) ? Math.floor((Date.now() - startTime)/1000) : '--'}s</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Sync Time</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WordScramble;
