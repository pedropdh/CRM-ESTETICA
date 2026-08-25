import {
  LayoutDashboard, Calendar, Users, TrendingUp, DollarSign,
  MessageSquare, BarChart2, Settings, Bell, ChevronLeft,
  ChevronRight, Building2, Lock
} from 'lucide-react';
import type { Page, Plan } from '../types';
import PlanSwitcher from './PlanSwitcher';

interface SidebarProps {
  current: Page;
  onNavigate: (p: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
  notifCount: number;
  plan: Plan;
  onPlanChange: (p: Plan) => void;
}

const planNames = { basico: 'Básico', pro: 'Pro', redes: 'Redes' };
const planColors = { basico: '#64748B', pro: '#0A6E6E', redes: '#7C3AED' };

// Which pages are locked per plan
const lockedFor: Partial<Record<Page, Plan[]>> = {
  leads: ['basico'],
  mensagens: ['basico'],
};

const navItems = [
  { id: 'dashboard' as Page, label: 'Visão Geral', Icon: LayoutDashboard },
  { id: 'agenda' as Page, label: 'Agenda', Icon: Calendar },
  { id: 'clientes' as Page, label: 'Clientes', Icon: Users },
  { id: 'leads' as Page, label: 'Funil de Leads', Icon: TrendingUp },
  { id: 'financeiro' as Page, label: 'Financeiro', Icon: DollarSign },
  { id: 'mensagens' as Page, label: 'Mensagens', Icon: MessageSquare, badge: 3 },
  { id: 'relatorios' as Page, label: 'Relatórios', Icon: BarChart2 },
];

const bottomItems = [
  { id: 'configuracoes' as Page, label: 'Configurações', Icon: Settings },
];

// Básico: 67 of 100 agendamentos used this month
const BASICO_USAGE = 67;
const BASICO_LIMIT = 100;

export default function Sidebar({ current, onNavigate, collapsed, onToggle, notifCount, plan, onPlanChange }: SidebarProps) {
  const w = collapsed ? 'w-16' : 'w-60';

  function isLocked(page: Page) {
    return lockedFor[page]?.includes(plan) ?? false;
  }

  return (
    <aside
      className={`${w} flex flex-col h-screen shrink-0 transition-all duration-200 overflow-hidden`}
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent)' }}>
          <Building2 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-white font-semibold text-sm leading-tight truncate" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Clínica Lumina</span>
            {/* Plan badge */}
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full w-fit mt-0.5"
              style={{ background: `${planColors[plan]}30`, color: planColors[plan], fontSize: '10px' }}>
              {planNames[plan]}
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded hover:bg-white/10 transition-colors text-white/40 hover:text-white/80"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ id, label, Icon, badge }) => {
          const active = current === id;
          const locked = isLocked(id);

          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left group relative`}
              style={
                locked
                  ? { color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }
                  : active
                  ? { background: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-fg)' }
                  : { color: 'var(--sidebar-fg)' }
              }
            >
              <Icon size={18} className="shrink-0" style={locked ? { opacity: 0.4 } : {}} />
              {!collapsed && (
                <span className="text-sm font-medium truncate flex-1"
                  style={locked ? { opacity: 0.4 } : {}}>{label}</span>
              )}
              {/* Badges / lock */}
              {!collapsed && (
                locked
                  ? <Lock size={12} className="ml-auto shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  : badge
                  ? <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: 'var(--accent)', color: 'white', fontSize: '10px' }}>{badge}</span>
                  : null
              )}
              {active && !locked && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: 'var(--sidebar-active-fg)' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Básico usage bar */}
      {plan === 'basico' && !collapsed && (
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Agendamentos</span>
            <span style={{ color: BASICO_USAGE >= 90 ? '#F59E0B' : 'rgba(255,255,255,0.4)' }}>
              {BASICO_USAGE}/{BASICO_LIMIT}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(BASICO_USAGE / BASICO_LIMIT) * 100}%`,
                background: BASICO_USAGE >= 90 ? '#F59E0B' : '#0D9488',
              }}
            />
          </div>
          <button
            onClick={() => onNavigate('configuracoes')}
            className="mt-2 w-full text-xs py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80 text-center"
            style={{ background: 'rgba(13,148,136,0.2)', color: '#4DD9CC' }}
          >
            Fazer upgrade →
          </button>
        </div>
      )}

      {/* Bottom nav */}
      <div className="px-2 pb-2 pt-2 border-t border-white/5 space-y-0.5">
        <button
          onClick={() => onNavigate('notificacoes')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative"
          style={current === 'notificacoes'
            ? { background: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-fg)' }
            : { color: 'var(--sidebar-fg)' }}
        >
          <div className="relative shrink-0">
            <Bell size={18} />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-white flex items-center justify-center"
                style={{ background: '#EF4444', fontSize: '9px' }}>{notifCount}</span>
            )}
          </div>
          {!collapsed && <span className="text-sm font-medium">Notificações</span>}
        </button>

        {bottomItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
            style={current === id
              ? { background: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-fg)' }
              : { color: 'var(--sidebar-fg)' }}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </button>
        ))}

        {/* Plan switcher (demo) */}
        {!collapsed && (
          <div className="px-1 pt-1">
            <PlanSwitcher plan={plan} onChange={onPlanChange} />
          </div>
        )}

        {/* User */}
        <button
          onClick={() => onNavigate('perfil')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-1"
          style={{ color: 'var(--sidebar-fg)' }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #0A6E6E 0%, #0D9488 100%)' }}>
            DM
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-medium text-white/80 truncate">Dra. Marina Silva</span>
              <span className="text-xs truncate" style={{ color: 'var(--sidebar-fg)', fontSize: '11px' }}>Administradora</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
