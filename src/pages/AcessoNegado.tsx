import { Lock } from 'lucide-react';
import type { Page } from '../types';

interface AcessoNegadoProps {
  onNavigate: (p: Page) => void;
}

export default function AcessoNegado({ onNavigate }: AcessoNegadoProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: '#FEF2F2' }}>
          <Lock size={36} style={{ color: '#DC2626' }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          Acesso Restrito
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Você não tem permissão para acessar esta área. Solicite ao administrador da clínica as permissões necessárias.
        </p>
        <button onClick={() => onNavigate('dashboard')}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white mx-auto"
          style={{ background: 'var(--primary)' }}>
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
