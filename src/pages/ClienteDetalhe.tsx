import { useState } from 'react';
import {
  ArrowLeft, Phone, Mail, Star, Camera, FileText, MessageSquare, Plus, Check, Repeat, CalendarClock,
} from 'lucide-react';
import type { Page } from '../types';
import {
  formatBR, getClient, getNextReturn, getProcedure, getProfessional, money,
  sendRecall, wasRecallSent,
} from '../data/mock';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { statusChip } from './Clientes';

interface ClienteDetalheProps {
  clientId: string;
  onNavigate: (p: Page) => void;
}

const tabs = ['Prontuário', 'Anamnese', 'Fotos', 'Financeiro'] as const;

export default function ClienteDetalhe({ clientId, onNavigate }: ClienteDetalheProps) {
  const [, forceTick] = useState(0);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Prontuário');

  const client = getClient(clientId);
  const chip = statusChip(client);
  const next = getNextReturn(client);
  const recallSent = wasRecallSent(client.id);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-3 md:px-6 py-3 flex items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <button onClick={() => onNavigate('clientes')} className="p-2 rounded-lg hover:bg-secondary transition-colors"
          style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{client.initials}</div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm flex items-center gap-1.5 truncate" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            <span className="truncate">{client.name}</span>
            {client.stage === 'VIP' && <Star size={13} fill="#D97706" style={{ color: '#D97706' }} />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge label={chip.label} color={chip.color} bg={chip.bg} />
            <span className="hidden sm:inline text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Cliente desde {client.since} · {client.history.length} atendimentos
            </span>
          </div>
        </div>
        <div className="hidden sm:flex gap-2 shrink-0">
          <button onClick={() => onNavigate('whatsapp')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <MessageSquare size={13} /> WhatsApp
          </button>
          <button onClick={() => onNavigate('novo-agendamento')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={14} /> Agendar
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-auto md:overflow-hidden flex-col md:flex-row">
        {/* Resumo — vira bloco no topo no celular */}
        <div className="w-full md:w-64 shrink-0 md:border-r md:overflow-auto p-3 md:p-4 space-y-4 border-b md:border-b-0"
          style={{ borderColor: 'var(--border)' }}>

          {/* Próximo retorno previsto */}
          <div className="p-3.5 rounded-xl" style={{ background: '#E0F2F1', border: '1px solid rgba(10,110,110,0.2)' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <CalendarClock size={14} style={{ color: 'var(--primary)' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>
                Próximo retorno previsto
              </span>
            </div>
            {next ? (
              <>
                <div className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>
                  {next.procedure.name} em {formatBR(next.dueISO)}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#40656A' }}>
                  A cada {next.procedure.returnIntervalDays} dias · último em {formatBR(next.lastDate)}
                  {next.overdue ? ` · atrasado ${Math.abs(next.daysUntil)} dias` : ` · faltam ${next.daysUntil} dias`}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => onNavigate('novo-agendamento')}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold text-white"
                    style={{ background: 'var(--primary)', minHeight: 36 }}>
                    Agendar
                  </button>
                  <button
                    onClick={() => { sendRecall([client.id]); forceTick(t => t + 1); }}
                    disabled={recallSent}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                    style={{
                      background: 'white',
                      color: recallSent ? '#059669' : 'var(--primary)',
                      border: '1px solid rgba(10,110,110,0.25)',
                      minHeight: 36,
                    }}>
                    {recallSent ? <><Check size={12} /> Enviado</> : <><Repeat size={12} /> Recall agora</>}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-xs" style={{ color: '#40656A' }}>
                Sem procedimento registrado ainda — o retorno é calculado depois do primeiro atendimento.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Total gasto', value: client.totalSpent > 0 ? `R$ ${(client.totalSpent / 1000).toFixed(1)}k` : '—' },
              { label: 'Atendimentos', value: client.history.length },
              { label: 'Última visita', value: formatBR(client.lastVisit).slice(0, 5) },
              { label: 'Categoria', value: client.stage },
            ].map(({ label, value }) => (
              <div key={label} className="p-2.5 rounded-xl text-center" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                <div className="text-sm font-bold truncate" style={{ fontFamily: 'Instrument Sans, sans-serif', color: 'var(--primary)' }}>{value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Contato</h4>
            <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-xs hover:opacity-80">
              <Phone size={13} style={{ color: 'var(--primary)' }} /> <span>{client.phone}</span>
            </a>
            <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-xs hover:opacity-80">
              <Mail size={13} style={{ color: 'var(--primary)' }} /> <span className="truncate">{client.email}</span>
            </a>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{client.address}</div>
          </div>

          <div className="p-3 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#DC2626' }}>Alergias</div>
            <div className="text-xs" style={{ color: '#7F1D1D' }}>{client.allergies}</div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Observações</h4>
            <p className="text-xs leading-relaxed">{client.notes}</p>
          </div>

          {/* Ações no celular */}
          <div className="flex gap-2 sm:hidden">
            <button onClick={() => onNavigate('whatsapp')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium"
              style={{ background: '#DCFCE7', color: '#16A34A', minHeight: 44 }}>
              <MessageSquare size={14} /> WhatsApp
            </button>
            <button onClick={() => onNavigate('novo-agendamento')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: 'var(--primary)', minHeight: 44 }}>
              <Plus size={14} /> Agendar
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b px-2 md:px-4 shrink-0 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="px-3 md:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                style={activeTab === t
                  ? { borderColor: 'var(--primary)', color: 'var(--primary)' }
                  : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-3 md:p-5">
            {activeTab === 'Prontuário' && (
              <div className="space-y-3 max-w-2xl">
                {client.history.length === 0 ? (
                  <EmptyState Icon={FileText} title="Sem atendimentos" description="O histórico aparece aqui depois da primeira sessão." />
                ) : client.history.map((h, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{getProcedure(h.procedureId).name}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          {getProfessional(h.professionalId).name} · {formatBR(h.date)}
                        </div>
                      </div>
                      <div className="text-sm font-bold shrink-0" style={{ color: 'var(--primary)' }}>{money(h.value)}</div>
                    </div>
                    <div className="text-xs p-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                      <FileText size={11} className="inline mr-1" style={{ color: 'var(--muted-foreground)' }} />
                      {h.notes}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Anamnese' && (
              <div className="max-w-2xl space-y-3">
                {client.anamnese.map(({ question, answer }) => (
                  <div key={question} className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>{question}</div>
                    <div className="text-sm">{answer}</div>
                  </div>
                ))}
                <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: '#ECFDF5', border: '1px solid #BBF7D0' }}>
                  <Check size={16} style={{ color: '#059669' }} />
                  <span className="text-xs font-medium" style={{ color: '#065F46' }}>
                    Anamnese atualizada em {formatBR(client.lastVisit)}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'Fotos' && (
              client.photos.length === 0 ? (
                <EmptyState Icon={Camera} title="Nenhuma foto"
                  description="Adicione fotos antes e depois para acompanhar a evolução do tratamento." />
              ) : (
                <div className="space-y-5">
                  {[...new Set(client.photos.map(p => p.session))].map(session => (
                    <div key={session}>
                      <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        {formatBR(session)}
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {client.photos.filter(p => p.session === session).map((p, i) => (
                          <div key={i} className="relative group">
                            <img src={p.url} alt={p.label} className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-xl"
                              style={{ border: '2px solid var(--border)' }} />
                            <div className="absolute inset-x-0 bottom-0 rounded-b-xl px-2 py-1"
                              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
                              <span className="text-white text-xs">{p.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'Financeiro' && (
              <div className="max-w-2xl">
                <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm min-w-[420px]">
                    <thead style={{ background: 'var(--secondary)' }}>
                      <tr>
                        {['Data', 'Procedimento', 'Valor', 'Pagamento'].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {client.history.map((h, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 text-xs">{formatBR(h.date)}</td>
                          <td className="px-4 py-3 text-xs">{getProcedure(h.procedureId).name}</td>
                          <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--primary)' }}>{money(h.value)}</td>
                          <td className="px-4 py-3 text-xs">{h.payment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-sm font-bold text-right" style={{ color: 'var(--primary)' }}>
                  Total: {money(client.totalSpent)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
