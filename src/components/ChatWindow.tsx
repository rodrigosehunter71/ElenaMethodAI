import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Send, User as UserIcon, Bot, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatWindowProps {
  currentUserId: string;
  targetUserId: string;
  targetUserName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUserId, targetUserId, targetUserName }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatId = [currentUserId, targetUserId].sort().join('_');

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: currentUserId,
        receiverId: targetUserId,
        text: inputValue,
        timestamp: serverTimestamp()
      });
      setInputValue('');
    } catch (err) {
      console.error("Chat Error:", err);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden">
      <header className="p-4 border-b border-white/5 bg-white/5 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-cyber-indigo flex items-center justify-center text-white">
          <UserIcon size={16} />
        </div>
        <span className="font-bold text-white text-sm">{targetUserName}</span>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.senderId === currentUserId ? 'bg-cyber-indigo text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-black/20 flex space-x-2">
        <input 
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-cyber-indigo"
        />
        <button type="submit" className="p-2 bg-white text-obsidian rounded-xl hover:scale-105 active:scale-95 transition-all">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
