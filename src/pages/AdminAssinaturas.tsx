import { useMemo, useState } from 'react';
import { Search, CreditCard, CheckCircle2, Clock3, AlertTriangle, XCircle } from 'lucide-react';
import Badge, { clinicStatusMap } from '../components/admin/Badge';
import StatCard from '../components/admin/StatCard';
import { getSubscriptions, getClinic, getPlan, getPlans, type SubscriptionStatus, type SaasPlanId } from '../data/adminMock';

export default function AdminAssinaturas() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'todas'>('todas');
  const [planFilter, setPlanFilter] = useState<SaasPlanId | 'todos'>('todos');

  const subs = getSubscriptions();

  const activeSubs = subs.filter(s => s.status === 'ativa');
  const mrr = activeSubs.reduce((s, sub) => s + sub.value, 0);
  const trial = subs.filter(s => s.status === 'trial').length;
  const cancelled = subs.filter(s => s.status === 'cancelada').length;
  const overdue = subs.filter(s => s.status === 'inadimplente').length;

  const filtered = useMemo(() => subs.filter(s => {
    const clinic = getClinic(s.clinicId);
    return (statusFilter === 'todas' || s.status === statusFilter) &&
      (planFilter === 'todos' || s.planId === planFilter) &&
      (search === '' || (clinic?.name.toLowerCase().includes(search.toLowerCase()) ?? false));
  }), [subs, search, statusFilter, planFilter]);

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--background)' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Assinaturas</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Visão consolidada de todas as assinaturas da plataforma</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="MRR" value={`R$ ${mrr.toLocaleString('pt-BR')}`} Icon={CreditCard} color="#4F46E5" />
        <StatCard label="Ativas" value={activeSubs.length} Icon={CheckCircle2} color="#16A34A" />
        <StatCard label="Em trial" value={trial} Icon={Clock3} color="#0891B2" />
        <StatCard label="Inadimplentes" value={overdue} Icon={AlertTriangle} color="#DC2626" />
        <StatCard label="Canceladas" value={cancelled} Icon={XCircle} color="#64748B" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar clínica…"
            className="text-sm bg-transparent outline-none w-56" style={{ color: 'var(--foreground)' }} />
        </div>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(['todas', 'ativa', 'trial', 'inadimplente', 'suspensa', 'cancelada'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1.5 text-xs font-medium capitalize"
              style={statusFilter === s ? { background: '#4F46E5', color: 'white' } : { background: 'var(--card)', color: 'var(--muted-foreground)' }}>
              {s === 'todas' ? 'Todas' : clinicStatusMap[s].label}
            </button>
          ))}
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value as any)}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none font-medium" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}>
          <option value="todos">Todos os planos</option>
          {getPlans().map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--secondary)' }}>
            <tr>
              {['Clínica', 'Plano', 'Valor', 'Status', 'Próxima cobrança', 'Forma de pagamento', 'Início'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filtered.map(s => {
              const clinic = getClinic(s.clinicId);
              const plan = getPlan(s.planId);
              const cfg = clinicStatusMap[s.status];
              if (!clinic) return null;
              return (
                <tr key={s.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{clinic.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{clinic.owner}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">{plan.name}</td>
                  <td className="px-4 py-3 text-xs font-semibold">{s.value > 0 ? `R$ ${s.value}` : '—'}</td>
                  <td className="px-4 py-3"><Badge label={cfg.label} color={cfg.color} bg={cfg.bg} dot /></td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.nextBilling}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.paymentMethod}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.startDate}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhuma assinatura encontrada</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
