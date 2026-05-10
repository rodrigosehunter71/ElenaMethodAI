import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './FirebaseProvider';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, orderBy, serverTimestamp, getDocs } from 'firebase/firestore';
import { Send, User, MessageSquare, Terminal, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Chat: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatUser, setSelectedChatUser] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAdmin && user) {
      // Fetch classrooms
      const classQ = query(collection(db, 'classrooms'), where('teacherId', '==', user.uid));
      getDocs(classQ).then(snapshot => {
        setClassrooms(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });

      // Fetch students
      const q = query(collection(db, 'users'), where('role', '==', 'student'));
      getDocs(q).then(snapshot => {
        setStudents(snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id })));
      });
    } else if (user) {
      const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
      getDocs(q).then(snapshot => {
        if (!snapshot.empty) {
          setSelectedChatUser({ ...snapshot.docs[0].data(), uid: snapshot.docs[0].id });
        }
      });
    }
  }, [isAdmin, user]);

  const filteredStudents = selectedClassId 
    ? students.filter(s => s.classroomId === selectedClassId)
    : students;

  useEffect(() => {
    if (!user || !selectedChatUser) return;

    const chatId = [user.uid, selectedChatUser.uid].sort().join('_');
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'messages');
    });

    return () => unsubscribe();
  }, [user, selectedChatUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedChatUser) return;

    const chatId = [user.uid, selectedChatUser.uid].sort().join('_');
    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        senderId: user.uid,
        receiverId: selectedChatUser.uid,
        text: newMessage,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex mt-24 glass-panel rounded-[40px] border border-white/5 overflow-hidden">
      {isAdmin && (
        <div className="w-1/3 border-r border-white/5 bg-white/5 flex flex-col">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Terminal size={20} className="text-cyber-indigo" />
              <h2 className="text-lg font-bold text-white tracking-tight uppercase tracking-widest text-xs">Operatives</h2>
            </div>
          </div>
          
          {/* Classroom Filter */}
          <div className="p-4 border-b border-white/5 bg-black/20">
            <select 
              value={selectedClassId || ''} 
              onChange={(e) => setSelectedClassId(e.target.value || null)}
              className="w-full bg-slate-900 border border-white/10 text-white text-[10px] font-bold rounded-lg p-3 outline-none focus:border-cyber-indigo transition-all"
            >
              <option value="">All Classrooms</option>
              {classrooms.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredStudents.map(student => (
              <button
                key={student.uid}
                onClick={() => setSelectedChatUser(student)}
                className={`w-full p-6 flex items-center space-x-4 transition-all duration-300 ${selectedChatUser?.uid === student.uid ? 'bg-cyber-indigo/10 border-r-4 border-cyber-indigo' : 'hover:bg-white/5'}`}
              >
                {student.photoURL ? (
                  <img 
                    src={student.photoURL} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl border border-white/10" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10">
                    <User size={24} />
                  </div>
                )}
                <div className="text-left">
                  <div className="font-bold text-white text-sm">{student.displayName || 'Student'}</div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{student.email?.split('@')[0] || 'unknown'}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col relative ${!selectedChatUser ? 'items-center justify-center' : ''}`}>
        {!selectedChatUser ? (
          <div className="text-center p-12">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 bg-cyber-indigo/10 rounded-full flex items-center justify-center text-cyber-indigo mx-auto mb-8 border border-cyber-indigo/20"
            >
              <MessageSquare size={40} />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">Communications Hub</h2>
            <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">Select an operative to initialize a secure communication channel.</p>
          </div>
        ) : (
          <>
            <header className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                {selectedChatUser.photoURL ? (
                  <img 
                    src={selectedChatUser.photoURL} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl border border-white/10" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-white text-lg tracking-tight">{selectedChatUser.displayName || (isAdmin ? 'Student' : 'Teacher')}</h2>
                  <div className="flex items-center text-[10px] text-cyber-cyan font-black uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full mr-2 shadow-[0_0_8px_rgba(6,182,212,1)] animate-pulse"></span>
                    Link Active
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Channel_SEC_01</div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-5 rounded-3xl relative ${msg.senderId === user?.uid ? 'bg-cyber-indigo text-white rounded-tr-none shadow-lg shadow-cyber-indigo/20' : 'bg-slate-800/50 text-slate-200 border border-white/5 rounded-tl-none'}`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`text-[9px] mt-2 font-mono opacity-50 ${msg.senderId === user?.uid ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) || 'Syncing...'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-8 bg-white/5 border-t border-white/5">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Input transmission..."
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-cyber-indigo focus:bg-cyber-indigo/5 text-white transition-all font-sans"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700">
                    <Zap size={16} />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-white text-obsidian p-4 rounded-2xl shadow-2xl hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all group"
                >
                  <Send size={24} className="group-hover:text-cyber-indigo transition-colors" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
