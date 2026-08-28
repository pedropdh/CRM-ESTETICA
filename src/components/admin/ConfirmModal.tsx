import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ title, description, confirmLabel, danger, onConfirm, onCancel }: ConfirmModalProps) {
  const color = danger ? '#DC2626' : '#4F46E5';
  const bg = danger ? '#FEF2F2' : '#EEF2FF';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,27,42,0.5)' }} onClick={onCancel}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: 'var(--card)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
            <AlertTriangle size={19} style={{ color }} />
          </div>
          <button onClick={onCancel} className="p-1 rounded hover:bg-secondary transition-colors">
            <X size={16} style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>
        <h3 className="text-base font-bold mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{title}</h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: color }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
