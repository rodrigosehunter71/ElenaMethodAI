import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { units } from '../data/units';
import ReactMarkdown from 'react-markdown';
import { useAuth } from './FirebaseProvider';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { BookOpen, PenTool, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Trophy, Cpu, Zap, FileText, ExternalLink, Sparkles, MessageSquare, Video, Music, Gamepad2, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGrammarAssistantFeedback, generateDynamicExercises } from '../services/geminiService';
import WordScramble from './WordScramble';

const UnitDetail: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const { user, userData, addXP, handleDailyStreak } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'games' | 'ai-tutor'>('learn');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [dynamicEx, setDynamicEx] = useState<any[]>([]);
  const [dynLoading, setDynLoading] = useState(false);
  const [dynAnswers, setDynAnswers] = useState<Record<number, string>>({});
  const [dynResults, setDynResults] = useState<Record<number, boolean>>({});
  const [results, setResults] = useState<Record<string, boolean | null>>({});
  const [aiFeedbacks, setAiFeedbacks] = useState<Record<string, { explanation: string, suggestion: string }>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [resources, setResources] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const content = units.find(u => u.id === unitId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [unitId]);

  useEffect(() => {
    if (!unitId) return;
    const q = query(collection(db, 'unit_resources'), where('unitId', '==', unitId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [unitId]);

  const handleGenerateExercises = async () => {
    if (!content) return;
    setDynLoading(true);
    const ex = await generateDynamicExercises(content.title, 5);
    setDynamicEx(ex);
    setDynAnswers({});
    setDynResults({});
    setDynLoading(false);
  };

  const checkDynAnswer = (index: number, answer: string, correct: string) => {
    const isCorrect = answer.trim().toLowerCase() === correct.toLowerCase();
    setDynResults(prev => ({ ...prev, [index]: isCorrect }));
  };

  const handleAnswerChange = (id: string, val: string) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = async () => {
    if (!content || !user) return;

    setIsAnalyzing(true);
    let correctCount = 0;
    const newResults: Record<string, boolean> = {};
    const newAiFeedbacks: Record<string, { explanation: string, suggestion: string }> = {};
    const errorLogs: any[] = [];

    for (const ex of content.exercises) {
      const isCorrect = answers[ex.id]?.trim().toLowerCase() === ex.correctAnswer.toLowerCase();
      if (isCorrect) {
        correctCount++;
        newResults[ex.id] = true;
      } else {
        newResults[ex.id] = false;
        // Collect error log
        errorLogs.push({
          unitId: content.id,
          exerciseId: ex.id,
          question: ex.question,
          correctAnswer: ex.correctAnswer,
          userAnswer: answers[ex.id] || '',
          timestamp: new Date().toISOString()
        });
        
        // Get AI feedback for incorrect answers if they actually typed something
        if (answers[ex.id]?.trim()) {
          const feedback = await getGrammarAssistantFeedback(ex.question, answers[ex.id], content.title);
          newAiFeedbacks[ex.id] = { explanation: feedback.explanation, suggestion: feedback.suggestion };
        }
      }
    }

    setResults(newResults);
    setAiFeedbacks(newAiFeedbacks);
    setSubmitted(true);
    const finalScore = content?.exercises ? Math.round((correctCount / content.exercises.length) * 100) : 0;
    setScore(finalScore);
    setIsAnalyzing(false);

    // XP calculation: 10 per correct answer + 100 for mastering unit
    const earnedXP = (correctCount * 10) + (finalScore >= 70 ? 100 : 0);
    if (earnedXP > 0) {
      await addXP(earnedXP);
    }
    await handleDailyStreak();

    // Save progress and error logs
    try {
      const progressId = `${user.uid}_${content.id}`;
      await setDoc(doc(db, 'progress', progressId), {
        userId: user.uid,
        unitId: content.id,
        completed: finalScore >= 70, 
        score: finalScore,
        lastAccessed: serverTimestamp()
      });

      // Log errors if any
      if (errorLogs.length > 0) {
        const errorLogRef = doc(db, 'error_logs', user.uid);
        const existingErrors = await getDoc(errorLogRef);
        let logs = errorLogs;
        if (existingErrors.exists()) {
          logs = [...(existingErrors.data().logs || []), ...errorLogs].slice(-50); // Keep last 50 errors
        }
        await setDoc(errorLogRef, { logs, updatedAt: serverTimestamp() });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'progress');
    }
  };

  if (!content) return <div className="text-center py-20 text-slate-500">Module not found or content not yet loaded.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-slate-500 hover:text-cyber-indigo transition-colors group font-bold text-xs uppercase tracking-widest w-fit"
        >
          <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Return to Command
        </button>

        <button 
          onClick={() => navigate('/ai-teacher')}
          className="flex items-center space-x-2 bg-cyber-indigo/10 text-cyber-indigo px-4 py-2 rounded-xl text-xs font-bold border border-cyber-indigo/20 hover:bg-cyber-indigo/20 transition-all group"
        >
          <MessageSquare size={14} className="group-hover:rotate-12 transition-transform" />
          <span>Ask Elena AI about this module</span>
        </button>
      </div>

      <header className="mb-12 relative">
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-cyber-indigo/30 rounded-tl-2xl"></div>
        <div className="flex items-center space-x-4 mb-4">
          <span className="bg-cyber-indigo/10 text-cyber-indigo px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-cyber-indigo/20">
            Level {content.level}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          <span className="text-slate-500 font-mono text-xs">MOD_{content.id.toUpperCase()}</span>
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tighter glow-text-indigo">{content.title}</h1>
      </header>

      <div className="flex glass-panel p-1.5 rounded-2xl mb-12 w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab('learn')}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${activeTab === 'learn' ? 'bg-cyber-indigo text-white shadow-lg shadow-cyber-indigo/20' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BookOpen size={18} />
          <span>Manual</span>
        </button>
        <button 
          onClick={() => setActiveTab('practice')}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${activeTab === 'practice' ? 'bg-cyber-indigo text-white shadow-lg shadow-cyber-indigo/20' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <PenTool size={18} />
          <span>Simulation</span>
        </button>
        <button 
          onClick={() => setActiveTab('games')}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 relative ${activeTab === 'games' ? 'bg-cyber-pink text-white shadow-lg shadow-cyber-pink/20' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Gamepad2 size={18} />
          <span>Games</span>
          <div className="absolute -top-2 -right-2 bg-cyber-indigo text-[7px] px-1.5 py-0.5 rounded-full font-black animate-pulse shadow-glow-indigo">NEW</div>
        </button>
        <button 
          onClick={() => setActiveTab('ai-tutor')}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 relative ${activeTab === 'ai-tutor' ? 'bg-white text-obsidian shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Sparkles size={18} />
          <span>AI Tutor</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'learn' ? (
          <motion.div 
            key="learn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <section className="glass-panel p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Zap size={100} className="text-cyber-indigo" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Cpu className="text-cyber-indigo" />
                <span>Core Objectives</span>
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content?.learningObjectives?.map((obj, i) => (
                  <li key={i} className="flex items-start text-slate-400 text-sm leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-cyber-indigo rounded-full mt-1.5 mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                    {obj}
                  </li>
                ))}
              </ul>
            </section>

            {content?.sections?.map((section, i) => (
              <section key={i} className="glass-panel p-10 rounded-[40px] border border-white/5">
                <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/5 pb-6 flex items-center justify-between">
                  <span>{section.title}</span>
                  <span className="text-[10px] font-mono text-slate-600">SEC_0{i+1}</span>
                </h2>
                <div className="markdown-body">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </section>
            ))}

            {resources.length > 0 && (
              <section className="glass-panel p-10 rounded-[40px] border border-cyber-cyan/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Cpu className="text-cyber-cyan" />
                  <span>Audiovisual & Resources</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resources.map(res => {
                    const Icon = res.type === 'video' ? Video : res.type === 'audio' ? Music : res.type === 'pdf' ? FileText : ExternalLink;
                    return (
                      <a 
                        key={res.id} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-cyber-cyan/30 hover:bg-cyber-cyan/5 transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${res.type === 'video' ? 'bg-cyber-pink/10 text-cyber-pink' : res.type === 'audio' ? 'bg-cyber-indigo/10 text-cyber-indigo' : 'bg-cyber-cyan/10 text-cyber-cyan'}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-cyber-cyan transition-colors">{res.title}</span>
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{res.type || 'link'}</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-500 group-hover:text-cyber-cyan" />
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => setActiveTab('practice')}
                className="group relative px-12 py-5 bg-white text-obsidian font-black rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-indigo/0 via-cyber-indigo/20 to-cyber-indigo/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center space-x-3">
                  <span>Initialize Simulation</span>
                  <ArrowRight size={20} />
                </span>
              </button>
            </div>
          </motion.div>
        ) : activeTab === 'ai-tutor' ? (
          <motion.div 
            key="ai-tutor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <section className="glass-panel p-10 rounded-[40px] border border-cyber-indigo/30 bg-cyber-indigo/5">
              <h2 className="text-3xl font-black text-white mb-4 flex items-center space-x-3">
                <Terminal className="text-cyber-indigo" />
                <span>Unlimited AI Training</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-2xl">
                Need more practice? Activate the AI Synthesis module to generate customized exercises targeting <strong>{content.title}</strong> grammar structures in real-time.
              </p>
              
              {!dynamicEx.length ? (
                <button 
                  onClick={handleGenerateExercises}
                  disabled={dynLoading}
                  className="bg-white text-obsidian px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {dynLoading ? 'Synthesizing Exercises...' : 'Generate New Training Sequence'}
                </button>
              ) : (
                <div className="space-y-6">
                  {dynamicEx.map((ex, idx) => (
                    <div key={idx} className="bg-slate-900/60 p-8 rounded-3xl border border-white/5 space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-cyan-500">AI_GEN_EXEC_{idx + 1}</span>
                        {dynResults[idx] !== undefined && (
                          dynResults[idx] ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />
                        )}
                      </div>
                      <p className="text-xl font-bold text-white">{ex.question}</p>
                      
                      {ex.type === 'multiple-choice' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          {ex.options?.map((opt: string) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setDynAnswers({...dynAnswers, [idx]: opt});
                                checkDynAnswer(idx, opt, ex.correctAnswer);
                              }}
                              className={`p-4 rounded-xl border transition-all text-left font-bold ${dynAnswers[idx] === opt ? 'border-cyber-indigo bg-cyber-indigo/10 text-white' : 'border-white/5 text-slate-400'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input 
                          type="text"
                          placeholder="Your answer..."
                          onBlur={(e) => {
                            setDynAnswers({...dynAnswers, [idx]: e.target.value});
                            checkDynAnswer(idx, e.target.value, ex.correctAnswer);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyber-indigo"
                        />
                      )}

                      {dynResults[idx] === false && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <p className="text-sm text-red-400"><span className="font-bold">Protocol Failure:</span> Correct sync requirement: <span className="font-mono text-white">{ex.correctAnswer}</span></p>
                          <p className="text-xs text-slate-500 mt-2 italic">{ex.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={handleGenerateExercises}
                    className="w-full py-4 text-slate-400 border border-dashed border-white/10 rounded-2xl hover:bg-white/5 transition-all"
                  >
                    Generate More Exercises
                  </button>
                </div>
              )}
            </section>
          </motion.div>
        ) : activeTab === 'practice' ? (
          <motion.div 
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {isAnalyzing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/60 backdrop-blur-sm">
                <div className="glass-panel p-8 rounded-3xl flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-cyber-indigo border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white font-bold tracking-widest text-xs animate-pulse uppercase">AI Analyzing Sync Data...</p>
                </div>
              </div>
            )}

            {submitted && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-10 rounded-[40px] border flex flex-col items-center text-center mb-12 relative overflow-hidden ${score >= 70 ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-cyber-pink/5 border-cyber-pink/20 text-cyber-pink'}`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-current opacity-20"></div>
                <Trophy size={64} className="mb-6 animate-bounce" />
                <h2 className="text-5xl font-black mb-4 tracking-tighter">Sync Level: {score}%</h2>
                <p className="text-xl opacity-80 max-w-md font-light">
                  {score >= 70 ? 'Linguistic synchronization successful. Module mastered.' : 'Synchronization incomplete. Recalibration required.'}
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setResults({}); setAnswers({}); setAiFeedbacks({}); }}
                  className="mt-10 text-xs font-black uppercase tracking-[0.3em] border-b-2 border-current pb-1 hover:opacity-70 transition-opacity"
                >
                  Restart Simulation
                </button>
              </motion.div>
            )}

            {content?.exercises?.map((ex, i) => (
              <div key={ex.id} className="glass-panel p-10 rounded-[40px] border border-white/5 relative group">
                <div className="flex items-start justify-between mb-8">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Task Sequence 0{i + 1}</span>
                  {submitted && (
                    results[ex.id] ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-cyber-pink" />
                  )}
                </div>
                <p className="text-2xl font-bold text-white mb-10 leading-tight">{ex.question}</p>
                
                {ex.type === 'fill-in-blank' ? (
                  <div className="relative">
                    <input 
                      type="text"
                      value={answers[ex.id] || ''}
                      onChange={(e) => handleAnswerChange(ex.id, e.target.value)}
                      disabled={submitted}
                      placeholder="Input response..."
                      className={`w-full bg-slate-900/50 p-6 rounded-2xl border-2 transition-all outline-none font-mono text-lg ${submitted ? (results[ex.id] ? 'border-green-500/30 text-green-400' : 'border-cyber-pink/30 text-cyber-pink') : 'border-white/5 focus:border-cyber-indigo focus:bg-cyber-indigo/5 text-white'}`}
                    />
                    {!submitted && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyber-indigo animate-pulse"><Zap size={20} /></div>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ex.options?.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleAnswerChange(ex.id, opt)}
                        disabled={submitted}
                        className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 font-bold ${answers[ex.id] === opt ? 'border-cyber-indigo bg-cyber-indigo/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-white/10 text-slate-400'} ${submitted && ex.correctAnswer === opt ? 'border-green-500 bg-green-500/10 text-green-400' : ''} ${submitted && answers[ex.id] === opt && ex.correctAnswer !== opt ? 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {answers[ex.id] === opt && !submitted && <div className="w-2 h-2 bg-cyber-indigo rounded-full shadow-[0_0_8px_rgba(99,102,241,1)]"></div>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {submitted && !results[ex.id] && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 space-y-4"
                  >
                    <div className="p-6 bg-white/5 rounded-2xl text-sm border border-white/5">
                      <span className="font-black text-cyber-indigo uppercase tracking-widest mr-3">Manual Feedback:</span> 
                      <span className="text-slate-400">{ex.feedback}</span>
                    </div>

                    {aiFeedbacks[ex.id] && (
                      <div className="p-6 bg-cyber-indigo/5 border border-cyber-indigo/20 rounded-2xl text-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <Sparkles size={14} className="text-cyber-indigo" />
                          <span className="font-black text-cyber-indigo uppercase tracking-widest">Elena AI Analysis</span>
                        </div>
                        <p className="text-slate-200 mb-4">{aiFeedbacks[ex.id].explanation}</p>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                          <span className="text-[10px] font-black text-cyber-cyan uppercase tracking-widest block mb-2">Pro Tip:</span>
                          <p className="text-slate-400 italic">"{aiFeedbacks[ex.id].suggestion}"</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}

            {!submitted && (
              <div className="pt-12">
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-cyber-indigo to-cyber-cyan text-white py-6 rounded-3xl font-black shadow-2xl hover:scale-[1.02] transition-all text-xl uppercase tracking-[0.2em]"
                >
                  Finalize Submission
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="games"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4 mb-8">
              <div className="inline-block p-4 bg-cyber-pink/10 rounded-full text-cyber-pink border border-cyber-pink/20 mb-4">
                <Gamepad2 size={40} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Interactive Challenges</h2>
              <p className="text-slate-400 max-w-lg mx-auto">Master grammar mechanics through active synchronization protocols. High-performance gaming for high-performance learning.</p>
            </div>

            <WordScramble 
              sentence={content.exercises[0]?.question.replace(/\d+\. /, '').replace('______', content.exercises[0]?.correctAnswer) || "The verb to be is fundamental."} 
              onComplete={(gameScore) => {
                console.log("Game score:", gameScore);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnitDetail;
