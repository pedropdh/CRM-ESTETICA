import { useState } from 'react';
import { ArrowLeft, Phone, Mail, Star, Edit3, Camera, FileText, Calendar, DollarSign, MessageSquare, Plus, Check } from 'lucide-react';
import type { Page } from '../types';

interface ClienteDetalheProps {
  clientId: string;
  onNavigate: (p: Page) => void;
}

const client = {
  id: '1',
  name: 'Ana Carolina Medeiros',
  phone: '(11) 99234-5678',
  email: 'anacarolina@email.com',
  birthdate: '14/03/1988',
  cpf: '123.456.789-00',
  address: 'Rua das Palmeiras, 45 — Jardins, SP',
  stage: 'VIP',
  status: 'ativo',
  since: 'Março 2023',
  totalSpent: 8700,
  visits: 12,
  lastVisit: '15/08/2026',
  nextAppt: '05/09/2026 — 10:00',
  avatar: 'ACM',
  notes: 'Cliente faz toxina a cada 4 meses. Prefere sessões nas manhãs de sexta. Alérgica a lidocaína — usar anestésico alternativo.',
  tags: ['Toxina', 'Preenchimento', 'Fio PDO'],
};

const history = [
  { date: '15/08/2026', procedure: 'Toxina Botulínica — Testa + glabela', prof: 'Dra. Marina Silva', value: 900, status: 'completed', obs: 'Aplicação de 50U. Retorno em 15 dias.' },
  { date: '20/04/2026', procedure: 'Preenchimento Labial — 1ml AH', prof: 'Dra. Marina Silva', value: 1200, status: 'completed', obs: 'Técnica linear retrógrada. Ótimo resultado.' },
  { date: '15/01/2026', procedure: 'Toxina Botulínica — Testa + glabela + patas de galinha', prof: 'Dra. Marina Silva', value: 1100, status: 'completed', obs: '60U. Cliente satisfeita.' },
  { date: '10/09/2025', procedure: 'Fio de PDO — Lifting facial', prof: 'Dra. Marina Silva', value: 2800, status: 'completed', obs: '20 fios smooth. Resultado excelente.' },
  { date: '20/05/2025', procedure: 'Bioestimulador de Colágeno — Sculptra', prof: 'Dra. Marina Silva', value: 2700, status: 'completed', obs: 'Protocolo 3 sessões. Sessão 1/3.' },
];

const anamnese = [
  { q: 'Alergias conhecidas', a: 'Lidocaína — usar prilocaína ou EMLA como alternativa' },
  { q: 'Medicamentos em uso', a: 'Anticoncepcional oral (Yaz), vitamina D 2000UI' },
  { q: 'Doenças pré-existentes', a: 'Nenhuma' },
  { q: 'Gestante/amamentando', a: 'Não' },
  { q: 'Procedimentos anteriores', a: 'Toxina desde 2019 em outras clínicas, preenchimento desde 2021' },
  { q: 'Expectativas', a: 'Manter resultado natural, evitar aspecto artificial' },
  { q: 'Herpes labial', a: 'Sim — profilaxia com Aciclovir antes de preenchimentos labiais' },
];

const photos = [
  { session: '15/08/2026', label: 'Toxina — Frente', url: `https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=200&h=200&fit=crop&auto=format` },
  { session: '15/08/2026', label: 'Toxina — Perfil E', url: `https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&auto=format` },
  { session: '20/04/2026', label: 'Preenchimento — Antes', url: `https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop&auto=format` },
  { session: '20/04/2026', label: 'Preenchimento — Depois', url: `https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop&auto=format` },
];

const tabs = ['Prontuário', 'Anamnese', 'Fotos', 'Histórico Financeiro', 'Mensagens'];

export default function ClienteDetalhe({ onNavigate }: ClienteDetalheProps) {
  const [activeTab, setActiveTab] = useState('Prontuário');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-3 flex items-center gap-4 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <button onClick={() => onNavigate('clientes')} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{client.avatar}</div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              {client.name}
              <Star size={13} fill="#D97706" style={{ color: '#D97706' }} />
            </div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cliente desde {client.since} · {client.visits} visitas</div>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <MessageSquare size={13} /> WhatsApp
          </button>
          <button onClick={() => onNavigate('novo-agendamento')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={14} /> Agendar
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — client summary */}
        <div className="w-64 shrink-0 border-r overflow-auto p-4 space-y-4"
          style={{ borderColor: 'var(--border)' }}>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Total gasto', value: `R$ ${(client.totalSpent / 1000).toFixed(1)}k` },
              { label: 'Visitas', value: client.visits },
              { label: 'Última visita', value: '15/08' },
              { label: 'Próx. apmt.', value: '05/09' },
            ].map(({ label, value }) => (
              <div key={label} className="p-2.5 rounded-xl text-center"
                style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                <div className="text-base font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color: 'var(--primary)' }}>{value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Contato</h4>
            <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-xs hover:opacity-80">
              <Phone size={13} style={{ color: 'var(--primary)' }} />
              <span>{client.phone}</span>
            </a>
            <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-xs hover:opacity-80">
              <Mail size={13} style={{ color: 'var(--primary)' }} />
              <span className="truncate">{client.email}</span>
            </a>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{client.address}</div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>Procedimentos</h4>
            <div className="flex flex-wrap gap-1">
              {client.tags.map(t => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--primary)', color: 'white', opacity: 0.85 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>Observações</h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>{client.notes}</p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b px-4 shrink-0 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                style={activeTab === t
                  ? { borderColor: 'var(--primary)', color: 'var(--primary)' }
                  : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-5">
            {activeTab === 'Prontuário' && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Histórico de Atendimentos</h3>
                {history.map((h, i) => (
                  <div key={i} className="p-4 rounded-xl"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="text-sm font-semibold">{h.procedure}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{h.prof} · {h.date}</div>
                      </div>
                      <div className="text-sm font-bold shrink-0" style={{ color: 'var(--primary)' }}>R$ {h.value.toLocaleString('pt-BR')}</div>
                    </div>
                    {h.obs && (
                      <div className="text-xs p-2 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                        <FileText size={11} className="inline mr-1" style={{ color: 'var(--muted-foreground)' }} />
                        {h.obs}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Anamnese' && (
              <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Ficha de Anamnese</h3>
                  <button className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--accent)' }}>
                    <Edit3 size={13} /> Editar
                  </button>
                </div>
                <div className="space-y-3">
                  {anamnese.map(({ q, a }) => (
                    <div key={q} className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>{q}</div>
                      <div className="text-sm">{a}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl flex items-center gap-2"
                  style={{ background: '#ECFDF5', border: '1px solid #BBF7D0' }}>
                  <Check size={16} style={{ color: '#059669' }} />
                  <span className="text-xs font-medium" style={{ color: '#065F46' }}>
                    Anamnese atualizada em 15/08/2026 · Assinatura digital do cliente coletada
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'Fotos' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Galeria de Fotos</h3>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
                    <Camera size={13} /> Adicionar fotos
                  </button>
                </div>
                <div className="space-y-4">
                  {['15/08/2026 — Toxina Botulínica', '20/04/2026 — Preenchimento Labial'].map((session, si) => (
                    <div key={session}>
                      <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>{session}</div>
                      <div className="flex gap-3 flex-wrap">
                        {photos.filter((_, i) => Math.floor(i / 2) === si).map((p, pi) => (
                          <div key={pi} className="relative group cursor-pointer">
                            <img src={p.url} alt={p.label}
                              className="w-32 h-32 object-cover rounded-xl"
                              style={{ border: '2px solid var(--border)' }} />
                            <div className="absolute inset-0 rounded-xl flex items-end p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }}>
                              <span className="text-white text-xs">{p.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Histórico Financeiro' && (
              <div className="max-w-2xl">
                <h3 className="font-semibold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Histórico Financeiro</h3>
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead style={{ background: 'var(--secondary)' }}>
                      <tr>
                        {['Data', 'Procedimento', 'Valor', 'Pagamento', 'Status'].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {history.map((h, i) => (
                        <tr key={i} className="hover:bg-secondary/50">
                          <td className="px-4 py-3 text-xs">{h.date}</td>
                          <td className="px-4 py-3 text-xs">{h.procedure.split(' — ')[0]}</td>
                          <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--primary)' }}>R$ {h.value.toLocaleString('pt-BR')}</td>
                          <td className="px-4 py-3 text-xs">{['Pix', 'Cartão', 'Dinheiro', 'Pix', 'Cartão'][i]}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#ECFDF5', color: '#059669' }}>Pago</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex justify-end">
                  <div className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                    Total: R$ {client.totalSpent.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Mensagens' && (
              <div className="max-w-lg">
                <h3 className="font-semibold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Conversa no WhatsApp</h3>
                <div className="space-y-3">
                  {[
                    { from: 'clinic', text: 'Olá Ana Carolina! Lembrando do seu agendamento amanhã às 10h. ✅', time: '14/08 09:00' },
                    { from: 'client', text: 'Oi! Sim, estarei lá. Posso chegar 10 minutos antes?', time: '14/08 10:32' },
                    { from: 'clinic', text: 'Claro, pode chegar quando quiser! Te esperamos 😊', time: '14/08 10:35' },
                    { from: 'client', text: 'Ótimo! Já posso aplicar protetor solar hoje à tarde?', time: '14/08 16:00' },
                    { from: 'clinic', text: 'Sim, pode usar FPS 50+ após 4h do procedimento. Evite sol direto por 48h.', time: '14/08 16:08' },
                  ].map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'clinic' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
                        style={m.from === 'clinic'
                          ? { background: 'var(--primary)', color: 'white', borderBottomRightRadius: 4 }
                          : { background: 'var(--card)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 }}>
                        <p>{m.text}</p>
                        <p className={`text-xs mt-1 ${m.from === 'clinic' ? 'text-white/60' : ''}`}
                          style={m.from !== 'clinic' ? { color: 'var(--muted-foreground)' } : {}}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <input className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="Digite uma mensagem…" />
                  <button className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ background: '#25D366' }}>Enviar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
