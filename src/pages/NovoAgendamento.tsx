import { useState } from 'react';
import { ArrowLeft, Check, Search } from 'lucide-react';
import type { Page } from '../types';
import {
  TODAY, addDays, addAppointment, getClients, getProcedures, getProfessionals,
} from '../data/mock';
import Toggle from '../components/ui/Toggle';
import WhatsBubble from '../components/ui/WhatsBubble';

interface NovoAgendamentoProps {
  onNavigate: (p: Page) => void;
}

const times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

/** Cliente → procedimento → profissional → data/hora, tudo numa tela só. */
export default function NovoAgendamento({ onNavigate }: NovoAgendamentoProps) {
  const [saved, setSaved] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientId, setClientId] = useState('');
  const [procedureId, setProcedureId] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [date, setDate] = useState(addDays(TODAY, 1));
  const [time, setTime] = useState('');
  const [autoConfirm, setAutoConfirm] = useState(true);

  const clients = getClients();
  const matches = clientSearch
    ? clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.phone.includes(clientSearch))
    : [];
  const selectedClient = clients.find(c => c.id === clientId);
  const ready = clientId && procedureId && professionalId && time;

  function save() {
    addAppointment({ date, time, clientId, procedureId, professionalId, autoConfirm });
    setSaved(true);
    setTimeout(() => onNavigate('agenda'), 1200);
  }

  if (saved) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#ECFDF5' }}>
            <Check size={30} style={{ color: '#059669' }} />
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Horário marcado</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {autoConfirm ? 'A confirmação sai 24h antes.' : 'Sem confirmação automática.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 md:px-6 py-3 flex items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <button onClick={() => onNavigate('agenda')} className="p-2 rounded-lg hover:bg-secondary transition-colors"
          style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={18} />
        </button>
        <span className="font-semibold text-sm">Novo agendamento</span>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-lg mx-auto space-y-4 pb-6">

          {/* 1. Cliente */}
          <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>1. Cliente</h3>
            {selectedClient ? (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#E0F2F1' }}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{selectedClient.initials}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{selectedClient.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedClient.phone}</div>
                </div>
                <button onClick={() => { setClientId(''); setClientSearch(''); }}
                  className="text-xs font-semibold shrink-0" style={{ color: 'var(--primary)' }}>Trocar</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                  <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
                  <input value={clientSearch} onChange={e => setClientSearch(e.target.value)}
                    placeholder="Buscar por nome ou telefone…"
                    className="flex-1 text-sm bg-transparent outline-none" style={{ color: 'var(--foreground)' }} />
                </div>
                {matches.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {matches.map(c => (
                      <button key={c.id} onClick={() => { setClientId(c.id); setClientSearch(''); }}
                        className="w-full flex items-center gap-2 p-2.5 rounded-lg text-left hover:bg-secondary transition-colors"
                        style={{ minHeight: 44 }}>
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{c.initials}</span>
                        <span className="text-sm truncate">{c.name}</span>
                        <span className="ml-auto text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{c.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={() => onNavigate('novo-cliente')}
                  className="mt-2 text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                  + Cadastrar cliente nova
                </button>
              </>
            )}
          </div>

          {/* 2. Procedimento */}
          <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>2. Procedimento</h3>
            <select value={procedureId} onChange={e => setProcedureId(e.target.value)}
              className="w-full px-3 py-3 rounded-lg text-sm outline-none"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
              <option value="">Escolher…</option>
              {getProcedures().map(p => (
                <option key={p.id} value={p.id}>{p.name} — {p.durationMin} min</option>
              ))}
            </select>
          </div>

          {/* 3. Profissional */}
          <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>3. Profissional</h3>
            <div className="flex gap-2">
              {getProfessionals().map(p => (
                <button key={p.id} onClick={() => setProfessionalId(p.id)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-medium"
                  style={professionalId === p.id
                    ? { background: 'var(--primary)', color: 'white', minHeight: 44 }
                    : { background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid var(--border)', minHeight: 44 }}>
                  {p.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Data e horário */}
          <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>4. Data e horário</h3>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-3 rounded-lg text-sm outline-none mb-3"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
            <div className="flex flex-wrap gap-2">
              {times.map(t => (
                <button key={t} onClick={() => setTime(t)}
                  className="px-3 py-2 rounded-lg text-xs font-medium"
                  style={time === t
                    ? { background: 'var(--primary)', color: 'white', minHeight: 40 }
                    : { background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid var(--border)', minHeight: 40 }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Confirmação automática — ligada por padrão */}
          <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <Toggle checked={autoConfirm} onChange={setAutoConfirm}
              label="Confirmar por WhatsApp 24h antes"
              description="A cliente responde SIM ou NÃO e a agenda se atualiza sozinha." />
            {autoConfirm && (
              <div className="mt-3">
                <WhatsBubble framed time="09:00"
                  text={`Oi ${selectedClient ? selectedClient.name.split(' ')[0] : '{nome}'}! Confirmando seu horário de amanhã às ${time || '{horario}'}. Responda SIM para confirmar ou NÃO para liberar o horário. 💚`} />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => onNavigate('agenda')}
              className="flex-1 py-3 rounded-xl text-sm font-medium border"
              style={{ borderColor: 'var(--border)', color: 'var(--secondary-foreground)', minHeight: 48 }}>
              Cancelar
            </button>
            <button onClick={save} disabled={!ready}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: ready ? 'var(--primary)' : '#CBD5E1', minHeight: 48 }}>
              Marcar horário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
