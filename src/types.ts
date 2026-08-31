// Tipos compartilhados do protótipo.
// O catálogo de dados (planos, clientes, agenda, automações) vive em
// `src/data/mock.ts` — este arquivo só declara as formas.

export type Plan = 'essencial' | 'crescimento';

export type Page =
  | 'login'
  | 'onboarding'
  | 'hoje'
  | 'agenda'
  | 'novo-agendamento'
  | 'clientes'
  | 'cliente-detalhe'
  | 'novo-cliente'
  | 'whatsapp'
  | 'leads'
  | 'novo-lead'
  | 'configuracoes'
  | 'perfil';

export type UserRole = 'dona' | 'profissional' | 'recepcao';

export type AppointmentStatus =
  | 'pendente'
  | 'confirmado'
  | 'nao_confirmado'
  | 'recusado'
  | 'concluido'
  | 'falta'
  | 'cancelado';

export type MessageCategory = 'utilidade' | 'marketing' | 'servico';

export type LeadStage = 'novo' | 'contato' | 'proposta' | 'agendado' | 'ganho' | 'perdido';

export type PreferredPeriod = 'manha' | 'tarde' | 'qualquer';

export interface PlanInfo {
  id: Plan;
  name: string;
  price: number;
  /** Profissionais já inclusos na mensalidade. */
  professionalsIncluded: number;
  /** Teto de profissionais do plano. */
  professionalsMax: number;
  /** Preço mensal de cada profissional acima do incluído. */
  extraProfessionalPrice: number;
  /** Franquia mensal de mensagens de marketing (só marketing conta). */
  marketingQuota: number;
  tagline: string;
  features: string[];
}

export interface Professional {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  color: string;
  specialty: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Preenchido quando o usuário também atende (tem agenda). */
  professionalId?: string;
}

export interface Procedure {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  commissionPct: number;
  /** Intervalo recomendado até o retorno, em dias. Base do recall. */
  returnIntervalDays: number;
}

export interface ClinicalEntry {
  date: string;
  procedureId: string;
  professionalId: string;
  value: number;
  payment: string;
  notes: string;
}

export interface AnamneseItem {
  question: string;
  answer: string;
}

export interface ClientPhoto {
  session: string;
  label: string;
  url: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  initials: string;
  birthdate: string;
  address: string;
  since: string;
  stage: 'VIP' | 'Frequente' | 'Regular' | 'Nova';
  /** Última visita em ISO (YYYY-MM-DD). */
  lastVisit: string;
  totalSpent: number;
  notes: string;
  allergies: string;
  anamnese: AnamneseItem[];
  photos: ClientPhoto[];
  history: ClinicalEntry[];
}

export interface Appointment {
  id: string;
  /** ISO YYYY-MM-DD. */
  date: string;
  time: string;
  end: string;
  clientId: string;
  procedureId: string;
  professionalId: string;
  room: string;
  status: AppointmentStatus;
  /** Quando a mensagem de confirmação saiu; null = ainda não enviada. */
  confirmationSentAt: string | null;
}

export interface WaitlistEntry {
  id: string;
  clientId: string;
  procedureId: string;
  professionalId?: string;
  preferredPeriod: PreferredPeriod;
  createdAt: string;
  offeredFor?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  from: 'clinic' | 'client';
  text: string;
  time: string;
  read: boolean;
  category: MessageCategory;
  /** Usuário que respondeu (inbox multiatendente, só no Crescimento). */
  authorId?: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  lastPreview: string;
  lastTime: string;
  unread: number;
  online: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  procedureId: string;
  source: string;
  value: number;
  stage: LeadStage;
  date: string;
  initials: string;
}

export interface AutomationParam {
  id: string;
  label: string;
  value: string;
  options?: string[];
}

export interface AutomationStep {
  trigger: string;
  outcome: string;
  tone: 'positivo' | 'neutro' | 'atencao';
}

export interface Automation {
  id: string;
  name: string;
  summary: string;
  icon: string;
  enabled: boolean;
  category: MessageCategory;
  /** Automação exclusiva do plano Crescimento. */
  requiresCrescimento?: boolean;
  params: AutomationParam[];
  template: string;
  /** "O que acontece" — a sequência que explica o funcionamento. */
  sequence: AutomationStep[];
  /** Mensagens que essa regra já disparou no mês. */
  sentThisMonth: number;
}
