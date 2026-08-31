import { useState } from 'react';
import {
  Building2, Scissors, DollarSign, Package, Plus, Check, AlertCircle, BarChart2, Link2,
} from 'lucide-react';
import type { Plan } from '../types';
import {
  clinic, formatBR, getClient, getCommissions, getFinance, getMarketingUsage, getPerformance,
  getPlan, getPlans, getProcedures, getProfessional, getProfessionals, getUsers, money, roleLabels,
} from '../data/mock';
import Badge, { usageColor } from '../components/ui/Badge';

interface ConfiguracoesProps {
  plan: Plan;
  onPlanChange: (p: Plan) => void;
}

const tabs = [
  { id: 'clinica', label: 'Clínica & Equipe', Icon: Building2 },
  { id: 'procedimentos', label: 'Procedimentos', Icon: Scissors },
  { id: 'financeiro', label: 'Financeiro', Icon: DollarSign },
  { id: 'plano', label: 'Plano & Consumo', Icon: Package },
] as const;

type TabId = typeof tabs[number]['id'];

export default function Configuracoes({ plan, onPlanChange }: ConfiguracoesProps) {
  const [tab, setTab] = useState<TabId>('clinica');
  // No Crescimento entra uma quinta aba com o relatório de desempenho.
  const [showPerformance, setShowPerformance] = useState(false);

  const planInfo = getPlan(plan);
  const professionals = getProfessionals();
  const extras = Math.max(0, professionals.length - planInfo.professionalsIncluded);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Abas */}
      <div className="flex border-b shrink-0 overflow-x-auto" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        {tabs.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => { setTab(id); setShowPerformance(false); }}
            className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5"
            style={tab === id && !showPerformance
              ? { borderColor: 'var(--primary)', color: 'var(--primary)' }
              : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
            <Icon size={14} /> {label}
          </button>
        ))}
        {plan === 'crescimento' && (
          <button onClick={() => setShowPerformance(true)}
            className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5"
            style={showPerformance
              ? { borderColor: 'var(--primary)', color: 'var(--primary)' }
              : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
            <BarChart2 size={14} /> Desempenho
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {showPerformance ? <Desempenho /> : (
          <>
            {tab === 'clinica' && <ClinicaEquipe plan={plan} extras={extras} />}
            {tab === 'procedimentos' && <Procedimentos />}
            {tab === 'financeiro' && <Financeiro plan={plan} />}
            {tab === 'plano' && <PlanoConsumo plan={plan} onPlanChange={onPlanChange} />}
          </>
        )}
      </div>
    </div>
  );
}

// ── Clínica & Equipe ─────────────────────────────────────────────────────────
// Sem CNPJ obrigatório, sem regime tributário, sem fuso horário.

function ClinicaEquipe({ plan, extras }: { plan: Plan; extras: number }) {
  const planInfo = getPlan(plan);
  const professionals = getProfessionals();
  const users = getUsers();

  return (
    <div className="max-w-2xl space-y-6">
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Dados da clínica</h2>
        <div className="space-y-3 p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {[
            { label: 'Nome da clínica', value: clinic.name },
            { label: 'WhatsApp', value: clinic.whatsapp },
            { label: 'E-mail', value: clinic.email },
            { label: 'Endereço', value: clinic.address },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
              <input defaultValue={value} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {[['Abre às', clinic.opensAt], ['Fecha às', clinic.closesAt]].map(([label, value]) => (
              <div key={label}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
                <input type="time" defaultValue={value} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'var(--secondary)' }}>
            <Link2 size={14} style={{ color: 'var(--primary)' }} />
            <span className="text-xs flex-1 truncate">Link de agendamento: <strong>{clinic.bookingLink}</strong></span>
          </div>
        </div>
      </section>

      {/* Profissionais — são cobrados */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Profissionais</h2>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
            style={{ background: 'var(--primary)', minHeight: 36 }}>
            <Plus size={13} /> Adicionar
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
          style={{ background: extras > 0 ? '#FFF7ED' : 'var(--secondary)', border: `1px solid ${extras > 0 ? '#FED7AA' : 'var(--border)'}` }}>
          <AlertCircle size={14} style={{ color: extras > 0 ? '#D97706' : 'var(--muted-foreground)', flexShrink: 0 }} />
          <span className="text-xs" style={{ color: extras > 0 ? '#92400E' : 'var(--muted-foreground)' }}>
            <strong>{professionals.length} de {planInfo.professionalsIncluded} incluídos</strong> no {planInfo.name} —
            R$ {planInfo.extraProfessionalPrice}/mês por profissional adicional
            {extras > 0 && ` (${extras} adicional${extras > 1 ? 'is' : ''} = R$ ${extras * planInfo.extraProfessionalPrice}/mês)`}.
            Máximo de {planInfo.professionalsMax} neste plano.
          </span>
        </div>
        <div className="space-y-2">
          {professionals.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: p.color }}>{p.initials}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{p.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.specialty}</div>
              </div>
              {i < planInfo.professionalsIncluded
                ? <Badge label="Incluído" color="#059669" bg="#ECFDF5" />
                : <Badge label={`+R$ ${planInfo.extraProfessionalPrice}/mês`} color="#D97706" bg="#FFF7ED" />}
            </div>
          ))}
        </div>
      </section>

      {/* Usuários — não são cobrados */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Usuários</h2>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: 'var(--secondary)', color: 'var(--primary)', minHeight: 36 }}>
            <Plus size={13} /> Convidar
          </button>
        </div>
        <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
          Quem só usa o sistema (recepção, por exemplo) não custa nada — sem limite de usuários.
          {plan === 'essencial' && ' Permissões por papel entram no Crescimento; no Essencial todo mundo vê tudo.'}
        </p>
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>
                {u.name.replace('Dra. ', '').split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{u.name}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{u.email}</div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Badge label={roleLabels[u.role]} color="#0891B2" bg="#E0F7FA" />
                <span className="hidden sm:inline text-xs" style={{ color: 'var(--muted-foreground)' }}>sem custo</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Procedimentos ────────────────────────────────────────────────────────────

function Procedimentos() {
  return (
    <div className="max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Procedimentos</h2>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'var(--primary)', minHeight: 36 }}>
          <Plus size={13} /> Adicionar
        </button>
      </div>
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
        O <strong>intervalo de retorno</strong> é o que faz o recall funcionar: é a partir dele que o Lumina
        sabe quando chamar a cliente de volta.
      </p>
      <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm min-w-[520px]">
          <thead style={{ background: 'var(--secondary)' }}>
            <tr>
              {['Procedimento', 'Duração', 'Preço', 'Comissão', 'Intervalo de retorno', ''].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {getProcedures().map(p => (
              <tr key={p.id} className="hover:bg-secondary/50">
                <td className="px-4 py-3 font-medium whitespace-nowrap">{p.name}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap">{p.durationMin} min</td>
                <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: 'var(--primary)' }}>
                  {p.price > 0 ? money(p.price) : 'Grátis'}
                </td>
                <td className="px-4 py-3 text-xs">{p.commissionPct}%</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: '#E0F2F1', color: 'var(--primary)' }}>
                    {p.returnIntervalDays} dias
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Financeiro ───────────────────────────────────────────────────────────────
// Entradas do dia, a receber, inadimplentes. Comissões só no Crescimento.
// Sem fechamento de caixa, sem contas a pagar, sem mix de pagamentos.

function Financeiro({ plan }: { plan: Plan }) {
  const finance = getFinance();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Entrou hoje', value: money(finance.receivedToday), color: '#059669' },
          { label: 'A receber', value: money(finance.toReceive), color: 'var(--foreground)' },
          { label: 'Em atraso', value: money(finance.overdueTotal), color: '#DC2626' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
          </div>
        ))}
      </div>

      <section>
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Entradas do dia</h3>
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {finance.payments.map((p, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs tabular-nums font-semibold shrink-0" style={{ width: 44 }}>{p.time}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{getClient(p.clientId).name}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{p.method}</div>
              </div>
              <span className="text-sm font-bold shrink-0" style={{ color: '#059669' }}>{money(p.value)}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>A receber</h3>
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {finance.open.map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{getClient(r.clientId).name}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{r.label} · vence {formatBR(r.dueISO)}</div>
              </div>
              <span className="text-sm font-semibold shrink-0">{money(r.amount)}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Inadimplentes</h3>
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {finance.overdue.map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{getClient(r.clientId).name}</div>
                <div className="text-xs truncate" style={{ color: '#DC2626' }}>{r.label} · venceu {formatBR(r.dueISO)}</div>
              </div>
              <span className="text-sm font-bold shrink-0" style={{ color: '#DC2626' }}>{money(r.amount)}</span>
            </div>
          ))}
        </div>
      </section>

      {plan === 'crescimento' && (
        <section>
          <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Comissões por profissional</h3>
          <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-sm min-w-[460px]">
              <thead style={{ background: 'var(--secondary)' }}>
                <tr>
                  {['Profissional', 'Atendimentos', 'Faturamento', '%', 'Comissão', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {getCommissions().map(c => (
                  <tr key={c.professionalId}>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{getProfessional(c.professionalId).name}</td>
                    <td className="px-4 py-3 text-xs">{c.procedures}</td>
                    <td className="px-4 py-3 text-xs">{money(c.revenue)}</td>
                    <td className="px-4 py-3 text-xs">{c.commissionPct}%</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: 'var(--primary)' }}>{money(c.commission)}</td>
                    <td className="px-4 py-3">
                      {c.paid
                        ? <Badge label="Pago" color="#059669" bg="#ECFDF5" />
                        : <Badge label="A pagar" color="#D97706" bg="#FFF7ED" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

// ── Desempenho (Crescimento) ─────────────────────────────────────────────────

function Desempenho() {
  const { byProfessional, funnel, bySource } = getPerformance();
  const maxFunnel = funnel[0].value;

  return (
    <div className="max-w-3xl space-y-6">
      <section>
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Por profissional</h3>
        <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm min-w-[420px]">
            <thead style={{ background: 'var(--secondary)' }}>
              <tr>
                {['Profissional', 'Atendimentos', 'Faturamento', 'Comparecimento'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {byProfessional.map(p => (
                <tr key={p.professionalId}>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{getProfessional(p.professionalId).name}</td>
                  <td className="px-4 py-3 text-xs">{p.appointments}</td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: 'var(--primary)' }}>{money(p.revenue)}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: p.attendance >= 95 ? '#059669' : '#D97706' }}>{p.attendance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Funil de leads</h3>
        <div className="p-4 rounded-xl space-y-2.5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {funnel.map(f => (
            <div key={f.stage}>
              <div className="flex justify-between text-xs mb-1">
                <span>{f.stage}</span>
                <span className="font-semibold">{f.value}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                <div className="h-full rounded-full" style={{ width: `${(f.value / maxFunnel) * 100}%`, background: 'var(--primary)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Por origem</h3>
        <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm min-w-[420px]">
            <thead style={{ background: 'var(--secondary)' }}>
              <tr>
                {['Origem', 'Leads', 'Fechados', 'Faturamento'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {bySource.map(s => (
                <tr key={s.source}>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{s.source}</td>
                  <td className="px-4 py-3 text-xs">{s.leads}</td>
                  <td className="px-4 py-3 text-xs">{s.won}</td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: 'var(--primary)' }}>{money(s.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ── Plano & Consumo ──────────────────────────────────────────────────────────

function PlanoConsumo({ plan, onPlanChange }: { plan: Plan; onPlanChange: (p: Plan) => void }) {
  const planInfo = getPlan(plan);
  const usage = getMarketingUsage(plan);
  const pct = Math.round((usage.sent / usage.quota) * 100);
  const professionals = getProfessionals();
  const extras = Math.max(0, professionals.length - planInfo.professionalsIncluded);
  const total = planInfo.price + extras * planInfo.extraProfessionalPrice;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Plano atual */}
      <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)', color: 'white' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Plano {planInfo.name}</div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>Ativo</span>
        </div>
        <div className="text-3xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          R$ {total}<span className="text-sm font-normal opacity-70">/mês</span>
        </div>
        <div className="text-sm opacity-85 mt-1">
          R$ {planInfo.price} do plano
          {extras > 0 && ` + R$ ${extras * planInfo.extraProfessionalPrice} de ${extras} profissional${extras > 1 ? 'is' : ''} adicional${extras > 1 ? 'is' : ''}`}
        </div>
      </div>

      {/* Consumo de marketing */}
      <section>
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Consumo do mês</h3>
        <div className="p-4 rounded-xl space-y-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Mensagens de marketing</span>
              <span className="font-bold" style={{ color: usageColor(pct) }}>{usage.sent} de {usage.quota}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: usageColor(pct) }} />
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
              Só reativação promocional e campanhas contam aqui.
            </p>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: '#ECFDF5' }}>
            <Check size={14} style={{ color: '#059669' }} />
            <span className="text-xs" style={{ color: '#065F46' }}>
              Confirmação, lista de espera e recall: <strong>ilimitados</strong> nos dois planos.
            </span>
          </div>
        </div>
      </section>

      {/* Os dois planos lado a lado */}
      <section>
        <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Planos</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {getPlans().map(p => {
            const current = p.id === plan;
            return (
              <div key={p.id} className="p-4 rounded-xl flex flex-col"
                style={{ background: current ? 'var(--secondary)' : 'var(--card)', border: current ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                <div className="font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{p.name}</div>
                <div className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{p.tagline}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--primary)', fontFamily: 'Instrument Sans, sans-serif' }}>
                  R$ {p.price}<span className="text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>/mês</span>
                </div>
                <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  {p.professionalsIncluded} profissional{p.professionalsIncluded > 1 ? 'is' : ''} incluído{p.professionalsIncluded > 1 ? 's' : ''} ·
                  R$ {p.extraProfessionalPrice}/mês por adicional (até {p.professionalsMax}) · {p.marketingQuota} mensagens de marketing/mês
                </div>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-1.5 text-xs">
                      <Check size={11} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} /> {f}
                    </li>
                  ))}
                </ul>
                {current
                  ? <div className="text-center text-xs font-semibold py-2" style={{ color: 'var(--primary)' }}>Plano atual</div>
                  : (
                    <button onClick={() => onPlanChange(p.id)}
                      className="w-full py-2.5 rounded-lg text-xs font-semibold text-white"
                      style={{ background: 'var(--primary)', minHeight: 40 }}>
                      Mudar para o {p.name}
                    </button>
                  )}
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--muted-foreground)' }}>
          Tem mais de uma unidade?{' '}
          <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Fale com a gente.</a>
        </p>
      </section>
    </div>
  );
}
