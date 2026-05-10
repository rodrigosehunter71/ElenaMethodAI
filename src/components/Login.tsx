import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, GraduationCap, Users, ArrowRight, AlertTriangle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.code === 'auth/popup-blocked') {
        setError('Browser blocked the authentication pipeline. Please enable popups for this site.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Authentication pipeline disconnected by user before completion.');
      } else {
        setError('Unexpected synchronization failure. Please try again.');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-obsidian overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-indigo/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-cyan/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Simple Navigation */}
      <nav className="relative z-20 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-indigo to-cyber-cyan rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyber-indigo/20 group-hover:scale-110 transition-transform">
              <Zap size={20} fill="currentColor" />
            </div>
            {/* Claudia's Badge - Consistency with main App */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full border-2 border-cyber-pink shadow-glow-pink overflow-hidden bg-slate-800">
              <img 
                src="/claudia.png" 
                alt="Claudia" 
                className="w-full h-full object-cover"
                title="Claudia - Master Instructor"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150";
                }}
              />
            </div>
          </div>
          <span className="font-display font-bold text-2xl text-white tracking-tighter glow-text-indigo">ElenaMethod</span>
        </div>
        <button 
          onClick={handleLogin}
          className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-xl transition-all border border-white/10 text-xs font-black uppercase tracking-[0.2em]"
        >
          Initialize Access
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-cyber-indigo/10 border border-cyber-indigo/20 text-cyber-indigo mb-8">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Learning Protocol v4.2.0_READY</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              Master Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-indigo to-cyber-cyan italic">English</span> with AI.
            </h1>
            
            <p className="text-slate-400 text-xl mb-12 max-w-lg font-light leading-relaxed">
              ElenaMethod is the ultimate platform for synchronizing your grammatical knowledge. 18 tactical modules designed for total language mastery.
            </p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center space-x-4 text-red-400 text-sm"
              >
                <AlertTriangle size={20} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                className="bg-white text-obsidian px-10 py-5 rounded-2xl font-black flex items-center justify-center space-x-4 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" referrerPolicy="no-referrer" />
                <span className="uppercase tracking-widest text-xs">Command Access with Google</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 glass-panel p-12 rounded-[60px] border border-white/10 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="p-8 rounded-[40px] bg-cyber-indigo/5 border border-cyber-indigo/10">
                    <GraduationCap className="text-cyber-indigo mb-4" size={32} />
                    <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Digital Manual</h3>
                    <p className="text-slate-500 text-[10px] leading-tight">Complete access to the interactive grammatical synchronization guide.</p>
                  </div>
                  <div className="p-8 rounded-[40px] bg-cyber-pink/5 border border-cyber-pink/10">
                    <Users className="text-cyber-pink mb-4" size={32} />
                    <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Docent Control</h3>
                    <p className="text-slate-500 text-[10px] leading-tight">Dynamic group management and real-time task deployment.</p>
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="p-8 rounded-[40px] bg-cyber-cyan/5 border border-cyber-cyan/10">
                    <Zap className="text-cyber-cyan mb-4" size={32} />
                    <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">AI Interactive</h3>
                    <p className="text-slate-500 text-[10px] leading-tight">Gamified synchronization through advanced interactive challenges.</p>
                  </div>
                  <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                    <ShieldCheck className="text-white mb-4" size={32} />
                    <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Secure Data</h3>
                    <p className="text-slate-500 text-[10px] leading-tight">Real-time progress backup within our encrypted synchronization pipeline.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full pointer-events-none opacity-50"></div>
          </motion.div>
        </div>

        {/* Global Stats Status Bar */}
        <div className="mt-32 pt-16 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-white mb-1">18</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Advanced Modules</div>
          </div>
          <div>
            <div className="text-3xl font-black text-cyber-indigo mb-1">A1-C2</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Linguistic Range</div>
          </div>
          <div>
            <div className="text-3xl font-black text-cyber-cyan mb-1">+100</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Active Simulations</div>
          </div>
          <div>
            <div className="text-3xl font-black text-cyber-pink mb-1">24/7</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Elena AI Feedback</div>
          </div>
        </div>
      </main>

      <footer className="relative z-20 max-w-7xl mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">
          &copy; 2026 ElenaMethod AI. Todos los derechos reservados.
        </div>
        <div className="flex space-x-6">
          <Link to="/privacy" className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Política de Privacidad</Link>
          <button className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors cursor-not-allowed">Términos de Servicio</button>
          <button className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors cursor-not-allowed">Contacto Técnico</button>
        </div>
      </footer>
    </div>
  );
};

export default Login;
