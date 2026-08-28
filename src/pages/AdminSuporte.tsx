import { useMemo, useState } from 'react';
import { Search, Inbox, AlertTriangle, Loader2, Clock3, CheckCircle2, Send } from 'lucide-react';
import Badge, { ticketPriorityMap, ticketStatusMap } from '../components/admin/Badge';
import StatCard from '../components/admin/StatCard';
import SlideOver from '../components/admin/SlideOver';
import { getTickets, getClinic, type TicketPriority, type TicketStatus } from '../data/adminMock';

export default function AdminSuporte() {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'todas'>('todas');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'todos'>('todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  const tickets = getTickets();
  const open = tickets.filter(t => t.status === 'aberto').length;
  const urgent = tickets.filter(t => t.priority === 'urgente').length;
  const inProgress = tickets.filter(t => t.status === 'em_atendimento').length;
  const waiting = tickets.filter(t => t.status === 'aguardando_cliente').length;
  const resolved = tickets.filter(t => t.status === 'resolvido').length;

  const filtered = useMemo(() => tickets.filter(t => {
    const clinic = getClinic(t.clinicId);
    return (priorityFilter === 'todas' || t.priority === priorityFilter) &&
      (statusFilter === 'todos' || t.status === statusFilter) &&
      (t.subject.toLowerCase().includes(search.toLowerCase()) || (clinic?.name.toLowerCase().includes(search.toLowerCase()) ?? false));
  }), [tickets, search, priorityFilter, statusFilter]);

  const selected = tickets.find(t => t.id === selectedId);
  const selectedClinic = selected ? getClinic(selected.clinicId) : undefined;

  function sendReply() {
    if (!selected || !reply.trim()) return;
    selected.messages.push({ author: 'Você (Gestor)', text: reply.trim(), date: 'agora' });
    setReply('');
  }

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--background)' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Central de Suporte</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Tickets abertos pelas clínicas clientes</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Abertos" value={open} Icon={Inbox} color="#DC2626" />
        <StatCard label="Urgentes" value={urgent} Icon={AlertTriangle} color="#DC2626" />
        <StatCard label="Em atendimento" value={inProgress} Icon={Loader2} color="#D97706" />
        <StatCard label="Aguardando cliente" value={waiting} Icon={Clock3} color="#0891B2" />
        <StatCard label="Resolvidos" value={resolved} Icon={CheckCircle2} color="#16A34A" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar assunto ou clínica…"
            className="text-sm bg-transparent outline-none w-56" style={{ color: 'var(--foreground)' }} />
        </div>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none font-medium" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}>
          <option value="todas">Todas as prioridades</option>
          {(['baixa', 'normal', 'alta', 'urgente'] as const).map(p => <option key={p} value={p}>{ticketPriorityMap[p].label}</option>)}
        </select>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(['todos', 'aberto', 'em_atendimento', 'aguardando_cliente', 'resolvido'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1.5 text-xs font-medium"
              style={statusFilter === s ? { background: '#4F46E5', color: 'white' } : { background: 'var(--card)', color: 'var(--muted-foreground)' }}>
              {s === 'todos' ? 'Todos' : ticketStatusMap[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--secondary)' }}>
            <tr>
              {['Número', 'Clínica', 'Assunto', 'Categoria', 'Prioridade', 'Status', 'Responsável', 'Data'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filtered.map(t => {
              const clinic = getClinic(t.clinicId);
              const pCfg = ticketPriorityMap[t.priority];
              const sCfg = ticketStatusMap[t.status];
              return (
                <tr key={t.id} onClick={() => setSelectedId(t.id)} className="hover:bg-secondary/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: '#4F46E5' }}>{t.number}</td>
                  <td className="px-4 py-3 text-xs">{clinic?.name ?? '—'}</td>
                  <td className="px-4 py-3 font-medium">{t.subject}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.category}</td>
                  <td className="px-4 py-3"><Badge label={pCfg.label} color={pCfg.color} bg={pCfg.bg} /></td>
                  <td className="px-4 py-3"><Badge label={sCfg.label} color={sCfg.color} bg={sCfg.bg} /></td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.assignee}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.date}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-10 text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhum ticket encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <SlideOver title={`${selected.number} · ${selected.subject}`} subtitle={selectedClinic?.name} onClose={() => setSelectedId(null)}>
          <div className="flex items-center gap-2 mb-5">
            <Badge label={ticketPriorityMap[selected.priority].label} color={ticketPriorityMap[selected.priority].color} bg={ticketPriorityMap[selected.priority].bg} />
            <Badge label={ticketStatusMap[selected.status].label} color={ticketStatusMap[selected.status].color} bg={ticketStatusMap[selected.status].bg} />
            <span className="text-xs ml-auto" style={{ color: 'var(--muted-foreground)' }}>{selected.category}</span>
          </div>

          <div className="space-y-3 mb-5">
            {selected.messages.map((m, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">{m.author}</span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.date}</span>
                </div>
                <div className="text-sm">{m.text}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Responder ao ticket…"
              onKeyDown={e => e.key === 'Enter' && sendReply()}
              className="flex-1 text-sm px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
            <button onClick={sendReply} className="p-2.5 rounded-lg text-white" style={{ background: '#4F46E5' }}>
              <Send size={15} />
            </button>
          </div>
        </SlideOver>
      )}
    </div>
  );
}
