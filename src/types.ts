export type Plan = 'start' | 'pro' | 'business' | 'redes';

export type Page =
  | 'login'
  | 'forgot-password'
  | 'onboarding'
  | 'dashboard'
  | 'agenda'
  | 'novo-agendamento'
  | 'detalhe-agendamento'
  | 'clientes'
  | 'cliente-detalhe'
  | 'novo-cliente'
  | 'leads'
  | 'novo-lead'
  | 'campanhas'
  | 'financeiro'
  | 'mensagens'
  | 'relatorios'
  | 'configuracoes'
  | 'notificacoes'
  | 'perfil'
  | 'estado-vazio'
  | 'acesso-negado'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-clinica-detalhe'
  | 'admin-usuarios'
  | 'admin-planos'
  | 'admin-assinaturas'
  | 'admin-whatsapp'
  | 'admin-uso'
  | 'admin-suporte'
  | 'admin-logs'
  | 'admin-configuracoes';

export interface NavItem {
  id: Page;
  label: string;
  icon: string;
  badge?: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  procedure: string;
  professional: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'canceled' | 'completed' | 'no-show';
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  procedure: string;
  source: string;
  value: number;
  stage: 'novo' | 'contato' | 'proposta' | 'agendado' | 'ganho' | 'perdido';
  date: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  procedure: string;
  lastVisit: string;
  totalSpent: number;
  status: 'ativo' | 'inativo' | 'prospect';
  stage: string;
}
