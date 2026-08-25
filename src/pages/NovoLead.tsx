import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import type { Page } from '../types';

interface NovoLeadProps {
  onNavigate: (p: Page) => void;
}

export default function NovoLead({ onNavigate }: NovoLeadProps) {
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#ECFDF5' }}>
            <Check size={32} style={{ color: '#059669' }} />
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lead cadastrado!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 flex items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <button onClick={() => onNavigate('leads')} className="p-1.5 rounded-lg hover:bg-secondary" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={18} />
        </button>
        <span className="font-semibold">Novo Lead</span>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-md mx-auto space-y-5">
          <div className="p-5 rounded-xl space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Informações do Lead</h3>
            {[
              { label: 'Nome *', placeholder: 'Nome do lead' },
              { label: 'Telefone / WhatsApp *', placeholder: '(11) 99999-9999' },
              { label: 'E-mail', placeholder: 'email@exemplo.com' },
            ].map(({ label, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
                <input placeholder={placeholder} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Procedimento de interesse</label>
                <select className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                  <option>Selecionar…</option>
                  {['Toxina Botulínica', 'Preenchimento Labial', 'Limpeza de Pele', 'Bioestimulador', 'Fio de PDO'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Origem</label>
                <select className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                  {['Instagram', 'Google Ads', 'Indicação', 'WhatsApp', 'Passagem', 'Outros'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Observações</label>
              <textarea rows={3} placeholder="Interesse demonstrado, orçamento estimado, etc."
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onNavigate('leads')}
              className="flex-1 py-3 rounded-xl text-sm font-medium border"
              style={{ borderColor: 'var(--border)', color: 'var(--secondary-foreground)' }}>Cancelar</button>
            <button onClick={() => { setSaved(true); setTimeout(() => onNavigate('leads'), 1000); }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--primary)' }}>Salvar Lead</button>
          </div>
        </div>
      </div>
    </div>
  );
}
