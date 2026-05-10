import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { units } from '../data/units';
import { useAuth } from './FirebaseProvider';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle2, Circle, ArrowRight, BarChart3, Target, Zap, Cpu, Search, Filter, Sparkles, Calendar, BookOpen, Terminal, MessageSquare, Shield, PenTool, AlertCircle, Headphones, Clock, Users } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from 'recharts';
import ReactMarkdown from 'react-markdown';

const Dashboard: React.FC = () => {
  const { user, userData, resetRole, setRole } = useAuth();
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [lessonScripts, setLessonScripts] = useState<any[]>([]);
  const [classroomData, setClassroomData] = useState<any | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const isMasterEmail = user?.email === 'segahunter71@gmail.com' || user?.email === 'garciahellen872@gmail.com';

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'progress'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const progData: Record<string, any> = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        progData[data.unitId] = data;
      });
      setProgress(progData);
      setLoading(false);
    }, (error) => {
      console.error("Dashboard progress error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || !userData?.classroomId) return;

    const q = query(
      collection(db, 'assignments'), 
      where('classroomId', '==', userData.classroomId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActiveAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const scriptQ = query(
      collection(db, 'lesson_scripts'),
      where('classroomId', '==', userData.classroomId)
    );

    const unsubScripts = onSnapshot(scriptQ, (snapshot) => {
      setLessonScripts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const classroomRef = doc(db, 'classrooms', userData.classroomId);
    const unsubClass = onSnapshot(classroomRef, (doc) => {
      if (doc.exists()) {
        setClassroomData({ id: doc.id, ...doc.data() });
      }
    });

    return () => {
      unsubscribe();
      unsubScripts();
      unsubClass();
    };
  }, [user, userData?.classroomId]);

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const totalUnits = units.length;
  const percentage = Math.round((completedCount / totalUnits) * 100);

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         unit.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = filterLevel === 'All' || unit.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const handleJoinClass = async () => {
    if (!joinCodeInput || joinCodeInput.length !== 6) {
      setJoinError("El código debe tener 6 caracteres.");
      return;
    }
    setIsJoining(true);
    setJoinError(null);
    try {
      await setRole('student', joinCodeInput);
      setJoinCodeInput('');
    } catch (err: any) {
      setJoinError(err.message || "Error al unirse al aula.");
    } finally {
      setIsJoining(false);
    }
  };

  const chartData = units.slice(0, Math.max(completedCount + 2, 6)).map((u, i) => ({
    name: `U${i+1}`,
    score: progress[u.id]?.score || (i < completedCount ? 85 : 0)
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyber-indigo border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
      {/* Classroom Nexus Section */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <Terminal className="text-cyber-cyan" size={20} />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Nexo de Comunicación</h2>
          <div className="flex-1 h-px bg-white/5 mx-4"></div>
        </div>

        {userData?.classroomId ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 glass-panel border border-cyber-cyan/30 bg-cyber-cyan/5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-cyber-cyan/20 rounded-2xl flex items-center justify-center text-cyber-cyan">
                <Users size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{classroomData?.name || 'Cargando Aula...'}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-[10px] font-mono text-cyber-cyan font-bold uppercase">Sincronización de Aula Activa</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">CÓDIGO: {classroomData?.joinCode}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowChat(true)}
                className="px-6 py-3 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-cyber-cyan/20 transition-all flex items-center space-x-2"
              >
                <MessageSquare size={16} />
                <span>Contactar Docente</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 glass-panel border border-white/10 bg-white/5 rounded-3xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Protocolo Individual Detectado</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Actualmente estás en el modo de estudio autónomo. Puedes unirte a un aula gestionada para recibir misiones específicas de un docente.
                </p>
                <div className="flex items-center space-x-2 p-3 bg-obsidian/50 rounded-xl border border-white/5 w-fit">
                  <AlertCircle size={14} className="text-cyber-indigo" />
                  <span className="text-[10px] text-slate-500 font-mono uppercase">MODO_LIBRE_ACTIVO</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder="INGRESAR CÓDIGO DE CLASE"
                    maxLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-14 text-white font-mono text-sm focus:border-cyber-cyan outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
                {joinError && <p className="text-red-500 text-[10px] font-bold uppercase ml-4">{joinError}</p>}
                <button 
                  onClick={handleJoinClass}
                  disabled={isJoining}
                  className="w-full py-4 bg-cyber-cyan text-obsidian rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cyber-cyan/20 flex items-center justify-center space-x-2"
                >
                  {isJoining ? (
                    <div className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Unirse al Aula</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {isMasterEmail && userData?.role !== 'teacher' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-6 bg-cyber-pink/10 border border-cyber-pink/20 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-cyber-pink/20 rounded-full flex items-center justify-center text-cyber-pink">
              <Shield size={20} />
            </div>
            <div>
              <div className="text-white font-bold text-sm uppercase tracking-widest">Protocolo de Acceso Anomalía</div>
              <p className="text-slate-400 text-xs mt-1">Tu cuenta tiene privilegios de Docente, pero estás en la vista de Estudiante.</p>
            </div>
          </div>
          <button 
            onClick={async () => {
              try {
                await setRole('teacher');
                window.location.href = '/teacher'; // Force full refresh to clear any state artifacts
              } catch (err) {
                console.error("Manual sync failed:", err);
                resetRole(); // Fallback to reset if setRole fails
              }
            }}
            className="px-6 py-3 bg-cyber-pink text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-cyber-pink/20"
          >
            Sincronizar como Docente
          </button>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-panel p-8 rounded-[32px] relative overflow-hidden group"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
              opacity: [0.05, 0.1, 0.05] 
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-cyber-indigo rounded-full blur-[100px]"
          ></motion.div>

          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Cpu size={120} className="text-cyber-indigo" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex space-x-1">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1 bg-cyber-indigo rounded-full"
                  ></motion.div>
                ))}
              </div>
              <span className="text-[10px] font-mono text-cyber-indigo uppercase tracking-[0.3em]">Neural_Link_Active</span>
            </div>

            <h1 className="text-4xl font-bold mb-2 tracking-tight">Estado del Sistema</h1>
            <p className="text-slate-400 mb-8 max-w-md">Bienvenido de nuevo. Tu sincronización lingüística está al <span className="text-cyber-indigo font-bold">{percentage}%</span> de eficiencia.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Stat Cards */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-cyber-cyan/30 transition-colors">
                <div className="text-cyber-cyan mb-1 flex justify-between items-center">
                  <Target size={20} />
                  <div className="w-1 h-1 bg-cyber-cyan rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-white">{userData?.xp || 0}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">XP TOTAL</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-cyber-indigo/30 transition-colors">
                <div className="text-cyber-indigo mb-1 flex justify-between items-center">
                  <Zap size={20} />
                  <div className="w-1 h-1 bg-cyber-indigo rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-white">{userData?.streak || 0}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">RACHA DIARIA</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-cyber-pink/30 transition-colors">
                <div className="text-cyber-pink mb-1 flex justify-between items-center">
                  <BarChart3 size={20} />
                  <div className="w-1 h-1 bg-cyber-pink rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-white">{completedCount}/{totalUnits}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">PROGRESO</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-green-400/30 transition-colors">
                <div className="text-green-400 mb-1 flex justify-between items-center">
                  <CheckCircle2 size={20} />
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-white">{percentage}%</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">EFICIENCIA</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {userData?.role === 'teacher' && (
                <Link 
                  to="/teacher"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-cyber-indigo text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-cyber-indigo/20 border border-white/10"
                >
                  <Shield size={18} />
                  <span>Panel de Docente</span>
                  <ArrowRight size={18} />
                </Link>
              )}
              <Link 
                to="/dictation"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-cyber-cyan text-obsidian rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-cyber-cyan/20 border border-white/10"
              >
                <Headphones size={18} />
                <span>Dictado Táctico</span>
              </Link>
              <Link 
                to="/writing-corrector"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-white/5 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/10"
              >
                <PenTool className="text-cyber-indigo" size={18} />
                <span>Corrector de Escritura</span>
              </Link>
              <Link 
                to="/error-review"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-white/5 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/10"
              >
                <AlertCircle className="text-cyber-pink" size={18} />
                <span>Revisión de Errores</span>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-[32px] flex flex-col border border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <BarChart3 size={20} className="text-cyber-indigo" />
              <span>Progreso de Maestría</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">REALTIME_METRICS</span>
          </div>
          <div className="flex-1 min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Elena AI Recommendation Section */}
      {/* Lessons Scripts / Guides */}
      <AnimatePresence>
        {classroomData && (
          <div className="fixed bottom-8 right-8 z-[100]">
            <button 
              onClick={() => setShowChat(!showChat)}
              className="bg-cyber-indigo text-white p-4 rounded-2xl shadow-2xl shadow-cyber-indigo/30 hover:scale-110 transition-all flex items-center space-x-2"
            >
              <MessageSquare size={24} />
              {!showChat && <span className="font-bold text-xs uppercase tracking-widest px-2">Chat con Instructor</span>}
            </button>
            
            <AnimatePresence>
              {showChat && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="absolute bottom-20 right-0 w-[400px] shadow-2xl"
                >
                  <ChatWindow 
                    currentUserId={user?.uid || ''} 
                    targetUserId={classroomData.teacherId} 
                    targetUserName="Mi Instructor" 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lessonScripts.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="text-cyber-indigo" size={20} />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Protocolos y Guías del Instructor</h2>
              <div className="flex-1 h-px bg-white/5 mx-4"></div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {lessonScripts.map(script => (
                <div key={script.id} className="glass-panel p-10 rounded-[40px] border border-cyber-indigo/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Terminal size={100} className="text-cyber-indigo" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <Sparkles size={20} className="text-cyber-indigo" />
                    <span>{script.title}</span>
                  </h3>
                  <div className="markdown-body max-w-none text-slate-300 leading-relaxed">
                    <ReactMarkdown>{script.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeAssignments.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="text-cyber-pink" size={20} />
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Misiones del Docente</h2>
              <div className="flex-1 h-px bg-white/5 mx-4"></div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">{activeAssignments.length} MISIONES_ACTIVAS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAssignments.map(assign => {
                const unit = units.find(u => u.id === assign.unitId);
                const isCompleted = progress[assign.unitId]?.completed;
                if (!unit) return null;
                return (
                  <Link 
                    key={assign.id}
                    to={`/unit/${unit.id}`}
                    className={`glass-panel p-6 rounded-3xl border transition-all flex items-center justify-between group ${isCompleted ? 'border-green-500/20 opacity-60' : 'border-cyber-pink/40 hover:border-cyber-pink shadow-[0_0_20px_rgba(236,72,153,0.1)]'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-2xl ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-cyber-pink/10 text-cyber-pink'}`}>
                        <Target size={24} />
                      </div>
                      <div>
                        <div className="text-lg font-black text-white group-hover:text-cyber-pink transition-colors line-clamp-1">{unit.title}</div>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">ASIGNADO_POR_DOCENTE</span>
                            {assign.dueDate && (
                              <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-cyber-pink/5 border border-cyber-pink/20 rounded-md">
                                <Clock size={10} className="text-cyber-pink" />
                                <span className="text-[9px] text-cyber-pink font-black uppercase tracking-widest">Vence: {new Date(assign.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {assign.gamesEnabled && <span className="w-1 h-1 bg-cyber-pink rounded-full"></span>}
                            {assign.gamesEnabled && <span className="text-[9px] text-cyber-pink font-bold uppercase">Juegos Activos</span>}
                          </div>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-slate-500 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {completedCount < totalUnits && (
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 glass-panel p-8 rounded-[32px] border border-cyber-indigo/20 bg-cyber-indigo/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles size={80} className="text-cyber-indigo" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-cyber-indigo/20 flex items-center justify-center border border-cyber-indigo/30 shrink-0">
                  <div className="relative">
                    <Cpu size={32} className="text-cyber-indigo" />
                    <motion.div 
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-cyber-indigo/40 rounded-full blur-md"
                    ></motion.div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Elena AI Feedback</h3>
                  <p className="text-slate-400 text-sm max-w-xl">
                    "Según tu progreso actual, sugiero finalizar tu sincronización con <span className="text-cyber-indigo font-bold">{units[completedCount]?.title}</span>. Esto consolidará tus bases antes de avanzar a niveles {units[completedCount + 1]?.level || 'superiores'}."
                  </p>
                </div>
              </div>
              <Link 
                to={`/unit/${units[completedCount]?.id}`}
                className="bg-cyber-indigo text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-3 hover:scale-105 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] uppercase tracking-widest text-xs"
              >
                <span>Continuar Sincronización</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Filtrar módulos por tema o título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-cyber-indigo transition-all font-sans text-sm"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter size={16} className="text-slate-500 mr-2 shrink-0" />
          {levels.map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${filterLevel === lvl ? 'bg-cyber-indigo text-white shadow-lg shadow-cyber-indigo/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}
            >
              {lvl === 'All' ? 'All' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.length > 0 ? filteredUnits.map((unit, index) => {
          const isCompleted = progress?.[unit.id]?.completed;
          const score = progress?.[unit.id]?.score;
          
          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Link to={`/unit/${unit.id}`} className="block group">
                <div className={`glass-card p-6 rounded-3xl h-full flex flex-col relative overflow-hidden transition-all duration-500 group-hover:scale-[1.02] ${isCompleted ? 'border-green-500/30' : 'border-white/5'}`}>
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-green-500/10 text-green-400 px-4 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-[0.2em] border-l border-b border-green-500/20">
                      Mastered {score}%
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyber-indigo mb-1">Módulo {unit.order}</span>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyber-indigo transition-colors">{unit.title}</h3>
                    </div>
                    <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-cyber-cyan border border-white/5 uppercase tracking-wider">
                      {unit.level}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {unit.topics.slice(0, 3).map((topic, i) => (
                        <span key={i} className="text-[10px] text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700/50">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 size={14} className="text-green-500" />
                        </div>
                      ) : (
                        <Circle size={18} className="text-slate-700" />
                      )}
                      <span className={`text-xs font-bold ${isCompleted ? 'text-green-500' : 'text-slate-500'}`}>
                        {isCompleted ? 'Protocolo Sincronizado' : 'Listo para Inicializar'}
                      </span>
                    </div>
                    <div className="text-cyber-indigo group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        }) : (
          <div className="col-span-full py-20 text-center glass-panel rounded-3xl border border-white/5">
            <Search className="mx-auto text-slate-800 mb-4" size={48} />
            <p className="text-slate-500 font-bold italic">No modules match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
