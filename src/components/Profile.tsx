import React, { useState, useEffect } from 'react';
import { useAuth } from './FirebaseProvider';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Shield, Camera, Save, LogOut, CheckCircle2 } from 'lucide-react';
import { auth } from '../firebase';

const Profile: React.FC = () => {
  const { userData, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [fullName, setFullName] = useState(userData?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [grade, setGrade] = useState(userData?.grade || '');
  const [section, setSection] = useState(userData?.section || '');
  const [address, setAddress] = useState(userData?.address || '');
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || '');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync state when userData changes (e.g. after first load)
  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '');
      setFullName(userData.fullName || '');
      setPhoneNumber(userData.phoneNumber || '');
      setGrade(userData.grade || '');
      setSection(userData.section || '');
      setAddress(userData.address || '');
      setPhotoURL(userData.photoURL || '');
    }
  }, [userData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ 
        displayName, 
        fullName, 
        phoneNumber, 
        grade, 
        section, 
        address, 
        photoURL 
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      alert("Error al sincronizar configuración. Revisa tu conexión.");
    } finally {
      setSaving(false);
    }
  };

  const resetRole = async () => {
    if (window.confirm("¿Estás seguro de que quieres restablecer tu rol? Serás redirigido a la pantalla de selección.")) {
      setSaving(true);
      try {
        await updateProfile({ role: null, classroomId: null });
        // The App component will detect role == null and show RoleSelection
      } catch (err) {
        console.error("Error resetting role:", err);
        alert("Error al restablecer el protocolo de rol.");
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-white tracking-tighter glow-text-indigo">Perfil Operativo</h1>
        <p className="text-slate-400 mt-2">Gestiona tu identidad y credenciales de sincronización.</p>
      </header>
      
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold"
          >
            <CheckCircle2 size={20} />
            <span>Perfil sincronizado exitosamente</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Action */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-panel p-8 rounded-[40px] border border-white/5 flex flex-col items-center text-center">
            <div className="relative group mb-6">
              {photoURL ? (
                <img 
                  src={photoURL} 
                  alt="" 
                  referrerPolicy="no-referrer"
                  className="w-40 h-40 rounded-[40px] border-4 border-cyber-indigo/30 p-1 object-cover shadow-2xl" 
                />
              ) : (
                <div className="w-40 h-40 rounded-[40px] bg-slate-800 flex items-center justify-center text-slate-500 border-4 border-white/5">
                  <User size={80} />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-black text-white mb-1">{displayName || 'Operativo Anónimo'}</h2>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5 mb-6">
              <Shield size={10} className="text-cyber-indigo" />
              <span>Rango: {userData?.role === 'teacher' ? 'Docente' : userData?.role === 'student' ? 'Estudiante' : 'Invitado'}</span>
            </div>

            <div className="w-full pt-6 border-t border-white/5 space-y-3">
              <button 
                onClick={resetRole}
                className="w-full text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-cyber-pink transition-colors"
              >
                Restablecer Selección de Rol
              </button>
            </div>
          </div>

          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center justify-center space-x-3 p-6 bg-cyber-pink/10 text-cyber-pink rounded-3xl border border-cyber-pink/20 hover:bg-cyber-pink hover:text-white transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-cyber-pink/5"
          >
            <LogOut size={18} />
            <span>Terminar Sesión</span>
          </button>
        </div>

        {/* Right Column: Information Forms */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-10 rounded-[40px] border border-white/5">
            <h3 className="text-xl font-black text-white mb-10 flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-cyber-indigo/10 flex items-center justify-center text-cyber-indigo">
                <Shield size={20} />
              </div>
              <span>Configuración de Identidad</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Image URL */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Foto de Perfil (URL)</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyber-indigo transition-all font-bold placeholder:text-slate-700"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-cyber-indigo transition-colors">
                    <Camera size={18} />
                  </div>
                </div>
                <p className="mt-2 ml-2 text-[10px] text-slate-600 italic">
                  Nota: Asegúrate de que el enlace sea directo a la imagen.
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Nombre de Usuario (Apodo)</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyber-indigo transition-all font-bold placeholder:text-slate-700"
                    placeholder="Cipher"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-cyber-indigo transition-colors">
                    <User size={18} />
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Nombre Completo</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyber-indigo transition-all font-bold placeholder:text-slate-700"
                    placeholder="Nombre Completo"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-cyber-indigo transition-colors">
                    <User size={18} />
                  </div>
                </div>
              </div>

              {/* Email (Read-Only) */}
              <div className="md:col-span-2 opacity-60">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Protocolo de Comunicación (Solo Lectura)</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={userData?.email || ''} 
                    disabled
                    className="w-full bg-slate-900/20 border border-white/5 rounded-2xl px-6 py-4 text-slate-500 outline-none cursor-not-allowed font-mono text-sm"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800">
                    <Mail size={18} />
                  </div>
                </div>
              </div>

              {/* Phone and Grade */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Frecuencia Telefónica</label>
                <input 
                  type="text" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyber-indigo transition-all font-bold placeholder:text-slate-700"
                  placeholder="+503 1234-5678"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Grado</label>
                  <input 
                    type="text" 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyber-indigo transition-all font-bold text-center"
                    placeholder="9no"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Sección</label>
                  <input 
                    type="text" 
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyber-indigo transition-all font-bold text-center"
                    placeholder="A"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Ubicación de Operaciones Base (Dirección)</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-3xl px-6 py-4 text-white outline-none focus:border-cyber-indigo transition-all font-bold h-32 resize-none placeholder:text-slate-700"
                  placeholder="Introduce la dirección física completa..."
                />
              </div>
            </div>

            <div className="pt-10">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-white text-obsidian py-6 rounded-3xl font-black shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-4 uppercase tracking-widest text-sm"
              >
                {saving ? (
                  <div className="w-6 h-6 border-3 border-obsidian border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Sincronizar Configuración</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="glass-panel p-10 rounded-[40px] border border-white/5 bg-cyber-indigo/5">
            <h3 className="text-lg font-bold text-white mb-4">Protocolo de Seguridad</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tu identidad está protegida por la encriptación ElenaMethod. Todos los datos de tu perfil están asegurados. Para actualizar tu rango (Rol), utiliza el enlace de restablecimiento al inicio de esta sección.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
