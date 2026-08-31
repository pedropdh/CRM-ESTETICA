import type { Page } from '../types';
import { navItems } from './Sidebar';

interface BottomNavProps {
  current: Page;
  onNavigate: (p: Page) => void;
  unreadCount: number;
}

/** No celular (≤768px) a sidebar vira este menu inferior com os 5 itens. */
export default function BottomNav({ current, onNavigate, unreadCount }: BottomNavProps) {
  return (
    <nav className="md:hidden flex shrink-0 z-30"
      style={{
        background: 'var(--sidebar-bg)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
      {navItems.map(({ id, label, Icon }) => {
        const active = current === id;
        const badge = id === 'whatsapp' ? unreadCount : 0;
        return (
          <button key={id} onClick={() => onNavigate(id)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 relative"
            style={{ color: active ? 'var(--sidebar-active-fg)' : 'var(--sidebar-fg)', minHeight: 56 }}>
            <span className="relative">
              <Icon size={20} />
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-2 rounded-full text-white font-bold flex items-center justify-center"
                  style={{ background: '#25D366', fontSize: '9px', minWidth: 15, height: 15, padding: '0 3px' }}>
                  {badge}
                </span>
              )}
            </span>
            <span className="text-xs font-medium" style={{ fontSize: 10.5 }}>{label}</span>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                style={{ background: 'var(--sidebar-active-fg)' }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
