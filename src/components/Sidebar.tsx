import { Sun, Calendar, Users, MessageSquare, TrendingUp, Settings, ChevronLeft, ChevronRight, Building2, Lock } from 'lucide-react';
import type { Page, Plan } from '../types';
import { getPlan } from '../data/mock';
import PlanSwitcher from './PlanSwitcher';

interface SidebarProps {
  current: Page;
  onNavigate: (p: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
  plan: Plan;
  onPlanChange: (p: Plan) => void;
  unreadCount: number;
}

/** Os 5 itens da navegação principal. Configurações fica no rodapé. */
export const navItems = [
  { id: 'hoje' as Page, label: 'Hoje', Icon: Sun },
  { id: 'agenda' as Page, label: 'Agenda', Icon: Calendar },
  { id: 'clientes' as Page, label: 'Clientes', Icon: Users },
  { id: 'whatsapp' as Page, label: 'WhatsApp', Icon: MessageSquare },
  { id: 'leads' as Page, label: 'Leads', Icon: TrendingUp },
];

export default function Sidebar({ current, onNavigate, collapsed, onToggle, plan, onPlanChange, unreadCount }: SidebarProps) {
  const planInfo = getPlan(plan);
  const w = collapsed ? 'w-16' : 'w-60';

  return (
    <aside
      className={`${w} hidden md:flex flex-col h-screen shrink-0 transition-all duration-200 overflow-hidden`}
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent)' }}>
          <Building2 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-white font-semibold text-sm leading-tight truncate" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Clínica Lumina
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full w-fit mt-0.5"
              style={{ background: 'rgba(13,148,136,0.25)', color: '#4DD9CC', fontSize: '10px' }}>
              {planInfo.name}
            </span>
          </div>
        )}
        <button onClick={onToggle}
          className="ml-auto p-1 rounded hover:bg-white/10 transition-colors text-white/40 hover:text-white/80">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ id, label, Icon }) => {
          const active = current === id;
          const locked = id === 'leads' && plan === 'essencial';
          const badge = id === 'whatsapp' ? unreadCount : 0;

          return (
            <button key={id} onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left relative"
              style={active
                ? { background: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-fg)' }
                : { color: locked ? 'rgba(255,255,255,0.3)' : 'var(--sidebar-fg)' }}>
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="text-sm font-medium truncate flex-1">{label}</span>}
              {!collapsed && locked && <Lock size={12} className="shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />}
              {!collapsed && !locked && badge > 0 && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold text-white"
                  style={{ background: '#25D366', fontSize: '10px' }}>{badge}</span>
              )}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: 'var(--sidebar-active-fg)' }} />
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-2 pb-3 pt-2 border-t border-white/5 space-y-0.5">
        <button onClick={() => onNavigate('configuracoes')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          style={current === 'configuracoes'
            ? { background: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-fg)' }
            : { color: 'var(--sidebar-fg)' }}>
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Configurações</span>}
        </button>

        {!collapsed && (
          <div className="px-1 pt-2">
            <PlanSwitcher plan={plan} onChange={onPlanChange} />
          </div>
        )}
      </div>
    </aside>
  );
}
