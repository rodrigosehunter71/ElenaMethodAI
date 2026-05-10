import React from 'react';
import { Shield, ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
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
              <FileText size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Acuerdo Legal</span>
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">Términos y Condiciones</h1>
          <p className="text-slate-400">Última actualización: 9 de Mayo, 2026</p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar la aplicación ElenaMethod AI, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Uso del Servicio</h2>
            <p>
              ElenaMethod AI es una plataforma educativa diseñada para el aprendizaje del idioma inglés. El usuario se compromete a:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Proporcionar información veraz durante el registro.</li>
              <li>No utilizar la plataforma para fines ilícitos o no autorizados.</li>
              <li>Respetar la propiedad intelectual del contenido pedagógico y la metodología "Elena Method".</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Cuentas de Usuario</h2>
            <p>
              Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. ElenaMethod AI no se hace responsable de cualquier pérdida o daño que resulte de su incumplimiento de esta obligación de seguridad.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Propiedad Intelectual</h2>
            <p>
              Todo el contenido, incluyendo textos, gráficos, logos, y la metodología educativa impartida por la IA (Elena), es propiedad exclusiva de ElenaMethod y está protegido por las leyes internacionales de derechos de autor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Modificaciones del Servicio</h2>
            <p>
              Nos reservamos el derecho de modificar o discontinuar el servicio con o sin previo aviso en cualquier momento.
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

export default TermsAndConditions;
