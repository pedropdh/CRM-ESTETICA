import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import type { Page } from '../types';

const professionals = ['Todos', 'Dra. Marina Silva', 'Camila Rocha', 'Paulo Mendes'];

const colors: Record<string, string> = {
  'Dra. Marina Silva': '#0A6E6E',
  'Camila Rocha': '#7C3AED',
  'Paulo Mendes': '#D97706',
};

const appointments = [
  { id: '1', time: '09:00', end: '10:00', client: 'Ana Carolina Medeiros', procedure: 'Toxina Botulínica', prof: 'Dra. Marina Silva', status: 'confirmed', room: 'Sala 1' },
  { id: '2', time: '10:00', end: '10:45', client: 'Fernanda Oliveira', procedure: 'Preenchimento Labial', prof: 'Dra. Marina Silva', status: 'confirmed', room: 'Sala 1' },
  { id: '3', time: '10:30', end: '12:00', client: 'Juliana Torres', procedure: 'Limpeza de Pele Profunda', prof: 'Camila Rocha', status: 'pending', room: 'Sala 2' },
  { id: '4', time: '13:00', end: '14:00', client: 'Roberta Lima', procedure: 'Fio de PDO', prof: 'Paulo Mendes', status: 'confirmed', room: 'Sala 3' },
  { id: '5', time: '14:00', end: '15:30', client: 'Patricia Santos', procedure: 'Bioestimulador de Colágeno', prof: 'Dra. Marina Silva', status: 'confirmed', room: 'Sala 1' },
  { id: '6', time: '15:00', end: '16:00', client: 'Camila Duarte', procedure: 'Drenagem Linfática', prof: 'Camila Rocha', status: 'confirmed', room: 'Sala 2' },
  { id: '7', time: '16:00', end: '16:45', client: 'Tatiana Ferreira', procedure: 'Consulta Avaliação', prof: 'Dra. Marina Silva', status: 'pending', room: 'Sala 1' },
];

const statusColor: Record<string, string> = {
  confirmed: '#059669',
  pending: '#D97706',
  canceled: '#DC2626',
};

const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const today = new Date();

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

interface AgendaProps {
  onNavigate: (p: Page) => void;
}

export default function Agenda({ onNavigate }: AgendaProps) {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [prof, setProf] = useState('Todos');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 23));

  const filtered = prof === 'Todos' ? appointments : appointments.filter(a => a.prof === prof);

  function timeToRow(time: string) {
    const [h, m] = time.split(':').map(Number);
    return (h - 8) * 60 + m;
  }

  function durationMins(start: string, end: string) {
    return timeToRow(end) - timeToRow(start);
  }

  const totalMins = 10 * 60;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-3 flex items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1))}
            className="p-1.5 rounded hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold px-2" style={{ minWidth: 140, textAlign: 'center' }}>
            {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1))}
            className="p-1.5 rounded hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            <ChevronRight size={16} />
          </button>
          <button onClick={() => setCurrentDate(new Date(2026, 7, 23))}
            className="ml-2 px-3 py-1 rounded-lg text-xs font-medium"
            style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
            Hoje
          </button>
        </div>

        <div className="flex ml-auto rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(['day', 'week', 'month'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={view === v ? { background: 'var(--primary)', color: 'white' } : { background: 'var(--card)', color: 'var(--muted-foreground)' }}>
              {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>

        <select value={prof} onChange={e => setProf(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs border outline-none"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
          {professionals.map(p => <option key={p}>{p}</option>)}
        </select>

        <button onClick={() => onNavigate('novo-agendamento')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'var(--primary)' }}>
          <Plus size={14} /> Novo
        </button>
      </div>

      {/* Day view */}
      {view === 'day' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Time grid */}
          <div className="flex flex-1 overflow-auto">
            <div className="w-16 shrink-0 pt-2">
              {hours.map(h => (
                <div key={h} className="h-[60px] flex items-start justify-end pr-3">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{h}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 relative border-l" style={{ borderColor: 'var(--border)' }}>
              {hours.map(h => (
                <div key={h} className="h-[60px] border-b" style={{ borderColor: 'var(--border)' }} />
              ))}
              {/* Current time indicator */}
              <div className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
                style={{ top: `${(9 * 60 + 30) / totalMins * 100}%` }}>
                <div className="w-2 h-2 rounded-full -ml-1" style={{ background: '#EF4444' }} />
                <div className="flex-1 h-px" style={{ background: '#EF4444' }} />
              </div>
              {/* Appointments */}
              {filtered.map(a => {
                const top = timeToRow(a.time) / totalMins * 100;
                const height = durationMins(a.time, a.end) / totalMins * 100;
                const c = colors[a.prof] || '#0A6E6E';
                return (
                  <div key={a.id} className="absolute left-2 right-2 rounded-lg p-2 cursor-pointer hover:brightness-95 transition-all overflow-hidden"
                    style={{ top: `${top}%`, height: `calc(${height}% - 4px)`, background: `${c}18`, borderLeft: `3px solid ${c}` }}>
                    <div className="text-xs font-semibold truncate" style={{ color: c }}>{a.client}</div>
                    <div className="text-xs truncate" style={{ color: c, opacity: 0.8 }}>{a.procedure}</div>
                    <div className="text-xs truncate mt-0.5" style={{ color: c, opacity: 0.6 }}>{a.time} · {a.prof.split(' ')[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: today's list */}
          <div className="w-64 shrink-0 border-l overflow-auto p-4" style={{ borderColor: 'var(--border)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)' }}>
              {filtered.length} agendamentos
            </h4>
            <div className="space-y-2">
              {filtered.map(a => (
                <div key={a.id} className="p-3 rounded-xl cursor-pointer hover:bg-secondary transition-colors"
                  style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={11} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-xs tabular-nums font-semibold">{a.time}–{a.end}</span>
                    <span className="ml-auto w-2 h-2 rounded-full" style={{ background: statusColor[a.status] }} />
                  </div>
                  <div className="text-sm font-medium truncate">{a.client}</div>
                  <div className="text-xs truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{a.procedure}</div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <User size={10} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.prof.split(' ').slice(1).join(' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Week view */}
      {view === 'week' && (
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-7 gap-1 min-w-[700px]">
            {daysOfWeek.map((d, i) => (
              <div key={d} className="text-center">
                <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{d}</div>
                <div className={`text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center mx-auto ${i === 6 ? 'text-white' : ''}`}
                  style={i === 6 ? { background: 'var(--primary)' } : {}}>
                  {17 + i}
                </div>
                <div className="mt-2 space-y-1 min-h-[200px]">
                  {appointments.filter((_, idx) => idx % 7 === i).slice(0, 3).map(a => (
                    <div key={a.id} className="text-xs p-1.5 rounded text-left truncate"
                      style={{ background: `${colors[a.prof] || '#0A6E6E'}18`, color: colors[a.prof] || '#0A6E6E' }}>
                      {a.time} {a.client.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month view */}
      {view === 'month' && (
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            {daysOfWeek.map(d => (
              <div key={d} className="text-center py-2 text-xs font-semibold" style={{ color: 'var(--muted-foreground)', background: 'var(--secondary)' }}>{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 4;
              const inMonth = day >= 1 && day <= 31;
              const isToday = day === 23;
              return (
                <div key={i} className="min-h-[80px] p-1.5 text-sm"
                  style={{ background: inMonth ? 'var(--card)' : 'var(--secondary)', color: inMonth ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1 ${isToday ? 'text-white' : ''}`}
                    style={isToday ? { background: 'var(--primary)' } : {}}>
                    {inMonth ? day : ''}
                  </div>
                  {inMonth && day % 3 === 0 && (
                    <div className="text-xs px-1 py-0.5 rounded truncate" style={{ background: '#0A6E6E18', color: '#0A6E6E' }}>
                      {day % 2 === 0 ? 3 : 2} aptos
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
