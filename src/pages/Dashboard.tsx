import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, Star, Clock, ChevronRight, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { Page, Plan } from '../types';
import { getPlan } from '../data/adminMock';

const revenueData = [
  { mes: 'Mar', valor: 42000, meta: 45000 },
  { mes: 'Abr', valor: 51000, meta: 48000 },
  { mes: 'Mai', valor: 47000, meta: 50000 },
  { mes: 'Jun', valor: 55000, meta: 52000 },
  { mes: 'Jul', valor: 61000, meta: 55000 },
  { mes: 'Ago', valor: 58000, meta: 58000 },
];

const leadsData = [
  { dia: 'Seg', leads: 8 },
  { dia: 'Ter', leads: 12 },
  { dia: 'Qua', leads: 6 },
  { dia: 'Qui', leads: 15 },
  { dia: 'Sex', leads: 11 },
  { dia: 'Sáb', leads: 9 },
];

const todayAppts = [
  { time: '09:00', client: 'Ana Carolina Medeiros', procedure: 'Toxina Botulínica', prof: 'Dra. Marina', status: 'confirmed' },
  { time: '10:00', client: 'Fernanda Oliveira', procedure: 'Preenchimento Labial', prof: 'Dra. Marina', status: 'confirmed' },
  { time: '11:30', client: 'Juliana Torres', procedure: 'Limpeza de Pele', prof: 'Camila Rocha', status: 'pending' },
  { time: '14:00', client: 'Patricia Santos', procedure: 'Bioestimulador de Colágeno', prof: 'Dra. Marina', status: 'confirmed' },
  { time: '15:30', client: 'Roberta Lima', procedure: 'Fio de PDO', prof: 'Paulo Mendes', status: 'confirmed' },
];

const statusColors: Record<string, string> = {
  confirmed: '#059669',
  pending: '#D97706',
  canceled: '#DC2626',
  completed: '#6366F1',
  'no-show': '#9CA3AF',
};

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmado',
  pending: 'Pendente',
  canceled: 'Cancelado',
  completed: 'Concluído',
  'no-show': 'No-show',
};

interface DashboardProps {
  onNavigate: (p: Page) => void;
  plan: Plan;
}

function KpiCard({ label, value, sub, icon: Icon, trend, trendUp }: {
  label: string; value: string; sub: string; icon: any; trend: string; trendUp: boolean
}) {
  return (
    <div className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: 'var(--secondary)' }}>
          <Icon size={18} style={{ color: 'var(--primary)' }} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
        </span>
      </div>
      <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{value}</div>
      <div className="text-sm font-medium mb-0.5">{label}</div>
      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sub}</div>
    </div>
  );
}

export default function Dashboard({ onNavigate, plan }: DashboardProps) {
  const isBasico = plan === 'start';
  const startUsage = 67;
  const startLimit = getPlan('start').appointments;
  const startPct = Math.round((startUsage / startLimit) * 100);

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      {/* Start plan usage alert */}
      {isBasico && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
          <AlertCircle size={16} style={{ color: '#D97706' }} />
          <div className="flex-1 min-w-0">
            <span className="text-sm" style={{ color: '#92400E' }}>
              <strong>{startUsage} de {startLimit} agendamentos</strong> usados este mês no plano Start.
            </span>
            <div className="mt-1.5 h-1.5 rounded-full overflow-hidden w-48" style={{ background: '#FED7AA' }}>
              <div className="h-full rounded-full" style={{ width: `${startPct}%`, background: '#D97706' }} />
            </div>
          </div>
          <button onClick={() => onNavigate('configuracoes')} className="ml-auto text-xs font-semibold whitespace-nowrap flex items-center gap-1"
            style={{ color: '#D97706' }}>
            Fazer upgrade <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Pro alert */}
      {!isBasico && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
          <AlertCircle size={16} style={{ color: '#D97706' }} />
          <span className="text-sm" style={{ color: '#92400E' }}>
            <strong>3 confirmações pendentes</strong> para amanhã — envie lembretes pelo WhatsApp agora.
          </span>
          <button className="ml-auto text-xs font-medium underline" style={{ color: '#D97706' }}>Enviar</button>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Faturamento no Mês" value="R$ 58.420" sub="Meta: R$ 60.000" icon={DollarSign} trend="+12%" trendUp />
        <KpiCard label="Agendamentos Hoje" value="14" sub="2 pendentes de confirmação" icon={Calendar} trend="+3 vs ontem" trendUp />
        <KpiCard label="Novos Clientes" value="23" sub="Mês de agosto" icon={Users} trend="+8%" trendUp />
        <KpiCard label="Taxa de No-show" value="4,2%" sub="Meta: abaixo de 5%" icon={Star} trend="-1.1pp" trendUp />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Faturamento × Meta</h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>6 meses</span>
          </div>
          <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A6E6E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0A6E6E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E8EF" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip formatter={(v) => [`R$ ${Number(v).toLocaleString('pt-BR')}`, '']} contentStyle={{ background: 'white', border: '1px solid #E1E8EF', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="valor" stroke="#0A6E6E" strokeWidth={2} fill="url(#valGrad)" name="Faturamento" />
              <Area type="monotone" dataKey="meta" stroke="#94A3B8" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Meta" />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl relative overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Leads esta semana</h3>
          <div style={{ width: '100%', height: 200, filter: isBasico ? 'blur(4px)' : 'none', pointerEvents: isBasico ? 'none' : 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadsData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E8EF" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #E1E8EF', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="leads" fill="#0D9488" radius={[4, 4, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
          </div>
          {isBasico && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
              style={{ background: 'rgba(255,255,255,0.85)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                style={{ background: '#E0F2F1' }}>
                <Lock size={18} style={{ color: '#0A6E6E' }} />
              </div>
              <p className="text-sm font-semibold mb-1">Funil de Leads</p>
              <p className="text-xs mb-3 text-center px-4" style={{ color: '#64748B' }}>Disponível no plano Pro</p>
              <button onClick={() => onNavigate('leads')}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex items-center gap-1"
                style={{ background: '#0A6E6E' }}>
                Ver mais <ArrowRight size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Today's agenda + funnel summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Agenda de Hoje</h3>
            <button onClick={() => onNavigate('agenda')} className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--accent)' }}>
              Ver completa <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {todayAppts.map((a) => (
              <div key={a.time + a.client} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="text-xs font-semibold w-12 shrink-0 tabular-nums" style={{ color: 'var(--muted-foreground)' }}>{a.time}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.client}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{a.procedure} · {a.prof}</div>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: `${statusColors[a.status]}15`, color: statusColors[a.status] }}>
                  {statusLabels[a.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {/* Top procedures */}
          <div className="p-5 rounded-xl h-full" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Top Procedimentos</h3>
            <div className="space-y-3">
              {[
                { name: 'Toxina Botulínica', pct: 35, count: 42 },
                { name: 'Preenchimento', pct: 25, count: 30 },
                { name: 'Limpeza de Pele', pct: 20, count: 24 },
                { name: 'Bioestimulador', pct: 12, count: 14 },
                { name: 'Outros', pct: 8, count: 10 },
              ].map(({ name, pct, count }) => (
                <div key={name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: 'var(--foreground)' }}>{name}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{count} sessões</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--primary)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
