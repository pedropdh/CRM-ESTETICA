import { useState } from 'react';
import { Phone, MessageSquare, Plus, Search, Globe, Users, Link2, Zap, Copy, Check } from 'lucide-react';
import type { Lead, LeadStage, Page, Plan } from '../types';
import {
  clinic, getLeads, getProcedure, leadAutoReply, leadStageMap, leadStageOrder, money, moveLead,
} from '../data/mock';
import PlanGate from '../components/PlanGate';
import WhatsBubble from '../components/ui/WhatsBubble';
import Toggle from '../components/ui/Toggle';

interface LeadsProps {
  onNavigate: (p: Page) => void;
  plan: Plan;
  onUpgrade: () => void;
}

// lucide-react aqui é reduzido: não existem ícones de marca. Globe é o
// placeholder genérico para origem social.
const sourceIcons: Record<string, any> = {
  'Link de agendamento': Link2,
  'Redes sociais': Globe,
  Indicação: Users,
  WhatsApp: MessageSquare,
  Google: Globe,
};

function LeadCard({ lead, onMove }: { lead: Lead; onMove: (id: string, stage: LeadStage) => void }) {
  const cfg = leadStageMap[lead.stage];
  const SrcIcon = sourceIcons[lead.source] || Globe;

  return (
    <div className="p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start gap-2 mb-2">
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: cfg.color }}>{lead.initials}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{lead.name}</div>
          <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
            {getProcedure(lead.procedureId).name}
          </div>
        </div>
        <div className="text-xs font-bold shrink-0" style={{ color: 'var(--primary)' }}>
          R${(lead.value / 1000).toFixed(1)}k
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <SrcIcon size={11} className="shrink-0" />
        <span className="truncate">{lead.source}</span>
        <span className="ml-auto shrink-0">{lead.date}</span>
      </div>
      <div className="flex gap-1.5 mt-2">
        <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium"
          style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)', minHeight: 36 }}>
          <Phone size={10} /> Ligar
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium"
          style={{ background: '#DCFCE7', color: '#16A34A', minHeight: 36 }}>
          <MessageSquare size={10} /> WhatsApp
        </button>
      </div>
      <select value={lead.stage} onChange={e => onMove(lead.id, e.target.value as LeadStage)}
        className="mt-2 w-full text-xs px-2 py-2 rounded-lg border outline-none"
        style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}40`, fontWeight: 500 }}>
        {leadStageOrder.map(s => <option key={s} value={s}>{leadStageMap[s].label}</option>)}
      </select>
    </div>
  );
}

export default function Leads({ onNavigate, plan, onUpgrade }: LeadsProps) {
  const [, forceTick] = useState(0);
  const [search, setSearch] = useState('');
  const [autoReplyOn, setAutoReplyOn] = useState(leadAutoReply.enabled);
  const [replyText, setReplyText] = useState(leadAutoReply.text);
  const [copied, setCopied] = useState(false);

  const leads = getLeads();
  const filtered = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
  const pipeline = leads.filter(l => !['ganho', 'perdido'].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const won = leads.filter(l => l.stage === 'ganho').reduce((s, l) => s + l.value, 0);

  return (
    <PlanGate
      feature="Funil de Leads"
      description="Acompanhe cada pessoa que chega — pelo link de agendamento, indicação ou WhatsApp — do primeiro contato até o horário marcado."
      requiredPlan="crescimento"
      currentPlan={plan}
      onUpgrade={onUpgrade}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 md:px-6 py-2.5 flex flex-wrap items-center gap-2 border-b shrink-0"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border flex-1 min-w-[160px]"
            style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
            <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar lead…" className="text-sm bg-transparent outline-none w-full"
              style={{ color: 'var(--foreground)' }} />
          </div>
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <span style={{ color: 'var(--muted-foreground)' }}>
              Pipeline: <strong style={{ color: 'var(--foreground)' }}>{money(pipeline)}</strong>
            </span>
            <span style={{ color: 'var(--muted-foreground)' }}>
              Ganho: <strong style={{ color: '#16A34A' }}>{money(won)}</strong>
            </span>
          </div>
          <button onClick={() => onNavigate('novo-lead')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
            style={{ background: 'var(--primary)', minHeight: 36 }}>
            <Plus size={14} /> Novo lead
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Configuração da resposta automática fora do horário */}
          <div className="p-3 md:p-4">
            <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-3 mb-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#E0F2F1' }}>
                  <Zap size={17} style={{ color: 'var(--primary)' }} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">Resposta automática fora do horário</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    Quem chama depois das {clinic.closesAt} recebe o link e já vira um card em "Novos".
                  </div>
                </div>
                <div className="shrink-0">
                  <Toggle checked={autoReplyOn} onChange={setAutoReplyOn} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>
                    Texto da resposta
                  </label>
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4}
                    className="w-full px-3 py-2.5 rounded-lg text-xs outline-none resize-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                  <div className="flex items-center gap-2 mt-2 p-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                    <Link2 size={13} style={{ color: 'var(--primary)' }} />
                    <span className="text-xs truncate flex-1">{clinic.bookingLink}</span>
                    <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                      className="text-xs font-semibold flex items-center gap-1 shrink-0" style={{ color: 'var(--primary)' }}>
                      {copied ? <><Check size={11} /> Copiado</> : <><Copy size={11} /> Copiar</>}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>
                    Como chega
                  </div>
                  <WhatsBubble framed time="21:47"
                    text={replyText.replace('{link}', clinic.bookingLink)} />
                </div>
              </div>
            </div>
          </div>

          {/* Kanban */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 px-3 md:px-4" style={{ minWidth: leadStageOrder.length * 232 }}>
              {leadStageOrder.map(stage => {
                const stageLeads = filtered.filter(l => l.stage === stage);
                const cfg = leadStageMap[stage];
                const val = stageLeads.reduce((s, l) => s + l.value, 0);
                return (
                  <div key={stage} className="flex flex-col rounded-xl overflow-hidden shrink-0"
                    style={{ width: 220, background: 'var(--secondary)' }}>
                    <div className="px-3 py-2.5 flex items-center gap-2" style={{ background: cfg.bg, borderBottom: `2px solid ${cfg.color}` }}>
                      <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                      <span className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full text-white" style={{ background: cfg.color }}>
                        {stageLeads.length}
                      </span>
                    </div>
                    {val > 0 && (
                      <div className="px-3 py-1 text-xs" style={{ color: cfg.color, background: cfg.bg, opacity: 0.75 }}>
                        {money(val)}
                      </div>
                    )}
                    <div className="p-2 space-y-2">
                      {stageLeads.map(lead => (
                        <LeadCard key={lead.id} lead={lead} onMove={(id, s) => { moveLead(id, s); forceTick(t => t + 1); }} />
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="flex items-center justify-center h-20 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          Nenhum lead aqui
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PlanGate>
  );
}
