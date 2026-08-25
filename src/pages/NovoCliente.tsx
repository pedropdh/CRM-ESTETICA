import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import type { Page } from '../types';

interface NovoClienteProps {
  onNavigate: (p: Page) => void;
}

export default function NovoCliente({ onNavigate }: NovoClienteProps) {
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#ECFDF5' }}>
            <Check size={32} style={{ color: '#059669' }} />
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Cliente cadastrado!</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Redirecionando para a lista…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 flex items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <button onClick={() => onNavigate('clientes')} className="p-1.5 rounded-lg hover:bg-secondary" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={18} />
        </button>
        <span className="font-semibold">Novo Cliente</span>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-lg mx-auto space-y-5">
          <div className="p-5 rounded-xl space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Dados Pessoais</h3>
            {[
              { label: 'Nome completo *', placeholder: 'Ana Carolina Medeiros' },
              { label: 'CPF', placeholder: '000.000.000-00' },
              { label: 'Data de nascimento', placeholder: '', type: 'date' },
              { label: 'Telefone *', placeholder: '(11) 99999-9999' },
              { label: 'E-mail', placeholder: 'cliente@email.com' },
            ].map(({ label, placeholder, type }) => (
              <div key={label}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
                <input type={type || 'text'} placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Endereço</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Rua</label>
                <input placeholder="Rua das Flores" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Número</label>
                <input placeholder="123" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Cidade</label>
                <input placeholder="São Paulo" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Estado</label>
                <select className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                  <option>SP</option><option>RJ</option><option>MG</option><option>RS</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl space-y-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Como nos conheceu?</h3>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'Google', 'Indicação', 'WhatsApp', 'Passagem', 'Outros'].map(s => (
                <button key={s} className="px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{ borderColor: 'var(--border)', color: 'var(--secondary-foreground)', background: 'var(--secondary)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onNavigate('clientes')}
              className="flex-1 py-3 rounded-xl text-sm font-medium border"
              style={{ borderColor: 'var(--border)', color: 'var(--secondary-foreground)' }}>Cancelar</button>
            <button onClick={() => { setSaved(true); setTimeout(() => onNavigate('clientes'), 1200); }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--primary)' }}>Salvar Cliente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
