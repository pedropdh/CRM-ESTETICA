import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Lock, Mail, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('pedro@lumina.app');
  const [password, setPassword] = useState('••••••••');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0D0F1A' }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, #4F46E5 0%, transparent 40%), radial-gradient(circle at 85% 85%, #7C3AED 0%, transparent 40%)' }} />

      <div className="relative z-10 w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-8 text-white/50 hover:text-white/80 transition-colors">
          <ArrowLeft size={14} /> Voltar para o login da clínica
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(79,70,229,0.2)' }}>
            <ShieldCheck size={20} style={{ color: '#818CF8' }} />
          </div>
          <div>
            <div className="text-white font-bold text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Painel do Gestor</div>
            <div className="text-white/40 text-xs">Acesso restrito · Lumina SaaS</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white/70">E-mail administrativo</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white/70">Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#4F46E5' }}>
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <>Entrar no painel <ArrowRight size={15} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6 text-white/30">
          Este acesso é exclusivo da equipe Lumina. Clínicas clientes não usam este login.
        </p>
      </div>
    </div>
  );
}
