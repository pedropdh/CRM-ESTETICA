interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

/** Interruptor ligado/desligado usado nas automações e no agendamento. */
export default function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className="w-full flex items-center gap-3 text-left"
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <span className="w-10 h-6 rounded-full relative shrink-0 transition-colors"
        style={{ background: checked ? 'var(--primary)' : '#CBD5E1' }}>
        <span className="w-4.5 h-4.5 bg-white rounded-full absolute top-0.5 shadow transition-all"
          style={{ width: 18, height: 18, left: checked ? 20 : 3 }} />
      </span>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-medium">{label}</span>}
          {description && (
            <span className="block text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{description}</span>
          )}
        </span>
      )}
    </button>
  );
}
