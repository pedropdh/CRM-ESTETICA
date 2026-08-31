import { Lock, ArrowRight, Zap } from 'lucide-react';
import type { Plan } from '../types';
import { crescimentoOnly, getPlan } from '../data/mock';

interface PlanGateProps {
  feature: string;
  description: string;
  /** Só existe um plano com bloqueio: Crescimento. */
  requiredPlan: 'crescimento';
  currentPlan: Plan;
  onUpgrade: () => void;
  children: React.ReactNode;
}

export default function PlanGate({ feature, description, requiredPlan, currentPlan, onUpgrade, children }: PlanGateProps) {
  if (currentPlan === requiredPlan) return <>{children}</>;

  const target = getPlan(requiredPlan);
  const current = getPlan(currentPlan);

  return (
    <div className="flex-1 overflow-auto flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#E0F2F1' }}>
          <Lock size={30} style={{ color: 'var(--primary)' }} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
          style={{ background: '#E0F2F1', color: 'var(--primary)' }}>
          <Zap size={11} /> Plano {target.name}
        </div>

        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{feature}</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748B' }}>{description}</p>

        <div className="p-4 rounded-xl mb-6 text-left" style={{ background: '#E0F2F1', border: '1px solid rgba(10,110,110,0.2)' }}>
          <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--primary)' }}>
            O que entra no {target.name}:
          </p>
          <ul className="space-y-2">
            {crescimentoOnly.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--primary)' }}>
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ color: '#334155' }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={onUpgrade}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--primary)' }}>
          Mudar para o {target.name} — R$ {target.price}/mês <ArrowRight size={16} />
        </button>
        <p className="text-xs mt-3" style={{ color: '#94A3B8' }}>
          Você está no <strong>{current.name}</strong> · R$ {current.price}/mês
        </p>
      </div>
    </div>
  );
}
