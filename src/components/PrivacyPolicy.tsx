import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian text-slate-300 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-cyber-indigo hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Regresar</span>
        </button>

        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyber-indigo/10 rounded-lg text-cyber-indigo">
              <Shield size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocolo de Privacidad</span>
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">Política de Privacidad</h1>
          <p className="text-slate-400">Última actualización: 26 de Abril, 2026</p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Recopilación de Datos</h2>
            <p>
              Recopilamos información necesaria para la sincronización pedagógica y el progreso del alumno, incluyendo nombre, correo electrónico y datos de uso de la plataforma. Estos datos son utilizados exclusivamente para mejorar la experiencia de aprendizaje personalizada por nuestra IA, Elena.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Uso de la Información</h2>
            <p>
              La información se utiliza para:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Generar reportes de progreso en tiempo real.</li>
              <li>Personalizar los ejercicios dinámicos mediante IA.</li>
              <li>Permitir el enlace directo entre docente y alumno en las aulas virtuales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Seguridad</h2>
            <p>
              Implementamos protocolos de seguridad de grado industrial y encriptación de datos en tránsito y reposo a través de los servicios de Google Firebase. No compartimos información personal con terceros para fines publicitarios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Derechos del Usuario</h2>
            <p>
              Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento a través del panel de perfil o contactando al soporte técnico.
            </p>
          </section>

          <section className="pt-8 border-t border-white/5">
            <p className="italic text-slate-500">
              ElenaMethod AI - "Syncing Intelligence, Mastering English."
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
