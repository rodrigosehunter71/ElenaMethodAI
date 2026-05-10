import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, CheckCircle2, RotateCcw, Sparkles, Send, Info, Wand2 } from 'lucide-react';
import { correctWriting } from '../services/geminiService';

const WritingCorrector: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const handleCorrect = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const data = await correctWriting(text, language);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error al conectar con la IA de Elena. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Corrector de Escritura</h2>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">IA-Powered Linguistic Refinement System</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${language === 'en' ? 'bg-cyber-indigo text-white shadow-lg shadow-cyber-indigo/20' : 'text-slate-500 hover:text-white'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage('es')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${language === 'es' ? 'bg-cyber-pink text-white shadow-lg shadow-cyber-pink/20' : 'text-slate-500 hover:text-white'}`}
          >
            Español
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="glass-panel p-6 rounded-[32px] border border-white/5 relative">
            <div className="absolute top-4 right-6 flex items-center space-x-2 text-[10px] font-mono text-slate-600 uppercase">
              < PenTool size={12} />
              <span>Input Terminal</span>
            </div>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={language === 'en' ? "Write your sentence here..." : "Escribe tu oración aquí..."}
              className="w-full h-48 bg-transparent border-none outline-none text-white placeholder-slate-600 resize-none font-medium text-lg pt-6"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-[10px] font-mono text-slate-700">{text.length} characters</span>
              <button 
                onClick={handleReset}
                className="p-2 text-slate-500 hover:text-white transition-colors"
                title="Limpiar"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleCorrect}
            disabled={!text.trim() || loading}
            className="w-full bg-cyber-indigo text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 shadow-lg shadow-cyber-indigo/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Corregir Texto</span>
              </>
            )}
          </button>
        </section>

        <section className="relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass-panel p-6 rounded-[32px] border border-cyber-cyan/30 shadow-glow-cyan/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-cyber-cyan uppercase tracking-widest">Resultado de Sincronización</span>
                    <CheckCircle2 size={20} className="text-cyber-cyan" />
                  </div>
                  <p className="text-xl font-bold text-white leading-relaxed">
                    {result.correctedText}
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-[32px] border border-white/5">
                  <div className="flex items-center space-x-3 mb-3 text-cyber-indigo">
                    <Info size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Explicación Técnica</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    {result.explanation}
                  </p>
                </div>

                <div className="p-6 bg-cyber-pink/10 rounded-[32px] border border-cyber-pink/20">
                  <div className="flex items-center space-x-3 mb-3 text-cyber-pink">
                    <Wand2 size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sugerencia Natural</span>
                  </div>
                  <p className="text-sm text-cyber-pink font-medium leading-relaxed">
                    {result.naturalSuggestion}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-[40px] grayscale"
              >
                <Sparkles size={48} className="text-slate-800 mb-6" />
                <p className="text-slate-600 font-mono text-[10px] uppercase tracking-widest leading-loose">
                  En espera de datos... <br/>
                  Elena aplicará correcciones instantáneas y sugerencias de fluidez.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default WritingCorrector;
