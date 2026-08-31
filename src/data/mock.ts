// ─────────────────────────────────────────────────────────────────────────────
// Fonte única de verdade do protótipo.
//
// Formato de repositório: registros tipados + funções `get*()`. Nenhuma página
// deve declarar sua própria cópia de cliente, agenda, plano ou automação —
// tudo sai daqui. Quando existir backend, só estas funções mudam.
//
// "Persistência": as ações mutam o objeto dentro do array compartilhado e a
// página chama `forceTick` para re-renderizar. Reseta ao recarregar a página.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Appointment,
  AppointmentStatus,
  Automation,
  Client,
  Conversation,
  Lead,
  LeadStage,
  Message,
  Plan,
  PlanInfo,
  Procedure,
  Professional,
  User,
  WaitlistEntry,
} from '../types';

// ── Data de referência do protótipo ──────────────────────────────────────────
// Tudo (retornos, inativos, "hoje") é calculado a partir daqui.
export const TODAY = '2026-08-26';
export const TOMORROW = '2026-08-27';

export function toDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

export function formatBR(iso: string) {
  return toDate(iso).toLocaleDateString('pt-BR');
}

export function addDays(iso: string, days: number) {
  const d = toDate(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export function daysBetween(fromISO: string, toISOStr: string) {
  const ms = toDate(toISOStr).getTime() - toDate(fromISO).getTime();
  return Math.round(ms / 86400000);
}

export function money(v: number) {
  return `R$ ${v.toLocaleString('pt-BR')}`;
}

// ── Planos ───────────────────────────────────────────────────────────────────
// Dois planos. Nada de limite de agendamentos, clientes, storage ou usuários.
// Confirmação, recall e lista de espera são ilimitados nos dois; só mensagem
// de marketing consome franquia.

const plans: PlanInfo[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    price: 149,
    professionalsIncluded: 1,
    professionalsMax: 3,
    extraProfessionalPrice: 59,
    marketingQuota: 100,
    tagline: 'Para quem atende sozinha ou com uma dupla',
    features: [
      'Agenda + link de agendamento',
      'Prontuário com fotos antes/depois',
      'Confirmação de horário pelo WhatsApp',
      'Lista de espera automática',
      'Recall por procedimento',
      'Financeiro simples',
      'Reativação de inativas (manual)',
    ],
  },
  {
    id: 'crescimento',
    name: 'Crescimento',
    price: 297,
    professionalsIncluded: 3,
    professionalsMax: 10,
    extraProfessionalPrice: 59,
    marketingQuota: 400,
    tagline: 'Para clínica com equipe e recepção',
    features: [
      'Tudo do Essencial',
      'Funil de Leads',
      'Resposta automática a lead',
      'Reativação de inativas automática',
      'Permissões por papel',
      'Comissões por profissional',
      'Relatório por profissional e por origem',
      'Inbox com vários atendentes',
    ],
  },
];

/** Recursos que só existem no Crescimento — usado por PlanGate e pela landing. */
export const crescimentoOnly = [
  'Funil de Leads',
  'Resposta automática a lead',
  'Reativação automática de inativas',
  'Permissões por papel',
  'Comissões por profissional',
  'Relatório por profissional e origem',
  'Inbox com vários atendentes',
];

export function getPlans() {
  return plans;
}

export function getPlan(id: Plan) {
  return plans.find(p => p.id === id) ?? plans[0];
}

// ── Clínica ──────────────────────────────────────────────────────────────────

export const clinic = {
  name: 'Clínica Lumina Estética',
  whatsapp: '(11) 3456-7890',
  email: 'contato@lumina.com.br',
  address: 'Rua das Flores, 123 — Jardins, São Paulo, SP',
  opensAt: '08:00',
  closesAt: '18:00',
  bookingLink: 'lumina.app/clinica-lumina',
  monthlyGoal: 60000,
};

// ── Profissionais (têm agenda e são cobrados) ────────────────────────────────

const professionals: Professional[] = [
  { id: 'p1', name: 'Dra. Marina Silva', shortName: 'Marina', initials: 'MS', color: '#0A6E6E', specialty: 'Injetáveis' },
  { id: 'p2', name: 'Camila Rocha', shortName: 'Camila', initials: 'CR', color: '#7C3AED', specialty: 'Estética facial' },
  { id: 'p3', name: 'Paulo Mendes', shortName: 'Paulo', initials: 'PM', color: '#D97706', specialty: 'Fios e corporal' },
];

export function getProfessionals() {
  return professionals;
}

export function getProfessional(id: string) {
  return professionals.find(p => p.id === id) ?? professionals[0];
}

// ── Usuários (login; não são cobrados) ───────────────────────────────────────

const users: User[] = [
  { id: 'u1', name: 'Dra. Marina Silva', email: 'marina@lumina.com.br', role: 'dona', professionalId: 'p1' },
  { id: 'u2', name: 'Camila Rocha', email: 'camila@lumina.com.br', role: 'profissional', professionalId: 'p2' },
  { id: 'u3', name: 'Paulo Mendes', email: 'paulo@lumina.com.br', role: 'profissional', professionalId: 'p3' },
  { id: 'u4', name: 'Sofia Andrade', email: 'sofia@lumina.com.br', role: 'recepcao' },
];

export const roleLabels: Record<User['role'], string> = {
  dona: 'Dona da clínica',
  profissional: 'Profissional',
  recepcao: 'Recepção',
};

export function getUsers() {
  return users;
}

export function getUser(id: string) {
  return users.find(u => u.id === id) ?? users[0];
}

/** Usuária logada no protótipo. */
export const currentUser = users[0];

// ── Procedimentos ────────────────────────────────────────────────────────────

const procedures: Procedure[] = [
  { id: 'pr1', name: 'Toxina Botulínica', durationMin: 60, price: 900, commissionPct: 35, returnIntervalDays: 120 },
  { id: 'pr2', name: 'Preenchimento Labial', durationMin: 45, price: 1200, commissionPct: 35, returnIntervalDays: 300 },
  { id: 'pr3', name: 'Limpeza de Pele', durationMin: 75, price: 280, commissionPct: 40, returnIntervalDays: 30 },
  { id: 'pr4', name: 'Bioestimulador de Colágeno', durationMin: 90, price: 1800, commissionPct: 35, returnIntervalDays: 180 },
  { id: 'pr5', name: 'Fio de PDO', durationMin: 120, price: 2200, commissionPct: 35, returnIntervalDays: 365 },
  { id: 'pr6', name: 'Drenagem Linfática', durationMin: 60, price: 120, commissionPct: 40, returnIntervalDays: 15 },
  { id: 'pr7', name: 'Consulta de Avaliação', durationMin: 30, price: 0, commissionPct: 0, returnIntervalDays: 60 },
];

export function getProcedures() {
  return procedures;
}

export function getProcedure(id: string) {
  return procedures.find(p => p.id === id) ?? procedures[0];
}

/** Sugestões pré-marcadas no onboarding, com retorno já preenchido. */
export const commonProcedures = [
  { name: 'Toxina Botulínica', durationMin: 60, price: 900, returnIntervalDays: 120, checked: true },
  { name: 'Preenchimento Labial', durationMin: 45, price: 1200, returnIntervalDays: 300, checked: true },
  { name: 'Limpeza de Pele', durationMin: 75, price: 280, returnIntervalDays: 30, checked: true },
  { name: 'Bioestimulador de Colágeno', durationMin: 90, price: 1800, returnIntervalDays: 180, checked: true },
  { name: 'Fio de PDO', durationMin: 120, price: 2200, returnIntervalDays: 365, checked: false },
  { name: 'Drenagem Linfática', durationMin: 60, price: 120, returnIntervalDays: 15, checked: false },
  { name: 'Peeling Químico', durationMin: 45, price: 450, returnIntervalDays: 45, checked: false },
  { name: 'Microagulhamento', durationMin: 60, price: 600, returnIntervalDays: 30, checked: false },
  { name: 'Consulta de Avaliação', durationMin: 30, price: 0, returnIntervalDays: 60, checked: true },
];

// ── Clientes ─────────────────────────────────────────────────────────────────

const clients: Client[] = [
  {
    id: 'c1',
    name: 'Ana Carolina Medeiros',
    phone: '(11) 99234-5678',
    email: 'anacarolina@email.com',
    initials: 'AC',
    birthdate: '14/03/1988',
    address: 'Rua das Palmeiras, 45 — Jardins, SP',
    since: 'Março 2023',
    stage: 'VIP',
    lastVisit: '2026-08-15',
    totalSpent: 8700,
    notes: 'Faz toxina a cada 4 meses. Prefere manhãs de sexta.',
    allergies: 'Lidocaína — usar prilocaína ou EMLA',
    anamnese: [
      { question: 'Alergias conhecidas', answer: 'Lidocaína — usar prilocaína ou EMLA como alternativa' },
      { question: 'Medicamentos em uso', answer: 'Anticoncepcional oral, vitamina D 2000UI' },
      { question: 'Doenças pré-existentes', answer: 'Nenhuma' },
      { question: 'Gestante ou amamentando', answer: 'Não' },
      { question: 'Procedimentos anteriores', answer: 'Toxina desde 2019, preenchimento desde 2021' },
      { question: 'Expectativas', answer: 'Manter resultado natural, evitar aspecto artificial' },
      { question: 'Herpes labial', answer: 'Sim — profilaxia com Aciclovir antes de preenchimentos labiais' },
    ],
    photos: [
      { session: '2026-08-15', label: 'Toxina — Antes', url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=240&h=240&fit=crop&auto=format' },
      { session: '2026-08-15', label: 'Toxina — Depois', url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=240&h=240&fit=crop&auto=format' },
      { session: '2026-04-20', label: 'Preenchimento — Antes', url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=240&h=240&fit=crop&auto=format' },
      { session: '2026-04-20', label: 'Preenchimento — Depois', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=240&h=240&fit=crop&auto=format' },
    ],
    history: [
      { date: '2026-08-15', procedureId: 'pr1', professionalId: 'p1', value: 900, payment: 'Pix', notes: 'Aplicação de 50U em testa e glabela. Retorno de avaliação em 15 dias.' },
      { date: '2026-04-20', procedureId: 'pr2', professionalId: 'p1', value: 1200, payment: 'Cartão', notes: 'Técnica linear retrógrada, 1ml de AH.' },
      { date: '2026-01-15', procedureId: 'pr1', professionalId: 'p1', value: 1100, payment: 'Pix', notes: '60U — testa, glabela e periorbital.' },
      { date: '2025-09-10', procedureId: 'pr5', professionalId: 'p1', value: 2800, payment: 'Cartão', notes: '20 fios smooth, lifting facial.' },
      { date: '2025-05-20', procedureId: 'pr4', professionalId: 'p1', value: 2700, payment: 'Pix', notes: 'Protocolo de 3 sessões — sessão 1/3.' },
    ],
  },
  {
    id: 'c2',
    name: 'Fernanda Oliveira',
    phone: '(11) 97654-3210',
    email: 'fernanda@email.com',
    initials: 'FO',
    birthdate: '02/07/1991',
    address: 'Av. Rebouças, 900 — Pinheiros, SP',
    since: 'Janeiro 2024',
    stage: 'Frequente',
    lastVisit: '2026-08-10',
    totalSpent: 6200,
    notes: 'Sempre chega adiantada. Gosta de agendar no fim da tarde.',
    allergies: 'Nenhuma relatada',
    anamnese: [
      { question: 'Alergias conhecidas', answer: 'Nenhuma relatada' },
      { question: 'Medicamentos em uso', answer: 'Nenhum' },
      { question: 'Gestante ou amamentando', answer: 'Não' },
      { question: 'Expectativas', answer: 'Volume labial discreto' },
    ],
    photos: [],
    history: [
      { date: '2026-08-10', procedureId: 'pr2', professionalId: 'p1', value: 1200, payment: 'Cartão', notes: 'Retoque de volume, 0,5ml.' },
      { date: '2026-02-14', procedureId: 'pr2', professionalId: 'p1', value: 1200, payment: 'Pix', notes: 'Primeira aplicação.' },
    ],
  },
  {
    id: 'c3',
    name: 'Juliana Torres',
    phone: '(11) 98877-6655',
    email: 'juliana.torres@email.com',
    initials: 'JT',
    birthdate: '19/11/1995',
    address: 'Rua Harmonia, 210 — Vila Madalena, SP',
    since: 'Maio 2025',
    stage: 'Regular',
    lastVisit: '2026-08-02',
    totalSpent: 1680,
    notes: 'Pele oleosa, protocolo mensal de limpeza.',
    allergies: 'Ácido salicílico em alta concentração',
    anamnese: [
      { question: 'Alergias conhecidas', answer: 'Ácido salicílico em alta concentração' },
      { question: 'Tipo de pele', answer: 'Oleosa com tendência acneica' },
      { question: 'Gestante ou amamentando', answer: 'Não' },
    ],
    photos: [],
    history: [
      { date: '2026-08-02', procedureId: 'pr3', professionalId: 'p2', value: 280, payment: 'Pix', notes: 'Extração leve, pele reativa.' },
      { date: '2026-07-01', procedureId: 'pr3', professionalId: 'p2', value: 280, payment: 'Pix', notes: 'Boa evolução.' },
    ],
  },
  {
    id: 'c4',
    name: 'Patricia Santos',
    phone: '(11) 91234-5670',
    email: 'patricia.s@email.com',
    initials: 'PS',
    birthdate: '30/05/1983',
    address: 'Rua Bela Cintra, 55 — Consolação, SP',
    since: 'Agosto 2024',
    stage: 'Frequente',
    lastVisit: '2026-07-20',
    totalSpent: 5400,
    notes: 'Protocolo de bioestimulador em 3 sessões — está na 2ª.',
    allergies: 'Nenhuma relatada',
    anamnese: [
      { question: 'Alergias conhecidas', answer: 'Nenhuma relatada' },
      { question: 'Gestante ou amamentando', answer: 'Não' },
    ],
    photos: [],
    history: [
      { date: '2026-07-20', procedureId: 'pr4', professionalId: 'p1', value: 1800, payment: 'Cartão', notes: 'Sessão 2/3.' },
      { date: '2026-01-20', procedureId: 'pr4', professionalId: 'p1', value: 1800, payment: 'Cartão', notes: 'Sessão 1/3.' },
    ],
  },
  {
    id: 'c5',
    name: 'Roberta Lima',
    phone: '(11) 92345-6781',
    email: 'roberta.l@email.com',
    initials: 'RL',
    birthdate: '08/09/1979',
    address: 'Al. Santos, 1200 — Jardins, SP',
    since: 'Fevereiro 2023',
    stage: 'VIP',
    lastVisit: '2026-05-05',
    totalSpent: 9800,
    notes: 'Cliente antiga, some por temporadas. Responde bem a recall.',
    allergies: 'Nenhuma relatada',
    anamnese: [
      { question: 'Alergias conhecidas', answer: 'Nenhuma relatada' },
      { question: 'Gestante ou amamentando', answer: 'Não' },
    ],
    photos: [],
    history: [
      { date: '2026-05-05', procedureId: 'pr5', professionalId: 'p3', value: 2200, payment: 'Cartão', notes: 'Fios em terço médio.' },
      { date: '2025-11-10', procedureId: 'pr1', professionalId: 'p1', value: 900, payment: 'Pix', notes: '50U.' },
    ],
  },
  {
    id: 'c6',
    name: 'Camila Duarte',
    phone: '(11) 93456-7892',
    email: 'camila.d@email.com',
    initials: 'CD',
    birthdate: '22/12/1998',
    address: 'Rua Girassol, 88 — Vila Madalena, SP',
    since: 'Abril 2026',
    stage: 'Nova',
    lastVisit: '2026-04-18',
    totalSpent: 840,
    notes: 'Comprou pacote de drenagem e parou de vir.',
    allergies: 'Nenhuma relatada',
    anamnese: [{ question: 'Alergias conhecidas', answer: 'Nenhuma relatada' }],
    photos: [],
    history: [
      { date: '2026-04-18', procedureId: 'pr6', professionalId: 'p2', value: 120, payment: 'Dinheiro', notes: 'Sessão 7 do pacote de 10.' },
    ],
  },
  {
    id: 'c7',
    name: 'Tatiana Ferreira',
    phone: '(11) 94567-8903',
    email: 'tati.f@email.com',
    initials: 'TF',
    birthdate: '11/01/1990',
    address: 'Rua Augusta, 2400 — Cerqueira César, SP',
    since: 'Março 2026',
    stage: 'Nova',
    lastVisit: '2026-03-30',
    totalSpent: 0,
    notes: 'Fez avaliação e não fechou procedimento.',
    allergies: 'Não informado',
    anamnese: [{ question: 'Alergias conhecidas', answer: 'Não informado' }],
    photos: [],
    history: [
      { date: '2026-03-30', procedureId: 'pr7', professionalId: 'p1', value: 0, payment: '—', notes: 'Interesse em toxina, achou o valor alto.' },
    ],
  },
  {
    id: 'c8',
    name: 'Mônica Pereira',
    phone: '(11) 95678-9014',
    email: 'monica.p@email.com',
    initials: 'MP',
    birthdate: '05/06/1986',
    address: 'Rua Oscar Freire, 700 — Jardins, SP',
    since: 'Junho 2025',
    stage: 'Regular',
    lastVisit: '2026-04-22',
    totalSpent: 3600,
    notes: 'Toxina de 4 em 4 meses, está atrasada.',
    allergies: 'Nenhuma relatada',
    anamnese: [{ question: 'Alergias conhecidas', answer: 'Nenhuma relatada' }],
    photos: [],
    history: [
      { date: '2026-04-22', procedureId: 'pr1', professionalId: 'p1', value: 900, payment: 'Pix', notes: '45U.' },
      { date: '2025-12-15', procedureId: 'pr1', professionalId: 'p1', value: 900, payment: 'Pix', notes: '45U.' },
    ],
  },
];

export function getClients() {
  return clients;
}

export function getClient(id: string) {
  return clients.find(c => c.id === id) ?? clients[0];
}

/** Dias desde a última visita, contados a partir de TODAY. */
export function daysSinceLastVisit(client: Client) {
  return daysBetween(client.lastVisit, TODAY);
}

export function isInactive(client: Client, thresholdDays = 90) {
  return daysSinceLastVisit(client) >= thresholdDays;
}

export function getInactiveClients(thresholdDays = 90) {
  return clients.filter(c => isInactive(c, thresholdDays));
}

/**
 * Próximo retorno previsto: último procedimento do prontuário + o
 * `returnIntervalDays` daquele procedimento.
 */
export function getNextReturn(client: Client) {
  const last = client.history[0];
  if (!last) return null;
  const procedure = getProcedure(last.procedureId);
  const dueISO = addDays(last.date, procedure.returnIntervalDays);
  return {
    procedure,
    lastDate: last.date,
    dueISO,
    daysUntil: daysBetween(TODAY, dueISO),
    overdue: daysBetween(TODAY, dueISO) < 0,
  };
}

/** Clientes cujo retorno vence dentro da janela (por padrão, esta semana). */
export function getClientsDueForRecall(windowDays = 7) {
  return clients
    .map(c => ({ client: c, next: getNextReturn(c) }))
    .filter(x => x.next !== null && x.next.daysUntil <= windowDays)
    .filter(x => !recallSent.has(x.client.id));
}

// ── Agenda ───────────────────────────────────────────────────────────────────

const appointments: Appointment[] = [
  // Hoje
  { id: 'a1', date: TODAY, time: '09:00', end: '10:00', clientId: 'c1', procedureId: 'pr1', professionalId: 'p1', room: 'Sala 1', status: 'confirmado', confirmationSentAt: '25/08 09:00' },
  { id: 'a2', date: TODAY, time: '10:00', end: '10:45', clientId: 'c2', procedureId: 'pr2', professionalId: 'p1', room: 'Sala 1', status: 'confirmado', confirmationSentAt: '25/08 09:00' },
  { id: 'a3', date: TODAY, time: '10:30', end: '11:45', clientId: 'c3', procedureId: 'pr3', professionalId: 'p2', room: 'Sala 2', status: 'nao_confirmado', confirmationSentAt: '25/08 09:00' },
  { id: 'a4', date: TODAY, time: '13:00', end: '15:00', clientId: 'c5', procedureId: 'pr5', professionalId: 'p3', room: 'Sala 3', status: 'confirmado', confirmationSentAt: '25/08 09:00' },
  { id: 'a5', date: TODAY, time: '14:00', end: '15:30', clientId: 'c4', procedureId: 'pr4', professionalId: 'p1', room: 'Sala 1', status: 'confirmado', confirmationSentAt: '25/08 09:00' },
  { id: 'a6', date: TODAY, time: '15:00', end: '16:00', clientId: 'c6', procedureId: 'pr6', professionalId: 'p2', room: 'Sala 2', status: 'pendente', confirmationSentAt: null },
  { id: 'a7', date: TODAY, time: '16:00', end: '16:30', clientId: 'c7', procedureId: 'pr7', professionalId: 'p1', room: 'Sala 1', status: 'nao_confirmado', confirmationSentAt: '25/08 09:00' },

  // Amanhã — as que ainda não receberam confirmação alimentam o alerta de Hoje
  { id: 'a8', date: TOMORROW, time: '09:00', end: '10:00', clientId: 'c8', procedureId: 'pr1', professionalId: 'p1', room: 'Sala 1', status: 'pendente', confirmationSentAt: null },
  { id: 'a9', date: TOMORROW, time: '10:30', end: '11:45', clientId: 'c3', procedureId: 'pr3', professionalId: 'p2', room: 'Sala 2', status: 'pendente', confirmationSentAt: null },
  { id: 'a10', date: TOMORROW, time: '14:00', end: '15:00', clientId: 'c2', procedureId: 'pr1', professionalId: 'p1', room: 'Sala 1', status: 'pendente', confirmationSentAt: null },
  { id: 'a11', date: TOMORROW, time: '16:00', end: '17:00', clientId: 'c6', procedureId: 'pr6', professionalId: 'p2', room: 'Sala 2', status: 'pendente', confirmationSentAt: null },
  { id: 'a12', date: TOMORROW, time: '17:00', end: '18:00', clientId: 'c4', procedureId: 'pr1', professionalId: 'p1', room: 'Sala 1', status: 'confirmado', confirmationSentAt: '26/08 08:00' },
];

export const appointmentStatusMap: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
  pendente: { label: 'Aguardando envio', color: '#64748B', bg: '#F1F5F9' },
  confirmado: { label: 'Confirmado', color: '#059669', bg: '#ECFDF5' },
  nao_confirmado: { label: 'Sem resposta', color: '#D97706', bg: '#FFF7ED' },
  recusado: { label: 'Recusado', color: '#DC2626', bg: '#FEF2F2' },
  concluido: { label: 'Concluído', color: '#4F46E5', bg: '#EEF2FF' },
  falta: { label: 'Faltou', color: '#9CA3AF', bg: '#F9FAFB' },
  cancelado: { label: 'Cancelado', color: '#9CA3AF', bg: '#F9FAFB' },
};

export function getAppointments() {
  return appointments;
}

export function getAppointmentsByDate(iso: string) {
  return appointments
    .filter(a => a.date === iso && a.status !== 'cancelado')
    .sort((a, b) => a.time.localeCompare(b.time));
}

/** Horários de amanhã que ainda não receberam a mensagem de confirmação. */
export function getUnconfirmedTomorrow() {
  return appointments.filter(a => a.date === TOMORROW && a.confirmationSentAt === null && a.status !== 'cancelado');
}

/** Envia a confirmação (mock) para todos os horários de amanhã sem envio. */
export function sendConfirmationsForTomorrow() {
  const pending = getUnconfirmedTomorrow();
  pending.forEach(a => {
    a.confirmationSentAt = `${formatBR(TODAY).slice(0, 5)} agora`;
    a.status = 'nao_confirmado';
  });
  return pending.length;
}

export function setAppointmentStatus(id: string, status: AppointmentStatus) {
  const appt = appointments.find(a => a.id === id);
  if (appt) appt.status = status;
}

export function addAppointment(data: {
  date: string;
  time: string;
  clientId: string;
  procedureId: string;
  professionalId: string;
  autoConfirm: boolean;
}) {
  const procedure = getProcedure(data.procedureId);
  const [h, m] = data.time.split(':').map(Number);
  const endMinutes = h * 60 + m + procedure.durationMin;
  const end = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;
  const appt: Appointment = {
    id: `a${appointments.length + 1}-${Date.now()}`,
    date: data.date,
    time: data.time,
    end,
    clientId: data.clientId,
    procedureId: data.procedureId,
    professionalId: data.professionalId,
    room: 'Sala 1',
    status: 'pendente',
    confirmationSentAt: null,
  };
  appointments.push(appt);
  if (!data.autoConfirm) appt.status = 'confirmado';
  return appt;
}

// ── Lista de espera ──────────────────────────────────────────────────────────

const waitlist: WaitlistEntry[] = [
  { id: 'w1', clientId: 'c8', procedureId: 'pr1', professionalId: 'p1', preferredPeriod: 'manha', createdAt: '2026-08-21' },
  { id: 'w2', clientId: 'c5', procedureId: 'pr5', preferredPeriod: 'tarde', createdAt: '2026-08-22' },
  { id: 'w3', clientId: 'c6', procedureId: 'pr3', professionalId: 'p2', preferredPeriod: 'qualquer', createdAt: '2026-08-24' },
  { id: 'w4', clientId: 'c2', procedureId: 'pr2', professionalId: 'p1', preferredPeriod: 'tarde', createdAt: '2026-08-25' },
];

export const periodLabels: Record<WaitlistEntry['preferredPeriod'], string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
  qualquer: 'Qualquer horário',
};

export function getWaitlist() {
  return waitlist;
}

/** Quem da lista de espera combina com um horário que abriu. */
export function matchWaitlist(appt: Appointment) {
  const morning = Number(appt.time.split(':')[0]) < 12;
  return waitlist.filter(w => {
    const periodOk = w.preferredPeriod === 'qualquer' || (w.preferredPeriod === 'manha') === morning;
    const profOk = !w.professionalId || w.professionalId === appt.professionalId;
    return periodOk && profOk && !w.offeredFor;
  });
}

export function offerSlot(entryId: string, slotLabel: string) {
  const entry = waitlist.find(w => w.id === entryId);
  if (entry) entry.offeredFor = slotLabel;
}

export function offerSlotToAll(entryIds: string[], slotLabel: string) {
  entryIds.forEach(id => offerSlot(id, slotLabel));
}

// ── Conversas e mensagens ────────────────────────────────────────────────────

const conversations: Conversation[] = [
  { id: 'cv1', clientId: 'c1', lastPreview: 'Posso chegar 10 min antes?', lastTime: '10:32', unread: 0, online: true },
  { id: 'cv2', clientId: 'c2', lastPreview: 'SIM', lastTime: '09:15', unread: 1, online: false },
  { id: 'cv3', clientId: 'c3', lastPreview: 'Já posso lavar o rosto?', lastTime: 'ontem', unread: 2, online: false },
  { id: 'cv4', clientId: 'c8', lastPreview: 'Adorei! Quero sim 😍', lastTime: 'ontem', unread: 0, online: true },
  { id: 'cv5', clientId: 'c5', lastPreview: 'Vou ver minha agenda e te falo', lastTime: 'seg', unread: 0, online: false },
];

const messages: Message[] = [
  { id: 'm1', conversationId: 'cv1', from: 'clinic', text: 'Oi Ana Carolina! Confirmando seu horário de amanhã às 09:00 para Toxina Botulínica. Responda SIM para confirmar ou NÃO para liberar o horário.', time: '25/08 09:00', read: true, category: 'utilidade' },
  { id: 'm2', conversationId: 'cv1', from: 'client', text: 'SIM', time: '25/08 09:12', read: true, category: 'servico' },
  { id: 'm3', conversationId: 'cv1', from: 'clinic', text: 'Perfeito, horário confirmado na agenda! Te esperamos 😊', time: '25/08 09:12', read: true, category: 'servico', authorId: 'u4' },
  { id: 'm4', conversationId: 'cv1', from: 'client', text: 'Posso chegar 10 min antes?', time: '26/08 10:32', read: true, category: 'servico' },

  { id: 'm5', conversationId: 'cv2', from: 'clinic', text: 'Oi Fernanda! Confirmando seu horário de amanhã às 14:00 para Toxina Botulínica.', time: '25/08 09:00', read: true, category: 'utilidade' },
  { id: 'm6', conversationId: 'cv2', from: 'client', text: 'SIM', time: '26/08 09:15', read: false, category: 'servico' },

  { id: 'm7', conversationId: 'cv3', from: 'client', text: 'Oi! Fiz a limpeza de pele ontem. Já posso lavar o rosto?', time: '25/08 07:30', read: false, category: 'servico' },
  { id: 'm8', conversationId: 'cv3', from: 'client', text: 'Pode usar hidratante também?', time: '25/08 07:31', read: false, category: 'servico' },

  { id: 'm9', conversationId: 'cv4', from: 'clinic', text: 'Mônica, faz 4 meses da sua última toxina. Separei um horário essa semana — quer que eu reserve?', time: '25/08 11:00', read: true, category: 'marketing' },
  { id: 'm10', conversationId: 'cv4', from: 'client', text: 'Adorei! Quero sim 😍', time: '25/08 11:40', read: true, category: 'servico' },

  { id: 'm11', conversationId: 'cv5', from: 'clinic', text: 'Roberta, abriu uma vaga hoje às 13:00 para Fio de PDO. Quer essa vaga? Responde QUERO que eu já reservo.', time: '24/08 15:20', read: true, category: 'utilidade' },
  { id: 'm12', conversationId: 'cv5', from: 'client', text: 'Vou ver minha agenda e te falo', time: '24/08 16:05', read: true, category: 'servico' },
];

export const messageCategoryMap: Record<Message['category'], { label: string; color: string; bg: string }> = {
  utilidade: { label: 'Utilidade', color: '#0891B2', bg: '#E0F7FA' },
  marketing: { label: 'Marketing', color: '#D97706', bg: '#FFF7ED' },
  servico: { label: 'Grátis', color: '#16A34A', bg: '#F0FDF4' },
};

export function getConversations() {
  return conversations;
}

export function getMessages(conversationId: string) {
  return messages.filter(m => m.conversationId === conversationId);
}

export function sendMessage(conversationId: string, text: string) {
  messages.push({
    id: `m${messages.length + 1}`,
    conversationId,
    from: 'clinic',
    text,
    time: 'agora',
    read: false,
    category: 'servico',
    authorId: currentUser.id,
  });
  const conv = conversations.find(c => c.id === conversationId);
  if (conv) {
    conv.lastPreview = text;
    conv.lastTime = 'agora';
    conv.unread = 0;
  }
}

export function markConversationRead(conversationId: string) {
  const conv = conversations.find(c => c.id === conversationId);
  if (conv) conv.unread = 0;
}

// ── Consumo de mensagens ─────────────────────────────────────────────────────
// Só marketing consome franquia. Utilidade (confirmação, lista de espera,
// recall) é ilimitada nos dois planos.

const usage = { marketingSent: 37 };

export function getMarketingUsage(plan: Plan) {
  return { sent: usage.marketingSent, quota: getPlan(plan).marketingQuota };
}

export function registerMarketingMessages(count: number) {
  usage.marketingSent += count;
}

// ── Recall e reativação ──────────────────────────────────────────────────────

const recallSent = new Set<string>();
const reactivationSent = new Set<string>();

export function sendRecall(clientIds: string[]) {
  clientIds.forEach(id => recallSent.add(id));
  return clientIds.length;
}

export function wasRecallSent(clientId: string) {
  return recallSent.has(clientId);
}

/** Reativação é promocional — consome franquia de marketing. */
export function sendReactivation(clientIds: string[]) {
  clientIds.forEach(id => reactivationSent.add(id));
  registerMarketingMessages(clientIds.length);
  return clientIds.length;
}

export function wasReactivationSent(clientId: string) {
  return reactivationSent.has(clientId);
}

// ── Leads ────────────────────────────────────────────────────────────────────

const leads: Lead[] = [
  { id: 'l1', name: 'Bianca Rodrigues', phone: '(11) 99234-5678', procedureId: 'pr1', source: 'Link de agendamento', value: 900, stage: 'novo', date: '25/08', initials: 'BR' },
  { id: 'l2', name: 'Letícia Marques', phone: '(11) 97654-3210', procedureId: 'pr2', source: 'Indicação', value: 1200, stage: 'novo', date: '25/08', initials: 'LM' },
  { id: 'l3', name: 'Vanessa Costa', phone: '(11) 98877-6655', procedureId: 'pr4', source: 'Redes sociais', value: 1800, stage: 'novo', date: '24/08', initials: 'VC' },
  { id: 'l4', name: 'Carla Mendes', phone: '(11) 91234-5670', procedureId: 'pr3', source: 'Link de agendamento', value: 280, stage: 'contato', date: '23/08', initials: 'CM' },
  { id: 'l5', name: 'Tânia Alves', phone: '(11) 92345-6781', procedureId: 'pr1', source: 'WhatsApp', value: 900, stage: 'contato', date: '22/08', initials: 'TA' },
  { id: 'l6', name: 'Renata Souza', phone: '(11) 93456-7892', procedureId: 'pr5', source: 'Indicação', value: 2200, stage: 'proposta', date: '21/08', initials: 'RS' },
  { id: 'l7', name: 'Gabriela Nunes', phone: '(11) 94567-8903', procedureId: 'pr2', source: 'Redes sociais', value: 1200, stage: 'agendado', date: '20/08', initials: 'GN' },
  { id: 'l8', name: 'Mônica Lima', phone: '(11) 95678-9014', procedureId: 'pr4', source: 'Link de agendamento', value: 1800, stage: 'ganho', date: '19/08', initials: 'ML' },
  { id: 'l9', name: 'Sandra Ferreira', phone: '(11) 96789-0125', procedureId: 'pr1', source: 'Indicação', value: 900, stage: 'perdido', date: '18/08', initials: 'SF' },
];

export const leadSources = ['Link de agendamento', 'Redes sociais', 'Indicação', 'WhatsApp', 'Google'];

export const leadStageMap: Record<LeadStage, { label: string; color: string; bg: string }> = {
  novo: { label: 'Novos', color: '#6366F1', bg: '#EEF2FF' },
  contato: { label: 'Em contato', color: '#D97706', bg: '#FFF7ED' },
  proposta: { label: 'Proposta enviada', color: '#0891B2', bg: '#E0F7FA' },
  agendado: { label: 'Agendado', color: '#059669', bg: '#ECFDF5' },
  ganho: { label: 'Ganho', color: '#16A34A', bg: '#F0FDF4' },
  perdido: { label: 'Perdido', color: '#9CA3AF', bg: '#F9FAFB' },
};

export const leadStageOrder: LeadStage[] = ['novo', 'contato', 'proposta', 'agendado', 'ganho', 'perdido'];

export function getLeads() {
  return leads;
}

export function moveLead(id: string, stage: LeadStage) {
  const lead = leads.find(l => l.id === id);
  if (lead) lead.stage = stage;
}

export function addLead(data: { name: string; phone: string; procedureId: string; source: string }) {
  const procedure = getProcedure(data.procedureId);
  leads.push({
    id: `l${leads.length + 1}-${Date.now()}`,
    name: data.name,
    phone: data.phone,
    procedureId: data.procedureId,
    source: data.source,
    value: procedure.price,
    stage: 'novo',
    date: formatBR(TODAY).slice(0, 5),
    initials: data.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
  });
}

/** Resposta automática fora do horário — exclusiva do Crescimento. */
export const leadAutoReply = {
  enabled: true,
  text: 'Oi! Aqui é da Clínica Lumina 💚 Estamos fora do horário agora, mas você já pode escolher seu horário por aqui: {link}. Amanhã cedo a gente te responde.',
  link: clinic.bookingLink,
};

// ── Automações ───────────────────────────────────────────────────────────────
// Cada regra tem: parâmetros, template com variáveis, e a sequência que
// explica o que acontece quando a cliente responde.

const automations: Automation[] = [
  {
    id: 'confirmacao',
    name: 'Confirmação de horário',
    summary: 'Pergunta se a cliente vem e atualiza a agenda com a resposta.',
    icon: 'CheckCheck',
    enabled: true,
    category: 'utilidade',
    sentThisMonth: 214,
    params: [
      { id: 'antecedencia', label: 'Enviar', value: '24h antes', options: ['48h antes', '24h antes', '12h antes', '3h antes'] },
      { id: 'horario', label: 'Horário do disparo', value: '09:00', options: ['08:00', '09:00', '10:00', '18:00'] },
      { id: 'reenvio', label: 'Se não responder', value: 'Lembrar 3h antes', options: ['Não insistir', 'Lembrar 3h antes', 'Lembrar na véspera à noite'] },
    ],
    template: 'Oi {nome}! Confirmando seu horário de amanhã às {horario} para {procedimento}. Responda SIM para confirmar ou NÃO para liberar o horário. 💚',
    sequence: [
      { trigger: 'Cliente responde SIM', outcome: 'O horário fica confirmado na agenda (verde) e ninguém precisa ligar.', tone: 'positivo' },
      { trigger: 'Cliente responde NÃO', outcome: 'O horário é liberado e a Lista de espera é acionada automaticamente para preencher a vaga.', tone: 'neutro' },
      { trigger: 'Cliente não responde', outcome: 'O horário fica como "sem resposta" e aparece no alerta da tela Hoje para você decidir.', tone: 'atencao' },
    ],
  },
  {
    id: 'lista-espera',
    name: 'Lista de espera',
    summary: 'Quando uma vaga abre, oferece para quem está esperando.',
    icon: 'ListPlus',
    enabled: true,
    category: 'utilidade',
    sentThisMonth: 46,
    params: [
      { id: 'quantas', label: 'Oferecer para', value: 'As 3 primeiras da fila', options: ['A primeira da fila', 'As 3 primeiras da fila', 'Todas que combinam'] },
      { id: 'ordem', label: 'Critério de ordem', value: 'Quem pediu primeiro', options: ['Quem pediu primeiro', 'Cliente mais frequente', 'Maior ticket'] },
      { id: 'validade', label: 'Vaga reservada por', value: '2 horas', options: ['30 minutos', '2 horas', '6 horas'] },
    ],
    template: 'Oi {nome}! Abriu uma vaga {horario} para {procedimento}. Quer essa vaga? Responda QUERO que eu já reservo pra você. 😊',
    sequence: [
      { trigger: 'Um horário é cancelado ou recusado', outcome: 'O Lumina procura na lista de espera quem quer aquele procedimento naquele período.', tone: 'neutro' },
      { trigger: 'Primeira cliente responde QUERO', outcome: 'A vaga entra na agenda no nome dela e as outras recebem "a vaga já foi preenchida".', tone: 'positivo' },
      { trigger: 'Ninguém responde no prazo', outcome: 'O horário volta a aparecer como livre na agenda.', tone: 'atencao' },
    ],
  },
  {
    id: 'recall',
    name: 'Recall por procedimento',
    summary: 'Lembra a cliente quando está na hora de repetir o procedimento.',
    icon: 'Repeat',
    enabled: true,
    category: 'utilidade',
    sentThisMonth: 63,
    params: [
      { id: 'base', label: 'Intervalo', value: 'O de cada procedimento', options: ['O de cada procedimento', 'Fixo em 90 dias'] },
      { id: 'antecedencia', label: 'Avisar', value: '7 dias antes do retorno', options: ['15 dias antes', '7 dias antes do retorno', 'No dia do retorno'] },
      { id: 'limite', label: 'Se não responder', value: 'Tentar mais uma vez em 7 dias', options: ['Não insistir', 'Tentar mais uma vez em 7 dias'] },
    ],
    template: 'Oi {nome}! Já faz quase {intervalo} do seu {procedimento}. Quer que eu separe um horário? Tenho {horario} disponível. 💚',
    sequence: [
      { trigger: 'Passa o intervalo do procedimento', outcome: 'A cliente entra no alerta "retorno vencendo" da tela Hoje e a mensagem é preparada.', tone: 'neutro' },
      { trigger: 'Cliente responde que quer', outcome: 'A conversa vai para o inbox marcada como "quer agendar" e você fecha o horário na Agenda.', tone: 'positivo' },
      { trigger: 'Cliente não responde', outcome: 'Uma segunda tentativa sai em 7 dias; depois disso ela entra na régua de inativas.', tone: 'atencao' },
    ],
  },
  {
    id: 'reativacao',
    name: 'Reativação de inativos',
    summary: 'Chama de volta quem parou de aparecer.',
    icon: 'Heart',
    enabled: true,
    category: 'marketing',
    sentThisMonth: 37,
    params: [
      { id: 'janela', label: 'Considerar inativa', value: 'há 90 dias', options: ['há 60 dias', 'há 90 dias', 'há 120 dias', 'há 180 dias'] },
      { id: 'oferta', label: 'Oferta na mensagem', value: 'Sem desconto', options: ['Sem desconto', '10% de retorno', 'Avaliação gratuita'] },
      { id: 'frequencia', label: 'Repetir no máximo', value: '1 vez por trimestre', options: ['1 vez por trimestre', '1 vez por semestre'] },
    ],
    template: 'Oi {nome}, senti sua falta por aqui! Faz {dias} dias do seu último {procedimento}. Quer voltar? Me responde que eu vejo um horário bom pra você.',
    sequence: [
      { trigger: 'Cliente passa da janela sem visita', outcome: 'Entra na lista de reativação da tela Hoje. No Crescimento a mensagem sai sozinha; no Essencial você aprova antes.', tone: 'neutro' },
      { trigger: 'Cliente responde', outcome: 'A conversa aparece no inbox e a cliente volta para "ativa" assim que agendar.', tone: 'positivo' },
      { trigger: 'Mensagem enviada', outcome: 'Conta na franquia de marketing do mês — é a única automação aqui que consome franquia.', tone: 'atencao' },
    ],
  },
  {
    id: 'resposta-lead',
    name: 'Resposta automática a lead',
    summary: 'Responde na hora quem chama fora do horário e manda o link de agendamento.',
    icon: 'Zap',
    enabled: true,
    category: 'utilidade',
    requiresCrescimento: true,
    sentThisMonth: 28,
    params: [
      { id: 'quando', label: 'Responder', value: 'Fora do horário de atendimento', options: ['Sempre', 'Fora do horário de atendimento', 'Só nos fins de semana'] },
      { id: 'link', label: 'Link enviado', value: clinic.bookingLink },
      { id: 'destino', label: 'Novo contato vira', value: 'Lead na coluna "Novos"', options: ['Lead na coluna "Novos"', 'Só conversa no inbox'] },
    ],
    template: 'Oi! Aqui é da {clinica} 💚 Estamos fora do horário agora, mas você já pode escolher seu horário por aqui: {link}. Amanhã cedo a gente te responde.',
    sequence: [
      { trigger: 'Número desconhecido manda mensagem fora do horário', outcome: 'A resposta sai em segundos com o link de agendamento.', tone: 'neutro' },
      { trigger: 'Pessoa agenda pelo link', outcome: 'O horário entra na Agenda e o lead vai direto para "Agendado" no funil.', tone: 'positivo' },
      { trigger: 'Pessoa só responde a mensagem', outcome: 'Vira um card em "Novos" no Funil de Leads, com a conversa já anexada.', tone: 'atencao' },
    ],
  },
];

export function getAutomations() {
  return automations;
}

export function getAutomation(id: string) {
  return automations.find(a => a.id === id) ?? automations[0];
}

export function toggleAutomation(id: string) {
  const a = automations.find(x => x.id === id);
  if (a) a.enabled = !a.enabled;
}

export function setAutomationParam(automationId: string, paramId: string, value: string) {
  const a = automations.find(x => x.id === automationId);
  const p = a?.params.find(x => x.id === paramId);
  if (p) p.value = value;
}

export function setAutomationTemplate(automationId: string, template: string) {
  const a = automations.find(x => x.id === automationId);
  if (a) a.template = template;
}

/** Substitui as variáveis do template por um exemplo real, para a prévia. */
export function renderTemplate(template: string) {
  return template
    .replace(/\{nome\}/g, 'Ana Carolina')
    .replace(/\{horario\}/g, '09:00')
    .replace(/\{procedimento\}/g, 'Toxina Botulínica')
    .replace(/\{intervalo\}/g, '4 meses')
    .replace(/\{dias\}/g, '112')
    .replace(/\{clinica\}/g, clinic.name)
    .replace(/\{link\}/g, clinic.bookingLink);
}

// ── Financeiro ───────────────────────────────────────────────────────────────

const payments = [
  { time: '09:00', clientId: 'c1', procedureId: 'pr1', value: 900, method: 'Pix' },
  { time: '10:45', clientId: 'c2', procedureId: 'pr2', value: 1200, method: 'Cartão' },
  { time: '14:00', clientId: 'c4', procedureId: 'pr4', value: 900, method: 'Pix' },
];

const receivables = [
  { clientId: 'c5', label: 'Pacote Fio de PDO (3/3)', dueISO: '2026-08-30', amount: 800 },
  { clientId: 'c4', label: 'Bioestimulador (3/3)', dueISO: '2026-09-05', amount: 900 },
  { clientId: 'c6', label: 'Drenagem — pacote 10x', dueISO: '2026-09-01', amount: 280 },
  { clientId: 'c3', label: 'Limpeza de Pele', dueISO: '2026-08-15', amount: 280 },
  { clientId: 'c7', label: 'Consulta de Avaliação', dueISO: '2026-08-10', amount: 150 },
];

export function getFinance() {
  const receivedToday = payments.reduce((s, p) => s + p.value, 0);
  const open = receivables.filter(r => daysBetween(r.dueISO, TODAY) <= 0);
  const overdue = receivables.filter(r => daysBetween(r.dueISO, TODAY) > 0);
  return {
    payments,
    receivedToday,
    toReceive: open.reduce((s, r) => s + r.amount, 0),
    open,
    overdue,
    overdueTotal: overdue.reduce((s, r) => s + r.amount, 0),
    monthRevenue: 58420,
    monthGoal: clinic.monthlyGoal,
  };
}

export function getCommissions() {
  return [
    { professionalId: 'p1', procedures: 38, revenue: 42000, commissionPct: 35, commission: 14700, paid: true },
    { professionalId: 'p2', procedures: 24, revenue: 9600, commissionPct: 40, commission: 3840, paid: true },
    { professionalId: 'p3', procedures: 15, revenue: 6820, commissionPct: 38, commission: 2592, paid: false },
  ];
}

// ── Desempenho ───────────────────────────────────────────────────────────────

export function getPerformance() {
  return {
    attendanceRate: 94,
    monthRevenue: 58420,
    inactiveCount: getInactiveClients().length,
    byProfessional: [
      { professionalId: 'p1', revenue: 42000, appointments: 38, attendance: 96 },
      { professionalId: 'p2', revenue: 9600, appointments: 24, attendance: 92 },
      { professionalId: 'p3', revenue: 6820, appointments: 15, attendance: 90 },
    ],
    funnel: [
      { stage: 'Leads recebidos', value: 55 },
      { stage: 'Em contato', value: 41 },
      { stage: 'Proposta enviada', value: 30 },
      { stage: 'Agendados', value: 22 },
      { stage: 'Ganhos', value: 18 },
    ],
    bySource: [
      { source: 'Link de agendamento', leads: 21, won: 9, revenue: 12800 },
      { source: 'Indicação', leads: 14, won: 6, revenue: 9600 },
      { source: 'Redes sociais', leads: 12, won: 2, revenue: 3000 },
      { source: 'WhatsApp', leads: 8, won: 1, revenue: 900 },
    ],
  };
}

// ── Notificações (dropdown do header) ────────────────────────────────────────

export function getNotifications() {
  return [
    { id: 'n1', title: `${getUnconfirmedTomorrow().length} horários de amanhã sem confirmação`, time: 'agora', page: 'hoje' as const },
    { id: 'n2', title: 'Fernanda Oliveira respondeu SIM', time: '09:15', page: 'whatsapp' as const },
    { id: 'n3', title: 'Juliana Torres tem 2 mensagens sem resposta', time: 'ontem', page: 'whatsapp' as const },
  ];
}
