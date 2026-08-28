import { Lock, ArrowRight, Zap } from 'lucide-react';
import type { Plan } from '../types';
import { getPlan } from '../data/adminMock';

interface PlanGateProps {
  feature: string;
  description: string;
  requiredPlan: 'pro' | 'redes';
  currentPlan: Plan;
  onUpgrade: () => void;
  children: React.ReactNode;
}

const planNames = { start: 'Start', pro: 'Pro', business: 'Business', redes: 'Redes' };
const planColors = { pro: '#0A6E6E', redes: '#7C3AED' };
const planBgs = { pro: '#E0F2F1', redes: '#EDE9FE' };

const requiredFeatures: Record<string, string[]> = {
  pro: ['Funil de leads completo', 'WhatsApp automático', 'Financeiro + comissões', 'Relatórios avançados', 'Até 5 profissionais'],
  redes: ['Múltiplas unidades', 'Profissionais ilimitados', 'Dashboard consolidado', 'API própria'],
};

export default function PlanGate({ feature, description, requiredPlan, currentPlan, onUpgrade, children }: PlanGateProps) {
  const planOrder = { start: 0, pro: 1, business: 2, redes: 3 };
  const isLocked = planOrder[currentPlan] < planOrder[requiredPlan];

  if (!isLocked) return <>{children}</>;

  const color = planColors[requiredPlan];
  const bg = planBgs[requiredPlan];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Lock icon */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: bg }}>
          <Lock size={36} style={{ color }} />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
          style={{ background: bg, color }}>
          <Zap size={11} /> Plano {planNames[requiredPlan]}
        </div>

        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          {feature}
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748B' }}>
          {description}
        </p>

        {/* Feature list */}
        <div className="p-4 rounded-xl mb-6 text-left" style={{ background: bg, border: `1px solid ${color}30` }}>
          <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color }}>
            O que você ganha no plano {planNames[requiredPlan]}:
          </p>
          <ul className="space-y-2">
            {requiredFeatures[requiredPlan].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: color }}>
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ color: '#334155' }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={onUpgrade}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: color }}>
          Fazer upgrade para {planNames[requiredPlan]} <ArrowRight size={16} />
        </button>
        <p className="text-xs mt-3" style={{ color: '#94A3B8' }}>
          Você está no plano <strong>{planNames[currentPlan]}</strong> · R${getPlan(currentPlan).price}/mês
        </p>
      </div>
    </div>
  );
}
