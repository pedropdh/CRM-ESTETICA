import { useMemo, useState } from 'react';
import { Search, MessageSquare, Wifi, WifiOff, AlertTriangle, Send, PercentCircle, RefreshCcw } from 'lucide-react';
import Badge, { whatsappStatusMap } from '../components/admin/Badge';
import StatCard from '../components/admin/StatCard';
import SlideOver from '../components/admin/SlideOver';
import { getWhatsappConnections, getClinic, type WhatsappStatus } from '../data/adminMock';

export default function AdminWhatsapp() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<WhatsappStatus | 'todas'>('todas');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const connections = getWhatsappConnections();

  const connected = connections.filter(c => c.status === 'conectado').length;
  const withError = connections.filter(c => c.status === 'erro').length;
  const totalSentMonth = connections.reduce((s, c) => s + c.sent, 0);
  const totalReceived = connections.reduce((s, c) => s + c.received, 0);
  const totalErrors = connections.reduce((s, c) => s + c.errors, 0);
  const errorRate = totalSentMonth > 0 ? ((totalErrors / totalSentMonth) * 100).toFixed(1) : '0.0';
  const sentToday = Math.round(totalSentMonth / 28); // rough daily average for the mock

  const filtered = useMemo(() => connections.filter(c => {
    const clinic = getClinic(c.clinicId);
    return (statusFilter === 'todas' || c.status === statusFilter) &&
      (clinic?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
  }), [connections, search, statusFilter]);

  const selected = connections.find(c => c.id === selectedId);
  const selectedClinic = selected ? getClinic(selected.clinicId) : undefined;

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--background)' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>WhatsApp</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Integrações de WhatsApp de todas as clínicas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Clínicas conectadas" value={connected} Icon={Wifi} color="#16A34A" sub={`de ${connections.length} clínicas`} />
        <StatCard label="Conexões com erro" value={withError} Icon={WifiOff} color="#DC2626" />
        <StatCard label="Mensagens hoje" value={sentToday.toLocaleString('pt-BR')} Icon={Send} color="#4F46E5" sub="média diária estimada" />
        <StatCard label="Taxa de erro" value={`${errorRate}%`} Icon={AlertTriangle} color="#D97706" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Mensagens enviadas (mês)" value={totalSentMonth.toLocaleString('pt-BR')} Icon={MessageSquare} color="#0891B2" />
        <StatCard label="Mensagens recebidas (mês)" value={totalReceived.toLocaleString('pt-BR')} Icon={PercentCircle} color="#7C3AED" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar clínica…"
            className="text-sm bg-transparent outline-none w-56" style={{ color: 'var(--foreground)' }} />
        </div>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(['todas', 'conectado', 'aguardando', 'erro', 'desconectado'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1.5 text-xs font-medium capitalize"
              style={statusFilter === s ? { background: '#4F46E5', color: 'white' } : { background: 'var(--card)', color: 'var(--muted-foreground)' }}>
              {s === 'todas' ? 'Todas' : whatsappStatusMap[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--secondary)' }}>
            <tr>
              {['Clínica', 'Número', 'Status', 'Mensagens no mês', 'Última atividade', 'Último erro'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filtered.map(c => {
              const clinic = getClinic(c.clinicId);
              const cfg = whatsappStatusMap[c.status];
              return (
                <tr key={c.id} onClick={() => setSelectedId(c.id)} className="hover:bg-secondary/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-medium">{clinic?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.number}</td>
                  <td className="px-4 py-3"><Badge label={cfg.label} color={cfg.color} bg={cfg.bg} /></td>
                  <td className="px-4 py-3 text-xs">{(c.sent + c.received).toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.lastActivity}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: c.lastError ? '#DC2626' : 'var(--muted-foreground)' }}>{c.lastError ?? '—'}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhuma conexão encontrada</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && selectedClinic && (
        <SlideOver title={selectedClinic.name} subtitle="Detalhes da conexão WhatsApp" onClose={() => setSelectedId(null)}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold">{selected.number}</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Número conectado</div>
            </div>
            <Badge label={whatsappStatusMap[selected.status].label} color={whatsappStatusMap[selected.status].color} bg={whatsappStatusMap[selected.status].bg} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <Stat label="Enviadas" value={selected.sent.toLocaleString('pt-BR')} />
            <Stat label="Recebidas" value={selected.received.toLocaleString('pt-BR')} />
            <Stat label="Com erro" value={String(selected.errors)} danger={selected.errors > 0} />
            <Stat label="Último webhook" value={selected.lastWebhook} />
          </div>

          {selected.lastError && (
            <div className="p-3 rounded-lg text-xs mb-5" style={{ background: '#FEF2F2', color: '#DC2626' }}>
              <strong>Último erro:</strong> {selected.lastError}
            </div>
          )}

          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: '#4F46E5' }}>
            <RefreshCcw size={14} /> Solicitar reconexão
          </button>
        </SlideOver>
      )}
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: 'var(--secondary)' }}>
      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
      <div className="text-sm font-semibold mt-0.5" style={{ color: danger ? '#DC2626' : 'var(--foreground)' }}>{value}</div>
    </div>
  );
}
