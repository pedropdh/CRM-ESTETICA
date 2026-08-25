import { Calendar, Plus } from 'lucide-react';
import type { Page } from '../types';

interface EstadoVazioProps {
  onNavigate: (p: Page) => void;
}

export default function EstadoVazio({ onNavigate }: EstadoVazioProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'var(--secondary)' }}>
          <Calendar size={36} style={{ color: 'var(--muted-foreground)' }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          Nenhum agendamento hoje
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Sua agenda está livre por agora. Que tal aproveitar para agendar novos clientes?
        </p>
        <button onClick={() => onNavigate('novo-agendamento')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white mx-auto"
          style={{ background: 'var(--primary)' }}>
          <Plus size={16} /> Novo Agendamento
        </button>
      </div>
    </div>
  );
}
