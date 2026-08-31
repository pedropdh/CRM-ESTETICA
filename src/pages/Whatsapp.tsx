import { useState } from 'react';
import {
  Search, Send, ArrowLeft, CheckCheck, ListPlus, Repeat, Heart, Zap, Lock,
  ChevronRight, Infinity as InfinityIcon, ArrowRight, Check,
} from 'lucide-react';
import type { Automation, Page, Plan } from '../types';
import {
  getAutomation, getAutomations, getClient, getConversations, getMarketingUsage,
  getMessages, getUser, markConversationRead, messageCategoryMap, renderTemplate, sendMessage,
  setAutomationParam, setAutomationTemplate, toggleAutomation,
} from '../data/mock';
import Badge, { usageColor } from '../components/ui/Badge';
import SlideOver from '../components/ui/SlideOver';
import Toggle from '../components/ui/Toggle';
import WhatsBubble from '../components/ui/WhatsBubble';
import EmptyState from '../components/ui/EmptyState';
import PlanGate from '../components/PlanGate';

const automationIcons: Record<string, any> = {
  CheckCheck,
  ListPlus,
  Repeat,
  Heart,
  Zap,
};

const toneStyles = {
  positivo: { color: '#059669', bg: '#ECFDF5' },
  neutro: { color: '#0891B2', bg: '#E0F7FA' },
  atencao: { color: '#D97706', bg: '#FFF7ED' },
};

interface WhatsappProps {
  plan: Plan;
  onNavigate: (p: Page) => void;
  onSelectClient: (id: string) => void;
  onUpgrade: () => void;
}

export default function Whatsapp({ plan, onNavigate, onSelectClient, onUpgrade }: WhatsappProps) {
  const [, forceTick] = useState(0);
  const [tab, setTab] = useState<'conversas' | 'automacoes'>('conversas');
  const [activeConv, setActiveConv] = useState<string | null>('cv1');
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [openAutomation, setOpenAutomation] = useState<string | null>(null);

  const tick = () => forceTick(t => t + 1);
  const usage = getMarketingUsage(plan);
  const usagePct = Math.round((usage.sent / usage.quota) * 100);

  const conversations = getConversations().filter(c =>
    getClient(c.clientId).name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Abas */}
      <div className="flex items-center border-b shrink-0 px-2 md:px-4" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        {([['conversas', 'Conversas'], ['automacoes', 'Automações']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            style={tab === id
              ? { borderColor: 'var(--primary)', color: 'var(--primary)' }
              : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Consumo — só marketing conta */}
      <div className="px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 shrink-0 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Mensagens de marketing este mês:</span>
          <span className="text-xs font-bold" style={{ color: usageColor(usagePct) }}>
            {usage.sent} de {usage.quota}
          </span>
          <span className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
            <span className="block h-full rounded-full" style={{ width: `${usagePct}%`, background: usageColor(usagePct) }} />
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <InfinityIcon size={13} style={{ color: '#059669' }} />
          Confirmação, lista de espera e recall: <strong style={{ color: '#059669' }}>ilimitado</strong>
        </div>
      </div>

      {/* ── Conversas ── */}
      {tab === 'conversas' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Lista */}
          <div className={`${showChatOnMobile ? 'hidden' : 'flex'} md:flex w-full md:w-72 shrink-0 flex-col md:border-r`}
            style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
            <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                <Search size={13} style={{ color: 'var(--muted-foreground)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none" placeholder="Buscar…"
                  style={{ color: 'var(--foreground)' }} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map(c => {
                const client = getClient(c.clientId);
                return (
                  <button key={c.id}
                    onClick={() => { setActiveConv(c.id); markConversationRead(c.id); setShowChatOnMobile(true); tick(); }}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-secondary/60 transition-colors border-b"
                    style={{ borderColor: 'var(--border)', background: activeConv === c.id ? 'var(--secondary)' : '', minHeight: 68 }}>
                    <span className="relative shrink-0">
                      <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{client.initials}</span>
                      {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#22C55E' }} />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold truncate">{client.name}</span>
                        <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{c.lastTime}</span>
                      </span>
                      <span className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{c.lastPreview}</span>
                        {c.unread > 0 && (
                          <span className="rounded-full flex items-center justify-center text-white shrink-0"
                            style={{ background: '#25D366', fontSize: '10px', minWidth: 18, height: 18 }}>{c.unread}</span>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
              {conversations.length === 0 && (
                <EmptyState compact Icon={Search} title="Nada encontrado" description="Nenhuma conversa com esse nome." />
              )}
            </div>
          </div>

          {/* Chat */}
          <div className={`${showChatOnMobile ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-hidden`}>
            {activeConv ? (() => {
              const conv = getConversations().find(c => c.id === activeConv)!;
              const client = getClient(conv.clientId);
              const msgs = getMessages(activeConv);
              return (
                <>
                  <div className="px-3 md:px-5 py-2.5 flex items-center gap-2 border-b shrink-0"
                    style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                    <button onClick={() => setShowChatOnMobile(false)} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--muted-foreground)' }}>
                      <ArrowLeft size={18} />
                    </button>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{client.initials}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{client.name}</div>
                      <div className="text-xs" style={{ color: conv.online ? '#22C55E' : 'var(--muted-foreground)' }}>
                        {conv.online ? 'Online' : 'Visto por último ontem'}
                      </div>
                    </div>
                    <button onClick={() => onSelectClient(client.id)}
                      className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold"
                      style={{ background: 'var(--secondary)', color: 'var(--primary)', minHeight: 36 }}>
                      Ficha <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#ECE5DD' }}>
                    {msgs.map(m => {
                      const cat = messageCategoryMap[m.category];
                      const author = m.authorId ? getUser(m.authorId) : null;
                      return (
                        <div key={m.id} className={`flex flex-col ${m.from === 'clinic' ? 'items-end' : 'items-start'}`}>
                          <WhatsBubble text={m.text} from={m.from} time={m.time} />
                          <div className="flex items-center gap-1.5 mt-1 px-1">
                            {/* Selo discreto de categoria por mensagem */}
                            <span style={{ opacity: 0.85 }}>
                              <Badge label={cat.label} color={cat.color} bg={cat.bg} />
                            </span>
                            {/* Multiatendente: só no Crescimento */}
                            {plan === 'crescimento' && m.from === 'clinic' && author && (
                              <span className="flex items-center gap-1 text-xs" style={{ color: '#5B6B78' }}>
                                <span className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                                  style={{ background: '#0A6E6E', fontSize: 8 }}>
                                  {author.name.replace('Dra. ', '').split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </span>
                                {author.name.split(' ')[0]}
                              </span>
                            )}
                            {m.from === 'clinic' && <CheckCheck size={12} style={{ color: m.read ? '#34B7F1' : '#94A3B8' }} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-3 py-2.5 flex items-end gap-2 shrink-0 border-t" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                    <textarea value={input} onChange={e => setInput(e.target.value)} rows={1}
                      placeholder={plan === 'essencial' ? 'Responder (atendente única)…' : 'Digite uma mensagem…'}
                      className="flex-1 px-4 py-2.5 rounded-2xl text-sm outline-none resize-none"
                      style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)', maxHeight: 100 }} />
                    <button
                      onClick={() => { if (input.trim()) { sendMessage(activeConv, input.trim()); setInput(''); tick(); } }}
                      className="p-3 rounded-full text-white shrink-0" style={{ background: '#25D366' }}>
                      <Send size={16} />
                    </button>
                  </div>
                  {plan === 'essencial' && (
                    <div className="px-4 py-1.5 text-xs shrink-0" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                      Essencial: um atendente por vez. No Crescimento cada resposta mostra quem respondeu.
                    </div>
                  )}
                </>
              );
            })() : (
              <EmptyState Icon={Send} title="Escolha uma conversa" description="Selecione alguém na lista ao lado." />
            )}
          </div>
        </div>
      )}

      {/* ── Automações ── */}
      {tab === 'automacoes' && (
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-3">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Cada regra abaixo é uma conversa que o Lumina puxa sozinho. Abra uma para ver a mensagem
              exata que sai e o que acontece quando a cliente responde.
            </p>

            {getAutomations().map(a => {
              const Icon = automationIcons[a.icon] ?? Zap;
              const locked = !!a.requiresCrescimento && plan === 'essencial';
              const cat = messageCategoryMap[a.category];
              return (
                <button key={a.id} onClick={() => setOpenAutomation(a.id)}
                  className="w-full p-4 rounded-xl flex items-center gap-3 text-left hover:shadow-md transition-shadow"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', opacity: locked ? 0.75 : 1 }}>
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: locked ? '#F1F5F9' : '#E0F2F1' }}>
                    {locked ? <Lock size={17} style={{ color: '#94A3B8' }} /> : <Icon size={18} style={{ color: 'var(--primary)' }} />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{a.name}</span>
                      <Badge label={cat.label} color={cat.color} bg={cat.bg} />
                      {locked && <Badge label="Crescimento" color="#7C3AED" bg="#F5F3FF" />}
                    </span>
                    <span className="block text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{a.summary}</span>
                    {!locked && (
                      <span className="block text-xs mt-1" style={{ color: 'var(--muted-foreground)', opacity: 0.8 }}>
                        {a.sentThisMonth} mensagens este mês
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: a.enabled && !locked ? '#059669' : '#94A3B8' }}>
                      {locked ? 'Bloqueada' : a.enabled ? 'Ligada' : 'Desligada'}
                    </span>
                    <ChevronRight size={16} style={{ color: 'var(--muted-foreground)' }} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Detalhe da automação */}
      {openAutomation && (
        <AutomationPanel
          automation={getAutomation(openAutomation)}
          plan={plan}
          onClose={() => setOpenAutomation(null)}
          onChange={tick}
          onUpgrade={() => { setOpenAutomation(null); onUpgrade(); }}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

// ── Painel lateral de uma automação ──────────────────────────────────────────
// Três blocos: (a) liga/desliga + parâmetros, (b) prévia da mensagem,
// (c) "O que acontece" — a sequência que explica o funcionamento.

function AutomationPanel({
  automation, plan, onClose, onChange, onUpgrade, onNavigate,
}: {
  automation: Automation;
  plan: Plan;
  onClose: () => void;
  onChange: () => void;
  onUpgrade: () => void;
  onNavigate: (p: Page) => void;
}) {
  const [template, setTemplate] = useState(automation.template);
  const locked = !!automation.requiresCrescimento && plan === 'essencial';
  const Icon = automationIcons[automation.icon] ?? Zap;

  return (
    <SlideOver title={automation.name} subtitle={automation.summary} onClose={onClose}>
      {locked ? (
        <div className="-m-5">
          <PlanGate
            feature={automation.name}
            description={automation.summary}
            requiredPlan="crescimento"
            currentPlan={plan}
            onUpgrade={onUpgrade}
          >
            <></>
          </PlanGate>
        </div>
      ) : (
        <div className="space-y-6">
          {/* (a) Liga/desliga e parâmetros */}
          <section>
            <div className="p-3.5 rounded-xl mb-3" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
              <Toggle
                checked={automation.enabled}
                onChange={() => { toggleAutomation(automation.id); onChange(); }}
                label={automation.enabled ? 'Automação ligada' : 'Automação desligada'}
                description={automation.enabled
                  ? 'Rodando sozinha para todas as clientes que se encaixam.'
                  : 'Nada é enviado enquanto estiver desligada.'}
              />
            </div>

            <div className="space-y-2.5">
              {automation.params.map(p => (
                <div key={p.id}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>
                    {p.label}
                  </label>
                  {p.options ? (
                    <select value={p.value}
                      onChange={e => { setAutomationParam(automation.id, p.id, e.target.value); onChange(); }}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                      {p.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input value={p.value}
                      onChange={e => { setAutomationParam(automation.id, p.id, e.target.value); onChange(); }}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* (b) Prévia da mensagem */}
          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>
              A mensagem que sai
            </h4>
            <textarea
              value={template}
              onChange={e => { setTemplate(e.target.value); setAutomationTemplate(automation.id, e.target.value); onChange(); }}
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg text-xs outline-none resize-none mb-2"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
            <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Variáveis: <code>{'{nome}'}</code> <code>{'{horario}'}</code> <code>{'{procedimento}'}</code>
            </p>
            <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
              Prévia — é assim que ela chega no celular da cliente:
            </div>
            <WhatsBubble framed text={renderTemplate(template)} time="09:00" />
          </section>

          {/* (c) O que acontece */}
          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>
              O que acontece
            </h4>
            <div className="space-y-2">
              {automation.sequence.map((s, i) => {
                const tone = toneStyles[s.tone];
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: tone.bg, color: tone.color }}>{i + 1}</span>
                      {i < automation.sequence.length - 1 && (
                        <span className="w-px flex-1 my-1" style={{ background: 'var(--border)' }} />
                      )}
                    </div>
                    <div className="pb-3 min-w-0">
                      <div className="text-sm font-semibold">{s.trigger}</div>
                      <div className="flex items-start gap-1.5 mt-1">
                        <ArrowRight size={12} className="mt-0.5 shrink-0" style={{ color: tone.color }} />
                        <span className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{s.outcome}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 p-3 rounded-xl flex items-start gap-2"
              style={{ background: automation.category === 'marketing' ? '#FFF7ED' : '#ECFDF5' }}>
              {automation.category === 'marketing'
                ? <Icon size={14} style={{ color: '#D97706', marginTop: 2 }} />
                : <Check size={14} style={{ color: '#059669', marginTop: 2 }} />}
              <span className="text-xs" style={{ color: automation.category === 'marketing' ? '#92400E' : '#065F46' }}>
                {automation.category === 'marketing'
                  ? 'Mensagem promocional: consome a franquia de marketing do mês.'
                  : 'Mensagem de utilidade: ilimitada nos dois planos, não consome franquia.'}
              </span>
            </div>

            <button onClick={() => { onClose(); onNavigate('agenda'); }}
              className="mt-3 w-full py-2.5 rounded-lg text-xs font-semibold"
              style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>
              Ver o efeito disso na Agenda
            </button>
          </section>
        </div>
      )}
    </SlideOver>
  );
}
