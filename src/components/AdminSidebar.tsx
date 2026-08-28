import {
  LayoutDashboard, Building2, Users, Layers, CreditCard,
  MessageSquare, Gauge, LifeBuoy, ShieldAlert, Settings,
  ShieldCheck, LogOut,
} from 'lucide-react';

export type AdminPage =
  | 'admin-dashboard'
  | 'admin-clinica-detalhe'
  | 'admin-usuarios'
  | 'admin-planos'
  | 'admin-assinaturas'
  | 'admin-whatsapp'
  | 'admin-uso'
  | 'admin-suporte'
  | 'admin-logs'
  | 'admin-configuracoes';

interface AdminSidebarProps {
  current: AdminPage;
  onNavigate: (p: AdminPage) => void;
  onLogout: () => void;
}

interface NavEntry { id: AdminPage; label: string; Icon: any; }
interface NavGroup { label: string; items: NavEntry[]; }

const groups: NavGroup[] = [
  { label: 'Principal', items: [
    { id: 'admin-dashboard', label: 'Visão Geral', Icon: LayoutDashboard },
    { id: 'admin-dashboard', label: 'Clínicas', Icon: Building2 },
  ] },
  { label: 'Gestão', items: [
    { id: 'admin-usuarios', label: 'Usuários', Icon: Users },
    { id: 'admin-planos', label: 'Planos', Icon: Layers },
    { id: 'admin-assinaturas', label: 'Assinaturas', Icon: CreditCard },
  ] },
  { label: 'Plataforma', items: [
    { id: 'admin-whatsapp', label: 'WhatsApp', Icon: MessageSquare },
    { id: 'admin-uso', label: 'Uso & Consumo', Icon: Gauge },
  ] },
  { label: 'Suporte', items: [
    { id: 'admin-suporte', label: 'Tickets', Icon: LifeBuoy },
  ] },
  { label: 'Segurança', items: [
    { id: 'admin-logs', label: 'Logs & Auditoria', Icon: ShieldAlert },
  ] },
  { label: 'Configurações', items: [
    { id: 'admin-configuracoes', label: 'Configurações', Icon: Settings },
  ] },
];

export default function AdminSidebar({ current, onNavigate, onLogout }: AdminSidebarProps) {
  // "Clínicas" stays highlighted both on the list and on a clinic's detail page.
  function isActive(id: AdminPage) {
    if (id === 'admin-clinica-detalhe') return current === 'admin-dashboard' || current === 'admin-clinica-detalhe';
    return current === id;
  }

  return (
    <aside className="w-60 flex flex-col h-screen shrink-0 overflow-hidden" style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#4F46E5' }}>
          <ShieldCheck size={16} className="text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white font-semibold text-sm leading-tight truncate" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Painel do Gestor
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Lumina SaaS</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {groups.map(group => (
          <div key={group.label}>
            <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map(({ id, label, Icon }) => {
                const active = isActive(id);
                return (
                  <button
                    key={label}
                    onClick={() => onNavigate(id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left relative"
                    style={active ? { background: 'rgba(79,70,229,0.18)', color: '#A5B4FC' } : { color: 'rgba(255,255,255,0.55)' }}
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="text-sm font-medium truncate">{label}</span>
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: '#A5B4FC' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-2 pb-3 pt-2 border-t border-white/5 shrink-0">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.5)' }}>
          <LogOut size={16} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
