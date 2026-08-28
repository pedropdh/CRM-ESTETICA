import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, MoreVertical,
  LogIn, RefreshCcw, PauseCircle, PlayCircle, XCircle as XCircleIcon, LifeBuoy,
  CheckCircle2, Clock3, CreditCard, Users2, Gauge, MessageSquare, History,
  Lock, Unlock, KeyRound, Pencil, Check, X,
} from 'lucide-react';
import Badge, { clinicStatusMap, userStatusMap, userRoleMap, whatsappStatusMap, usageColor } from '../components/admin/Badge';
import ConfirmModal from '../components/admin/ConfirmModal';
import {
  getClinic, getPlan, getPlans, usagePct, usersOfClinic, paymentsOfClinic,
  whatsappOfClinic, getSubscriptions, logs as allLogs, type SaasPlanId, type UserStatus,
} from '../data/adminMock';
import type { AdminPage } from '../components/AdminSidebar';

type Tab = 'resumo' | 'usuarios' | 'assinatura' | 'uso' | 'whatsapp' | 'atividade';

const tabs: { id: Tab; label: string; Icon: any }[] = [
  { id: 'resumo', label: 'Resumo', Icon: Building2 },
  { id: 'usuarios', label: 'Usuários', Icon: Users2 },
  { id: 'assinatura', label: 'Assinatura', Icon: CreditCard },
  { id: 'uso', label: 'Uso', Icon: Gauge },
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageSquare },
  { id: 'atividade', label: 'Atividade', Icon: History },
];

const paymentStatusConfig = {
  pago: { label: 'Pago', color: '#16A34A', Icon: CheckCircle2 },
  atrasado: { label: 'Atrasado', color: '#DC2626', Icon: XCircleIcon },
  pendente: { label: 'Pendente', color: '#D97706', Icon: Clock3 },
} as const;

const usageHistory = [
  { mes: 'Mar', agendamentos: 210 }, { mes: 'Abr', agendamentos: 245 }, { mes: 'Mai', agendamentos: 268 },
  { mes: 'Jun', agendamentos: 290 }, { mes: 'Jul', agendamentos: 305 }, { mes: 'Ago', agendamentos: 320 },
];

interface AdminClinicaDetalheProps {
  clinicId: string;
  onBack: () => void;
  onImpersonate: (clinicId: string) => void;
  onNavigate: (p: AdminPage) => void;
}

type PendingAction =
  | { type: 'suspend' } | { type: 'reactivate' } | { type: 'cancel' }
  | { type: 'block-user'; userId: string; name: string } | { type: 'unblock-user'; userId: string; name: string }
  | { type: 'change-plan'; planId: SaasPlanId };

export default function AdminClinicaDetalhe({ clinicId, onBack, onImpersonate, onNavigate }: AdminClinicaDetalheProps) {
  const [tab, setTab] = useState<Tab>('resumo');
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [planPickerOpen, setPlanPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [, forceTick] = useState(0);

  const clinic = getClinic(clinicId);
  if (!clinic) return <div className="p-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>Clínica não encontrada.</div>;

  const plan = getPlan(clinic.planId);
  const sCfg = clinicStatusMap[clinic.status];
  const clinicUsers = usersOfClinic(clinicId);
  const clinicPayments = paymentsOfClinic(clinicId);
  const whatsapp = whatsappOfClinic(clinicId);
  const subscription = getSubscriptions().find(s => s.clinicId === clinicId);
  const clinicLogs = allLogs.filter(l => l.clinicId === clinicId);

  function refresh() { forceTick(t => t + 1); }
  function notify(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function runConfirmed() {
    if (!pending || !clinic) return;
    if (pending.type === 'suspend') { clinic.status = 'suspensa'; notify('Clínica suspensa.'); }
    if (pending.type === 'reactivate') { clinic.status = 'ativa'; notify('Clínica reativada.'); }
    if (pending.type === 'cancel') { clinic.status = 'cancelada'; clinic.mrr = 0; notify('Assinatura cancelada.'); }
    if (pending.type === 'block-user') {
      const u = clinicUsers.find(u => u.id === pending.userId); if (u) u.status = 'bloqueado' as UserStatus;
      notify(`${pending.name} foi bloqueado.`);
    }
    if (pending.type === 'unblock-user') {
      const u = clinicUsers.find(u => u.id === pending.userId); if (u) u.status = 'ativo' as UserStatus;
      notify(`${pending.name} foi reativado.`);
    }
    if (pending.type === 'change-plan') {
      const newPlan = getPlan(pending.planId);
      clinic.planId = pending.planId;
      if (clinic.status === 'ativa') clinic.mrr = newPlan.price;
      notify(`Plano alterado para ${newPlan.name}.`);
    }
    setPending(null);
    refresh();
  }

  return (
    <div className="flex-1 overflow-auto p-6 relative" style={{ background: 'var(--background)' }}>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-4 transition-colors" style={{ color: 'var(--muted-foreground)' }}>
        <ArrowLeft size={14} /> Voltar para todas as clínicas
      </button>

      {/* Header */}
      <div className="p-5 rounded-xl mb-5 flex flex-wrap items-center gap-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#4F46E518' }}>
          <Building2 size={26} style={{ color: '#4F46E5' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{clinic.name}</h1>
            <Badge label={sCfg.label} color={sCfg.color} bg={sCfg.bg} dot />
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#4F46E518', color: '#4F46E5' }}>Plano {plan.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            <span className="flex items-center gap-1"><Users2 size={12} /> {clinic.owner}</span>
            <span className="flex items-center gap-1"><MapPin size={12} /> {clinic.city}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> cliente desde {clinic.since}</span>
          </div>
        </div>

        <div className="flex gap-2 shrink-0 relative">
          <button onClick={() => onImpersonate(clinicId)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: '#4F46E5' }}>
            <LogIn size={13} /> Entrar como administrador
          </button>
          <button onClick={() => setMenuOpen(o => !o)}
            className="p-2 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 w-56 rounded-xl overflow-hidden py-1.5" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(13,27,42,0.12)' }}>
                <MenuItem Icon={Pencil} label="Alterar plano" onClick={() => { setPlanPickerOpen(true); setMenuOpen(false); }} />
                {clinic.status !== 'suspensa' ? (
                  <MenuItem Icon={PauseCircle} label="Suspender clínica" onClick={() => { setPending({ type: 'suspend' }); setMenuOpen(false); }} />
                ) : (
                  <MenuItem Icon={PlayCircle} label="Reativar clínica" onClick={() => { setPending({ type: 'reactivate' }); setMenuOpen(false); }} />
                )}
                <MenuItem Icon={XCircleIcon} label="Cancelar assinatura" danger onClick={() => { setPending({ type: 'cancel' }); setMenuOpen(false); }} />
                <div className="h-px my-1" style={{ background: 'var(--border)' }} />
                <MenuItem Icon={Mail} label="Enviar e-mail" onClick={() => { notify(`E-mail enviado para ${clinic.email}.`); setMenuOpen(false); }} />
                <MenuItem Icon={LifeBuoy} label="Abrir suporte" onClick={() => { setMenuOpen(false); onNavigate('admin-suporte'); }} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={tab === id ? { borderColor: '#4F46E5', color: '#4F46E5' } : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === 'resumo' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">Uso do plano — agendamentos/mês</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{usagePct(clinic, 'appointments')}% do limite</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'var(--muted)' }}>
                <div className="h-full rounded-full" style={{ width: `${usagePct(clinic, 'appointments')}%`, background: usageColor(usagePct(clinic, 'appointments')) }} />
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageHistory} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1E8EF" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E1E8EF', fontSize: 12 }} />
                    <Area type="monotone" dataKey="agendamentos" stroke="#4F46E5" strokeWidth={2} fill="url(#usageGrad)" name="Agendamentos" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="px-4 py-3 flex items-center gap-2 text-sm font-semibold" style={{ background: 'var(--secondary)' }}>
                <CreditCard size={15} /> Histórico de pagamentos
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {clinicPayments.map(p => {
                    const pCfg = paymentStatusConfig[p.status];
                    return (
                      <tr key={p.id} style={{ background: 'var(--card)' }}>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.date}</td>
                        <td className="px-4 py-3 text-sm font-semibold">R$ {p.value}</td>
                        <td className="px-4 py-3"><Badge label={pCfg.label} color={pCfg.color} bg={`${pCfg.color}18`} /></td>
                      </tr>
                    );
                  })}
                  {clinicPayments.length === 0 && (
                    <tr><td colSpan={3} className="text-center py-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>Sem pagamentos registrados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Assinatura</span>
              <div className="text-2xl font-bold mt-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                R$ {plan.price}<span className="text-sm font-normal" style={{ color: 'var(--muted-foreground)' }}>/mês</span>
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Plano {plan.name} · cobrança mensal</div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span style={{ color: 'var(--muted-foreground)' }}>Status</span><span className="font-medium" style={{ color: sCfg.color }}>{sCfg.label}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--muted-foreground)' }}>Cliente desde</span><span className="font-medium">{clinic.since}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--muted-foreground)' }}>Última atividade</span><span className="font-medium">{clinic.lastActive}</span></div>
              </div>
              {clinic.status === 'inadimplente' && (
                <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  Pagamento em atraso. Cobrança automática reagendada.
                </div>
              )}
              {clinic.status === 'suspensa' && (
                <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: '#FFF7ED', color: '#D97706' }}>
                  Clínica suspensa pelo gestor do sistema.
                </div>
              )}
            </div>

            <div className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Contato</span>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center gap-2"><Mail size={13} style={{ color: 'var(--muted-foreground)' }} /> {clinic.email}</div>
                <div className="flex items-center gap-2"><Phone size={13} style={{ color: 'var(--muted-foreground)' }} /> {clinic.phone}</div>
                <div className="flex items-center gap-2"><MapPin size={13} style={{ color: 'var(--muted-foreground)' }} /> {clinic.city}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'usuarios' && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--secondary)' }}>
              <tr>
                {['Nome', 'E-mail', 'Função', 'Status', 'Último acesso', 'Cadastro', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {clinicUsers.map(u => {
                const roleCfg = userRoleMap[u.role];
                const statusCfg = userStatusMap[u.status];
                return (
                  <tr key={u.id} style={{ background: 'var(--card)' }}>
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.email}</td>
                    <td className="px-4 py-3"><Badge label={roleCfg.label} color={roleCfg.color} bg={roleCfg.bg} /></td>
                    <td className="px-4 py-3"><Badge label={statusCfg.label} color={statusCfg.color} bg={statusCfg.bg} /></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.lastAccess}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <IconBtn title="Editar" onClick={() => notify(`Edição de ${u.name} (mock).`)}><Pencil size={13} /></IconBtn>
                        <IconBtn title="Redefinir acesso" onClick={() => notify(`Link de redefinição enviado para ${u.email}.`)}><KeyRound size={13} /></IconBtn>
                        {u.status === 'ativo' ? (
                          <IconBtn title="Bloquear" danger onClick={() => setPending({ type: 'block-user', userId: u.id, name: u.name })}><Lock size={13} /></IconBtn>
                        ) : (
                          <IconBtn title="Reativar" onClick={() => setPending({ type: 'unblock-user', userId: u.id, name: u.name })}><Unlock size={13} /></IconBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {clinicUsers.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhum usuário cadastrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'assinatura' && subscription && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          <div className="p-5 rounded-xl space-y-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {[
              ['Plano atual', plan.name],
              ['Valor', `R$ ${plan.price}/mês`],
              ['Periodicidade', 'Mensal'],
              ['Status', clinicStatusMap[clinic.status].label],
              ['Próxima cobrança', subscription.nextBilling],
              ['Forma de pagamento', subscription.paymentMethod],
              ['Data de início', subscription.startDate],
              ['Data de renovação', subscription.nextBilling],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-xl space-y-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Ações</span>
            <button onClick={() => setPlanPickerOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: '#4F46E5' }}>
              <Pencil size={14} /> Alterar plano
            </button>
            {clinic.status !== 'cancelada' ? (
              <button onClick={() => setPending({ type: 'cancel' })}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                <XCircleIcon size={14} /> Cancelar assinatura
              </button>
            ) : (
              <button onClick={() => setPending({ type: 'reactivate' })}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                <RefreshCcw size={14} /> Reativar assinatura
              </button>
            )}
          </div>
        </div>
      )}

      {tab === 'uso' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
          {([
            ['Profissionais', clinic.usage.professionals, plan.professionals, ''],
            ['Usuários', clinic.usage.users, plan.users, ''],
            ['Clientes', clinic.usage.clients, plan.clients, ''],
            ['Agendamentos/mês', clinic.usage.appointments, plan.appointments, ''],
            ['Armazenamento', clinic.usage.storageGb, plan.storageGb, ' GB'],
          ] as [string, number, number, string][]).map(([label, used, limit, unit]) => {
            const pct = limit < 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
            return (
              <div key={label} className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{label}</span>
                  <span style={{ color: 'var(--muted-foreground)' }}>{used}{unit} / {limit < 0 ? '∞' : `${limit}${unit}`}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                  <div className="h-full rounded-full" style={{ width: `${limit < 0 ? 8 : pct}%`, background: limit < 0 ? '#4F46E5' : usageColor(pct) }} />
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{limit < 0 ? 'Ilimitado' : `${pct}% utilizado`}</div>
              </div>
            );
          })}
          {plan.ai && (
            <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium">IA — tokens/mês</span>
                <span style={{ color: 'var(--muted-foreground)' }}>{clinic.usage.aiTokens.toLocaleString('pt-BR')} / 1.000.000</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                <div className="h-full rounded-full" style={{ width: `${usagePct(clinic, 'aiTokens')}%`, background: usageColor(usagePct(clinic, 'aiTokens')) }} />
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{usagePct(clinic, 'aiTokens')}% utilizado</div>
            </div>
          )}
        </div>
      )}

      {tab === 'whatsapp' && (
        <div className="max-w-2xl p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {whatsapp ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold">{whatsapp.number}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Número conectado</div>
                </div>
                <Badge label={whatsappStatusMap[whatsapp.status].label} color={whatsappStatusMap[whatsapp.status].color} bg={whatsappStatusMap[whatsapp.status].bg} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
                <div><div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Enviadas</div><div className="font-semibold">{whatsapp.sent.toLocaleString('pt-BR')}</div></div>
                <div><div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Recebidas</div><div className="font-semibold">{whatsapp.received.toLocaleString('pt-BR')}</div></div>
                <div><div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Com erro</div><div className="font-semibold" style={{ color: whatsapp.errors > 0 ? '#DC2626' : undefined }}>{whatsapp.errors}</div></div>
                <div><div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Último webhook</div><div className="font-semibold">{whatsapp.lastWebhook}</div></div>
                <div><div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Última atividade</div><div className="font-semibold">{whatsapp.lastActivity}</div></div>
              </div>
              {whatsapp.lastError && (
                <div className="p-3 rounded-lg text-xs" style={{ background: '#FEF2F2', color: '#DC2626' }}>Último erro: {whatsapp.lastError}</div>
              )}
            </>
          ) : (
            <div className="text-sm text-center py-6" style={{ color: 'var(--muted-foreground)' }}>Nenhuma conexão de WhatsApp configurada.</div>
          )}
        </div>
      )}

      {tab === 'atividade' && (
        <div className="rounded-xl overflow-hidden max-w-3xl" style={{ border: '1px solid var(--border)' }}>
          {clinicLogs.length === 0 && (
            <div className="p-6 text-center text-sm" style={{ color: 'var(--muted-foreground)', background: 'var(--card)' }}>Nenhuma atividade registrada.</div>
          )}
          {clinicLogs.map((l, i) => (
            <div key={l.id} className="flex items-start gap-3 px-4 py-3" style={{ background: 'var(--card)', borderTop: i > 0 ? '1px solid var(--border)' : undefined }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: l.result === 'sucesso' ? '#F0FDF4' : '#FEF2F2' }}>
                {l.result === 'sucesso' ? <Check size={13} style={{ color: '#16A34A' }} /> : <X size={13} style={{ color: '#DC2626' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">{l.action}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{l.actor} · {l.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan picker modal */}
      {planPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,27,42,0.5)' }} onClick={() => setPlanPickerOpen(false)}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: 'var(--card)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Alterar plano de {clinic.name}</h3>
            <div className="space-y-2 mb-5">
              {getPlans().map(p => (
                <button key={p.id} onClick={() => { setPlanPickerOpen(false); setPending({ type: 'change-plan', planId: p.id }); }}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-lg border text-left transition-colors"
                  style={p.id === clinic.planId ? { borderColor: '#4F46E5', background: '#EEF2FF' } : { borderColor: 'var(--border)' }}>
                  <div>
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>R$ {p.price}/mês</div>
                  </div>
                  {p.id === clinic.planId && <Check size={16} style={{ color: '#4F46E5' }} />}
                </button>
              ))}
            </div>
            <button onClick={() => setPlanPickerOpen(false)} className="w-full py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal for sensitive actions */}
      {pending && (
        <ConfirmModal
          title={
            pending.type === 'suspend' ? 'Suspender clínica?' :
            pending.type === 'reactivate' ? 'Reativar clínica?' :
            pending.type === 'cancel' ? 'Cancelar assinatura?' :
            pending.type === 'block-user' ? `Bloquear ${pending.name}?` :
            pending.type === 'unblock-user' ? `Reativar ${pending.name}?` :
            `Alterar plano para ${getPlan(pending.planId).name}?`
          }
          description={
            pending.type === 'suspend' ? 'A clínica perde acesso imediato ao sistema até ser reativada. Os dados são preservados.' :
            pending.type === 'reactivate' ? 'A clínica volta a ter acesso normal ao sistema imediatamente.' :
            pending.type === 'cancel' ? 'A assinatura será cancelada e o MRR desta clínica passa a zero. Essa ação pode ser revertida reativando a assinatura.' :
            pending.type === 'block-user' ? 'O usuário perde acesso imediato ao sistema da clínica até ser reativado.' :
            pending.type === 'unblock-user' ? 'O usuário volta a ter acesso normal ao sistema da clínica.' :
            `A cobrança mensal passa a ser de R$ ${getPlan(pending.planId).price}. Os limites de uso são atualizados imediatamente.`
          }
          confirmLabel={
            pending.type === 'suspend' ? 'Suspender' :
            pending.type === 'reactivate' ? 'Reativar' :
            pending.type === 'cancel' ? 'Cancelar assinatura' :
            pending.type === 'block-user' ? 'Bloquear' :
            pending.type === 'unblock-user' ? 'Reativar' : 'Confirmar alteração'
          }
          danger={pending.type === 'suspend' || pending.type === 'cancel' || pending.type === 'block-user'}
          onConfirm={runConfirmed}
          onCancel={() => setPending(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg" style={{ background: '#0D1B2A' }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function MenuItem({ Icon, label, onClick, danger }: { Icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors hover:bg-secondary"
      style={{ color: danger ? '#DC2626' : 'var(--foreground)' }}>
      <Icon size={14} /> {label}
    </button>
  );
}

function IconBtn({ children, title, onClick, danger }: { children: React.ReactNode; title: string; onClick: () => void; danger?: boolean }) {
  return (
    <button title={title} onClick={onClick}
      className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
      style={{ color: danger ? '#DC2626' : 'var(--muted-foreground)' }}>
      {children}
    </button>
  );
}
