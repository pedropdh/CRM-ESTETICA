import { useState } from 'react';
import {
  Send, Repeat, ListPlus, Check, Clock, ChevronRight, Heart,
  ArrowUpRight, Wallet, Target, Percent, UserMinus,
} from 'lucide-react';
import type { Page, Plan } from '../types';
import {
  TODAY, TOMORROW, appointmentStatusMap, daysSinceLastVisit, formatBR, getAppointmentsByDate,
  getClient, getClientsDueForRecall, getFinance, getInactiveClients, getPerformance,
  getProcedure, getProfessional, getUnconfirmedTomorrow, getWaitlist, money,
  offerSlotToAll, periodLabels, sendConfirmationsForTomorrow, sendReactivation, sendRecall,
} from '../data/mock';
import Badge from '../components/ui/Badge';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';

interface HojeProps {
  onNavigate: (p: Page) => void;
  onSelectClient: (id: string) => void;
  plan: Plan;
}

type AlertKind = 'confirmacao' | 'recall' | 'espera' | null;

export default function Hoje({ onNavigate, onSelectClient, plan }: HojeProps) {
  const [, forceTick] = useState(0);
  const [modal, setModal] = useState<AlertKind>(null);
  const [done, setDone] = useState<Record<string, string>>({});

  const tick = () => forceTick(t => t + 1);

  const unconfirmed = getUnconfirmedTomorrow();
  const dueRecall = getClientsDueForRecall(7);
  // Quem da lista de espera ainda não recebeu oferta.
  const waiting = getWaitlist().filter(w => !w.offeredFor);
  const todayAppts = getAppointmentsByDate(TODAY);
  const finance = getFinance();
  const performance = getPerformance();
  const inactives = getInactiveClients(90);

  const goalPct = Math.min(100, Math.round((finance.monthRevenue / finance.monthGoal) * 100));

  const alerts = [
    {
      id: 'confirmacao' as const,
      Icon: Send,
      color: '#D97706',
      bg: '#FFF7ED',
      count: unconfirmed.length,
      title: `${unconfirmed.length} horários de amanhã sem confirmação`,
      sub: `${formatBR(TOMORROW)} · a mensagem pergunta se a cliente vem e atualiza a agenda com a resposta`,
      action: 'Enviar confirmação',
    },
    {
      id: 'recall' as const,
      Icon: Repeat,
      color: '#0891B2',
      bg: '#E0F7FA',
      count: dueRecall.length,
      title: `${dueRecall.length} clientes com retorno vencendo esta semana`,
      sub: 'Passou o intervalo do procedimento — hora de chamar para a próxima sessão',
      action: 'Enviar recall',
    },
    {
      id: 'espera' as const,
      Icon: ListPlus,
      color: '#7C3AED',
      bg: '#F5F3FF',
      count: waiting.length,
      title: `${waiting.length} na lista de espera para horários que abriram`,
      sub: 'Ofereça a vaga para quem já pediu esse procedimento',
      action: 'Oferecer vaga',
    },
  ].filter(a => a.count > 0 || done[a.id]);

  function runAction(kind: AlertKind) {
    if (kind === 'confirmacao') {
      const n = sendConfirmationsForTomorrow();
      setDone(d => ({ ...d, confirmacao: `${n} confirmações enviadas — as respostas aparecem na Agenda.` }));
    }
    if (kind === 'recall') {
      const n = sendRecall(dueRecall.map(x => x.client.id));
      setDone(d => ({ ...d, recall: `${n} recalls enviados. Não conta na franquia de marketing.` }));
    }
    if (kind === 'espera') {
      offerSlotToAll(waiting.map(w => w.id), 'horário que abriu hoje');
      setDone(d => ({ ...d, espera: `${waiting.length} clientes avisadas. A primeira que responder QUERO fica com a vaga.` }));
    }
    setModal(null);
    tick();
  }

  function reactivate(clientIds: string[]) {
    sendReactivation(clientIds);
    setDone(d => ({ ...d, reativacao: `${clientIds.length} mensagens de reativação enviadas (contam na franquia de marketing).` }));
    tick();
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto pb-10">

        {/* ── 1. Alertas acionáveis ── */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
            Precisa de você agora
          </h2>

          {alerts.length === 0 && (
            <div className="p-5 rounded-xl flex items-center gap-3" style={{ background: '#ECFDF5', border: '1px solid #BBF7D0' }}>
              <Check size={18} style={{ color: '#059669' }} />
              <span className="text-sm font-medium" style={{ color: '#065F46' }}>
                Tudo em dia. Nenhuma ação pendente por aqui.
              </span>
            </div>
          )}

          {alerts.map(({ id, Icon, color, bg, title, sub, action, count }) => (
            <div key={id} className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderLeft: `4px solid ${color}` }}>
              <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={17} style={{ color }} />
              </span>
              <div className="flex-1 min-w-0">
                {done[id] ? (
                  <>
                    <div className="text-sm font-semibold flex items-center gap-1.5" style={{ color: '#059669' }}>
                      <Check size={14} /> Feito
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{done[id]}</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{sub}</div>
                  </>
                )}
              </div>
              {!done[id] && count > 0 && (
                <button onClick={() => setModal(id)}
                  className="shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: color, minHeight: 44 }}>
                  {action}
                </button>
              )}
            </div>
          ))}
        </section>

        {/* ── 2. Agenda de hoje ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
              Agenda de hoje · {formatBR(TODAY)}
            </h2>
            <button onClick={() => onNavigate('agenda')}
              className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--primary)' }}>
              Ver agenda <ChevronRight size={13} />
            </button>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {todayAppts.length === 0 ? (
              <EmptyState compact Icon={Clock} title="Agenda livre hoje"
                description="Nenhum horário marcado. Boa hora para oferecer vagas para a lista de espera." />
            ) : (
              todayAppts.map(a => {
                const client = getClient(a.clientId);
                const status = appointmentStatusMap[a.status];
                return (
                  <button key={a.id} onClick={() => onSelectClient(a.clientId)}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-secondary/60 transition-colors text-left"
                    style={{ borderColor: 'var(--border)' }}>
                    <span className="w-1 h-10 rounded-full shrink-0" style={{ background: status.color }} />
                    <span className="text-sm font-semibold tabular-nums shrink-0" style={{ width: 46 }}>{a.time}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{client.name}</span>
                      <span className="block text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
                        {getProcedure(a.procedureId).name} · {getProfessional(a.professionalId).shortName}
                      </span>
                    </span>
                    <Badge label={status.label} color={status.color} bg={status.bg} />
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* ── 3. Dinheiro ── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)' }}>
            Dinheiro
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight size={15} style={{ color: '#059669' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Entrou hoje</span>
              </div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#059669' }}>
                {money(finance.receivedToday)}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                {finance.payments.length} pagamentos
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={15} style={{ color: '#D97706' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>A receber</span>
              </div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                {money(finance.toReceive)}
              </div>
              <div className="text-xs mt-1" style={{ color: finance.overdueTotal > 0 ? '#DC2626' : 'var(--muted-foreground)' }}>
                {money(finance.overdueTotal)} em atraso
              </div>
            </div>

            <div className="p-4 rounded-xl col-span-2 lg:col-span-1" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Target size={15} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Faturamento do mês</span>
              </div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                {money(finance.monthRevenue)}
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: 'var(--secondary)' }}>
                <div className="h-full rounded-full" style={{ width: `${goalPct}%`, background: 'var(--primary)' }} />
              </div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
                {goalPct}% da meta de {money(finance.monthGoal)}
              </div>
            </div>
          </div>
        </section>

        {/* ── Três números do mês (o que sobrou de Relatórios) ── */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: 'Comparecimento', value: `${performance.attendanceRate}%`, Icon: Percent, color: '#059669' },
            { label: 'Faturamento', value: money(performance.monthRevenue), Icon: Wallet, color: 'var(--primary)' },
            { label: 'Inativas', value: performance.inactiveCount, Icon: UserMinus, color: '#D97706' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <Icon size={14} className="mx-auto mb-1.5" style={{ color }} />
              <div className="text-base md:text-lg font-bold truncate" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
            </div>
          ))}
        </section>

        {/* ── 4. Retenção ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
              Clientes sem visita há 90+ dias
            </h2>
            {inactives.length > 0 && !done.reativacao && (
              <button onClick={() => reactivate(inactives.map(c => c.id))}
                className="text-xs font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg"
                style={{ background: '#FEF2F2', color: '#DC2626', minHeight: 36 }}>
                <Heart size={12} /> Reativar todas
              </button>
            )}
          </div>

          {done.reativacao && (
            <div className="mb-3 p-3 rounded-xl text-xs flex items-center gap-2" style={{ background: '#ECFDF5', color: '#065F46' }}>
              <Check size={14} /> {done.reativacao}
            </div>
          )}

          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {inactives.length === 0 ? (
              <EmptyState compact Icon={Heart} title="Ninguém sumiu"
                description="Todas as clientes vieram nos últimos 90 dias." />
            ) : (
              inactives.map(c => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={() => onSelectClient(c.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>
                    {c.initials}
                  </button>
                  <button onClick={() => onSelectClient(c.id)} className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
                      Última visita em {formatBR(c.lastVisit)} · {daysSinceLastVisit(c)} dias
                    </div>
                  </button>
                  <button onClick={() => reactivate([c.id])}
                    className="shrink-0 px-3 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: '#FEF2F2', color: '#DC2626', minHeight: 36 }}>
                    Reativar
                  </button>
                </div>
              ))
            )}
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
            {plan === 'crescimento'
              ? 'No Crescimento essa régua roda sozinha — aqui você só antecipa o disparo.'
              : 'No Essencial a reativação é manual: você decide quando disparar.'}
          </p>
        </section>
      </div>

      {/* Confirmações das ações */}
      {modal === 'confirmacao' && (
        <ConfirmModal
          title="Enviar confirmação de amanhã"
          description={`${unconfirmed.length} clientes vão receber a mensagem perguntando se vêm. Quem responder SIM fica confirmada na agenda; quem responder NÃO libera o horário para a lista de espera.`}
          confirmLabel="Enviar agora"
          onConfirm={() => runAction('confirmacao')}
          onCancel={() => setModal(null)}
        >
          <div className="space-y-1.5">
            {unconfirmed.map(a => (
              <div key={a.id} className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                <span className="tabular-nums font-semibold">{a.time}</span>
                <span className="truncate">{getClient(a.clientId).name}</span>
                <span className="ml-auto truncate" style={{ color: 'var(--muted-foreground)' }}>
                  {getProcedure(a.procedureId).name}
                </span>
              </div>
            ))}
          </div>
        </ConfirmModal>
      )}

      {modal === 'recall' && (
        <ConfirmModal
          title="Enviar recall de retorno"
          description="Mensagem de utilidade — não consome franquia de marketing em nenhum dos planos."
          confirmLabel="Enviar recall"
          onConfirm={() => runAction('recall')}
          onCancel={() => setModal(null)}
        >
          <div className="space-y-1.5">
            {dueRecall.map(({ client, next }) => (
              <div key={client.id} className="text-xs p-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                <div className="font-semibold">{client.name}</div>
                <div style={{ color: 'var(--muted-foreground)' }}>
                  {next!.procedure.name} · retorno {next!.overdue ? 'venceu' : 'vence'} em {formatBR(next!.dueISO)}
                </div>
              </div>
            ))}
          </div>
        </ConfirmModal>
      )}

      {modal === 'espera' && (
        <ConfirmModal
          title="Oferecer vaga para a lista de espera"
          description="Todas recebem a oferta ao mesmo tempo. A primeira que responder QUERO fica com o horário; as outras recebem um aviso de que a vaga foi preenchida."
          confirmLabel="Oferecer vaga"
          onConfirm={() => runAction('espera')}
          onCancel={() => setModal(null)}
        >
          <div className="space-y-1.5">
            {waiting.map(w => (
              <div key={w.id} className="text-xs p-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                <div className="font-semibold">{getClient(w.clientId).name}</div>
                <div style={{ color: 'var(--muted-foreground)' }}>
                  {getProcedure(w.procedureId).name} · {periodLabels[w.preferredPeriod]}
                  {w.professionalId ? ` · ${getProfessional(w.professionalId).shortName}` : ''}
                </div>
              </div>
            ))}
          </div>
        </ConfirmModal>
      )}
    </div>
  );
}
