import React, { useEffect, useState } from 'react';
import { useAuth } from './FirebaseProvider';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Ghost, RotateCcw, CheckCircle2, ChevronRight, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { units } from '../data/units';

const ErrorReview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'error_logs', user.uid), (doc) => {
      if (doc.exists()) {
        setErrorLogs(doc.data().logs || []);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-cyber-pink border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Sincronizando Errores...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-8">
      <header className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-cyber-pink/10 rounded-2xl text-cyber-pink border border-cyber-pink/20">
            <AlertCircle size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-1">Revisión de Errores</h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Error Analysis & Cognitive Recalibration</p>
          </div>
        </div>
        <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
          Aquí se registran tus fallos recientes en las simulaciones tácticas. Revísalos para asegurar una sincronización lingüística perfecta en tu próximo intento.
        </p>
      </header>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {errorLogs.length > 0 ? (
            errorLogs.slice().reverse().map((log, idx) => {
              const unit = units.find(u => u.id === log.unitId);
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-6 rounded-[32px] border border-white/5 hover:border-cyber-pink/20 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-black text-cyber-pink uppercase tracking-widest">{unit?.title || "Módulo Externo"}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span className="text-[10px] font-mono text-slate-600">{new Date(log.timestamp).toLocaleDateString()}</span>
                      </div>
                      
                      <p className="text-lg font-bold text-white leading-tight pr-4">
                        {log.question}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                          <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block mb-1">Tu Respuesta</span>
                          <span className="text-sm font-mono text-slate-300 line-through decoration-red-500/50">{log.userAnswer || "(Vacío)"}</span>
                        </div>
                        <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10 shadow-glow-green/5">
                          <span className="text-[9px] font-black text-green-500 uppercase tracking-widest block mb-1">Respuesta Correcta</span>
                          <span className="text-sm font-black text-white">{log.correctAnswer}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <button 
                        onClick={() => navigate(`/unit/${log.unitId}`)}
                        className="flex-1 md:flex-none p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all group/btn flex items-center justify-center"
                        title="Reintentar Módulo"
                      >
                        <RotateCcw size={18} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                      </button>
                      <button 
                        className="flex-1 md:flex-none p-4 bg-cyber-pink/10 rounded-2xl text-cyber-pink hover:bg-cyber-pink/20 transition-all flex items-center justify-center"
                        title="Marcar para Estudiar"
                      >
                        <Bookmark size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="py-24 text-center space-y-6 grayscale opacity-40">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Sin Errores Detectados</h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto font-mono uppercase tracking-widest">Tu sincronización lingüística es óptima en este ciclo operativo.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ErrorReview;
