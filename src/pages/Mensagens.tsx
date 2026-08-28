import { useState } from 'react';
import { Search, Send, Phone, MoreVertical, Paperclip, Smile, CheckCheck, Megaphone } from 'lucide-react';
import type { Plan } from '../types';
import PlanGate from '../components/PlanGate';

const conversations = [
  { id: '1', name: 'Ana Carolina Medeiros', avatar: 'AC', last: 'Posso chegar 10 min antes?', time: '10:32', unread: 0, online: true },
  { id: '2', name: 'Fernanda Oliveira', avatar: 'FO', last: 'Obrigada pela atenção! ❤️', time: '09:15', unread: 1, online: false },
  { id: '3', name: 'Juliana Torres', avatar: 'JT', last: 'Já posso lavar o rosto?', time: 'ontem', unread: 2, online: false },
  { id: '4', name: 'Patricia Santos', avatar: 'PS', last: 'Tudo bem! Até amanhã.', time: 'ontem', unread: 0, online: true },
  { id: '5', name: 'Roberta Lima', avatar: 'RL', last: 'Quando posso fazer sol?', time: 'seg', unread: 0, online: false },
  { id: '6', name: 'Bianca Rodrigues', avatar: 'BR', last: 'Quanto custa o preenchimento?', time: 'seg', unread: 3, online: false },
];

const messages: Record<string, Array<{ from: 'clinic' | 'client'; text: string; time: string; read: boolean }>> = {
  '1': [
    { from: 'clinic', text: 'Olá Ana Carolina! Lembrando do seu agendamento amanhã às 10h. 😊', time: '14/08 09:00', read: true },
    { from: 'client', text: 'Oi! Sim, estarei lá. Posso chegar 10 minutos antes?', time: '14/08 10:32', read: true },
    { from: 'clinic', text: 'Claro, pode chegar quando quiser! Te esperamos 😊', time: '14/08 10:35', read: true },
    { from: 'client', text: 'Já posso aplicar protetor solar hoje à tarde?', time: '14/08 16:00', read: true },
    { from: 'clinic', text: 'Sim, pode usar FPS 50+ após 4h do procedimento. Evite sol direto por 48h.', time: '14/08 16:08', read: true },
  ],
  '2': [
    { from: 'clinic', text: 'Fernanda, tudo bem com você? Passando para confirmar seu horário de segunda!', time: '22/08 08:00', read: true },
    { from: 'client', text: 'Oi! Sim, confirmo minha presença ✅', time: '22/08 09:00', read: true },
    { from: 'client', text: 'Obrigada pela atenção! ❤️', time: '22/08 09:15', read: false },
  ],
  '3': [
    { from: 'client', text: 'Oi! Fiz a limpeza de pele ontem. Já posso lavar o rosto?', time: '23/08 07:30', read: false },
    { from: 'client', text: 'Pode usar hidratante também?', time: '23/08 07:31', read: false },
  ],
};

const quickReplies = [
  'Seu agendamento foi confirmado! ✅',
  'Lembrando: seu horário é amanhã às {hora}.',
  'Após o procedimento, evite sol e maquiagem por 24h.',
  'Obrigada pela preferência! Até logo 😊',
];

interface MensagensProps { plan?: Plan; onUpgrade?: () => void; }

export default function Mensagens({ plan = 'pro', onUpgrade }: MensagensProps) {
  if (plan === 'start') {
    return (
      <PlanGate
        feature="Central de Mensagens WhatsApp"
        description="Gerencie todas as conversas de WhatsApp dos seus clientes em um só lugar. Envie lembretes automáticos, campanhas segmentadas e responda mensagens sem sair do sistema."
        requiredPlan="pro"
        currentPlan={plan}
        onUpgrade={onUpgrade ?? (() => {})}
      >
        <></>
      </PlanGate>
    );
  }
  const [activeConv, setActiveConv] = useState('1');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [campaignModal, setCampaignModal] = useState(false);

  const conv = conversations.find(c => c.id === activeConv)!;
  const msgs = messages[activeConv] || [];

  function sendMessage() {
    if (!input.trim()) return;
    setInput('');
  }

  const filteredConvs = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation list */}
      <div className="w-72 shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="p-3 border-b space-y-2" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
              <Search size={13} style={{ color: 'var(--muted-foreground)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none" placeholder="Buscar…"
                style={{ color: 'var(--foreground)' }} />
            </div>
            <button onClick={() => setCampaignModal(true)}
              className="p-2 rounded-xl transition-colors hover:opacity-80"
              style={{ background: 'var(--primary)', color: 'white' }}
              title="Campanha em massa">
              <Megaphone size={15} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map(c => (
            <button key={c.id} onClick={() => setActiveConv(c.id)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60 border-b"
              style={{ borderColor: 'var(--border)', background: activeConv === c.id ? 'var(--secondary)' : '' }}>
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{c.avatar}</div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ background: '#22C55E' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold truncate">{c.name}</span>
                  <span className="text-xs shrink-0 ml-1" style={{ color: 'var(--muted-foreground)' }}>{c.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{c.last}</span>
                  {c.unread > 0 && (
                    <span className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-white shrink-0 ml-1"
                      style={{ background: '#25D366', fontSize: '10px', minWidth: 18, minHeight: 18 }}>{c.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header */}
        <div className="px-5 py-3 flex items-center gap-3 border-b shrink-0"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <div className="relative">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{conv.avatar}</div>
            {conv.online && <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white" style={{ background: '#22C55E' }} />}
          </div>
          <div>
            <div className="text-sm font-semibold">{conv.name}</div>
            <div className="text-xs" style={{ color: conv.online ? '#22C55E' : 'var(--muted-foreground)' }}>
              {conv.online ? 'Online' : 'Visto por último ontem'}
            </div>
          </div>
          <div className="ml-auto flex gap-1">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}><Phone size={16} /></button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}><MoreVertical size={16} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3"
          style={{ background: 'var(--background)' }}>
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'clinic' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-xs md:max-w-sm px-4 py-2.5 rounded-2xl shadow-sm"
                style={m.from === 'clinic'
                  ? { background: '#0A6E6E', color: 'white', borderBottomRightRadius: 4 }
                  : { background: 'var(--card)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 }}>
                <p className="text-sm">{m.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1`}>
                  <span className="text-xs" style={{ color: m.from === 'clinic' ? 'rgba(255,255,255,0.6)' : 'var(--muted-foreground)' }}>{m.time}</span>
                  {m.from === 'clinic' && <CheckCheck size={13} style={{ color: m.read ? '#93C5FD' : 'rgba(255,255,255,0.4)' }} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 border-t" style={{ borderColor: 'var(--border)' }}>
          {quickReplies.map((r, i) => (
            <button key={i} onClick={() => setInput(r)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border hover:opacity-80 transition-opacity whitespace-nowrap"
              style={{ borderColor: 'var(--border)', color: 'var(--secondary-foreground)', background: 'var(--secondary)' }}>
              {r.length > 40 ? r.slice(0, 38) + '…' : r}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 flex items-end gap-2 shrink-0 border-t" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}><Paperclip size={18} /></button>
          <div className="flex-1 flex items-end rounded-2xl border px-4 py-2"
            style={{ background: 'var(--secondary)', borderColor: 'var(--border)', minHeight: 40 }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none resize-none"
              style={{ color: 'var(--foreground)', maxHeight: 100 }}
              rows={1} placeholder="Digite uma mensagem…"
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
            <button className="ml-2 shrink-0 self-end" style={{ color: 'var(--muted-foreground)' }}><Smile size={18} /></button>
          </div>
          <button onClick={sendMessage}
            className="p-2.5 rounded-full text-white transition-opacity hover:opacity-90"
            style={{ background: '#25D366' }}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Campaign modal */}
      {campaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Nova Campanha em Massa</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Segmento</label>
                <select className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                  style={{ background: 'var(--secondary)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <option>Todos os clientes ativos</option>
                  <option>Clientes VIP</option>
                  <option>Clientes sem visita há 90+ dias</option>
                  <option>Leads não convertidos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Mensagem</label>
                <textarea rows={4} className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none"
                  style={{ background: 'var(--secondary)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  defaultValue="Olá {nome}! Temos uma promoção especial para você este mês. Que tal renovar seu visual? 😍" />
              </div>
              <div className="text-xs p-2 rounded-lg" style={{ background: '#FFF7ED', color: '#92400E' }}>
                Esta campanha será enviada para <strong>142 contatos</strong> via WhatsApp.
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setCampaignModal(false)}
                className="flex-1 py-2 rounded-xl text-sm font-medium border"
                style={{ borderColor: 'var(--border)', color: 'var(--secondary-foreground)' }}>Cancelar</button>
              <button onClick={() => setCampaignModal(false)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--primary)' }}>Enviar Campanha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
