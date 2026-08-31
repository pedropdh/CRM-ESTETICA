import { useState } from 'react';
import { Bell, Plus, ChevronDown, Settings, User as UserIcon, LogOut } from 'lucide-react';
import type { Page } from '../types';
import { currentUser, getNotifications, roleLabels } from '../data/mock';

const titles: Record<Page, string> = {
  login: 'Entrar',
  onboarding: 'Configuração inicial',
  hoje: 'Hoje',
  agenda: 'Agenda',
  'novo-agendamento': 'Novo agendamento',
  clientes: 'Clientes',
  'cliente-detalhe': 'Ficha da cliente',
  'novo-cliente': 'Nova cliente',
  whatsapp: 'WhatsApp',
  leads: 'Leads',
  'novo-lead': 'Novo lead',
  configuracoes: 'Configurações',
  perfil: 'Meu perfil',
};

const quickActions: Partial<Record<Page, { label: string; page: Page }>> = {
  agenda: { label: 'Agendar', page: 'novo-agendamento' },
  clientes: { label: 'Nova cliente', page: 'novo-cliente' },
  leads: { label: 'Novo lead', page: 'novo-lead' },
};

interface HeaderProps {
  current: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
}

export default function Header({ current, onNavigate, onLogout }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<'none' | 'notif' | 'avatar'>('none');
  const notifications = getNotifications();
  const qa = quickActions[current];
  const initials = currentUser.name.replace('Dra. ', '').split(' ').map(n => n[0]).slice(0, 2).join('');

  function go(page: Page) {
    setOpenMenu('none');
    onNavigate(page);
  }

  return (
    <header className="h-14 flex items-center px-4 md:px-6 gap-2 md:gap-4 shrink-0 relative"
      style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
      <h1 className="text-base font-semibold flex-1 truncate"
        style={{ fontFamily: 'Instrument Sans, sans-serif', color: 'var(--foreground)' }}>
        {titles[current]}
      </h1>

      {qa && (
        <button onClick={() => onNavigate(qa.page)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--primary)' }}>
          <Plus size={14} />
          <span className="hidden sm:inline">{qa.label}</span>
        </button>
      )}

      {/* Notificações — dropdown, não é mais uma página */}
      <button onClick={() => setOpenMenu(m => (m === 'notif' ? 'none' : 'notif'))}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        style={{ color: 'var(--muted-foreground)' }}>
        <Bell size={18} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />
        )}
      </button>

      {/* Avatar — Perfil mora aqui */}
      <button onClick={() => setOpenMenu(m => (m === 'avatar' ? 'none' : 'avatar'))}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-secondary transition-colors">
        <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #0A6E6E 0%, #0D9488 100%)' }}>
          {initials}
        </span>
        <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1]}
        </span>
        <ChevronDown size={13} style={{ color: 'var(--muted-foreground)' }} />
      </button>

      {openMenu !== 'none' && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenMenu('none')} />
          <div className="absolute right-3 z-50 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl overflow-hidden shadow-xl"
            style={{ top: 56, background: 'var(--card)', border: '1px solid var(--border)' }}>
            {openMenu === 'notif' ? (
              <>
                <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b"
                  style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  Notificações
                </div>
                {notifications.map(n => (
                  <button key={n.id} onClick={() => go(n.page)}
                    className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors border-b"
                    style={{ borderColor: 'var(--border)' }}>
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{n.time}</div>
                  </button>
                ))}
              </>
            ) : (
              <>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-sm font-semibold">{currentUser.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {roleLabels[currentUser.role]} · {currentUser.email}
                  </div>
                </div>
                {[
                  { label: 'Meu perfil', Icon: UserIcon, page: 'perfil' as Page },
                  { label: 'Configurações', Icon: Settings, page: 'configuracoes' as Page },
                ].map(({ label, Icon, page }) => (
                  <button key={label} onClick={() => go(page)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-left">
                    <Icon size={15} style={{ color: 'var(--muted-foreground)' }} /> {label}
                  </button>
                ))}
                <button onClick={() => { setOpenMenu('none'); onLogout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-left border-t"
                  style={{ borderColor: 'var(--border)', color: '#DC2626' }}>
                  <LogOut size={15} /> Sair
                </button>
              </>
            )}
          </div>
        </>
      )}
    </header>
  );
}
