import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import type { Page } from '../types';

interface NovoAgendamentoProps {
  onNavigate: (p: Page) => void;
}

const professionals = ['Dra. Marina Silva', 'Camila Rocha', 'Paulo Mendes'];
const procedures = ['Toxina Botulínica', 'Preenchimento Labial', 'Limpeza de Pele', 'Bioestimulador de Colágeno', 'Fio de PDO', 'Drenagem Linfática', 'Consulta Avaliação'];
const times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

export default function NovoAgendamento({ onNavigate }: NovoAgendamentoProps) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    client: '',
    procedure: '',
    professional: '',
    date: '2026-08-26',
    time: '',
    room: 'Sala 1',
    notes: '',
    sendReminder: true,
  });

  function update(k: string, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => onNavigate('agenda'), 1200);
  }

  if (saved) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#ECFDF5' }}>
            <Check size={32} style={{ color: '#059669' }} />
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Agendamento criado!</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Redirecionando para a agenda…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 flex items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <button onClick={() => onNavigate('agenda')} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={18} />
        </button>
        <span className="font-semibold">Novo Agendamento</span>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-lg mx-auto space-y-5">
          {/* Client */}
          <div className="p-5 rounded-xl space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Cliente</h3>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Nome ou telefone do cliente *</label>
              <input value={form.client} onChange={e => update('client', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                placeholder="Buscar cliente existente ou novo…" />
            </div>
          </div>

          {/* Procedure + Professional */}
          <div className="p-5 rounded-xl space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Serviço & Profissional</h3>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Procedimento *</label>
              <select value={form.procedure} onChange={e => update('procedure', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                <option value="">Selecionar procedimento…</option>
                {procedures.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Profissional *</label>
              <div className="flex gap-2">
                {professionals.map(p => (
                  <button key={p} onClick={() => update('professional', p)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium transition-colors text-center"
                    style={form.professional === p
                      ? { background: 'var(--primary)', color: 'white' }
                      : { background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid var(--border)' }}>
                    {p.split(' ').slice(-1)[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date + Time */}
          <div className="p-5 rounded-xl space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Data & Horário</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Data *</label>
                <input type="date" value={form.date} onChange={e => update('date', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Sala</label>
                <select value={form.room} onChange={e => update('room', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                  {['Sala 1', 'Sala 2', 'Sala 3'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Horário *</label>
              <div className="flex flex-wrap gap-2">
                {times.map(t => (
                  <button key={t} onClick={() => update('time', t)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={form.time === t
                      ? { background: 'var(--primary)', color: 'white' }
                      : { background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid var(--border)' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes + reminder */}
          <div className="p-5 rounded-xl space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Observações</h3>
            <textarea value={form.notes} onChange={e => update('notes', e.target.value)}
              rows={3} placeholder="Anotações para o profissional…"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.sendReminder} onChange={e => update('sendReminder', e.target.checked)} className="rounded" />
              <span className="text-sm">Enviar lembrete automático por WhatsApp 24h antes</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onNavigate('agenda')}
              className="flex-1 py-3 rounded-xl text-sm font-medium border"
              style={{ borderColor: 'var(--border)', color: 'var(--secondary-foreground)' }}>
              Cancelar
            </button>
            <button onClick={handleSave}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--primary)' }}>
              Criar Agendamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
