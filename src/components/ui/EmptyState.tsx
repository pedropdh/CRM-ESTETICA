interface EmptyStateProps {
  Icon: any;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

/**
 * Estado vazio reutilizável (antes era a página `EstadoVazio`).
 * Use em listas, abas e painéis sem conteúdo.
 */
export default function EmptyState({ Icon, title, description, actionLabel, onAction, compact }: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center ${compact ? 'py-8' : 'flex-1 py-14'} px-6`}>
      <div className="text-center max-w-xs">
        <div className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} rounded-2xl flex items-center justify-center mx-auto mb-4`}
          style={{ background: 'var(--secondary)' }}>
          <Icon size={compact ? 22 : 28} style={{ color: 'var(--muted-foreground)' }} />
        </div>
        <h3 className="font-bold mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
        {actionLabel && onAction && (
          <button onClick={onAction}
            className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--primary)' }}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
