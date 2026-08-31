import { CircleDot } from 'lucide-react';

interface BadgeProps {
  label: string;
  color: string;
  bg: string;
  dot?: boolean;
}

/**
 * Pílula de status. Os mapas status → { label, color, bg } vivem em
 * `src/data/mock.ts` (appointmentStatusMap, leadStageMap, messageCategoryMap)
 * para não haver duas versões da mesma cor.
 */
export default function Badge({ label, color, bg, dot }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ background: bg, color }}>
      {dot && <CircleDot size={9} />}
      {label}
    </span>
  );
}

/** Verde / âmbar / vermelho para barras de consumo. */
export function usageColor(pct: number) {
  if (pct >= 90) return '#DC2626';
  if (pct >= 70) return '#D97706';
  return '#16A34A';
}
