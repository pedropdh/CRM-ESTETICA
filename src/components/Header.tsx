import { Bell, Search, Plus, ChevronDown } from 'lucide-react';
import type { Page } from '../types';

const titles: Partial<Record<Page, string>> = {
  dashboard: 'Visão Geral',
  agenda: 'Agenda',
  'novo-agendamento': 'Novo Agendamento',
  clientes: 'Clientes',
  'cliente-detalhe': 'Prontuário do Cliente',
  'novo-cliente': 'Novo Cliente',
  leads: 'Funil de Leads',
  'novo-lead': 'Novo Lead',
  financeiro: 'Financeiro',
  mensagens: 'Mensagens',
  relatorios: 'Relatórios',
  configuracoes: 'Configurações',
  notificacoes: 'Notificações',
  perfil: 'Meu Perfil',
  'estado-vazio': 'Início',
  'acesso-negado': 'Acesso Restrito',
};

const quickActions: Partial<Record<Page, { label: string; page: Page }>> = {
  agenda: { label: 'Novo Agendamento', page: 'novo-agendamento' },
  clientes: { label: 'Novo Cliente', page: 'novo-cliente' },
  leads: { label: 'Novo Lead', page: 'novo-lead' },
};

interface HeaderProps {
  current: Page;
  onNavigate: (p: Page) => void;
  notifCount: number;
}

export default function Header({ current, onNavigate, notifCount }: HeaderProps) {
  const title = titles[current] || 'Sistema';
  const qa = quickActions[current];

  return (
    <header className="h-14 flex items-center px-6 gap-4 shrink-0"
      style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
      <h1 className="text-base font-semibold flex-1" style={{ fontFamily: 'Instrument Sans, sans-serif', color: 'var(--foreground)' }}>
        {title}
      </h1>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm w-56"
        style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
        <Search size={14} />
        <span className="text-sm">Buscar…</span>
      </div>

      {/* Quick action */}
      {qa && (
        <button
          onClick={() => onNavigate(qa.page)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={14} />
          {qa.label}
        </button>
      )}

      {/* Notif */}
      <button
        onClick={() => onNavigate('notificacoes')}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <Bell size={18} />
        {notifCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />
        )}
      </button>

      {/* Avatar */}
      <button
        onClick={() => onNavigate('perfil')}
        className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-secondary transition-colors"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #0A6E6E 0%, #0D9488 100%)' }}>
          DM
        </div>
        <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--foreground)' }}>Dra. Marina</span>
        <ChevronDown size={13} style={{ color: 'var(--muted-foreground)' }} />
      </button>
    </header>
  );
}
