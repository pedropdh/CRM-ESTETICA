import type { Plan } from '../types';
import { getPlans } from '../data/mock';

interface PlanSwitcherProps {
  plan: Plan;
  onChange: (p: Plan) => void;
}

/** Atalho de demonstração: troca o plano para ver o que muda na interface. */
export default function PlanSwitcher({ plan, onChange }: PlanSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>Demo:</span>
      <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        {getPlans().map(p => (
          <button key={p.id} onClick={() => onChange(p.id)}
            className="px-2.5 py-1 text-xs font-semibold transition-all"
            style={plan === p.id
              ? { background: 'var(--primary)', color: 'white' }
              : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }}>
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
