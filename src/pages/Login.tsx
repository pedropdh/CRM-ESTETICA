import { useState } from 'react';
import { Eye, EyeOff, Building2, ArrowRight, Lock, Mail } from 'lucide-react';
import type { Page } from '../types';

interface LoginProps {
  onLogin: () => void;
  onNavigate: (p: Page) => void;
  onAdminAccess?: () => void;
}

export default function Login({ onLogin, onNavigate, onAdminAccess }: LoginProps) {
  const [email, setEmail] = useState('marina@lumina.com.br');
  const [password, setPassword] = useState('••••••••');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A6E6E 0%, #0D1B2A 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #4DD9CC 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0D9488 0%, transparent 40%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Building2 size={20} className="text-white" />
            </div>
            <span className="text-white text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lumina CRM</span>
          </div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Gestão completa para sua clínica estética
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Agenda inteligente, funil de leads, prontuários digitais e financeiro integrado — tudo em um único sistema.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { n: '2.400+', label: 'Agendamentos/mês' },
            { n: '98%', label: 'Satisfação dos clientes' },
            { n: 'R$ 180k', label: 'Faturamento gerenciado' },
            { n: '12', label: 'Profissionais ativos' },
          ].map(({ n, label }) => (
            <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{n}</div>
              <div className="text-xs text-white/50 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lumina CRM</span>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: 'var(--secondary)' }}>
            {(['login', 'register'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === t ? 'bg-white shadow-sm' : ''}`}
                style={tab === t ? { color: 'var(--foreground)' } : { color: 'var(--muted-foreground)' }}>
                {t === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Bem-vinda de volta</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Entre com suas credenciais para acessar o sistema</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>E-mail</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2"
                      style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)', '--tw-ring-color': 'var(--ring)' } as React.CSSProperties}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Senha</label>
                    <button type="button" onClick={() => onNavigate('forgot-password')} className="text-xs" style={{ color: 'var(--accent)' }}>
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none focus:ring-2"
                      style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm" style={{ color: 'var(--secondary-foreground)' }}>Manter conectada</span>
                </label>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--primary)' }}>
                  {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <>Entrar <ArrowRight size={15} /></>}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Criar sua conta</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Comece seu período de 14 dias gratuito agora</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nome</label>
                    <input className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2"
                      style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} placeholder="Marina" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Sobrenome</label>
                    <input className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} placeholder="Silva" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nome da clínica</label>
                  <input className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} placeholder="Clínica Lumina" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">E-mail profissional</label>
                  <input type="email" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} placeholder="voce@clinica.com.br" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Senha</label>
                  <input type="password" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} placeholder="Mínimo 8 caracteres" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--primary)' }}>
                  {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : 'Criar conta gratuita'}
                </button>
                <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
                  Ao criar sua conta, você concorda com os <a href="#" className="underline">Termos de Uso</a> e <a href="#" className="underline">Política de Privacidade</a>.
                </p>
              </form>
            </>
          )}

          {onAdminAccess && (
            <button onClick={onAdminAccess}
              className="w-full text-center text-xs mt-8" style={{ color: 'var(--muted-foreground)' }}>
              Sou da equipe Lumina · Acesso administrativo →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
