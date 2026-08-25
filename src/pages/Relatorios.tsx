import { useState } from 'react';
import { Download, Lock } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { Plan } from '../types';

const conversionData = [
  { mes: 'Mar', leads: 45, agendados: 28, convertidos: 22, noshow: 3 },
  { mes: 'Abr', leads: 52, agendados: 34, convertidos: 29, noshow: 2 },
  { mes: 'Mai', leads: 38, agendados: 25, convertidos: 20, noshow: 4 },
  { mes: 'Jun', leads: 61, agendados: 41, convertidos: 36, noshow: 2 },
  { mes: 'Jul', leads: 70, agendados: 48, convertidos: 43, noshow: 3 },
  { mes: 'Ago', leads: 55, agendados: 38, convertidos: 33, noshow: 2 },
];

const profData = [
  { name: 'Dra. Marina', faturamento: 42000, atendimentos: 38, satisfacao: 4.9 },
  { name: 'Camila Rocha', faturamento: 9600, atendimentos: 24, satisfacao: 4.8 },
  { name: 'Paulo Mendes', faturamento: 6820, atendimentos: 15, satisfacao: 4.7 },
];

const noshowTrend = [
  { mes: 'Mar', pct: 7.2 }, { mes: 'Abr', pct: 5.8 }, { mes: 'Mai', pct: 6.4 },
  { mes: 'Jun', pct: 4.9 }, { mes: 'Jul', pct: 4.2 }, { mes: 'Ago', pct: 4.2 },
];

const allTabs = ['Conversão', 'Profissionais', 'No-show', 'Multi-unidade'];
// Básico: only essential conversion report (no-show summary only, no professional breakdown)
const basicoLockedTabs = ['Profissionais', 'No-show', 'Multi-unidade'];

interface RelatoriosProps { plan?: Plan; }

export default function Relatorios({ plan = 'pro' }: RelatoriosProps) {
  const isBasico = plan === 'basico';
  const [tab, setTab] = useState('Conversão');
  const [period, setPeriod] = useState('6m');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center border-b px-4 shrink-0 gap-4" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="flex overflow-x-auto">
          {allTabs.map(t => {
            const locked = isBasico && basicoLockedTabs.includes(t);
            return (
              <button key={t} onClick={() => !locked && setTab(t)}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5"
                style={locked
                  ? { borderColor: 'transparent', color: 'var(--muted-foreground)', opacity: 0.4, cursor: 'not-allowed' }
                  : tab === t
                  ? { borderColor: 'var(--primary)', color: 'var(--primary)' }
                  : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
                {t}
                {locked && <Lock size={11} />}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            {['30d', '3m', '6m', '12m'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className="px-3 py-1.5 text-xs font-medium"
                style={period === p ? { background: 'var(--primary)', color: 'white' } : { background: 'var(--card)', color: 'var(--muted-foreground)' }}>
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
            style={{ borderColor: 'var(--border)', color: 'var(--secondary-foreground)' }}>
            <Download size={13} /> Exportar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'Conversão' && (
          <div className="space-y-6">
            {isBasico && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                <Lock size={15} style={{ color: '#6366F1', flexShrink: 0 }} />
                <span className="text-sm" style={{ color: '#3730A3' }}>
                  Plano Básico exibe apenas <strong>relatório essencial de conversão</strong>. Análise por profissional, no-show detalhado e multi-unidade estão no plano <strong>Pro</strong>.
                </span>
              </div>
            )}
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Taxa de Conversão', value: '60%', sub: 'leads → clientes pagantes', color: '#059669' },
                { label: 'No-show Médio', value: '4,2%', sub: 'agendamentos perdidos', color: '#D97706' },
                { label: 'CAC Médio', value: 'R$ 42', sub: 'custo por cliente', color: 'var(--primary)' },
                { label: 'LTV Médio', value: 'R$ 3.480', sub: 'receita por cliente/ano', color: '#7C3AED' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif', color }}>{value}</div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{sub}</div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Funil de Conversão por Mês</h3>
              <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E1E8EF" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #E1E8EF', borderRadius: 8, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar dataKey="leads" fill="#6366F1" radius={[3, 3, 0, 0]} name="Leads" />
                  <Bar dataKey="agendados" fill="#0A6E6E" radius={[3, 3, 0, 0]} name="Agendados" />
                  <Bar dataKey="convertidos" fill="#34D399" radius={[3, 3, 0, 0]} name="Convertidos" />
                  <Bar dataKey="noshow" fill="#FDA4AF" radius={[3, 3, 0, 0]} name="No-show" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'Profissionais' && (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Desempenho por Profissional — Agosto 2026</h3>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--secondary)' }}>
                  <tr>{['Profissional', 'Atendimentos', 'Faturamento', 'Ticket Médio', 'Satisfação'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {profData.map((p, i) => (
                    <tr key={i} className="hover:bg-secondary/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: `hsl(${i * 60 + 170}, 60%, 40%)` }}>
                            {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">{p.atendimentos}</td>
                      <td className="px-5 py-4 font-semibold" style={{ color: 'var(--primary)' }}>R$ {p.faturamento.toLocaleString('pt-BR')}</td>
                      <td className="px-5 py-4">R$ {Math.round(p.faturamento / p.atendimentos).toLocaleString('pt-BR')}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold">{p.satisfacao}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h4 className="font-semibold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Faturamento por Profissional</h4>
              <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profData} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E1E8EF" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v/1000}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip formatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`} contentStyle={{ background: 'white', border: '1px solid #E1E8EF', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="faturamento" fill="#0A6E6E" radius={[0, 4, 4, 0]} name="Faturamento" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'No-show' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'No-show este mês', value: '4,2%', color: '#D97706' },
                { label: 'Perda estimada', value: 'R$ 2.450', color: '#DC2626' },
                { label: 'Melhora em 6 meses', value: '-3,0pp', color: '#059669' },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color }}>{value}</div>
                  <div className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Evolução da Taxa de No-show</h3>
              <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={noshowTrend} margin={{ left: -20, right: 8 }}>
                  <defs>
                    <linearGradient id="noshowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E1E8EF" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, 'No-show']} contentStyle={{ background: 'white', border: '1px solid #E1E8EF', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="pct" stroke="#D97706" strokeWidth={2} fill="url(#noshowGrad)" name="No-show" />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'Multi-unidade' && (
          <div className="space-y-4">
            <div className="p-8 rounded-2xl text-center" style={{ background: 'var(--card)', border: '2px dashed var(--border)' }}>
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Dashboard Multi-unidade</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Disponível no plano <strong>Redes</strong>. Gerencie múltiplas unidades, compare desempenho entre clínicas e consolide relatórios em uma visão única.
              </p>
              <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--primary)' }}>
                Fazer upgrade para Redes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
