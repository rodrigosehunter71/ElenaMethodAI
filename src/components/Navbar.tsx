import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from './FirebaseProvider';
import { LogOut, BookOpen, MessageSquare, ShieldCheck, User, Zap, Bot } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, userData, isAdmin, resetRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const handleResetRole = async () => {
    if (window.confirm("¿Confirmas que deseas restablecer tu perfil? Serás redirigido a la selección de rol.")) {
      try {
        console.log("[Navbar] Resetting role initiated...");
        await resetRole();
        // Force navigation to root to trigger App.tsx redirect logic
        navigate('/', { replace: true });
        console.log("[Navbar] Role reset triggered successfully.");
      } catch (err) {
        console.error("[Navbar] Reset role operation failed:", err);
        alert("No se pudo restablecer el rol. Por favor, intenta cerrar sesión e ingresar de nuevo.");
      }
    }
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 h-16 flex items-center justify-between border border-white/10">
        <Link to={userData?.role === 'teacher' ? '/teacher' : '/'} className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-indigo to-cyber-cyan rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyber-indigo/20 group-hover:scale-110 transition-transform">
              <Zap size={20} fill="currentColor" />
            </div>
            {/* Claudia's Badge */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full border-2 border-cyber-pink shadow-glow-pink overflow-hidden bg-slate-800 animate-pulse">
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
          <span className="font-display font-bold text-xl text-white tracking-tighter glow-text-indigo">ElenaMethod</span>
        </Link>

        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-6">
            <Link to={userData?.role === 'teacher' ? '/?view=student' : '/'} className="text-slate-400 hover:text-white flex items-center space-x-2 transition-all group">
              <BookOpen size={18} className="group-hover:text-cyber-indigo transition-colors" />
              <span className="text-sm font-medium tracking-wide">Módulos</span>
            </Link>
            {isAdmin && (
              <Link to="/teacher" className="text-slate-400 hover:text-white flex items-center space-x-2 transition-all group">
                <ShieldCheck size={18} className="text-cyber-cyan group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium tracking-wide text-cyber-cyan">Panel Docente</span>
              </Link>
            )}
            <Link to="/chat" className="text-slate-400 hover:text-white flex items-center space-x-2 transition-all group">
              <MessageSquare size={18} className="group-hover:text-cyber-cyan transition-colors" />
              <span className="text-sm font-medium tracking-wide">Mensajes</span>
            </Link>
            <Link to="/ai-teacher" className="text-slate-400 hover:text-white flex items-center space-x-2 transition-all group">
              <Bot size={18} className="group-hover:text-cyber-indigo transition-colors" />
              <span className="text-sm font-medium tracking-wide">Elena AI</span>
            </Link>
            <Link to="/profile" className="text-slate-400 hover:text-white flex items-center space-x-2 transition-all group">
              <User size={18} className="group-hover:text-cyber-pink transition-colors" />
              <span className="text-sm font-medium tracking-wide">Perfil</span>
            </Link>
          </div>

          <div className="h-6 w-px bg-white/10 mx-2"></div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-bold text-white tracking-tight">{user?.displayName || 'Operativo'}</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleResetRole}
                  className="text-[10px] text-cyber-cyan hover:text-white uppercase font-black tracking-widest transition-colors"
                >
                  {isAdmin ? 'Docente' : 'Estudiante'} ↺
                </button>
                <span className="text-[10px] text-slate-500 font-mono">XP: {userData?.xp || 0}</span>
              </div>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-white/10 p-0.5" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10">
                <User size={18} />
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-cyber-pink transition-colors"
              title="Terminate Session"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
