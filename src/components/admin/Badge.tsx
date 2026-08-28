import { CircleDot } from 'lucide-react';

interface BadgeProps {
  label: string;
  color: string;
  bg: string;
  dot?: boolean;
}

export default function Badge({ label, color, bg, dot }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ background: bg, color }}>
      {dot && <CircleDot size={9} />}
      {label}
    </span>
  );
}

// Shared status → { label, color, bg } maps used across admin pages.

export const clinicStatusMap = {
  ativa: { label: 'Ativa', color: '#16A34A', bg: '#F0FDF4' },
  trial: { label: 'Trial', color: '#0891B2', bg: '#E0F7FA' },
  inadimplente: { label: 'Inadimplente', color: '#DC2626', bg: '#FEF2F2' },
  cancelada: { label: 'Cancelada', color: '#64748B', bg: '#F1F5F9' },
  suspensa: { label: 'Suspensa', color: '#D97706', bg: '#FFF7ED' },
} as const;

export const userStatusMap = {
  ativo: { label: 'Ativo', color: '#16A34A', bg: '#F0FDF4' },
  bloqueado: { label: 'Bloqueado', color: '#DC2626', bg: '#FEF2F2' },
} as const;

export const userRoleMap = {
  admin: { label: 'Administrador', color: '#4F46E5', bg: '#EEF2FF' },
  profissional: { label: 'Profissional', color: '#0891B2', bg: '#E0F7FA' },
  recepcao: { label: 'Recepção', color: '#7C3AED', bg: '#F5F3FF' },
} as const;

export const whatsappStatusMap = {
  conectado: { label: 'Conectado', color: '#16A34A', bg: '#F0FDF4' },
  desconectado: { label: 'Desconectado', color: '#64748B', bg: '#F1F5F9' },
  erro: { label: 'Erro', color: '#DC2626', bg: '#FEF2F2' },
  aguardando: { label: 'Aguardando conexão', color: '#D97706', bg: '#FFF7ED' },
} as const;

export const ticketPriorityMap = {
  baixa: { label: 'Baixa', color: '#64748B', bg: '#F1F5F9' },
  normal: { label: 'Normal', color: '#0891B2', bg: '#E0F7FA' },
  alta: { label: 'Alta', color: '#D97706', bg: '#FFF7ED' },
  urgente: { label: 'Urgente', color: '#DC2626', bg: '#FEF2F2' },
} as const;

export const ticketStatusMap = {
  aberto: { label: 'Aberto', color: '#DC2626', bg: '#FEF2F2' },
  em_atendimento: { label: 'Em atendimento', color: '#D97706', bg: '#FFF7ED' },
  aguardando_cliente: { label: 'Aguardando cliente', color: '#0891B2', bg: '#E0F7FA' },
  resolvido: { label: 'Resolvido', color: '#16A34A', bg: '#F0FDF4' },
} as const;

export function usageColor(pct: number) {
  if (pct >= 90) return '#DC2626';
  if (pct >= 70) return '#D97706';
  return '#16A34A';
}
