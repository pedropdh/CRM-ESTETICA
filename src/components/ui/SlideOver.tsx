import { X } from 'lucide-react';

interface SlideOverProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlideOver({ title, subtitle, onClose, children }: SlideOverProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(13,27,42,0.4)' }} onClick={onClose}>
      <div className="w-full max-w-md h-full overflow-y-auto flex flex-col" style={{ background: 'var(--card)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="text-sm font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{title}</div>
            {subtitle && <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X size={16} style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>
        <div className="flex-1 p-5">{children}</div>
      </div>
    </div>
  );
}
