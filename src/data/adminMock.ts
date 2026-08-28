// ---------------------------------------------------------------------------
// Central mock data layer for the Lumina SaaS admin panel.
//
// Every admin page reads from the accessor functions below instead of
// declaring its own arrays, so the numbers stay consistent across screens
// (a clinic's plan, status and usage are the same in Clínicas, Assinaturas,
// Uso & Consumo, etc).
//
// This is intentionally shaped like a tiny repository layer — swapping the
// bodies of the `get*` functions for Supabase queries later shouldn't
// require touching any page component.
// ---------------------------------------------------------------------------

// `SaasPlanId` is the same tier identifier used by the clinic-facing app
// (`Plan` in ../types) — one plan catalog for the whole product, so a
// clinic's plan means the same thing in the admin panel and inside its
// own CRM.
import type { Plan } from '../types';
export type SaasPlanId = Plan;

export interface SaasPlan {
  id: SaasPlanId;
  name: string;
  price: number;
  professionals: number; // -1 = ilimitado
  users: number;
  clients: number;
  appointments: number; // por mês
  whatsapp: boolean;
  ai: boolean;
  storageGb: number;
  status: 'ativo' | 'inativo';
}

export const plans: SaasPlan[] = [
  { id: 'start', name: 'Start', price: 97, professionals: 2, users: 3, clients: 300, appointments: 150, whatsapp: false, ai: false, storageGb: 1, status: 'ativo' },
  { id: 'pro', name: 'Pro', price: 247, professionals: 5, users: 8, clients: 2000, appointments: 800, whatsapp: true, ai: false, storageGb: 5, status: 'ativo' },
  { id: 'business', name: 'Business', price: 497, professionals: 12, users: 20, clients: 6000, appointments: 2500, whatsapp: true, ai: true, storageGb: 20, status: 'ativo' },
  { id: 'redes', name: 'Redes', price: 890, professionals: -1, users: -1, clients: -1, appointments: -1, whatsapp: true, ai: true, storageGb: 100, status: 'ativo' },
];

export type ClinicStatus = 'ativa' | 'trial' | 'inadimplente' | 'cancelada' | 'suspensa';

export interface ClinicUsage {
  professionals: number;
  users: number;
  clients: number;
  appointments: number;
  storageGb: number;
  aiTokens: number;
}

export interface Clinic {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  city: string;
  planId: SaasPlanId;
  status: ClinicStatus;
  mrr: number;
  since: string;
  lastActive: string;
  usage: ClinicUsage;
}

export const clinics: Clinic[] = [
  { id: '1', name: 'Clínica Lumina', owner: 'Dra. Marina Silva', email: 'marina@lumina.com.br', phone: '(11) 98765-4321', city: 'São Paulo, SP', planId: 'pro', status: 'ativa', mrr: 247, since: '12/01/2025', lastActive: 'Hoje', usage: { professionals: 4, users: 6, clients: 1248, appointments: 536, storageGb: 3.1, aiTokens: 0 } },
  { id: '2', name: 'Studio Bella Pele', owner: 'Dra. Camila Torres', email: 'camila@bellapele.com.br', phone: '(41) 99123-4567', city: 'Curitiba, PR', planId: 'redes', status: 'ativa', mrr: 890, since: '03/11/2024', lastActive: 'Hoje', usage: { professionals: 18, users: 24, clients: 4820, appointments: 2110, storageGb: 41, aiTokens: 812000 } },
  { id: '3', name: 'Espaço Renove', owner: 'Juliana Prado', email: 'juliana@espacorenove.com.br', phone: '(31) 98877-1122', city: 'Belo Horizonte, MG', planId: 'start', status: 'trial', mrr: 0, since: '20/08/2026', lastActive: 'Ontem', usage: { professionals: 1, users: 1, clients: 42, appointments: 51, storageGb: 0.2, aiTokens: 0 } },
  { id: '4', name: 'Vita Estética', owner: 'Dr. Rafael Nunes', email: 'rafael@vitaestetica.com.br', phone: '(51) 99234-5566', city: 'Porto Alegre, RS', planId: 'pro', status: 'inadimplente', mrr: 247, since: '15/04/2025', lastActive: '5 dias atrás', usage: { professionals: 5, users: 7, clients: 1830, appointments: 728, storageGb: 4.6, aiTokens: 0 } },
  { id: '5', name: 'Derma Prime', owner: 'Dra. Isabela Rocha', email: 'isabela@dermaprime.com.br', phone: '(11) 97765-8899', city: 'São Paulo, SP', planId: 'start', status: 'ativa', mrr: 97, since: '28/06/2025', lastActive: 'Hoje', usage: { professionals: 2, users: 2, clients: 174, appointments: 87, storageGb: 0.6, aiTokens: 0 } },
  { id: '6', name: 'Clínica Aurora', owner: 'Dra. Beatriz Lima', email: 'beatriz@clinicaaurora.com.br', phone: '(81) 98123-9900', city: 'Recife, PE', planId: 'redes', status: 'ativa', mrr: 890, since: '02/02/2025', lastActive: '2 dias atrás', usage: { professionals: 9, users: 14, clients: 2960, appointments: 1240, storageGb: 22, aiTokens: 395000 } },
  { id: '7', name: 'Pura Estética', owner: 'Fernanda Alves', email: 'fernanda@puraestetica.com.br', phone: '(71) 99345-2211', city: 'Salvador, BA', planId: 'pro', status: 'cancelada', mrr: 0, since: '10/09/2024', lastActive: '40 dias atrás', usage: { professionals: 0, users: 0, clients: 940, appointments: 0, storageGb: 2.8, aiTokens: 0 } },
  { id: '8', name: 'Bioforma Clínica', owner: 'Dr. Thiago Ramos', email: 'thiago@bioformaclinica.com.br', phone: '(48) 98456-7788', city: 'Florianópolis, SC', planId: 'start', status: 'ativa', mrr: 97, since: '19/07/2025', lastActive: 'Hoje', usage: { professionals: 2, users: 3, clients: 288, appointments: 144, storageGb: 0.9, aiTokens: 0 } },
  { id: '9', name: 'Clínica Vitalle', owner: 'Dra. Renata Cardoso', email: 'renata@clinicavitalle.com.br', phone: '(21) 99567-3344', city: 'Rio de Janeiro, RJ', planId: 'business', status: 'suspensa', mrr: 497, since: '05/05/2025', lastActive: '18 dias atrás', usage: { professionals: 8, users: 11, clients: 3100, appointments: 60, storageGb: 12, aiTokens: 154000 } },
];

export function getClinics() { return clinics; }
export function getClinic(id: string) { return clinics.find(c => c.id === id); }
export function getPlan(id: SaasPlanId) { return plans.find(p => p.id === id)!; }
export function getPlans() { return plans; }
export function clinicsOnPlan(id: SaasPlanId) { return clinics.filter(c => c.planId === id).length; }

export function usagePct(clinic: Clinic, key: keyof ClinicUsage) {
  const plan = getPlan(clinic.planId);
  const limitMap: Record<keyof ClinicUsage, number> = {
    professionals: plan.professionals,
    users: plan.users,
    clients: plan.clients,
    appointments: plan.appointments,
    storageGb: plan.storageGb,
    aiTokens: 1_000_000, // fictitious monthly AI token allowance
  };
  const limit = limitMap[key];
  if (limit < 0) return 0; // unlimited
  return Math.min(100, Math.round((clinic.usage[key] / limit) * 100));
}

export function overallUsagePct(clinic: Clinic) {
  return Math.round(
    (usagePct(clinic, 'professionals') + usagePct(clinic, 'users') + usagePct(clinic, 'clients') + usagePct(clinic, 'appointments')) / 4
  );
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export type UserRole = 'admin' | 'profissional' | 'recepcao';
export type UserStatus = 'ativo' | 'bloqueado';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  clinicId: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
  createdAt: string;
}

export const users: AdminUserRecord[] = [
  { id: 'u1', name: 'Marina Silva', email: 'marina@lumina.com.br', clinicId: '1', role: 'admin', status: 'ativo', lastAccess: 'Hoje, 09:12', createdAt: '12/01/2025' },
  { id: 'u2', name: 'Camila Rocha', email: 'camila.rocha@lumina.com.br', clinicId: '1', role: 'profissional', status: 'ativo', lastAccess: 'Hoje, 08:40', createdAt: '02/02/2025' },
  { id: 'u3', name: 'Paulo Mendes', email: 'paulo@lumina.com.br', clinicId: '1', role: 'profissional', status: 'ativo', lastAccess: 'Ontem', createdAt: '14/03/2025' },
  { id: 'u4', name: 'Larissa Gomes', email: 'larissa@lumina.com.br', clinicId: '1', role: 'recepcao', status: 'ativo', lastAccess: 'Hoje, 07:55', createdAt: '20/01/2025' },
  { id: 'u5', name: 'Camila Torres', email: 'camila@bellapele.com.br', clinicId: '2', role: 'admin', status: 'ativo', lastAccess: 'Hoje, 10:02', createdAt: '03/11/2024' },
  { id: 'u6', name: 'Bruno Castro', email: 'bruno@bellapele.com.br', clinicId: '2', role: 'profissional', status: 'ativo', lastAccess: 'Hoje, 09:30', createdAt: '05/11/2024' },
  { id: 'u7', name: 'Aline Duarte', email: 'aline@bellapele.com.br', clinicId: '2', role: 'profissional', status: 'bloqueado', lastAccess: '12 dias atrás', createdAt: '18/12/2024' },
  { id: 'u8', name: 'Sofia Martins', email: 'sofia@bellapele.com.br', clinicId: '2', role: 'recepcao', status: 'ativo', lastAccess: 'Hoje, 08:15', createdAt: '22/12/2024' },
  { id: 'u9', name: 'Juliana Prado', email: 'juliana@espacorenove.com.br', clinicId: '3', role: 'admin', status: 'ativo', lastAccess: 'Ontem', createdAt: '20/08/2026' },
  { id: 'u10', name: 'Rafael Nunes', email: 'rafael@vitaestetica.com.br', clinicId: '4', role: 'admin', status: 'ativo', lastAccess: '5 dias atrás', createdAt: '15/04/2025' },
  { id: 'u11', name: 'Priscila Nogueira', email: 'priscila@vitaestetica.com.br', clinicId: '4', role: 'profissional', status: 'ativo', lastAccess: '6 dias atrás', createdAt: '20/04/2025' },
  { id: 'u12', name: 'Diego Farias', email: 'diego@vitaestetica.com.br', clinicId: '4', role: 'recepcao', status: 'ativo', lastAccess: '5 dias atrás', createdAt: '02/05/2025' },
  { id: 'u13', name: 'Isabela Rocha', email: 'isabela@dermaprime.com.br', clinicId: '5', role: 'admin', status: 'ativo', lastAccess: 'Hoje, 11:05', createdAt: '28/06/2025' },
  { id: 'u14', name: 'Marcos Vieira', email: 'marcos@dermaprime.com.br', clinicId: '5', role: 'profissional', status: 'ativo', lastAccess: 'Hoje, 10:50', createdAt: '01/07/2025' },
  { id: 'u15', name: 'Beatriz Lima', email: 'beatriz@clinicaaurora.com.br', clinicId: '6', role: 'admin', status: 'ativo', lastAccess: '2 dias atrás', createdAt: '02/02/2025' },
  { id: 'u16', name: 'Otávio Barreto', email: 'otavio@clinicaaurora.com.br', clinicId: '6', role: 'profissional', status: 'ativo', lastAccess: '2 dias atrás', createdAt: '10/02/2025' },
  { id: 'u17', name: 'Vanessa Reis', email: 'vanessa@clinicaaurora.com.br', clinicId: '6', role: 'recepcao', status: 'ativo', lastAccess: '3 dias atrás', createdAt: '15/02/2025' },
  { id: 'u18', name: 'Fernanda Alves', email: 'fernanda@puraestetica.com.br', clinicId: '7', role: 'admin', status: 'bloqueado', lastAccess: '40 dias atrás', createdAt: '10/09/2024' },
  { id: 'u19', name: 'Thiago Ramos', email: 'thiago@bioformaclinica.com.br', clinicId: '8', role: 'admin', status: 'ativo', lastAccess: 'Hoje, 07:20', createdAt: '19/07/2025' },
  { id: 'u20', name: 'Carla Nascimento', email: 'carla@bioformaclinica.com.br', clinicId: '8', role: 'recepcao', status: 'ativo', lastAccess: 'Hoje, 07:18', createdAt: '25/07/2025' },
  { id: 'u21', name: 'Renata Cardoso', email: 'renata@clinicavitalle.com.br', clinicId: '9', role: 'admin', status: 'bloqueado', lastAccess: '18 dias atrás', createdAt: '05/05/2025' },
  { id: 'u22', name: 'Henrique Souza', email: 'henrique@clinicavitalle.com.br', clinicId: '9', role: 'profissional', status: 'bloqueado', lastAccess: '18 dias atrás', createdAt: '10/05/2025' },
];

export function getUsers() { return users; }
export function usersOfClinic(clinicId: string) { return users.filter(u => u.clinicId === clinicId); }

// ---------------------------------------------------------------------------
// Subscriptions / billing
// ---------------------------------------------------------------------------

export type SubscriptionStatus = ClinicStatus;
export type PaymentMethod = 'Cartão de crédito' | 'Pix' | 'Boleto';

export interface Subscription {
  id: string;
  clinicId: string;
  planId: SaasPlanId;
  value: number;
  status: SubscriptionStatus;
  nextBilling: string;
  paymentMethod: PaymentMethod;
  startDate: string;
}

export const subscriptions: Subscription[] = clinics.map((c, i) => ({
  id: `sub-${c.id}`,
  clinicId: c.id,
  planId: c.planId,
  value: c.mrr,
  status: c.status,
  nextBilling: c.status === 'ativa' ? ['01/09/2026', '03/09/2026', '05/09/2026', '01/09/2026'][i % 4] : '—',
  paymentMethod: (['Cartão de crédito', 'Pix', 'Boleto'] as PaymentMethod[])[i % 3],
  startDate: c.since,
}));

export interface PaymentRecord {
  id: string;
  clinicId: string;
  date: string;
  value: number;
  status: 'pago' | 'atrasado' | 'pendente';
}

export const payments: PaymentRecord[] = [
  { id: 'p1', clinicId: '1', date: '01/08/2026', value: 247, status: 'pago' },
  { id: 'p2', clinicId: '1', date: '01/07/2026', value: 247, status: 'pago' },
  { id: 'p3', clinicId: '1', date: '01/06/2026', value: 247, status: 'pago' },
  { id: 'p4', clinicId: '1', date: '01/05/2026', value: 247, status: 'pago' },
  { id: 'p5', clinicId: '4', date: '01/08/2026', value: 247, status: 'atrasado' },
  { id: 'p6', clinicId: '4', date: '01/07/2026', value: 247, status: 'pago' },
  { id: 'p7', clinicId: '4', date: '01/06/2026', value: 247, status: 'pago' },
];

export function getSubscriptions() { return subscriptions; }
export function paymentsOfClinic(clinicId: string) { return payments.filter(p => p.clinicId === clinicId); }

// ---------------------------------------------------------------------------
// WhatsApp connections
// ---------------------------------------------------------------------------

export type WhatsappStatus = 'conectado' | 'desconectado' | 'erro' | 'aguardando';

export interface WhatsappConnection {
  id: string;
  clinicId: string;
  number: string;
  status: WhatsappStatus;
  sent: number;
  received: number;
  errors: number;
  lastWebhook: string;
  lastActivity: string;
  lastError: string | null;
}

export const whatsappConnections: WhatsappConnection[] = [
  { id: 'w1', clinicId: '1', number: '+55 11 98765-4321', status: 'conectado', sent: 1840, received: 960, errors: 3, lastWebhook: 'Hoje, 11:20', lastActivity: 'Hoje, 11:20', lastError: null },
  { id: 'w2', clinicId: '2', number: '+55 41 99123-4567', status: 'conectado', sent: 5210, received: 2870, errors: 12, lastWebhook: 'Hoje, 11:05', lastActivity: 'Hoje, 11:05', lastError: null },
  { id: 'w3', clinicId: '3', number: '—', status: 'aguardando', sent: 0, received: 0, errors: 0, lastWebhook: '—', lastActivity: '—', lastError: null },
  { id: 'w4', clinicId: '4', number: '+55 51 99234-5566', status: 'erro', sent: 980, received: 410, errors: 34, lastWebhook: '5 dias atrás', lastActivity: '5 dias atrás', lastError: 'Token expirado — reautenticação necessária' },
  { id: 'w5', clinicId: '5', number: '—', status: 'desconectado', sent: 0, received: 0, errors: 0, lastWebhook: '—', lastActivity: '12 dias atrás', lastError: 'Sessão encerrada pelo usuário' },
  { id: 'w6', clinicId: '6', number: '+55 81 98123-9900', status: 'conectado', sent: 3120, received: 1640, errors: 5, lastWebhook: 'Hoje, 09:48', lastActivity: 'Hoje, 09:48', lastError: null },
  { id: 'w7', clinicId: '7', number: '+55 71 99345-2211', status: 'desconectado', sent: 0, received: 0, errors: 0, lastWebhook: '40 dias atrás', lastActivity: '40 dias atrás', lastError: null },
  { id: 'w8', clinicId: '8', number: '—', status: 'aguardando', sent: 0, received: 0, errors: 0, lastWebhook: '—', lastActivity: '—', lastError: null },
  { id: 'w9', clinicId: '9', number: '+55 21 99567-3344', status: 'erro', sent: 620, received: 190, errors: 41, lastWebhook: '18 dias atrás', lastActivity: '18 dias atrás', lastError: 'Número banido pela Meta — revisão necessária' },
];

export function getWhatsappConnections() { return whatsappConnections; }
export function whatsappOfClinic(clinicId: string) { return whatsappConnections.find(w => w.clinicId === clinicId); }

// ---------------------------------------------------------------------------
// Support tickets
// ---------------------------------------------------------------------------

export type TicketPriority = 'baixa' | 'normal' | 'alta' | 'urgente';
export type TicketStatus = 'aberto' | 'em_atendimento' | 'aguardando_cliente' | 'resolvido';

export interface TicketMessage {
  author: string;
  text: string;
  date: string;
}

export interface Ticket {
  id: string;
  number: string;
  clinicId: string;
  subject: string;
  category: 'Financeiro' | 'Técnico' | 'Dúvida' | 'Solicitação';
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string;
  date: string;
  messages: TicketMessage[];
}

export const tickets: Ticket[] = [
  { id: 't1', number: '#1042', clinicId: '4', subject: 'Cartão recusado na cobrança de agosto', category: 'Financeiro', priority: 'urgente', status: 'em_atendimento', assignee: 'Rodrigo (Suporte)', date: '23/08/2026',
    messages: [
      { author: 'Rafael Nunes (Vita Estética)', text: 'Minha cobrança de agosto não passou e o sistema está bloqueando o financeiro.', date: '23/08 09:14' },
      { author: 'Rodrigo (Suporte)', text: 'Olá Rafael, identificamos o cartão recusado. Pode tentar atualizar a forma de pagamento?', date: '23/08 09:40' },
    ] },
  { id: 't2', number: '#1041', clinicId: '9', subject: 'WhatsApp banido pela Meta', category: 'Técnico', priority: 'urgente', status: 'aberto', assignee: '—', date: '22/08/2026',
    messages: [
      { author: 'Renata Cardoso (Clínica Vitalle)', text: 'Nosso número foi banido e paramos de receber mensagens.', date: '22/08 14:02' },
    ] },
  { id: 't3', number: '#1039', clinicId: '2', subject: 'Dúvida sobre limite de profissionais no plano Redes', category: 'Dúvida', priority: 'normal', status: 'resolvido', assignee: 'Ana (Suporte)', date: '19/08/2026',
    messages: [
      { author: 'Camila Torres (Studio Bella Pele)', text: 'O plano Redes tem limite de profissionais?', date: '19/08 10:00' },
      { author: 'Ana (Suporte)', text: 'Não, o plano Redes é ilimitado em profissionais e usuários :)', date: '19/08 10:22' },
    ] },
  { id: 't4', number: '#1037', clinicId: '1', subject: 'Solicitação de nota fiscal retroativa', category: 'Solicitação', priority: 'baixa', status: 'aguardando_cliente', assignee: 'Rodrigo (Suporte)', date: '18/08/2026',
    messages: [
      { author: 'Marina Silva (Clínica Lumina)', text: 'Preciso da NF de julho para o contador.', date: '18/08 08:30' },
      { author: 'Rodrigo (Suporte)', text: 'Enviamos por e-mail, pode confirmar o recebimento?', date: '18/08 15:10' },
    ] },
  { id: 't5', number: '#1035', clinicId: '6', subject: 'Erro ao importar planilha de clientes', category: 'Técnico', priority: 'alta', status: 'em_atendimento', assignee: 'Ana (Suporte)', date: '17/08/2026',
    messages: [
      { author: 'Beatriz Lima (Clínica Aurora)', text: 'A importação trava em 60%.', date: '17/08 11:00' },
      { author: 'Ana (Suporte)', text: 'Estamos reproduzindo o erro, retornamos em breve.', date: '17/08 13:45' },
    ] },
  { id: 't6', number: '#1033', clinicId: '3', subject: 'Como migrar do trial para o plano pago', category: 'Dúvida', priority: 'normal', status: 'resolvido', assignee: 'Rodrigo (Suporte)', date: '15/08/2026', messages: [
      { author: 'Juliana Prado (Espaço Renove)', text: 'Como faço para assinar depois do trial?', date: '15/08 09:00' },
      { author: 'Rodrigo (Suporte)', text: 'É só ir em Configurações > Assinatura e escolher o plano.', date: '15/08 09:20' },
    ] },
  { id: 't7', number: '#1030', clinicId: '5', subject: 'Relatório financeiro com valor divergente', category: 'Financeiro', priority: 'alta', status: 'aberto', assignee: '—', date: '14/08/2026', messages: [
      { author: 'Isabela Rocha (Derma Prime)', text: 'O relatório de julho está R$400 a menos do que o esperado.', date: '14/08 16:20' },
    ] },
  { id: 't8', number: '#1028', clinicId: '8', subject: 'Dúvida sobre integração de WhatsApp', category: 'Dúvida', priority: 'baixa', status: 'resolvido', assignee: 'Ana (Suporte)', date: '11/08/2026', messages: [
      { author: 'Thiago Ramos (Bioforma Clínica)', text: 'O plano Start tem WhatsApp?', date: '11/08 10:00' },
      { author: 'Ana (Suporte)', text: 'Não, WhatsApp está disponível a partir do plano Pro.', date: '11/08 10:12' },
    ] },
  { id: 't9', number: '#1024', clinicId: '7', subject: 'Solicitação de cancelamento confirmada', category: 'Solicitação', priority: 'normal', status: 'resolvido', assignee: 'Rodrigo (Suporte)', date: '10/09/2024', messages: [
      { author: 'Fernanda Alves (Pura Estética)', text: 'Quero cancelar minha assinatura.', date: '10/09 12:00' },
      { author: 'Rodrigo (Suporte)', text: 'Cancelamento confirmado, sem multas.', date: '10/09 12:30' },
    ] },
  { id: 't10', number: '#1020', clinicId: '4', subject: 'Lentidão ao carregar a agenda', category: 'Técnico', priority: 'normal', status: 'aguardando_cliente', assignee: 'Ana (Suporte)', date: '08/08/2026', messages: [
      { author: 'Rafael Nunes (Vita Estética)', text: 'A agenda demora pra carregar no fim do dia.', date: '08/08 18:00' },
      { author: 'Ana (Suporte)', text: 'Pode nos enviar um print do horário exato que acontece?', date: '08/08 18:40' },
    ] },
];

export function getTickets() { return tickets; }

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------

export type LogType = 'acesso' | 'usuario' | 'plano' | 'whatsapp' | 'pagamento' | 'administrativo';

export interface LogEntry {
  id: string;
  actor: string;
  action: string;
  clinicId?: string;
  date: string;
  result: 'sucesso' | 'falha';
  type: LogType;
}

export const logs: LogEntry[] = [
  { id: 'l1', actor: 'Pedro (Gestor Lumina)', action: 'Acessou o painel da Clínica Lumina como administrador', clinicId: '1', date: '25/08/2026 11:32', result: 'sucesso', type: 'acesso' },
  { id: 'l2', actor: 'Pedro (Gestor Lumina)', action: 'Alterou o plano de Vita Estética de Start para Pro', clinicId: '4', date: '24/08/2026 16:04', result: 'sucesso', type: 'plano' },
  { id: 'l3', actor: 'Sistema', action: 'Cobrança de Vita Estética falhou — cartão recusado', clinicId: '4', date: '24/08/2026 08:00', result: 'falha', type: 'pagamento' },
  { id: 'l4', actor: 'Rodrigo (Suporte)', action: 'Bloqueou o usuário Fernanda Alves', clinicId: '7', date: '23/08/2026 14:50', result: 'sucesso', type: 'usuario' },
  { id: 'l5', actor: 'Sistema', action: 'WhatsApp de Clínica Vitalle desconectado (erro da Meta)', clinicId: '9', date: '22/08/2026 07:10', result: 'falha', type: 'whatsapp' },
  { id: 'l6', actor: 'Pedro (Gestor Lumina)', action: 'Suspendeu a clínica Clínica Vitalle por inadimplência recorrente', clinicId: '9', date: '21/08/2026 10:15', result: 'sucesso', type: 'administrativo' },
  { id: 'l7', actor: 'Ana (Suporte)', action: 'Redefiniu o acesso do usuário Aline Duarte', clinicId: '2', date: '20/08/2026 09:22', result: 'sucesso', type: 'usuario' },
  { id: 'l8', actor: 'Juliana Prado', action: 'Criou a conta da clínica Espaço Renove (trial)', clinicId: '3', date: '20/08/2026 08:00', result: 'sucesso', type: 'acesso' },
  { id: 'l9', actor: 'Sistema', action: 'Pagamento de Clínica Lumina confirmado', clinicId: '1', date: '01/08/2026 06:00', result: 'sucesso', type: 'pagamento' },
  { id: 'l10', actor: 'Camila Torres', action: 'Conectou o WhatsApp da Studio Bella Pele', clinicId: '2', date: '30/07/2026 13:40', result: 'sucesso', type: 'whatsapp' },
  { id: 'l11', actor: 'Pedro (Gestor Lumina)', action: 'Editou os limites do plano Business', date: '28/07/2026 17:00', result: 'sucesso', type: 'plano' },
  { id: 'l12', actor: 'Rodrigo (Suporte)', action: 'Cancelou a assinatura de Pura Estética a pedido do cliente', clinicId: '7', date: '10/09/2024 12:30', result: 'sucesso', type: 'administrativo' },
  { id: 'l13', actor: 'Rafael Nunes', action: 'Login realizado', clinicId: '4', date: '18/08/2026 07:40', result: 'sucesso', type: 'acesso' },
  { id: 'l14', actor: 'Sistema', action: 'Tentativa de login bloqueada — usuário Renata Cardoso inativo', clinicId: '9', date: '17/08/2026 21:12', result: 'falha', type: 'acesso' },
  { id: 'l15', actor: 'Pedro (Gestor Lumina)', action: 'Alterou preço do plano Pro de R$297 para R$247', date: '15/08/2026 15:00', result: 'sucesso', type: 'plano' },
  { id: 'l16', actor: 'Ana (Suporte)', action: 'Criou o usuário Marcos Vieira', clinicId: '5', date: '01/07/2025 09:00', result: 'sucesso', type: 'usuario' },
  { id: 'l17', actor: 'Sistema', action: 'Pagamento de Studio Bella Pele confirmado', clinicId: '2', date: '01/08/2026 06:00', result: 'sucesso', type: 'pagamento' },
  { id: 'l18', actor: 'Pedro (Gestor Lumina)', action: 'Reativou a clínica Derma Prime após regularização', clinicId: '5', date: '05/07/2025 11:00', result: 'sucesso', type: 'administrativo' },
];

export function getLogs() { return logs; }

// ---------------------------------------------------------------------------
// Aggregate KPIs used on the overview dashboard
// ---------------------------------------------------------------------------

export function computeKpis() {
  const activeClinics = clinics.filter(c => c.status === 'ativa');
  const mrr = activeClinics.reduce((s, c) => s + c.mrr, 0);
  const arr = mrr * 12;
  const trial = clinics.filter(c => c.status === 'trial').length;
  const overdue = clinics.filter(c => c.status === 'inadimplente').length;
  const cancelled = clinics.filter(c => c.status === 'cancelada').length;
  const churnRate = Math.round((cancelled / clinics.length) * 100);
  const avgTicket = activeClinics.length ? Math.round(mrr / activeClinics.length) : 0;
  // "new this period" — clinics whose `since` falls in 2026
  const newThisPeriod = clinics.filter(c => c.since.includes('2026')).length;

  return {
    mrr, arr, activeCount: activeClinics.length, trial, overdue, cancelled, churnRate, avgTicket, newThisPeriod,
    totalClinics: clinics.length,
  };
}
