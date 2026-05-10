import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Play, CheckCircle2, RotateCcw, Sparkles, Send, Info, Headphones, SkipForward, AlertCircle } from 'lucide-react';
import { generateDictation } from '../services/geminiService';
import { useAuth } from './FirebaseProvider';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { diff_match_patch } from 'diff-match-patch';

interface DictationData {
  sentence: string;
  translation: string;
  difficulty: string;
}

const DictationTool: React.FC = () => {
  const { user, addXP } = useAuth();
  const [level, setLevel] = useState('A1');
  const [dictation, setDictation] = useState<DictationData | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; score: number; diffs?: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const dmp = new diff_match_patch();

  const fetchNewDictation = async () => {
    setIsLoading(true);
    setFeedback(null);
    setUserInput('');
    setShowTranslation(false);
    setAttempts(0);
    try {
      const data = await generateDictation(level);
      setDictation(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewDictation();
  }, [level]);

  const speak = (rate = 1) => {
    if (!dictation) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(dictation.sentence);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  const calculateSimilarity = (s1: string, s2: string) => {
    const clean = (s: string) => s.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
    const v1 = clean(s1);
    const v2 = clean(s2);
    
    if (v1 === v2) return 100;
    
    const words1 = v1.split(' ');
    const words2 = v2.split(' ');
    let matches = 0;
    
    words2.forEach(word => {
      if (words1.includes(word)) matches++;
    });
    
    return Math.round((matches / Math.max(words1.length, words2.length)) * 100);
  };

  const handleCheck = async () => {
    if (!dictation || !user) return;
    setIsChecking(true);
    
    const cleanOrig = dictation.sentence.toLowerCase().trim();
    const cleanUser = userInput.toLowerCase().trim();
    
    const score = calculateSimilarity(dictation.sentence, userInput);
    const isCorrect = score >= 90;

    const diffs = dmp.diff_main(cleanOrig, cleanUser);
    dmp.diff_cleanupSemantic(diffs);
    
    setFeedback({ isCorrect, score, diffs });
    setAttempts(prev => prev + 1);

    if (isCorrect) {
      const xpAmount = attempts === 0 ? 15 : 5;
      await addXP(xpAmount);
    } else {
      try {
        const mistakeRef = doc(db, 'error_logs', user.uid);
        const mistakeDoc = await getDoc(mistakeRef);
        const currentMistakes = mistakeDoc.exists() ? mistakeDoc.data().mistakes || [] : [];
        
        await setDoc(mistakeRef, {
          mistakes: [
            {
              type: 'dictation',
              sentence: dictation.sentence,
              yourInput: userInput,
              timestamp: new Date().toISOString()
            },
            ...currentMistakes
          ].slice(0, 50)
        });
      } catch (err) {
        console.error("Error logging mistake:", err);
      }
    }
    
    setIsChecking(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-cyber-indigo/10 rounded-lg text-cyber-indigo">
                <Headphones size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">IA de Pronunciación & Dictado</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Operación Fonética</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-md">Escucha con atención y transcribe con precisión quirúrgica. Elena analizará cada palabra.</p>
          </div>

          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {['A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all ${
                  level === lvl ? 'bg-cyber-indigo text-white shadow-glow-indigo' : 'text-slate-600 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </header>

        <section className="glass-panel p-8 md:p-12 rounded-[48px] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-indigo/10 blur-[120px] -z-10 group-hover:bg-cyber-indigo/15 transition-all"></div>
          
          <div className="flex flex-col items-center space-y-12 text-center">
            <div className="space-y-6">
              <div className="flex justify-center items-center space-x-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speak(1)}
                  disabled={isLoading}
                  className="w-24 h-24 bg-cyber-indigo rounded-[32px] flex items-center justify-center text-white shadow-glow-indigo group transition-all"
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Play size={40} className="ml-1 group-hover:scale-110 transition-transform" />
                  )}
                </motion.button>

                <div className="flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => speak(0.7)}
                    disabled={isLoading}
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                    title="Escuchar lento"
                  >
                    <Volume2 size={20} />
                  </motion.button>
                  <p className="text-[8px] uppercase font-black text-slate-600 tracking-widest text-center">Lento</p>
                </div>
              </div>
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] animate-pulse">Pulsa para transmitir audio</p>
            </div>

            <div className="w-full max-w-2xl space-y-4">
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Escucha y transcribe aquí el protocolo..."
                  className="w-full bg-white/5 border-2 border-white/5 rounded-[32px] p-8 text-white text-xl font-medium focus:border-cyber-indigo focus:bg-white/10 outline-none transition-all min-h-[160px] resize-none placeholder:text-slate-800"
                  disabled={feedback?.isCorrect}
                />
                
                {feedback && feedback.diffs && (
                  <div className="absolute inset-0 p-8 text-xl font-medium leading-relaxed pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-pre-wrap">
                    {feedback.diffs.map(([type, text], i) => (
                      <span key={i} className={
                        type === 0 ? 'text-green-400' :
                        type === -1 ? 'text-red-500 line-through decoration-2' :
                        'text-cyber-indigo underline decoration-2'
                      }>
                        {text}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-6">
                <button 
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center space-x-3"
                >
                  <Info size={14} className={showTranslation ? 'text-cyber-indigo' : ''} />
                  <span>{showTranslation ? 'Ocultar Inteligencia' : 'Ver Traducción Táctica'}</span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-[10px] font-mono text-slate-600 uppercase">Intentos:</div>
                  <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-[10px] font-black text-white">{attempts}</div>
                </div>
              </div>

              <AnimatePresence>
                {showTranslation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-6 bg-cyber-indigo/5 border border-cyber-indigo/20 rounded-3xl text-cyber-indigo text-lg italic shadow-inner"
                  >
                    "{dictation?.translation}"
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleCheck}
                  disabled={!userInput || isChecking || feedback?.isCorrect}
                  className="flex-[2] bg-white text-obsidian py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:hover:scale-100 transition-all shadow-2xl flex items-center justify-center space-x-3"
                >
                  {isChecking ? (
                    <div className="w-6 h-6 border-3 border-obsidian border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Validar Transmisión</span>
                    </>
                  )}
                </button>

                {(feedback?.isCorrect || attempts >= 3) && (
                  <button
                    onClick={fetchNewDictation}
                    className="flex-1 bg-cyber-indigo text-white py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-glow-indigo/20 flex items-center justify-center space-x-3"
                  >
                    <SkipForward size={18} />
                    <span>Siguiente</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel p-10 rounded-[48px] border-2 ${feedback.isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5 shadow-glow-red/5'}`}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex items-center space-x-8">
                  <div className={`p-6 rounded-[32px] ${feedback.isCorrect ? 'bg-green-500/20 text-green-500 shadow-glow-green/20' : 'bg-red-500/20 text-red-500 shadow-glow-red/20'}`}>
                    {feedback.isCorrect ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
                  </div>
                  <div>
                    <h3 className={`text-4xl font-black italic tracking-tighter ${feedback.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {feedback.isCorrect ? 'TRANSMISIÓN LOGRADA' : 'ERROR DE SINCRO'}
                    </h3>
                    <p className="text-slate-400 text-lg mt-1 font-medium italic">Precisión del enlace: <span className={`font-black ${feedback.isCorrect? 'text-green-400' : 'text-red-400'}`}>{feedback.score}%</span></p>
                  </div>
                </div>

                {!feedback.isCorrect && (
                  <div className="text-left space-y-4 w-full lg:w-1/2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Análisis de la Desviación:</p>
                    <div className="bg-black/40 p-6 rounded-[24px] border border-white/5 font-mono text-sm text-white leading-relaxed whitespace-pre-wrap">
                      {feedback.diffs?.map(([type, text], i) => (
                        <span key={i} className={
                          type === 0 ? 'text-slate-300' :
                          type === -1 ? 'text-red-400 bg-red-400/10 px-1 rounded line-through' :
                          'text-cyber-pink bg-cyber-pink/10 px-1 rounded'
                        }>
                          {text}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium italic ml-2">Leyenda: <span className="text-red-400">Faltante</span> / <span className="text-cyber-pink">Sobrante</span> / <span className="text-slate-300">Correcto</span></p>
                  </div>
                )}

                {feedback.isCorrect && (
                  <div className="bg-green-500/10 px-8 py-4 rounded-3xl flex items-center space-x-4 text-green-400 border border-green-500/20 shadow-glow-green/10">
                    <Sparkles size={24} />
                    <span className="text-3xl font-black font-mono">+{attempts === 1 ? 15 : 5} XP</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DictationTool;

