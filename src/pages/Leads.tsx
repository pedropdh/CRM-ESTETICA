import { useState } from 'react';
import { Phone, MessageSquare, Plus, Search, Globe, Users } from 'lucide-react';
import type { Page, Plan } from '../types';
import PlanGate from '../components/PlanGate';

type Stage = 'novo' | 'contato' | 'proposta' | 'agendado' | 'ganho' | 'perdido';

interface Lead {
  id: string;
  name: string;
  phone: string;
  procedure: string;
  source: string;
  value: number;
  stage: Stage;
  date: string;
  avatar: string;
}

const stageConfig: Record<Stage, { label: string; color: string; bg: string }> = {
  novo: { label: 'Novos Leads', color: '#6366F1', bg: '#EEF2FF' },
  contato: { label: 'Em Contato', color: '#D97706', bg: '#FFF7ED' },
  proposta: { label: 'Proposta Enviada', color: '#0891B2', bg: '#E0F7FA' },
  agendado: { label: 'Agendado', color: '#059669', bg: '#ECFDF5' },
  ganho: { label: 'Ganho ✓', color: '#16A34A', bg: '#F0FDF4' },
  perdido: { label: 'Perdido', color: '#9CA3AF', bg: '#F9FAFB' },
};

const sourceIcons: Record<string, any> = {
  Instagram: Globe,
  'Google Ads': Globe,
  Indicação: Users,
  WhatsApp: MessageSquare,
};

const initialLeads: Lead[] = [
  { id: '1', name: 'Bianca Rodrigues', phone: '(11) 99234-5678', procedure: 'Toxina Botulínica', source: 'Instagram', value: 900, stage: 'novo', date: '22/08', avatar: 'BR' },
  { id: '2', name: 'Leticia Marques', phone: '(11) 97654-3210', procedure: 'Preenchimento Labial', source: 'Indicação', value: 1200, stage: 'novo', date: '22/08', avatar: 'LM' },
  { id: '3', name: 'Vanessa Costa', phone: '(11) 98877-6655', procedure: 'Bioestimulador', source: 'Google Ads', value: 1800, stage: 'novo', date: '21/08', avatar: 'VC' },
  { id: '4', name: 'Carla Mendes', phone: '(11) 91234-5670', procedure: 'Limpeza de Pele', source: 'Instagram', value: 280, stage: 'contato', date: '20/08', avatar: 'CM' },
  { id: '5', name: 'Tânia Alves', phone: '(11) 92345-6781', procedure: 'Toxina Botulínica', source: 'WhatsApp', value: 900, stage: 'contato', date: '19/08', avatar: 'TA' },
  { id: '6', name: 'Renata Souza', phone: '(11) 93456-7892', procedure: 'Fio de PDO', source: 'Indicação', value: 2200, stage: 'proposta', date: '18/08', avatar: 'RS' },
  { id: '7', name: 'Gabriela Nunes', phone: '(11) 94567-8903', procedure: 'Preenchimento', source: 'Instagram', value: 1200, stage: 'agendado', date: '17/08', avatar: 'GN' },
  { id: '8', name: 'Mônica Lima', phone: '(11) 95678-9014', procedure: 'Bioestimulador', source: 'Google Ads', value: 1800, stage: 'ganho', date: '16/08', avatar: 'ML' },
  { id: '9', name: 'Sandra Ferreira', phone: '(11) 96789-0125', procedure: 'Toxina Botulínica', source: 'Indicação', value: 900, stage: 'perdido', date: '15/08', avatar: 'SF' },
];

const stageOrder: Stage[] = ['novo', 'contato', 'proposta', 'agendado', 'ganho', 'perdido'];

interface LeadsProps {
  onNavigate: (p: Page) => void;
  plan?: Plan;
  onUpgrade?: () => void;
}

function LeadCard({ lead, onMove }: { lead: Lead; onMove: (id: string, stage: Stage) => void }) {
  const cfg = stageConfig[lead.stage];
  const SrcIcon = sourceIcons[lead.source] || Globe;

  return (
    <div className="p-3 rounded-xl cursor-pointer hover:shadow-md transition-shadow"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start gap-2 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: cfg.color }}>{lead.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{lead.name}</div>
          <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{lead.procedure}</div>
        </div>
        <div className="text-xs font-bold shrink-0" style={{ color: 'var(--primary)' }}>
          R${(lead.value / 1000).toFixed(1)}k
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <SrcIcon size={11} />
        <span>{lead.source}</span>
        <span className="ml-auto">{lead.date}</span>
      </div>
      <div className="flex gap-1.5 mt-2">
        <button className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
          style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
          <Phone size={10} /> Ligar
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
          style={{ background: '#DCFCE7', color: '#16A34A' }}>
          <MessageSquare size={10} /> WA
        </button>
      </div>
      {/* Move stage */}
      <div className="mt-2">
        <select
          value={lead.stage}
          onChange={e => onMove(lead.id, e.target.value as Stage)}
          className="w-full text-xs px-2 py-1 rounded-lg border outline-none"
          style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}40`, fontWeight: 500 }}>
          {stageOrder.map(s => <option key={s} value={s}>{stageConfig[s].label}</option>)}
        </select>
      </div>
    </div>
  );
}

export default function Leads({ onNavigate, plan = 'pro', onUpgrade }: LeadsProps) {
  if (plan === 'start') {
    return (
      <PlanGate
        feature="Funil de Leads"
        description="Visualize e gerencie todos os seus leads em um kanban. Acompanhe cada contato do primeiro interesse até o agendamento e nunca mais perca uma oportunidade de venda."
        requiredPlan="pro"
        currentPlan={plan}
        onUpgrade={onUpgrade ?? (() => {})}
      >
        <></>
      </PlanGate>
    );
  }
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  function moveLeadStage(id: string, newStage: Stage) {
    setLeads(ls => ls.map(l => l.id === id ? { ...l, stage: newStage } : l));
  }

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.procedure.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = leads.filter(l => l.stage === 'ganho').reduce((s, l) => s + l.value, 0);
  const pipelineValue = leads.filter(l => !['ganho', 'perdido'].includes(l.stage)).reduce((s, l) => s + l.value, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-3 flex flex-wrap items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar lead…" className="text-sm bg-transparent outline-none w-40"
            style={{ color: 'var(--foreground)' }} />
        </div>

        <div className="flex items-center gap-4 text-sm ml-auto">
          <span style={{ color: 'var(--muted-foreground)' }}>Pipeline: <strong style={{ color: 'var(--foreground)' }}>R$ {pipelineValue.toLocaleString('pt-BR')}</strong></span>
          <span style={{ color: 'var(--muted-foreground)' }}>Ganho: <strong className="text-green-600">R$ {totalValue.toLocaleString('pt-BR')}</strong></span>
        </div>

        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(['kanban', 'list'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-1.5 text-xs font-medium"
              style={view === v ? { background: 'var(--primary)', color: 'white' } : { background: 'var(--card)', color: 'var(--muted-foreground)' }}>
              {v === 'kanban' ? 'Kanban' : 'Lista'}
            </button>
          ))}
        </div>

        <button onClick={() => onNavigate('novo-lead')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'var(--primary)' }}>
          <Plus size={14} /> Novo Lead
        </button>
      </div>

      {/* Kanban */}
      {view === 'kanban' && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full gap-3 p-4" style={{ minWidth: stageOrder.length * 220 + 'px' }}>
            {stageOrder.map(stage => {
              const stageLeads = filtered.filter(l => l.stage === stage);
              const cfg = stageConfig[stage];
              const val = stageLeads.reduce((s, l) => s + l.value, 0);
              return (
                <div key={stage} className="flex flex-col rounded-xl overflow-hidden shrink-0" style={{ width: 220, background: 'var(--secondary)' }}>
                  <div className="px-3 py-2.5 flex items-center gap-2"
                    style={{ background: cfg.bg, borderBottom: `2px solid ${cfg.color}` }}>
                    <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: cfg.color }}>{stageLeads.length}</span>
                  </div>
                  {val > 0 && (
                    <div className="px-3 py-1 text-xs border-b" style={{ borderColor: 'var(--border)', color: cfg.color, background: cfg.bg, opacity: 0.7 }}>
                      R$ {val.toLocaleString('pt-BR')}
                    </div>
                  )}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {stageLeads.map(lead => (
                      <LeadCard key={lead.id} lead={lead} onMove={moveLeadStage} />
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="flex items-center justify-center h-24 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        Nenhum lead aqui
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-sm">
              <thead style={{ background: 'var(--secondary)' }}>
                <tr>
                  {['Nome', 'Procedimento', 'Fonte', 'Valor', 'Etapa', 'Data', 'Ações'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {filtered.map(lead => {
                  const cfg = stageConfig[lead.stage];
                  return (
                    <tr key={lead.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: cfg.color }}>{lead.avatar}</div>
                          <span className="font-medium">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{lead.procedure}</td>
                      <td className="px-4 py-3 text-xs">{lead.source}</td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--primary)' }}>R$ {lead.value.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{lead.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1 rounded hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}><Phone size={13} /></button>
                          <button className="p-1 rounded hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}><MessageSquare size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
