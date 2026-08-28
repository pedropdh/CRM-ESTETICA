import { useState } from 'react';
import {
  Plus, Search, Megaphone, Users, Send, Eye, MousePointerClick,
  Calendar, Clock, ChevronLeft, MessageSquare, Globe, Mail,
  Gift, Sparkles, Check,
} from 'lucide-react';
import type { Page, Plan } from '../types';
import PlanGate from '../components/PlanGate';

type CampaignStatus = 'rascunho' | 'agendada' | 'enviando' | 'concluida';
type Channel = 'whatsapp' | 'instagram' | 'email';

interface Campaign {
  id: string;
  name: string;
  segment: string;
  channel: Channel;
  status: CampaignStatus;
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
  date: string;
}

const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  rascunho: { label: 'Rascunho', color: '#64748B', bg: '#F1F5F9' },
  agendada: { label: 'Agendada', color: '#D97706', bg: '#FFF7ED' },
  enviando: { label: 'Enviando', color: '#0891B2', bg: '#E0F7FA' },
  concluida: { label: 'Concluída', color: '#16A34A', bg: '#F0FDF4' },
};

const channelConfig: Record<Channel, { label: string; Icon: any; color: string }> = {
  whatsapp: { label: 'WhatsApp', Icon: MessageSquare, color: '#25D366' },
  instagram: { label: 'Instagram', Icon: Globe, color: '#E1306C' },
  email: { label: 'E-mail', Icon: Mail, color: '#6366F1' },
};

const segments = [
  'Clientes inativas há 60+ dias',
  'Aniversariantes do mês',
  'Leads não convertidos',
  'Pacote prestes a vencer',
  'Todas as clientes ativas',
  'Primeira visita há 7 dias',
];

const initialCampaigns: Campaign[] = [
  { id: '1', name: 'Volta às aulas - Reative sua pele', segment: 'Clientes inativas há 60+ dias', channel: 'whatsapp', status: 'concluida', audience: 142, sent: 142, opened: 98, clicked: 34, date: '18/08' },
  { id: '2', name: 'Feliz aniversário 🎂 15% OFF', segment: 'Aniversariantes do mês', channel: 'whatsapp', status: 'concluida', audience: 23, sent: 23, opened: 21, clicked: 12, date: '15/08' },
  { id: '3', name: 'Última chance: pacote vencendo', segment: 'Pacote prestes a vencer', channel: 'whatsapp', status: 'enviando', audience: 37, sent: 22, opened: 14, clicked: 5, date: '22/08' },
  { id: '4', name: 'Setembro Dourado - Botox promo', segment: 'Todas as clientes ativas', channel: 'instagram', status: 'agendada', audience: 310, sent: 0, opened: 0, clicked: 0, date: '01/09' },
  { id: '5', name: 'Ainda pensando? Fale conosco', segment: 'Leads não convertidos', channel: 'whatsapp', status: 'rascunho', audience: 58, sent: 0, opened: 0, clicked: 0, date: '—' },
];

interface CampanhasProps {
  onNavigate?: (p: Page) => void;
  plan?: Plan;
  onUpgrade?: () => void;
}

function CampaignRow({ c }: { c: Campaign }) {
  const sCfg = statusConfig[c.status];
  const chCfg = channelConfig[c.channel];
  const openRate = c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : null;

  return (
    <tr className="hover:bg-secondary/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${chCfg.color}20` }}>
            <chCfg.Icon size={14} style={{ color: chCfg.color }} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{c.name}</div>
            <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{c.segment}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: sCfg.bg, color: sCfg.color }}>
          {sCfg.label}
        </span>
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <div className="flex items-center gap-1"><Users size={11} /> {c.audience}</div>
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        {c.sent > 0 ? c.sent : '—'}
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        {openRate !== null ? `${openRate}%` : '—'}
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.date}</td>
    </tr>
  );
}

export default function Campanhas({ onNavigate, plan = 'pro', onUpgrade }: CampanhasProps) {
  if (plan === 'start') {
    return (
      <PlanGate
        feature="Campanhas de Marketing"
        description="Crie campanhas segmentadas de WhatsApp, Instagram e e-mail para reativar clientes inativas, avisar sobre pacotes vencendo e converter mais leads."
        requiredPlan="pro"
        currentPlan={plan}
        onUpgrade={onUpgrade ?? (() => {})}
      >
        <></>
      </PlanGate>
    );
  }

  const [campaigns] = useState<Campaign[]>(initialCampaigns);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'new'>('list');

  const filtered = campaigns.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
  const totalAudience = campaigns.reduce((s, c) => s + c.audience, 0);
  const avgOpenRate = (() => {
    const withSends = campaigns.filter(c => c.sent > 0);
    if (!withSends.length) return 0;
    return Math.round(withSends.reduce((s, c) => s + (c.opened / c.sent) * 100, 0) / withSends.length);
  })();

  if (view === 'new') {
    return <NovaCampanha onBack={() => setView('list')} />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-3 flex flex-wrap items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar campanha…" className="text-sm bg-transparent outline-none w-48"
            style={{ color: 'var(--foreground)' }} />
        </div>

        <button onClick={() => setView('new')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white ml-auto"
          style={{ background: 'var(--primary)' }}>
          <Plus size={14} /> Nova Campanha
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Público alcançado', value: totalAudience, Icon: Users, color: '#0A6E6E' },
            { label: 'Mensagens enviadas', value: totalSent, Icon: Send, color: '#0891B2' },
            { label: 'Taxa média de abertura', value: `${avgOpenRate}%`, Icon: Eye, color: '#7C3AED' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="p-4 rounded-xl flex items-center gap-3"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{value}</div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Campaign table */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--secondary)' }}>
              <tr>
                {['Campanha', 'Status', 'Público', 'Enviados', 'Abertura', 'Data'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.map(c => <CampaignRow key={c.id} c={c} />)}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Nenhuma campanha encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Referral program teaser */}
        <div className="p-5 rounded-xl flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #FDF4FF 0%, #F0FDFA 100%)', border: '1px solid var(--border)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#7C3AED18' }}>
            <Gift size={20} style={{ color: '#7C3AED' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">Programa de Indicação</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Suas clientes indicam amigas e ganham desconto em troca. Em breve.
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold shrink-0" style={{ background: '#7C3AED18', color: '#7C3AED' }}>
            Em breve
          </span>
        </div>
      </div>
    </div>
  );
}

function NovaCampanha({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [segment, setSegment] = useState(segments[0]);
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [message, setMessage] = useState('Oi {{nome}}! 💛 Notamos que faz um tempinho desde sua última visita. Que tal agendar um horário e aproveitar 10% OFF essa semana?');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');

  const audienceEstimate: Record<string, number> = {
    'Clientes inativas há 60+ dias': 142,
    'Aniversariantes do mês': 23,
    'Leads não convertidos': 58,
    'Pacote prestes a vencer': 37,
    'Todas as clientes ativas': 310,
    'Primeira visita há 7 dias': 19,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 flex items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <ChevronLeft size={18} style={{ color: 'var(--muted-foreground)' }} />
        </button>
        <span className="text-sm font-semibold">Nova Campanha</span>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
              Nome da campanha
            </label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Ex: Reative sua pele - Setembro"
              className="mt-1.5 w-full text-sm px-3 py-2.5 rounded-lg border outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
          </div>

          {/* Segment */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
              Segmento de público
            </label>
            <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {segments.map(s => (
                <button key={s} onClick={() => setSegment(s)}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-left text-sm transition-colors"
                  style={segment === s
                    ? { borderColor: 'var(--primary)', background: 'var(--secondary)' }
                    : { borderColor: 'var(--border)', background: 'var(--card)' }}>
                  <span className="truncate">{s}</span>
                  {segment === s && <Check size={14} style={{ color: 'var(--primary)' }} className="shrink-0" />}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <Users size={12} /> ~{audienceEstimate[segment]} pessoas nesse segmento
            </div>
          </div>

          {/* Channel */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
              Canal de envio
            </label>
            <div className="mt-1.5 flex gap-2">
              {(Object.keys(channelConfig) as Channel[]).map(ch => {
                const cfg = channelConfig[ch];
                const active = channel === ch;
                return (
                  <button key={ch} onClick={() => setChannel(ch)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors"
                    style={active
                      ? { borderColor: cfg.color, background: `${cfg.color}12`, color: cfg.color }
                      : { borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--muted-foreground)' }}>
                    <cfg.Icon size={14} /> {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
              Mensagem
            </label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
              className="mt-1.5 w-full text-sm px-3 py-2.5 rounded-lg border outline-none resize-none"
              style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
            <div className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <Sparkles size={12} /> Use {'{{nome}}'} para personalizar com o nome de cada cliente
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
              Envio
            </label>
            <div className="mt-1.5 flex gap-2">
              <button onClick={() => setScheduleMode('now')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors"
                style={scheduleMode === 'now'
                  ? { borderColor: 'var(--primary)', background: 'var(--secondary)' }
                  : { borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--muted-foreground)' }}>
                <Send size={14} /> Enviar agora
              </button>
              <button onClick={() => setScheduleMode('later')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors"
                style={scheduleMode === 'later'
                  ? { borderColor: 'var(--primary)', background: 'var(--secondary)' }
                  : { borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--muted-foreground)' }}>
                <Calendar size={14} /> Agendar
              </button>
            </div>
            {scheduleMode === 'later' && (
              <div className="mt-2 flex gap-2">
                <input type="date" className="text-sm px-3 py-2 rounded-lg border outline-none flex-1"
                  style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                  <Clock size={13} style={{ color: 'var(--muted-foreground)' }} />
                  <input type="time" defaultValue="09:00" className="text-sm outline-none bg-transparent"
                    style={{ color: 'var(--foreground)' }} />
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>
              <MousePointerClick size={12} /> Preview
            </div>
            <div className="max-w-xs p-3 rounded-2xl rounded-tl-sm text-sm" style={{ background: '#DCFCE7', color: '#14532D' }}>
              {message.replace('{{nome}}', 'Bianca')}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-4">
            <button onClick={onBack}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
              Cancelar
            </button>
            <button onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'var(--primary)' }}>
              <Megaphone size={15} /> {scheduleMode === 'now' ? 'Enviar campanha' : 'Agendar campanha'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
