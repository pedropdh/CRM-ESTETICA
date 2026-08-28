import { useMemo, useState } from 'react';
import { Search, ShieldCheck, Check, X, LogIn, UserCog, Layers, MessageSquare, CreditCard, Settings2 } from 'lucide-react';
import { getLogs, getClinic, getClinics, type LogType } from '../data/adminMock';

const typeConfig: Record<LogType, { label: string; Icon: any; color: string }> = {
  acesso: { label: 'Acesso', Icon: LogIn, color: '#0891B2' },
  usuario: { label: 'Usuário', Icon: UserCog, color: '#4F46E5' },
  plano: { label: 'Plano', Icon: Layers, color: '#7C3AED' },
  whatsapp: { label: 'WhatsApp', Icon: MessageSquare, color: '#16A34A' },
  pagamento: { label: 'Pagamento', Icon: CreditCard, color: '#D97706' },
  administrativo: { label: 'Administrativo', Icon: Settings2, color: '#DC2626' },
};

export default function AdminLogs() {
  const [search, setSearch] = useState('');
  const [clinicFilter, setClinicFilter] = useState('todas');
  const [typeFilter, setTypeFilter] = useState<LogType | 'todos'>('todos');
  const [period, setPeriod] = useState<'7' | '30' | '90' | 'todos'>('todos');

  const logs = getLogs();
  const clinics = getClinics();

  const filtered = useMemo(() => logs.filter(l =>
    (clinicFilter === 'todas' || l.clinicId === clinicFilter) &&
    (typeFilter === 'todos' || l.type === typeFilter) &&
    (l.actor.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()))
  ), [logs, search, clinicFilter, typeFilter]);
  // `period` is illustrative here — the mock dataset only spans a handful of
  // days, kept for the filter's presence/UX rather than real date math.
  void period;

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--background)' }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#4F46E518' }}>
          <ShieldCheck size={18} style={{ color: '#4F46E5' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Logs & Auditoria</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Registro de todas as ações administrativas realizadas na plataforma</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuário ou ação…"
            className="text-sm bg-transparent outline-none w-56" style={{ color: 'var(--foreground)' }} />
        </div>
        <select value={clinicFilter} onChange={e => setClinicFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none font-medium" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}>
          <option value="todas">Todas as clínicas</option>
          {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none font-medium" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}>
          <option value="todos">Todos os tipos</option>
          {(Object.keys(typeConfig) as LogType[]).map(t => <option key={t} value={t}>{typeConfig[t].label}</option>)}
        </select>
        <select value={period} onChange={e => setPeriod(e.target.value as any)}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none font-medium" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}>
          <option value="todos">Qualquer período</option>
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {filtered.map((l, i) => {
          const cfg = typeConfig[l.type];
          const clinic = l.clinicId ? getClinic(l.clinicId) : undefined;
          return (
            <div key={l.id} className="flex items-start gap-3 px-4 py-3" style={{ background: 'var(--card)', borderTop: i > 0 ? '1px solid var(--border)' : undefined }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cfg.color}18` }}>
                <cfg.Icon size={14} style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">{l.action}</div>
                <div className="flex items-center gap-2 mt-0.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <span className="font-medium">{l.actor}</span>
                  <span>·</span>
                  <span>{l.date}</span>
                  {clinic && <><span>·</span><span>{clinic.name}</span></>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {l.result === 'sucesso' ? (
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#16A34A' }}><Check size={12} /> Sucesso</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#DC2626' }}><X size={12} /> Falha</span>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm" style={{ color: 'var(--muted-foreground)', background: 'var(--card)' }}>Nenhum registro encontrado</div>
        )}
      </div>
    </div>
  );
}
