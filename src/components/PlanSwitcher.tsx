import type { Plan } from '../types';

interface PlanSwitcherProps {
  plan: Plan;
  onChange: (p: Plan) => void;
}

const plans: { id: Plan; label: string; color: string }[] = [
  { id: 'start', label: 'Start', color: '#64748B' },
  { id: 'pro', label: 'Pro', color: '#0A6E6E' },
  { id: 'business', label: 'Business', color: '#4F46E5' },
  { id: 'redes', label: 'Redes', color: '#7C3AED' },
];

export default function PlanSwitcher({ plan, onChange }: PlanSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>Demo:</span>
      <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        {plans.map(p => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className="px-2.5 py-1 text-xs font-semibold transition-all"
            style={plan === p.id
              ? { background: p.color, color: 'white' }
              : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }
            }
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
