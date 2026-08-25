import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownLeft, AlertCircle, Receipt, FileText, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Plan } from '../types';

const allTabs = ['Visão Geral', 'Contas a Receber', 'Contas a Pagar', 'Comissões', 'Fechamento de Caixa'];
// Básico only shows Visão Geral (limited) and Contas a Receber
const basicoTabs = ['Visão Geral'];

const monthlyData = [
  { mes: 'Abr', receita: 51000, despesas: 22000, lucro: 29000 },
  { mes: 'Mai', receita: 47000, despesas: 20000, lucro: 27000 },
  { mes: 'Jun', receita: 55000, despesas: 24000, lucro: 31000 },
  { mes: 'Jul', receita: 61000, despesas: 26000, lucro: 35000 },
  { mes: 'Ago', receita: 58420, despesas: 23800, lucro: 34620 },
];

const paymentMix = [
  { name: 'Pix', value: 42, color: '#0A6E6E' },
  { name: 'Cartão Crédito', value: 35, color: '#0D9488' },
  { name: 'Cartão Débito', value: 15, color: '#7C3AED' },
  { name: 'Dinheiro', value: 8, color: '#D97706' },
];

const receivables = [
  { client: 'Roberta Lima', procedure: 'Pacote Fio PDO (3/3)', due: '25/08/2026', amount: 800, status: 'pending' },
  { client: 'Patricia Santos', procedure: 'Bioestimulador (2/3)', due: '30/08/2026', amount: 900, status: 'pending' },
  { client: 'Camila Duarte', procedure: 'Drenagem — pacote 10x', due: '01/09/2026', amount: 280, status: 'pending' },
  { client: 'Juliana Torres', procedure: 'Limpeza de Pele', due: '15/08/2026', amount: 280, status: 'overdue' },
  { client: 'Tânia Alves', procedure: 'Consulta Avaliação', due: '10/08/2026', amount: 150, status: 'overdue' },
];

const payables = [
  { supplier: 'Distribuidora Allergan', category: 'Insumos', due: '28/08/2026', amount: 4200, status: 'pending' },
  { supplier: 'Aluguel Sala Jardins', category: 'Infraestrutura', due: '05/09/2026', amount: 6800, status: 'pending' },
  { supplier: 'Software TOTVS', category: 'SaaS', due: '01/09/2026', amount: 890, status: 'pending' },
  { supplier: 'Marketing Digital', category: 'Marketing', due: '30/08/2026', amount: 2500, status: 'pending' },
  { supplier: 'Contabilidade Fiscal', category: 'Serviços', due: '15/08/2026', amount: 650, status: 'paid' },
];

const commissions = [
  { prof: 'Dra. Marina Silva', procedures: 38, revenue: 42000, commPct: 35, commission: 14700, paid: true },
  { prof: 'Camila Rocha', procedures: 24, revenue: 9600, commPct: 40, commission: 3840, paid: true },
  { prof: 'Paulo Mendes', procedures: 15, revenue: 6820, commPct: 38, commission: 2592, paid: false },
];

const cashflow = [
  { time: '09:00', type: 'entrada', desc: 'Ana Carolina — Toxina', value: 900, method: 'Pix' },
  { time: '10:30', type: 'entrada', desc: 'Fernanda Oliveira — Preenchimento', value: 1200, method: 'Cartão' },
  { time: '12:00', type: 'saida', desc: 'Lanche equipe', value: 85, method: 'Dinheiro' },
  { time: '14:00', type: 'entrada', desc: 'Patricia Santos — Bioestimulador', value: 900, method: 'Pix' },
  { time: '15:30', type: 'entrada', desc: 'Roberta Lima — Fio PDO', value: 733, method: 'Cartão' },
  { time: '17:00', type: 'saida', desc: 'Reposição insumos', value: 320, method: 'Pix' },
];

interface FinanceiroProps { plan?: Plan; }

export default function Financeiro({ plan = 'pro' }: FinanceiroProps) {
  const isBasico = plan === 'basico';
  const tabs = isBasico ? basicoTabs : allTabs;
  const [tab, setTab] = useState('Visão Geral');

  const totalEntradas = cashflow.filter(c => c.type === 'entrada').reduce((s, c) => s + c.value, 0);
  const totalSaidas = cashflow.filter(c => c.type === 'saida').reduce((s, c) => s + c.value, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b px-4 shrink-0 overflow-x-auto" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        {allTabs.map(t => {
          const locked = isBasico && !basicoTabs.includes(t);
          return (
            <button key={t} onClick={() => !locked && setTab(t)}
              className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5"
              style={locked
                ? { borderColor: 'transparent', color: 'var(--muted-foreground)', opacity: 0.45, cursor: 'not-allowed' }
                : tab === t
                ? { borderColor: 'var(--primary)', color: 'var(--primary)' }
                : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
              {t}
              {locked && <Lock size={11} />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'Visão Geral' && (
          <div className="space-y-6">
            {isBasico && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                <Lock size={15} style={{ color: '#6366F1', flexShrink: 0 }} />
                <span className="text-sm" style={{ color: '#3730A3' }}>
                  O plano Básico exibe apenas <strong>resumo do mês atual</strong>. Histórico comparativo, comissões e fechamento de caixa estão no plano <strong>Pro</strong>.
                </span>
              </div>
            )}
            {/* KPIs */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Faturamento do Mês', value: 'R$ 58.420', trend: '+12%', up: true, icon: DollarSign },
                { label: 'Lucro Líquido', value: 'R$ 34.620', trend: '+9%', up: true, icon: TrendingUp },
                { label: 'Despesas', value: 'R$ 23.800', trend: '+4%', up: false, icon: TrendingDown },
                { label: 'Ticket Médio', value: 'R$ 1.042', trend: '+7%', up: true, icon: Receipt },
              ].map(({ label, value, trend, up, icon: Icon }) => (
                <div key={label} className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
                      <Icon size={16} style={{ color: 'var(--primary)' }} />
                    </div>
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>
                      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {trend}
                    </span>
                  </div>
                  <div className="text-2xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Receita × Despesas × Lucro</h3>
                <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1E8EF" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                    <Tooltip formatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`} contentStyle={{ background: 'white', border: '1px solid #E1E8EF', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="receita" fill="#0A6E6E" radius={[3, 3, 0, 0]} name="Receita" />
                    <Bar dataKey="despesas" fill="#FDA4AF" radius={[3, 3, 0, 0]} name="Despesas" />
                    <Bar dataKey="lucro" fill="#34D399" radius={[3, 3, 0, 0]} name="Lucro" />
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </div>

              <div className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Mix de Pagamentos</h3>
                <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentMix} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {paymentMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Contas a Receber' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Contas a Receber</h3>
              <div className="text-sm">
                Total em aberto: <strong style={{ color: 'var(--primary)' }}>
                  R$ {receivables.filter(r => r.status !== 'paid').reduce((s, r) => s + r.amount, 0).toLocaleString('pt-BR')}
                </strong>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--secondary)' }}>
                  <tr>{['Cliente', 'Procedimento', 'Vencimento', 'Valor', 'Status', 'Ação'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {receivables.map((r, i) => (
                    <tr key={i} className="hover:bg-secondary/50">
                      <td className="px-4 py-3 font-medium">{r.client}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.procedure}</td>
                      <td className="px-4 py-3 text-xs">{r.due}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--primary)' }}>R$ {r.amount.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={r.status === 'overdue' ? { background: '#FEE2E2', color: '#DC2626' } : { background: '#FFF7ED', color: '#D97706' }}>
                          {r.status === 'overdue' ? 'Vencido' : 'A Vencer'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-2 py-1 rounded-lg font-medium"
                          style={{ background: '#ECFDF5', color: '#059669' }}>Cobrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Contas a Pagar' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Contas a Pagar</h3>
              <div className="text-sm">
                Total previsto: <strong style={{ color: '#DC2626' }}>
                  R$ {payables.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0).toLocaleString('pt-BR')}
                </strong>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--secondary)' }}>
                  <tr>{['Fornecedor', 'Categoria', 'Vencimento', 'Valor', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {payables.map((p, i) => (
                    <tr key={i} className="hover:bg-secondary/50">
                      <td className="px-4 py-3 font-medium">{p.supplier}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.category}</td>
                      <td className="px-4 py-3 text-xs">{p.due}</td>
                      <td className="px-4 py-3 font-semibold text-red-600">R$ {p.amount.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={p.status === 'paid' ? { background: '#ECFDF5', color: '#059669' } : { background: '#FFF7ED', color: '#D97706' }}>
                          {p.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Comissões' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Relatório de Comissões — Agosto 2026</h3>
            </div>
            <div className="space-y-3">
              {commissions.map((c, i) => (
                <div key={i} className="p-5 rounded-xl flex items-center gap-6"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>
                    {c.prof.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{c.prof}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{c.procedures} procedimentos · {c.commPct}% de comissão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">R$ {c.revenue.toLocaleString('pt-BR')}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Faturado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color: 'var(--primary)' }}>
                      R$ {c.commission.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Comissão</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={c.paid ? { background: '#ECFDF5', color: '#059669' } : { background: '#FFF7ED', color: '#D97706' }}>
                    {c.paid ? 'Pago' : 'Pendente'}
                  </span>
                  {!c.paid && (
                    <button className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                      style={{ background: 'var(--primary)' }}>Pagar</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Fechamento de Caixa' && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Fechamento — 23/08/2026</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ background: 'var(--primary)' }}>
                <FileText size={13} /> Exportar PDF
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-4 rounded-xl" style={{ background: '#ECFDF5', border: '1px solid #BBF7D0' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#065F46' }}>Entradas</div>
                <div className="text-xl font-bold" style={{ color: '#059669', fontFamily: 'Instrument Sans, sans-serif' }}>R$ {totalEntradas.toLocaleString('pt-BR')}</div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#991B1B' }}>Saídas</div>
                <div className="text-xl font-bold" style={{ color: '#DC2626', fontFamily: 'Instrument Sans, sans-serif' }}>R$ {totalSaidas.toLocaleString('pt-BR')}</div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Saldo do Dia</div>
                <div className="text-xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'Instrument Sans, sans-serif' }}>R$ {(totalEntradas - totalSaidas).toLocaleString('pt-BR')}</div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--secondary)' }}>
                  <tr>{['Hora', 'Descrição', 'Método', 'Valor'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {cashflow.map((c, i) => (
                    <tr key={i} className="hover:bg-secondary/50">
                      <td className="px-4 py-3 text-xs tabular-nums">{c.time}</td>
                      <td className="px-4 py-3 text-xs">{c.desc}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.method}</td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        <span className="flex items-center gap-1"
                          style={{ color: c.type === 'entrada' ? '#059669' : '#DC2626' }}>
                          {c.type === 'entrada' ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                          R$ {c.value.toLocaleString('pt-BR')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
