import React, { useState, useEffect, useRef } from 'react';
import { chatWithAITeacher } from '../services/geminiService';
import { Send, Bot, User, Sparkles, Terminal, Zap, Shield, Save, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isResource?: boolean;
}

const AIChat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode');
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'classrooms'), where('teacherId', '==', auth.currentUser.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setClassrooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleSaveToClass = async (text: string) => {
    if (!selectedClassId || !auth.currentUser) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'lesson_scripts'), {
        title: `Plan de Clase: ${new Date().toLocaleDateString()}`,
        content: text,
        teacherId: auth.currentUser.uid,
        classroomId: selectedClassId,
        createdAt: serverTimestamp(),
        type: mode || 'general'
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Error al guardar el recurso. El enlace táctico falló.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitialMessage = () => {
    switch(mode) {
      case 'script':
        return "🛠️ **Modo: Generador de Guiones Activado**. \n\n¡Hola! Soy Elena. Para ayudarte a crear un plan de clase perfecto, por favor dime: \n1. **¿Qué tema quieres enseñar?** (ej: Compras en el súper) \n2. **¿Qué nivel tienen tus alumnos?** (ej: A1, B2)";
      case 'activity':
        return "🎮 **Modo: Creador de Actividades Activado**. \n\n¡Hola! Diseñemos algo divertido. ¿Qué quieres practicar hoy? \n- *Sugerencia*: Phrasal Verbs, Conversation Practice, o Listening Comprehension.";
      case 'eval':
        return "📊 **Modo: Diseñador de Evaluaciones Activado**. \n\n¡Hola! Vamos a medir el progreso. ¿Sobre qué tema quieres la evaluación y cuántas preguntas necesitas?";
      default:
        return "Hello! I am **Elena**, your AI Linguistic Assistant. How can I help you perfect your English today?";
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: getInitialMessage(),
      timestamp: new Date()
    }
  ]);

  const quickSuggestions = {
    script: ['B1: Vacaciones', 'A2: Presente Simple', 'C1: Negocios'],
    activity: ['Juego de Roles', 'Completar Espacios', 'Práctica de Audio'],
    eval: ['Test de 5 preguntas', 'Examen de Vocabulario', 'Comprensión Lectora'],
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(`Generar ${mode} sobre: ${suggestion}`);
  };
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const history = messages.slice(0, -1).map(m => ({ 
      role: (m.role === 'model' ? 'model' : 'user') as 'user' | 'model', 
      text: m.text 
    }));
    
    try {
      const response = await chatWithAITeacher(inputValue, history);
      setIsTyping(false);
      
      // Detect if response is a structured resource (contains tables or headers)
      const isResource = response.includes('|') || response.includes('###') || response.includes('**');

      setMessages(prev => [...prev, {
        role: 'model',
        text: response || "I am processing your command, operative. Please restate your request.",
        timestamp: new Date(),
        isResource
      }]);
    } catch (error: any) {
      console.error("Elena Error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "🚨 **Error de Sincronización**: Mi conexión con el núcleo de IA falló. Reintenta el envío protocolo.",
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 h-[calc(100vh-12rem)] flex flex-col glass-panel rounded-[40px] border border-white/5 overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-indigo/5 to-transparent pointer-events-none"></div>
      
      <header className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyber-indigo to-cyber-cyan flex items-center justify-center text-white shadow-lg shadow-cyber-indigo/30 relative">
            <Bot size={24} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-deep-space animate-pulse"></div>
          </div>
          <div>
            <h2 className="font-bold text-white text-xl tracking-tight flex items-center space-x-2">
              <span>ELENA AI</span>
              <Sparkles size={14} className="text-cyber-cyan" />
            </h2>
            <div className="text-[10px] text-cyber-indigo font-black uppercase tracking-[0.2em] flex items-center">
              <Shield size={10} className="mr-1" />
              Secure Linguistic Protocol
            </div>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest hidden sm:block">AI_CORE_v3.1</div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth relative z-10">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
              <div className={`p-6 rounded-3xl relative ${msg.role === 'user' ? 'bg-cyber-indigo text-white rounded-tr-none shadow-lg shadow-cyber-indigo/20' : 'bg-slate-800/50 text-slate-200 border border-white/5 rounded-tl-none backdrop-blur-sm'}`}>
                <div className="markdown-body text-sm leading-relaxed">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {msg.role === 'model' && msg.isResource && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-white/10 space-y-4"
                  >
                    <div className="flex items-center space-x-2 text-cyber-indigo">
                      <Save size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Protocolo de Guardado</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select 
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="bg-obsidian border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyber-indigo flex-1"
                      >
                        <option value="">Seleccionar Aula Destino...</option>
                        {classrooms.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      
                      <button 
                        onClick={() => handleSaveToClass(msg.text)}
                        disabled={!selectedClassId || isSaving || saveSuccess}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${saveSuccess ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-cyber-indigo text-white shadow-lg shadow-cyber-indigo/20 disabled:opacity-30'}`}
                      >
                        {saveSuccess ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>¡Guardado!</span>
                          </>
                        ) : (
                          <>
                            <BookOpen size={14} />
                            <span>Asignar a Aula</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
                <div className={`text-[9px] mt-3 font-mono opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-800/30 p-4 rounded-2xl border border-white/5 flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-cyber-indigo rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-cyber-indigo rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-cyber-indigo rounded-full animate-bounce"></div>
            </div>
          </motion.div>
        )}
        
        {/* Quick Suggestions for Teachers */}
        {!isTyping && mode && (mode === 'script' || mode === 'activity' || mode === 'eval') && (
          <div className="flex flex-wrap gap-2 justify-center pb-4">
            {(quickSuggestions[mode as keyof typeof quickSuggestions] || []).map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="px-4 py-2 bg-cyber-indigo/10 border border-cyber-indigo/20 text-cyber-indigo rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyber-indigo/20 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-8 bg-black/20 border-t border-white/5 relative z-10">
        <div className="flex space-x-4">
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-indigo to-cyber-cyan rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about English grammar..."
              className="relative w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-cyber-indigo text-white transition-all font-sans text-sm"
              disabled={isTyping}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none">
              <Terminal size={16} />
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-white text-obsidian p-5 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-indigo/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Send size={24} className="relative z-10 transition-colors group-hover:text-cyber-indigo" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
