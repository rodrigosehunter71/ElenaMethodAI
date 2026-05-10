import React, { useState } from 'react';
import { useAuth } from './FirebaseProvider';
import { motion, AnimatePresence } from 'motion/react';
import { User, GraduationCap, ShieldCheck, ArrowRight, Hash, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelection: React.FC = () => {
  const { user, setRole } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'student' | 'teacher' | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMasterEmail = user?.email === 'segahunter71@gmail.com' || user?.email === 'garciahellen872@gmail.com';

  const handleConfirm = async () => {
    if (!selectedType) {
      setError("Por favor, selecciona un perfil de acceso para continuar.");
      return;
    }
    setLoading(true);
    setError(null);
    console.log(`[RoleSelection] Confirming selection: ${selectedType}`);
    try {
      await setRole(selectedType, joinCode);
      console.log(`[RoleSelection] Role sync successful: ${selectedType}`);
      
      // We navigate immediately but App.tsx will also re-render based on userData.role
      if (selectedType === 'teacher') {
        console.log("[RoleSelection] Navigating to Teacher Command Center...");
        navigate('/teacher', { replace: true });
      } else {
        console.log("[RoleSelection] Navigating to Student Synapse...");
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error("[RoleSelection] Critical Error during synchronization:", err);
      setError(err.message || "Error en la sincronización del protocolo de acceso.");
    } finally {
      setLoading(false);
    }
  };

  if (error === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-obsidian">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 shadow-glow-green">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Sincronización Exitosa</h1>
          <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">
            Inicializando Interfaz de {selectedType === 'teacher' ? 'Docente' : 'Estudiante'}...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-obsidian">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-16 relative">
          {/* Claudia's Onboarding Presence */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-cyber-pink shadow-glow-pink overflow-hidden bg-slate-800 z-10"
          >
            <img 
              src="/claudia.png" 
              alt="Claudia" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150";
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-4 rounded-3xl bg-cyber-indigo/10 border border-cyber-indigo/20 mb-6 pt-12"
          >
            <ShieldCheck className="text-cyber-indigo" size={48} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white tracking-tighter glow-text-indigo mb-4"
          >
            Selecciona tu Protocolo
          </motion.h1>
          <p className="text-slate-400 text-lg mb-4">Elige tu clearance del sistema para inicializar tu interfaz.</p>

          {isMasterEmail && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-cyber-pink/10 border border-cyber-pink/20 rounded-2xl flex items-center space-x-3 text-cyber-pink text-xs font-bold uppercase tracking-widest mb-8 max-w-md mx-auto"
            >
              <ShieldAlert size={16} />
              <span>Protocolo Administrativo: Anomalía Detectada</span>
            </motion.div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Student Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedType('student')}
            className={`glass-panel p-10 rounded-[40px] border text-left transition-all ${
              selectedType === 'student' ? 'border-cyber-cyan bg-cyber-cyan/5 shadow-glow-cyan' : 'border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-16 h-16 bg-cyber-cyan/10 rounded-2xl flex items-center justify-center text-cyber-cyan mb-8">
              <GraduationCap size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Estudiante</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Accede a los módulos de aprendizaje y monitorea tu crecimiento lingüístico.
            </p>
          </motion.button>

          {/* Teacher Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedType('teacher')}
            className={`glass-panel p-10 rounded-[40px] border text-left transition-all ${
              selectedType === 'teacher' ? 'border-cyber-indigo bg-cyber-indigo/5 shadow-glow-indigo' : 'border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-16 h-16 bg-cyber-indigo/10 rounded-2xl flex items-center justify-center text-cyber-indigo mb-8">
              <User size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Docente</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Gestiona aulas, analiza estadísticas y supervisa el progreso de tus alumnos.
            </p>
          </motion.button>
        </div>

        <AnimatePresence>
          {selectedType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-md mx-auto space-y-6"
            >
              {selectedType === 'student' && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                    Código de Clase (Opcional)
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Ej: ABC123"
                      maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-14 text-white font-mono text-lg focus:border-cyber-indigo outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>
                  <p className="px-4 text-[10px] text-slate-600 italic">Ingresa el código proporcionado por tu docente para unirte a su aula inmediatamente.</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs text-center font-bold">
                  {error}
                </div>
              )}

              <button 
                onClick={handleConfirm}
                disabled={loading}
                className="w-full bg-white text-obsidian py-6 rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-obsidian border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Confirmar Selección</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoleSelection;
