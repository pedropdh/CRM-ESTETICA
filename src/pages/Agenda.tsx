import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, User, X, ListPlus, Check } from 'lucide-react';
import type { Appointment, Page } from '../types';
import {
  TODAY, addDays, appointmentStatusMap, formatBR, getAppointmentsByDate, getClient,
  getProcedure, getProfessional, getProfessionals, getWaitlist, matchWaitlist,
  offerSlotToAll, periodLabels, setAppointmentStatus, toDate,
} from '../data/mock';
import Badge from '../components/ui/Badge';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';

interface AgendaProps {
  onNavigate: (p: Page) => void;
  onSelectClient: (id: string) => void;
}

const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const TOTAL_MINS = 10 * 60;

function timeToMins(time: string) {
  const [h, m] = time.split(':').map(Number);
  return (h - 8) * 60 + m;
}

export default function Agenda({ onNavigate, onSelectClient }: AgendaProps) {
  const [, forceTick] = useState(0);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [profFilter, setProfFilter] = useState('todos');
  const [dateISO, setDateISO] = useState(TODAY);
  const [panel, setPanel] = useState<'horarios' | 'espera'>('horarios');
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [offerFor, setOfferFor] = useState<Appointment | null>(null);
  const [flash, setFlash] = useState('');

  const tick = () => forceTick(t => t + 1);

  const dayAppts = getAppointmentsByDate(dateISO);
  const filtered = profFilter === 'todos' ? dayAppts : dayAppts.filter(a => a.professionalId === profFilter);
  const waiting = getWaitlist().filter(w => !w.offeredFor);

  function confirmCancel() {
    if (!cancelTarget) return;
    setAppointmentStatus(cancelTarget.id, 'cancelado');
    const freed = cancelTarget;
    setCancelTarget(null);
    tick();
    // A vaga abriu: oferecer para quem está esperando.
    setOfferFor(freed);
  }

  function confirmOffer() {
    if (!offerFor) return;
    const matches = matchWaitlist(offerFor);
    offerSlotToAll(matches.map(m => m.id), `${formatBR(offerFor.date)} às ${offerFor.time}`);
    setFlash(`${matches.length} clientes da lista de espera foram avisadas da vaga de ${offerFor.time}.`);
    setOfferFor(null);
    tick();
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="px-3 md:px-6 py-2.5 flex flex-wrap items-center gap-2 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="flex items-center gap-1">
          <button onClick={() => setDateISO(d => addDays(d, -1))}
            className="p-2 rounded hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold px-1 text-center" style={{ minWidth: 120 }}>
            {toDate(dateISO).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
          <button onClick={() => setDateISO(d => addDays(d, 1))}
            className="p-2 rounded hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            <ChevronRight size={16} />
          </button>
          <button onClick={() => setDateISO(TODAY)}
            className="ml-1 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
            Hoje
          </button>
        </div>

        <div className="hidden md:flex ml-auto rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(['day', 'week', 'month'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={view === v ? { background: 'var(--primary)', color: 'white' } : { background: 'var(--card)', color: 'var(--muted-foreground)' }}>
              {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>

        <select value={profFilter} onChange={e => setProfFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg text-xs border outline-none ml-auto md:ml-0"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
          <option value="todos">Todos</option>
          {getProfessionals().map(p => <option key={p.id} value={p.id}>{p.shortName}</option>)}
        </select>

        <button onClick={() => onNavigate('novo-agendamento')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'var(--primary)', minHeight: 34 }}>
          <Plus size={14} /> Novo
        </button>
      </div>

      {flash && (
        <div className="px-4 py-2 flex items-center gap-2 text-xs shrink-0" style={{ background: '#ECFDF5', color: '#065F46' }}>
          <Check size={14} /> {flash}
          <button onClick={() => setFlash('')} className="ml-auto"><X size={13} /></button>
        </div>
      )}

      {/* Dia */}
      {view === 'day' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Grade de horários — só no desktop */}
          <div className="hidden md:flex flex-1 overflow-auto">
            <div className="w-16 shrink-0 pt-2">
              {hours.map(h => (
                <div key={h} className="h-[60px] flex items-start justify-end pr-3">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{h}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 relative border-l" style={{ borderColor: 'var(--border)' }}>
              {hours.map(h => <div key={h} className="h-[60px] border-b" style={{ borderColor: 'var(--border)' }} />)}
              {dateISO === TODAY && (
                <div className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
                  style={{ top: `${((9 * 60 + 30) / TOTAL_MINS) * 100}%` }}>
                  <div className="w-2 h-2 rounded-full -ml-1" style={{ background: '#EF4444' }} />
                  <div className="flex-1 h-px" style={{ background: '#EF4444' }} />
                </div>
              )}
              {filtered.map(a => {
                const top = (timeToMins(a.time) / TOTAL_MINS) * 100;
                const height = ((timeToMins(a.end) - timeToMins(a.time)) / TOTAL_MINS) * 100;
                const prof = getProfessional(a.professionalId);
                const status = appointmentStatusMap[a.status];
                return (
                  <button key={a.id} onClick={() => onSelectClient(a.clientId)}
                    className="absolute left-2 right-2 rounded-lg p-2 text-left hover:brightness-95 transition-all overflow-hidden"
                    style={{
                      top: `${top}%`,
                      height: `calc(${height}% - 4px)`,
                      background: `${prof.color}18`,
                      borderLeft: `3px solid ${prof.color}`,
                      boxShadow: `inset -3px 0 0 ${status.color}`,
                    }}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: status.color }} />
                      <span className="text-xs font-semibold truncate" style={{ color: prof.color }}>
                        {getClient(a.clientId).name}
                      </span>
                    </div>
                    <div className="text-xs truncate" style={{ color: prof.color, opacity: 0.8 }}>
                      {getProcedure(a.procedureId).name}
                    </div>
                    <div className="text-xs truncate mt-0.5" style={{ color: prof.color, opacity: 0.6 }}>
                      {a.time} · {status.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Painel lateral: horários + lista de espera */}
          <div className="w-full md:w-80 shrink-0 md:border-l flex flex-col overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="flex border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
              {([
                ['horarios', `Horários (${filtered.length})`],
                ['espera', `Lista de espera (${waiting.length})`],
              ] as const).map(([id, label]) => (
                <button key={id} onClick={() => setPanel(id)}
                  className="flex-1 px-3 py-3 text-xs font-semibold border-b-2 transition-colors"
                  style={panel === id
                    ? { borderColor: 'var(--primary)', color: 'var(--primary)' }
                    : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-3 space-y-2">
              {panel === 'horarios' && (
                filtered.length === 0 ? (
                  <EmptyState compact Icon={Clock} title="Nenhum horário"
                    description="Esse dia está livre." actionLabel="Agendar" onAction={() => onNavigate('novo-agendamento')} />
                ) : filtered.map(a => {
                  const status = appointmentStatusMap[a.status];
                  return (
                    <div key={a.id} className="p-3 rounded-xl" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Clock size={11} style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-xs tabular-nums font-semibold">{a.time}–{a.end}</span>
                        <span className="ml-auto"><Badge label={status.label} color={status.color} bg={status.bg} /></span>
                      </div>
                      <button onClick={() => onSelectClient(a.clientId)} className="block w-full text-left">
                        <div className="text-sm font-medium truncate">{getClient(a.clientId).name}</div>
                        <div className="text-xs truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          {getProcedure(a.procedureId).name}
                        </div>
                      </button>
                      <div className="flex items-center gap-1 mt-1.5">
                        <User size={10} style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {getProfessional(a.professionalId).shortName} · {a.room}
                        </span>
                      </div>
                      {a.confirmationSentAt && (
                        <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)', opacity: 0.8 }}>
                          Confirmação enviada em {a.confirmationSentAt}
                        </div>
                      )}
                      <button onClick={() => setCancelTarget(a)}
                        className="mt-2 w-full py-2 rounded-lg text-xs font-semibold"
                        style={{ background: '#FEF2F2', color: '#DC2626', minHeight: 36 }}>
                        Cancelar horário
                      </button>
                    </div>
                  );
                })
              )}

              {panel === 'espera' && (
                waiting.length === 0 ? (
                  <EmptyState compact Icon={ListPlus} title="Lista de espera vazia"
                    description="Ninguém aguardando vaga no momento." />
                ) : waiting.map(w => (
                  <div key={w.id} className="p-3 rounded-xl" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
                    <div className="text-sm font-medium truncate">{getClient(w.clientId).name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {getProcedure(w.procedureId).name}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                      Prefere: {periodLabels[w.preferredPeriod]}
                      {w.professionalId ? ` · ${getProfessional(w.professionalId).shortName}` : ' · qualquer profissional'}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', opacity: 0.8 }}>
                      Pediu em {formatBR(w.createdAt)}
                    </div>
                    <button
                      onClick={() => {
                        offerSlotToAll([w.id], 'próxima vaga que abrir');
                        setFlash(`${getClient(w.clientId).name} foi avisada da próxima vaga.`);
                        tick();
                      }}
                      className="mt-2 w-full py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: 'var(--primary)', minHeight: 36 }}>
                      Oferecer vaga
                    </button>
                  </div>
                ))
              )}

              {panel === 'espera' && getWaitlist().some(w => w.offeredFor) && (
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>
                    Vaga já oferecida
                  </div>
                  {getWaitlist().filter(w => w.offeredFor).map(w => (
                    <div key={w.id} className="p-2.5 rounded-xl mb-2 text-xs" style={{ background: 'var(--secondary)' }}>
                      <span className="font-medium">{getClient(w.clientId).name}</span>
                      <span style={{ color: 'var(--muted-foreground)' }}> · aguardando resposta sobre {w.offeredFor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Semana */}
      {view === 'week' && (
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid grid-cols-7 gap-1 min-w-[700px]">
            {daysOfWeek.map((d, i) => {
              const iso = addDays(dateISO, i - toDate(dateISO).getDay());
              const appts = getAppointmentsByDate(iso);
              return (
                <div key={d} className="text-center">
                  <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{d}</div>
                  <div className="text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                    style={iso === TODAY ? { background: 'var(--primary)', color: 'white' } : {}}>
                    {toDate(iso).getDate()}
                  </div>
                  <div className="mt-2 space-y-1 min-h-[200px]">
                    {appts.map(a => {
                      const status = appointmentStatusMap[a.status];
                      return (
                        <div key={a.id} className="text-xs p-1.5 rounded text-left truncate"
                          style={{ background: status.bg, color: status.color }}>
                          {a.time} {getClient(a.clientId).name.split(' ')[0]}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mês */}
      {view === 'month' && (
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden border min-w-[640px]" style={{ borderColor: 'var(--border)' }}>
            {daysOfWeek.map(d => (
              <div key={d} className="text-center py-2 text-xs font-semibold"
                style={{ color: 'var(--muted-foreground)', background: 'var(--secondary)' }}>{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 4;
              const inMonth = day >= 1 && day <= 31;
              const iso = inMonth ? `2026-08-${String(day).padStart(2, '0')}` : '';
              const count = inMonth ? getAppointmentsByDate(iso).length : 0;
              return (
                <button key={i} onClick={() => inMonth && (setDateISO(iso), setView('day'))}
                  className="min-h-[80px] p-1.5 text-sm text-left"
                  style={{ background: inMonth ? 'var(--card)' : 'var(--secondary)', color: inMonth ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1"
                    style={iso === TODAY ? { background: 'var(--primary)', color: 'white' } : {}}>
                    {inMonth ? day : ''}
                  </div>
                  {count > 0 && (
                    <div className="text-xs px-1 py-0.5 rounded truncate" style={{ background: '#0A6E6E18', color: '#0A6E6E' }}>
                      {count} {count === 1 ? 'horário' : 'horários'}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {cancelTarget && (
        <ConfirmModal
          danger
          title="Cancelar este horário?"
          description={`${getClient(cancelTarget.clientId).name} · ${cancelTarget.time} · ${getProcedure(cancelTarget.procedureId).name}. O horário sai da agenda e a vaga fica livre.`}
          confirmLabel="Cancelar horário"
          onConfirm={confirmCancel}
          onCancel={() => setCancelTarget(null)}
        />
      )}

      {offerFor && (
        <ConfirmModal
          title="Abriu uma vaga — oferecer para a lista de espera?"
          description={`Vaga de ${offerFor.time} em ${formatBR(offerFor.date)} com ${getProfessional(offerFor.professionalId).shortName}. Estas clientes seriam avisadas agora:`}
          confirmLabel="Oferecer vaga"
          onConfirm={confirmOffer}
          onCancel={() => setOfferFor(null)}
        >
          {matchWaitlist(offerFor).length === 0 ? (
            <div className="text-xs p-3 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
              Ninguém na lista de espera combina com esse horário. A vaga fica livre na agenda.
            </div>
          ) : (
            <div className="space-y-1.5">
              {matchWaitlist(offerFor).map(w => (
                <div key={w.id} className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)', fontSize: 9 }}>
                    {getClient(w.clientId).initials}
                  </span>
                  <span className="font-medium truncate">{getClient(w.clientId).name}</span>
                  <span className="ml-auto shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                    {periodLabels[w.preferredPeriod]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ConfirmModal>
      )}
    </div>
  );
}
