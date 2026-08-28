import { useMemo, useState } from 'react';
import {
  Search, Building2, DollarSign, Users, AlertTriangle, TrendingDown,
  ChevronRight, ChevronUp, ChevronDown, ChevronLeft, Wallet, BadgeDollarSign, Sparkles,
} from 'lucide-react';
import Badge, { clinicStatusMap, usageColor } from '../components/admin/Badge';
import StatCard from '../components/admin/StatCard';
import { getClinics, getPlans, computeKpis, overallUsagePct, getPlan, type ClinicStatus, type SaasPlanId } from '../data/adminMock';

type SortKey = 'name' | 'mrr' | 'usage' | 'lastActive';

interface AdminDashboardProps {
  onSelectClinic: (id: string) => void;
}

const PAGE_SIZE = 6;

export default function AdminDashboard({ onSelectClinic }: AdminDashboardProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClinicStatus | 'todas'>('todas');
  const [planFilter, setPlanFilter] = useState<SaasPlanId | 'todos'>('todos');
  const [sortKey, setSortKey] = useState<SortKey>('mrr');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const clinics = getClinics();
  const plans = getPlans();
  const kpis = computeKpis();

  const filtered = useMemo(() => {
    let list = clinics.filter(c =>
      (statusFilter === 'todas' || c.status === statusFilter) &&
      (planFilter === 'todos' || c.planId === planFilter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.owner.toLowerCase().includes(search.toLowerCase()))
    );
    list = [...list].sort((a, b) => {
      let av: string | number, bv: string | number;
      switch (sortKey) {
        case 'name': av = a.name; bv = b.name; break;
        case 'mrr': av = a.mrr; bv = b.mrr; break;
        case 'usage': av = overallUsagePct(a); bv = overallUsagePct(b); break;
        case 'lastActive': av = a.lastActive; bv = b.lastActive; break;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [clinics, search, statusFilter, planFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClinics = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  }

  function SortHeader({ label, k }: { label: string; k: SortKey }) {
    const active = sortKey === k;
    return (
      <button onClick={() => toggleSort(k)} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
        style={{ color: active ? '#4F46E5' : 'var(--muted-foreground)' }}>
        {label}
        {active && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </button>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--background)' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Visão geral do sistema</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Todas as clínicas clientes, pagamentos e uso da plataforma</p>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="MRR ativo" value={`R$ ${kpis.mrr.toLocaleString('pt-BR')}`} Icon={DollarSign} color="#4F46E5" sub={`${kpis.activeCount} clínicas pagantes`} trend="up" />
        <StatCard label="ARR projetado" value={`R$ ${kpis.arr.toLocaleString('pt-BR')}`} Icon={Wallet} color="#7C3AED" sub="12x o MRR atual" />
        <StatCard label="Ticket médio" value={`R$ ${kpis.avgTicket}`} Icon={BadgeDollarSign} color="#0891B2" sub="por clínica ativa" />
        <StatCard label="Novas clínicas" value={kpis.newThisPeriod} Icon={Sparkles} color="#16A34A" sub="em 2026" trend="up" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Clínicas ativas" value={kpis.activeCount} Icon={Building2} color="#16A34A" sub={`${kpis.totalClinics} no total`} />
        <StatCard label="Em trial" value={kpis.trial} Icon={Users} color="#0891B2" sub="período de 14 dias" />
        <StatCard label="Inadimplentes" value={kpis.overdue} Icon={AlertTriangle} color="#DC2626" sub="requer atenção" trend="down" />
        <StatCard label="Taxa de churn" value={`${kpis.churnRate}%`} Icon={TrendingDown} color="#64748B" sub="últimos 90 dias" trend="down" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar clínica ou responsável…" className="text-sm bg-transparent outline-none w-56"
            style={{ color: 'var(--foreground)' }} />
        </div>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(['todas', 'ativa', 'trial', 'inadimplente', 'suspensa', 'cancelada'] as const).map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className="px-3 py-1.5 text-xs font-medium capitalize"
              style={statusFilter === s ? { background: '#4F46E5', color: 'white' } : { background: 'var(--card)', color: 'var(--muted-foreground)' }}>
              {s === 'todas' ? 'Todas' : clinicStatusMap[s].label}
            </button>
          ))}
        </div>
        <select value={planFilter} onChange={e => { setPlanFilter(e.target.value as any); setPage(1); }}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none font-medium"
          style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}>
          <option value="todos">Todos os planos</option>
          {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--secondary)' }}>
            <tr>
              <th className="text-left px-4 py-3"><SortHeader label="Clínica" k="name" /></th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Plano</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Status</th>
              <th className="text-left px-4 py-3"><SortHeader label="MRR" k="mrr" /></th>
              <th className="text-left px-4 py-3"><SortHeader label="Uso do plano" k="usage" /></th>
              <th className="text-left px-4 py-3"><SortHeader label="Última atividade" k="lastActive" /></th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {pageClinics.map(c => {
              const sCfg = clinicStatusMap[c.status];
              const usage = overallUsagePct(c);
              const plan = getPlan(c.planId);
              return (
                <tr key={c.id} onClick={() => onSelectClinic(c.id)}
                  className="hover:bg-secondary/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.owner} · {c.city}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">{plan.name}</td>
                  <td className="px-4 py-3"><Badge label={sCfg.label} color={sCfg.color} bg={sCfg.bg} dot /></td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: c.mrr > 0 ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                    {c.mrr > 0 ? `R$ ${c.mrr}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 w-32">
                      <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                        <div className="h-full rounded-full" style={{ width: `${usage}%`, background: usageColor(usage) }} />
                      </div>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{usage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.lastActive}</td>
                  <td className="px-4 py-3"><ChevronRight size={15} style={{ color: 'var(--muted-foreground)' }} /></td>
                </tr>
              );
            })}
            {pageClinics.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhuma clínica encontrada</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {filtered.length === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`} de {filtered.length} clínicas
          </span>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-lg border disabled:opacity-30 transition-colors" style={{ borderColor: 'var(--border)' }}>
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs px-2" style={{ color: 'var(--muted-foreground)' }}>{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg border disabled:opacity-30 transition-colors" style={{ borderColor: 'var(--border)' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
