import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, MessageSquare, Bot, User, LayoutDashboard, PenTool, AlertCircle, Headphones } from 'lucide-react';
import { useAuth } from './FirebaseProvider';

const BottomNav: React.FC = () => {
  const { user, isAdmin } = useAuth();
  
  if (!user) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="glass-panel rounded-3xl h-16 flex items-center justify-around border border-white/10 shadow-2xl">
        <NavLink 
          to={isAdmin ? "/?view=student" : "/"} 
          title={isAdmin ? "Vista Alumno" : "Módulos"}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-cyber-indigo scale-110' : 'text-slate-500'}`
          }
        >
          <BookOpen size={20} />
        </NavLink>

        {isAdmin && (
          <NavLink 
            to="/teacher" 
            title="Panel Docente"
            className={({ isActive }) => 
              `flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-cyber-cyan scale-110' : 'text-slate-500'}`
            }
          >
            <LayoutDashboard size={20} />
          </NavLink>
        )}
        
        <NavLink 
          to="/chat" 
          title="Mensajes"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-cyber-cyan scale-110' : 'text-slate-500'}`
          }
        >
          <MessageSquare size={20} />
        </NavLink>

        <NavLink 
          to="/ai-teacher" 
          title="Elena AI"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-cyber-indigo scale-110' : 'text-slate-500'}`
          }
        >
          <div className="relative">
            <Bot size={24} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyber-indigo rounded-full animate-pulse"></div>
          </div>
        </NavLink>

        <NavLink 
          to="/writing-corrector" 
          title="Corrector"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-cyber-indigo scale-110' : 'text-slate-500'}`
          }
        >
          <PenTool size={20} />
        </NavLink>

        <NavLink 
          to="/dictation" 
          title="Dictado"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-cyber-indigo scale-110' : 'text-slate-500'}`
          }
        >
          <Headphones size={20} />
        </NavLink>

        <NavLink 
          to="/profile" 
          title="Perfil"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-cyber-pink scale-110' : 'text-slate-500'}`
          }
        >
          <User size={20} />
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;
