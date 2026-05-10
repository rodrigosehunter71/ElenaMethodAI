import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, serverTimestamp, onSnapshot, deleteDoc } from 'firebase/firestore';
import ChatWindow from './ChatWindow';
import { User, BookOpen, BarChart3, Cpu, ShieldCheck, Activity, Zap, Plus, Users, Trash2, FileText, ExternalLink, Video, Music, Calendar, Target, Terminal, MessageSquare, Headphones, ArrowRight, PenTool, Bot, Brain, CheckCircle2, AlertCircle, Clock, FileDown, Menu, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from './FirebaseProvider';
import { units } from '../data/units';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [allProgress, setAllProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'resources' | 'assignments' | 'scripts' | 'attendance' | 'tools' | 'games'>('overview');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newResource, setNewResource] = useState({ unitId: 'unit1', title: '', url: '', type: 'link' });
  const [allResources, setAllResources] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [lessonScripts, setLessonScripts] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [newScript, setNewScript] = useState({ classroomId: '', title: '', content: '' });
  const [newAssignment, setNewAssignment] = useState({ classroomId: '', unitId: 'unit1', gamesEnabled: true, exercisesEnabled: true, dueDate: '' });
  const [scriptLoading, setScriptLoading] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  const exportStudentPDF = async (student: any) => {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    const doc = new jsPDF();
    const studentProgress = allProgress.filter(p => p.userId === student.uid);

    // Header
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // cyber-indigo
    doc.text('ElenaMethod - Reporte Académico', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Alumno: ${student.fullName || student.displayName ||'N/A'}`, 14, 30);
    doc.text(`Email: ${student.email}`, 14, 36);
    doc.text(`Grado: ${student.grade || 'N/A'} - Sección: ${student.section || 'N/A'}`, 14, 42);
    doc.text(`Fecha de Generación: ${new Date().toLocaleDateString()}`, 14, 48);

    // Statistics
    const modulesCompleted = studentProgress.filter(p => p.completed).length;
    const avgScore = studentProgress.length > 0 
      ? Math.round(studentProgress.reduce((acc, p) => acc + (p.score || 0), 0) / studentProgress.length) 
      : 0;

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Resumen de Desempeño', 14, 60);
    
    doc.setFontSize(10);
    doc.text(`Módulos Completados: ${modulesCompleted}`, 14, 68);
    doc.text(`Promedio General: ${avgScore}%`, 14, 74);
    doc.text(`Total Actividades Realizadas: ${studentProgress.length}`, 14, 80);

    // Table
    const tableData = studentProgress.map(p => [
      units.find(u => u.id === p.unitId)?.title || p.unitId,
      p.completed ? 'COMPLETADO' : 'EN CURSO',
      `${p.score}%`,
      p.lastAccessed?.toDate?.().toLocaleDateString() || 'N/A'
    ]);

    (doc as any).autoTable({
      startY: 90,
      head: [['Unidad', 'Estado', 'Puntaje', 'Último Acceso']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: [99, 102, 241] }
    });

    doc.save(`Reporte_${student.displayName || student.uid}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  useEffect(() => {
    if (!user) return;
    
    let unsubStudents: (() => void) | undefined;

    // Classroom listener
    const classroomsQ = query(collection(db, 'classrooms'), where('teacherId', '==', user.uid));
    const unsubClassrooms = onSnapshot(classroomsQ, (snap) => {
      const clsData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setClassrooms(clsData);
      setLoading(false);
      
      // Cleanup previous students listener if it exists
      if (unsubStudents) unsubStudents();

      // If we have classrooms, fetch students for THESE classrooms only
      if (clsData.length > 0) {
        const clsIds = clsData.map(c => c.id);
        const studentsQ = query(
          collection(db, 'users'), 
          where('role', '==', 'student'),
          where('classroomId', 'in', clsIds.slice(0, 30))
        );
        
        unsubStudents = onSnapshot(studentsQ, (studentSnap) => {
          const studentList = studentSnap.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
          setStudents(studentList);
          
          if (studentList.length > 0) {
            const studentIds = studentList.map(s => s.uid);
            const progressQ = query(
              collection(db, 'progress'),
              where('userId', 'in', studentIds.slice(0, 30))
            );
            getDocs(progressQ).then(pSnap => {
              setAllProgress(pSnap.docs.map(d => d.data()));
            }).catch(e => {
              console.warn("Progress fetch failed:", e);
              if (e.code === 'resource-exhausted') {
                setError("Quota de base de datos excedida (Rate Exceeded). Por favor, espera a que se reinicie el límite diario.");
              }
            });
          }
        }, (err) => {
          console.error("Error al cargar alumnos:", err);
          if (err.code === 'resource-exhausted') {
            setError("Rate Exceeded: Quota de lectura agotada.");
          }
        });
      } else {
        setStudents([]);
        setAllProgress([]);
      }
    }, (err) => {
      console.error("Error al cargar aulas:", err);
      setError("Error de conexión con el sector de aulas.");
      setLoading(false);
    });

    // Realtime resources
    const resourcesQ = query(collection(db, 'unit_resources'), where('teacherId', '==', user.uid));
    const unsubRes = onSnapshot(resourcesQ, (snap) => {
      setAllResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Realtime assignments
    const assignQ = query(collection(db, 'assignments'), where('teacherId', '==', user.uid));
    const unsubAssign = onSnapshot(assignQ, (snap) => {
      setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Realtime lesson scripts
    const scriptQ = query(collection(db, 'lesson_scripts'), where('teacherId', '==', user.uid));
    const unsubScripts = onSnapshot(scriptQ, (snap) => {
      setLessonScripts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Realtime attendance
    const attendQ = query(collection(db, 'attendance'), where('teacherId', '==', user.uid));
    const unsubAttend = onSnapshot(attendQ, (snap) => {
      setAttendance(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubClassrooms();
      if (unsubStudents) unsubStudents();
      unsubRes();
      unsubAssign();
      unsubScripts();
      unsubAttend();
    };
  }, [user]);

  const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      alert("Por favor, ingresa un nombre para el aula.");
      return;
    }
    if (!user) {
      alert("Error: Sesión no detectada. Por favor, reinicia la aplicación.");
      return;
    }
    
    setScriptLoading(true);
    try {
      const code = generateJoinCode();
      const docRef = await addDoc(collection(db, 'classrooms'), {
        name: newClassName.trim(),
        teacherId: user.uid,
        joinCode: code,
        studentIds: [],
        createdAt: serverTimestamp(),
      });
      
      if (docRef.id) {
        setNewClassName('');
        setShowCreateClass(false);
        setSuccessMsg(`¡Aula creada con éxito! Código: ${code}`);
        // Forzar selección inmediata de la nueva clase
        setSelectedClassId(docRef.id);
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error crítico al crear aula: ${err.message}`);
      setError(`Error en despliegue: ${err.message}`);
    } finally {
      setScriptLoading(false);
    }
  };

  const assignStudentToClass = async (studentId: string, classroomId: string) => {
    try {
      await updateDoc(doc(db, 'users', studentId), { classroomId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAssignment.classroomId) return;
    try {
      await addDoc(collection(db, 'assignments'), {
        ...newAssignment,
        teacherId: user.uid,
        createdAt: serverTimestamp()
      });
      setSuccessMsg("Misión de evaluación desplegada exitosamente.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newScript.classroomId || !newScript.title || !newScript.content) return;
    setScriptLoading(true);
    try {
      await addDoc(collection(db, 'lesson_scripts'), {
        ...newScript,
        teacherId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewScript({ classroomId: '', title: '', content: '' });
      setSuccessMsg("Guion pedagógico desplegado al aula.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setError(`Script sync error: ${err.message}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setScriptLoading(false);
    }
  };

  const deleteScript = async (id: string) => {
    if (!window.confirm("Purge this script?")) return;
    try {
      await deleteDoc(doc(db, 'lesson_scripts', id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newResource.title || !newResource.url) return;
    try {
      await addDoc(collection(db, 'unit_resources'), {
        ...newResource,
        teacherId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewResource({ unitId: 'unit1', title: '', url: '', type: 'link' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttendance = async (studentId: string, classroomId: string, status: 'present' | 'absent' | 'late') => {
    if (!user) return;
    const existing = attendance.find(a => a.studentId === studentId && a.date === attendanceDate);
    try {
      if (existing) {
        await updateDoc(doc(db, 'attendance', existing.id), { status });
      } else {
        await addDoc(collection(db, 'attendance'), {
          studentId,
          classroomId,
          teacherId: user.uid,
          date: attendanceDate,
          status,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Attendance Sync Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-cyber-indigo border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Iniciando Panel de Control...</p>
      </div>
    );
  }

  const filteredStudents = selectedClassId ? students.filter(s => s.classroomId === selectedClassId) : students;
  
  // Añadir alumno de simulación si no hay estudiantes reales
  const displayStudents = filteredStudents.length > 0 
    ? filteredStudents 
    : [{
        uid: 'demo_student',
        fullName: 'Alumno de Prueba (Elena Bot)',
        email: 'test@elenamethod.com',
        displayName: 'Test Bot',
        role: 'student',
        grade: 'B1',
        isDemo: true
      }];

  const chartData = filteredStudents.map(s => {
    const prog = allProgress.filter(p => p.userId === s.uid);
    return { name: s.displayName || 'Operative', completed: prog.filter(p => p.completed).length };
  });

  return (
    <div className="min-h-screen bg-obsidian flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-2 text-cyber-indigo uppercase font-black text-[10px] tracking-widest">
          <ShieldCheck size={20} />
          <span>Elena Docente</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white bg-white/5 rounded-xl border border-white/10"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl fixed h-full left-0 top-0 pt-24 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-8 hidden lg:block">
          <div className="flex items-center space-x-2 text-cyber-indigo mb-1">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Protocolo Docente</span>
          </div>
          <div className="h-1 w-12 bg-cyber-indigo rounded-full"></div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', label: 'Panorama', icon: BarChart3 },
            { id: 'students', label: 'Alumnos y Chat', icon: Users },
            { id: 'scripts', label: 'IA Maestro (Guiones)', icon: Bot },
            { id: 'assignments', label: 'IA Evaluaciones', icon: Target },
            { id: 'resources', label: 'Biblioteca', icon: BookOpen },
            { id: 'attendance', label: 'Asistencia', icon: Calendar },
            { id: 'tools', label: 'Laboratorio IA', icon: Zap },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                activeTab === item.id 
                ? 'bg-cyber-indigo text-white shadow-lg shadow-cyber-indigo/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <Link 
            to="/?view=student"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-white/5 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all border border-white/10"
          >
            <Users size={14} className="text-cyber-cyan" />
            <span>Vista Estudiante</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 px-4 sm:px-6 pt-24 pb-12 min-w-0">
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                {activeTab === 'overview' ? 'Panel de Control' : 
                 activeTab === 'students' ? 'Alumnos y Chat' :
                 activeTab === 'scripts' ? 'IA Maestro' :
                 activeTab === 'assignments' ? 'IA Eval' :
                 'Gestión'}
              </h1>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-2">Elena System // Protocolo Activo</p>
            </div>
            
            <button 
              onClick={() => setShowCreateClass(true)}
              className="bg-cyber-indigo text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cyber-indigo/20 uppercase tracking-widest text-xs"
            >
              <Plus size={18} />
              <span>Nueva Aula</span>
            </button>
          </div>
        </header>

      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold"
          >
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Content */}
      {activeTab === 'attendance' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Registro de Asistencia</h2>
            <input 
              type="date" 
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-cyber-indigo"
            />
          </div>

          <div className="glass-panel p-8 rounded-[40px] border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map(student => {
                const record = attendance.find(a => a.studentId === student.uid && a.date === attendanceDate);
                return (
                  <div key={student.uid} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{student.fullName || student.displayName ||'Sin Nombre'}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{student.grade} - {student.section}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAttendance(student.uid, student.classroomId, 'present')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${record?.status === 'present' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                      >
                        Presente
                      </button>
                      <button 
                        onClick={() => handleAttendance(student.uid, student.classroomId, 'absent')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${record?.status === 'absent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                      >
                        Ausente
                      </button>
                      <button 
                        onClick={() => handleAttendance(student.uid, student.classroomId, 'late')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${record?.status === 'late' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                      >
                        Tarde
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredStudents.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-600 italic">
                  No hay estudiantes registrados en este sector para tomar asistencia.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-12">
          {/* Quick Access / Classroom Management Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Gestión de Aulas</h2>
              {!showCreateClass && (
                <button 
                  onClick={() => setShowCreateClass(true)}
                  className="bg-cyber-indigo/20 text-cyber-indigo border border-cyber-indigo/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyber-indigo hover:text-white transition-all"
                >
                  + Nueva Aula
                </button>
              )}
            </div>

            {showCreateClass && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white/5 border border-cyber-indigo/30 p-6 rounded-[32px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <button onClick={() => setShowCreateClass(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Inicializar Protocolo de Aula</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateClass();
                  }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <input 
                    type="text" 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyber-indigo transition-all"
                    placeholder="Nombre del Aula (ej: 4to Grado B)"
                    autoFocus
                    required
                  />
                  <button 
                    type="submit"
                    disabled={!newClassName.trim() || scriptLoading}
                    className="bg-cyber-indigo text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-cyber-indigo/20 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                  >
                    {scriptLoading ? 'Sincronizando...' : 'Confirmar Creación'}
                  </button>
                </form>
              </motion.div>
            )}

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setSelectedClassId(null)}
                className={`px-6 py-3 rounded-xl border transition-all font-bold text-sm ${!selectedClassId ? 'bg-cyber-indigo border-cyber-indigo text-white shadow-lg shadow-cyber-indigo/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
              >
                Vista Global
              </button>
              {classrooms.map(cls => (
                <div key={cls.id} className="relative group">
                  <button 
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-6 py-3 rounded-xl border transition-all font-bold text-sm flex flex-col items-start min-w-[140px] ${selectedClassId === cls.id ? 'bg-cyber-cyan border-cyber-cyan text-white shadow-lg shadow-cyber-cyan/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    <span className="truncate w-full text-left">{cls.name}</span>
                    <span className="text-[10px] font-black font-mono mt-1 px-2 py-0.5 bg-black/20 rounded uppercase tracking-tighter">
                      CÓDIGO: {cls.joinCode}
                    </span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(cls.joinCode);
                      alert(`Código ${cls.joinCode} copiado al portapapeles.`);
                    }}
                    className="absolute -top-2 -right-2 bg-slate-900 border border-white/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-cyber-cyan hover:text-white"
                    title="Copiar Código"
                  >
                    <Save size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="glass-panel p-8 rounded-[40px] border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <BarChart3 className="text-cyber-indigo" />
                <span>Global Performance</span>
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} domain={[0, 18]} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff'}} />
                    <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="glass-panel p-8 rounded-[40px] border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Users className="text-cyber-cyan" />
                <span>Estudiantes sin Aula</span>
              </h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {students.filter(s => !s.classroomId).map(s => (
                  <div key={s.uid} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <span className="text-sm font-bold">{s.displayName || s.email}</span>
                    <select 
                      onChange={(e) => assignStudentToClass(s.uid, e.target.value)}
                      className="bg-obsidian border border-white/10 text-xs rounded-lg p-2"
                      defaultValue=""
                    >
                      <option value="" disabled>Assign to...</option>
                      {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                ))}
                {students.filter(s => !s.classroomId).length === 0 && <p className="text-slate-500 text-sm italic py-4">All operatives are linked to classrooms.</p>}
              </div>
            </section>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
              <Cpu className="text-cyber-pink" />
              <span>Estudiantes Activos</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map(s => {
                const prog = allProgress.filter(p => p.userId === s.uid);
                const comp = prog.filter(p => p.completed).length;
                return (
                  <div key={s.uid} className="glass-card p-6 rounded-3xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{s.displayName || 'Operative'}</div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">{s.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyber-cyan font-black text-xl">{Math.round((comp/18)*100)}%</div>
                      <div className="text-[9px] text-slate-600 uppercase font-bold">{comp}/18 Modules</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <section className={`lg:col-span-1 space-y-4 ${selectedStudent ? 'hidden lg:block' : 'block'}`}>
            <h2 className="text-xl font-bold text-white mb-6 uppercase flex items-center space-x-3">
              <Users className="text-cyber-indigo" />
              <span>Mis Alumnos</span>
            </h2>
            <div className="space-y-3">
              {displayStudents.map(student => (
                <button 
                  key={student.uid}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${selectedStudent?.uid === student.uid ? 'bg-cyber-indigo border-cyber-indigo text-white shadow-lg shadow-cyber-indigo/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                      {student.photoURL ? <img src={student.photoURL} alt="" className="w-full h-full object-cover" /> : <User size={16} />}
                    </div>
                    <div className="text-sm font-bold truncate max-w-[120px]">{student.fullName || student.email.split('@')[0]}</div>
                  </div>
                  <MessageSquare size={14} className={selectedStudent?.uid === student.uid ? 'text-white' : 'text-cyber-indigo opacity-40 group-hover:opacity-100'} />
                </button>
              ))}
            </div>
            {!students.length && (
              <div className="mt-4 p-4 bg-cyber-indigo/10 border border-cyber-indigo/20 rounded-xl">
                <p className="text-[10px] text-cyber-indigo font-bold uppercase leading-relaxed">
                  Sistema: No se detectan alumnos reales en este sector. Hemos habilitado un Alumno de Prueba para que verifiques el enlace táctico (chat).
                </p>
              </div>
            )}
          </section>

          <section className={`lg:col-span-3 space-y-8 ${!selectedStudent ? 'hidden lg:block' : 'block'}`}>
            {selectedStudent ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                {/* Back button for mobile */}
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="lg:hidden flex items-center space-x-2 text-slate-400 mb-6 py-2 px-4 bg-white/5 rounded-xl border border-white/10 active:scale-95 transition-all"
                >
                  <ArrowRight size={18} className="rotate-180 text-cyber-indigo" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cerrar Perfil Alumno</span>
                </button>
                <div className="glass-panel p-8 rounded-[40px] border border-white/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center space-x-4">
                      {selectedStudent.photoURL ? (
                        <img src={selectedStudent.photoURL} alt="" className="w-20 h-20 rounded-3xl object-cover border-4 border-white/5 shadow-2xl" />
                      ) : (
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/5 shadow-inner">
                          <User size={40} />
                        </div>
                      )}
                      <div>
                        <h3 className="text-3xl font-black text-white leading-none mb-1">{selectedStudent.fullName || selectedStudent.displayName || 'Alumno Sin Nombre'}</h3>
                        <p className="text-sm text-slate-500 font-mono tracking-tighter">{selectedStudent.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="px-4 py-1.5 bg-cyber-indigo text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyber-indigo/20">
                        Nivel de Acceso: Alumno
                      </div>
                      <button 
                        onClick={() => exportStudentPDF(selectedStudent)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase hover:bg-white/10 transition-all"
                      >
                        <FileDown size={14} className="text-cyber-cyan" />
                        <span>Exportar Informe PDF</span>
                      </button>
                      <div className="text-[10px] text-slate-600 font-mono uppercase">ID: {selectedStudent.uid.slice(0, 12)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="p-5 bg-black/20 rounded-2xl border border-white/5">
                      <div className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">Teléfono</div>
                      <div className="text-sm font-bold text-white">{selectedStudent.phoneNumber || 'N/A'}</div>
                    </div>
                    <div className="p-5 bg-black/20 rounded-2xl border border-white/5">
                      <div className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">Grado</div>
                      <div className="text-sm font-bold text-white">{selectedStudent.grade || 'N/A'}</div>
                    </div>
                    <div className="p-5 bg-black/20 rounded-2xl border border-white/5">
                      <div className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">Sección</div>
                      <div className="text-sm font-bold text-white">{selectedStudent.section || 'N/A'}</div>
                    </div>
                    <div className="p-5 bg-black/20 rounded-2xl border border-white/5">
                      <div className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">Ubicación</div>
                      <div className="text-xs font-bold text-slate-400 truncate" title={selectedStudent.address}>{selectedStudent.address || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="p-8 bg-gradient-to-br from-white/5 to-transparent rounded-[32px] border border-white/5">
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Módulos Completos</div>
                      <div className="text-4xl font-black text-white">
                        {allProgress.filter(p => p.userId === selectedStudent.uid && p.completed).length}
                      </div>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-cyber-cyan/5 to-transparent rounded-[32px] border border-cyber-cyan/10">
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Promedio de Sincronización</div>
                      <div className="text-4xl font-black text-cyber-cyan">
                        {Math.round(allProgress.reduce((acc, p) => p.userId === selectedStudent.uid ? acc + (p.score || 0) : acc, 0) / (allProgress.filter(p => p.userId === selectedStudent.uid).length || 1))}%
                      </div>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-cyber-indigo/5 to-transparent rounded-[32px] border border-cyber-indigo/10">
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Registros Totales</div>
                      <div className="text-4xl font-black text-white">
                        {allProgress.filter(p => p.userId === selectedStudent.uid).length}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center space-x-2">
                    <Activity size={16} className="text-cyber-indigo" />
                    <span>Registro de Desempeño Lingüístico</span>
                  </h4>
                  <div className="space-y-3">
                    {allProgress.filter(p => p.userId === selectedStudent.uid).map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${p.completed ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-500'}`}>
                            <BookOpen size={14} />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white uppercase tracking-tight">{units.find(u => u.id === p.unitId)?.title || p.unitId}</span>
                            <div className="text-[9px] text-slate-600 font-mono">Last Accessed: {p.lastAccessed?.toDate?.().toLocaleDateString() || 'Recently'}</div>
                          </div>
                        </div>
                        <div className={`text-xs font-black px-4 py-1.5 rounded-full ${p.completed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {p.score}%
                        </div>
                      </div>
                    ))}
                    {allProgress.filter(p => p.userId === selectedStudent.uid).length === 0 && (
                      <div className="p-12 text-center text-slate-600 italic bg-black/10 rounded-3xl border border-dashed border-white/5">
                        No se han detectado registros de actividad para este alumno.
                      </div>
                    )}
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-[40px] border border-cyber-cyan/20">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                    <MessageSquare size={20} className="text-cyber-cyan" />
                    <span>Canal Seguro de Comunicación</span>
                  </h3>
                  <ChatWindow 
                    currentUserId={user?.uid || ''} 
                    targetUserId={selectedStudent.uid} 
                    targetUserName={selectedStudent.fullName || selectedStudent.email.split('@')[0]} 
                  />
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex items-center justify-center glass-panel rounded-[40px] border border-dashed border-white/10 p-12">
                <div className="text-center space-y-6 max-w-xs">
                  <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto text-slate-700">
                    <Users size={48} />
                  </div>
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] leading-relaxed">Selecciona el perfil de un alumno de la lista para inicializar el enlace táctico.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'scripts' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => navigate('/ai-teacher?mode=script')}
              className="p-8 bg-gradient-to-br from-cyber-indigo/20 to-transparent border border-cyber-indigo/30 rounded-[32px] text-left hover:scale-[1.02] transition-all group"
            >
              <div className="w-12 h-12 bg-cyber-indigo/20 rounded-2xl flex items-center justify-center text-cyber-indigo mb-4 group-hover:shadow-glow-indigo/50 transition-all">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-black text-white uppercase mb-2">Generador de Guiones</h3>
              <p className="text-slate-500 text-xs">Crea planes de clase detallados con un solo clic.</p>
            </button>
            <button 
              onClick={() => navigate('/ai-teacher?mode=activity')}
              className="p-8 bg-gradient-to-br from-cyber-cyan/20 to-transparent border border-cyber-cyan/30 rounded-[32px] text-left hover:scale-[1.02] transition-all group"
            >
              <div className="w-12 h-12 bg-cyber-cyan/20 rounded-2xl flex items-center justify-center text-cyber-cyan mb-4 group-hover:shadow-glow-cyan/50 transition-all">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-black text-white uppercase mb-2">Crear Actividades</h3>
              <p className="text-slate-500 text-xs">Diseña ejercicios interactivos y dinámicos.</p>
            </button>
            <button 
              onClick={() => navigate('/ai-teacher?mode=eval')}
              className="p-8 bg-gradient-to-br from-cyber-pink/20 to-transparent border border-cyber-pink/30 rounded-[32px] text-left hover:scale-[1.02] transition-all group"
            >
              <div className="w-12 h-12 bg-cyber-pink/20 rounded-2xl flex items-center justify-center text-cyber-pink mb-4 group-hover:shadow-glow-pink/50 transition-all">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-black text-white uppercase mb-2">Diseñar Evaluación</h3>
              <p className="text-slate-500 text-xs">Genera pruebas de nivel automáticas.</p>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <section className="glass-panel p-8 rounded-[40px] border border-white/5 lg:col-span-1 h-fit">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Plus className="text-cyber-indigo" />
                <span>Manual Script</span>
              </h2>
              <form onSubmit={handleAddScript} className="space-y-4">
              <select 
                value={newScript.classroomId}
                onChange={e => setNewScript({...newScript, classroomId: e.target.value})}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyber-indigo text-sm"
              >
                <option value="">Material Global (Sin Aula)</option>
                {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input 
                type="text" 
                placeholder="Título del Guión (Ej: Semana 1)"
                value={newScript.title}
                onChange={e => setNewScript({...newScript, title: e.target.value})}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyber-indigo text-sm"
                required
              />
              <textarea 
                rows={10}
                placeholder="Contenido en Markdown... instrucciones, ejercicios o guiones."
                value={newScript.content}
                onChange={e => setNewScript({...newScript, content: e.target.value})}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyber-indigo text-sm font-mono"
                required
              />
              <button 
                type="submit" 
                disabled={scriptLoading}
                className="w-full bg-cyber-indigo text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {scriptLoading ? 'Sincronizando...' : 'Desplegar Guión'}
              </button>
            </form>
          </section>

          <section className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <FileText className="text-cyber-cyan" />
              <span>Guiones Activos</span>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {lessonScripts.map(script => (
                <div key={script.id} className="glass-card p-6 rounded-3xl flex items-center justify-between border border-white/5">
                  <div className="flex items-center space-x-6">
                    <div className="p-3 bg-cyber-indigo/10 rounded-2xl text-cyber-indigo">
                      <Terminal size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{script.title}</h4>
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 uppercase">
                        <span>Target: {classrooms.find(c => c.id === script.classroomId)?.name || 'Unknown'}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span>Len: {script.content.length} chars</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteScript(script.id)} className="p-3 text-slate-500 hover:text-cyber-pink hover:bg-cyber-pink/10 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {lessonScripts.length === 0 && <p className="text-center py-20 text-slate-500 italic">No custom scripts detected in this sector.</p>}
            </div>
          </section>
        </div>
      </div>
    )}

      {activeTab === 'resources' && (
        <section className="glass-panel p-10 rounded-[40px] border border-white/5 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold text-white mb-6">Repositorio Audiovisual</h2>
          <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <input type="text" placeholder="Título" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-cyber-indigo" required />
            <input type="text" placeholder="URL del Recurso" value={newResource.url} onChange={e => setNewResource({...newResource, url: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-cyber-indigo" required />
            <select value={newResource.type} onChange={e => setNewResource({...newResource, type: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-cyber-indigo">
              <option value="link">Enlace (Link)</option>
              <option value="video">Video</option>
              <option value="audio">Audio / Ejercicio</option>
              <option value="pdf">Documento PDF</option>
            </select>
            <button type="submit" className="bg-cyber-indigo text-white p-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all">Añadir Recurso</button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allResources.map(res => (
              <div key={res.id} className="bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 rounded-xl text-slate-400">
                    {res.type === 'video' ? <Video size={20} /> : res.type === 'audio' ? <Music size={20} /> : <ExternalLink size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-white uppercase text-xs tracking-wider">{res.title}</div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono mt-1">{res.type} sector</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:text-white transition-colors">
                    <ExternalLink size={16} />
                  </a>
                  <button onClick={() => deleteDoc(doc(db, 'unit_resources', res.id))} className="p-2 text-slate-500 hover:text-cyber-pink transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {allResources.length === 0 && <p className="col-span-full text-center py-20 text-slate-600 italic">No hay recursos audiovisuales configurados.</p>}
          </div>
        </section>
      )}

      {activeTab === 'assignments' && (
        <section className="glass-panel p-10 rounded-[40px] border border-white/5 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Despliegue de Misiones (Evaluación)</h2>
            <button 
              onClick={() => navigate('/ai-teacher')}
              className="px-6 py-3 bg-cyber-pink text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 hover:scale-105 transition-all shadow-lg shadow-cyber-pink/20"
            >
              <Bot size={18} />
              <span>Generar Actividades con IA</span>
            </button>
          </div>
          <form onSubmit={handleAddAssignment} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <select value={newAssignment.classroomId} onChange={e => setNewAssignment({...newAssignment, classroomId: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-cyber-indigo" required>
              <option value="">Aula Objetivo</option>
              {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={newAssignment.unitId} onChange={e => setNewAssignment({...newAssignment, unitId: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-cyber-indigo">
              {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
            </select>
            <div className="relative">
              <input 
                type="date" 
                value={newAssignment.dueDate} 
                onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} 
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-cyber-indigo" 
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Calendar size={18} />
              </div>
            </div>
            <button type="submit" className="bg-cyber-pink text-white p-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all">Asignar Misión</button>
          </form>

          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Misiones Activas y Resultados</h3>
          <div className="grid grid-cols-1 gap-6">
            {assignments.map(a => {
              const unit = units.find(u => u.id === a.unitId);
              const classroomStudents = students.filter(s => s.classroomId === a.classroomId);
              const scores = allProgress.filter(p => p.unitId === a.unitId && classroomStudents.some(s => s.uid === p.userId));
              const avgScore = scores.length > 0 ? Math.round(scores.reduce((acc, curr) => acc + (curr.score || 0), 0) / scores.length) : 0;
              
              return (
                <div key={a.id} className="bg-white/5 p-8 rounded-[32px] border border-cyber-pink/20 hover:border-cyber-pink/40 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-cyber-pink/10 rounded-2xl flex items-center justify-center text-cyber-pink shadow-glow-pink/10 group-hover:shadow-glow-pink/20 transition-all">
                        <Target size={32} />
                      </div>
                      <div>
                        <div className="font-black text-white text-xl uppercase tracking-tighter">{unit?.title}</div>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="text-xs text-slate-500">Objetivo: <span className="text-slate-300 font-bold">{classrooms.find(c => c.id === a.classroomId)?.name}</span></div>
                          {a.dueDate && (
                            <div className="text-[10px] text-cyber-pink shadow-glow-pink/20 font-bold uppercase flex items-center gap-1">
                              <Clock size={10} />
                              Vence: {new Date(a.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-2xl font-black text-cyber-pink">{avgScore}%</div>
                        <div className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Promedio Aula</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-white">{scores.length}/{classroomStudents.length}</div>
                        <div className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Completado</div>
                      </div>
                      <button onClick={() => deleteDoc(doc(db, 'assignments', a.id))} className="p-4 text-slate-700 hover:text-cyber-pink hover:bg-cyber-pink/10 rounded-2xl transition-all">
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {assignments.length === 0 && <p className="text-center py-20 text-slate-600 italic border border-dashed border-white/5 rounded-[40px]">No hay misiones asignadas actualmente.</p>}
          </div>
        </section>
      )}

      {activeTab === 'games' && (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-panel p-10 rounded-[40px] border border-white/5 bg-gradient-to-br from-cyber-indigo/5 to-transparent">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Ludoteca Pedagógica</h2>
                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Configuración de Experiencias Gamificadas</p>
              </div>
              <button 
                onClick={() => navigate('/ai-teacher')}
                className="bg-cyber-indigo text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center space-x-3 hover:scale-105 transition-all shadow-lg shadow-cyber-indigo/20 uppercase tracking-widest text-xs"
              >
                <Bot size={20} />
                <span>Generar Juego con IA</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'memory', name: 'Neural Memory', type: 'Vocabulario', icon: Brain, color: 'text-cyber-indigo' },
                { id: 'dictation_game', name: 'Sonic Command', type: 'Listening', icon: Headphones, color: 'text-cyber-cyan' },
                { id: 'grammar_race', name: 'Syntax Runner', type: 'Grammar', icon: Activity, color: 'text-cyber-pink' }
              ].map(game => (
                <div key={game.id} className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-white/20 transition-all group">
                  <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${game.color} mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                    <game.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{game.name}</h3>
                  <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-6">{game.type}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Estado: Operativo</span>
                    <button className="text-cyber-indigo text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                      Personalizar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-black/40 rounded-[32px] border border-white/5 text-center">
              <Zap size={40} className="text-cyber-indigo mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-bold text-white mb-2">¿Cómo funcionan los juegos?</h3>
              <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
                Los juegos se activan automáticamente al asignar una "Misión" desde la pestaña de Evaluaciones. 
                Los estudiantes podrán acceder a ellos desde su panel principal una vez que la misión esté activa.
              </p>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'tools' && (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-panel p-10 rounded-[40px] border border-white/5">
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Herramientas de IA para Estudiantes</h2>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-8">Previsualización de Módulos de Aprendizaje</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link 
                to="/dictation"
                className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-cyber-cyan hover:bg-cyber-cyan/5 transition-all group"
              >
                <div className="w-14 h-14 bg-cyber-cyan/10 rounded-2xl flex items-center justify-center text-cyber-cyan mb-6 group-hover:scale-110 transition-transform">
                  <Headphones size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Dictado Táctico</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Módulo de comprensión auditiva y escritura con síntesis de voz inteligente.
                </p>
                <div className="flex items-center text-cyber-cyan text-[10px] font-black uppercase tracking-widest">
                  <span>Abrir Herramienta</span>
                  <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link 
                to="/writing-corrector"
                className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-cyber-indigo hover:bg-cyber-indigo/5 transition-all group"
              >
                <div className="w-14 h-14 bg-cyber-indigo/10 rounded-2xl flex items-center justify-center text-cyber-indigo mb-6 group-hover:scale-110 transition-transform">
                  <PenTool size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Corrector de Escritura</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Asistente de refinamiento lingüístico impulsado por la IA de Elena.
                </p>
                <div className="flex items-center text-cyber-indigo text-[10px] font-black uppercase tracking-widest">
                  <span>Abrir Herramienta</span>
                  <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link 
                to="/ai-teacher"
                className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-cyber-pink hover:bg-cyber-pink/5 transition-all group"
              >
                <div className="w-14 h-14 bg-cyber-pink/10 rounded-2xl flex items-center justify-center text-cyber-pink mb-6 group-hover:scale-110 transition-transform">
                  <Cpu size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Asistente Elena</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Enlace de comunicación directa con el núcleo de IA pedagógica.
                </p>
                <div className="flex items-center text-cyber-pink text-[10px] font-black uppercase tracking-widest">
                  <span>Abrir Chat</span>
                  <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      </main>
    </div>
  );
};

export default TeacherDashboard;
