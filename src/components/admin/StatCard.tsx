import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  Icon: any;
  color: string;
  sub?: string;
  trend?: 'up' | 'down';
}

export default function StatCard({ label, value, Icon, color, sub, trend }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={15} style={{ color }} />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: trend === 'up' ? '#16A34A' : '#DC2626' }}>
            {trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          </span>
        )}
      </div>
      <div className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>{sub}</div>}
    </div>
  );
}
