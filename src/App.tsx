import { useState } from 'react';
import type { Page, Plan } from './types';

import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Hoje from './pages/Hoje';
import Agenda from './pages/Agenda';
import NovoAgendamento from './pages/NovoAgendamento';
import Clientes from './pages/Clientes';
import ClienteDetalhe from './pages/ClienteDetalhe';
import NovoCliente from './pages/NovoCliente';
import Whatsapp from './pages/Whatsapp';
import Leads from './pages/Leads';
import NovoLead from './pages/NovoLead';
import Configuracoes from './pages/Configuracoes';
import Perfil from './pages/Perfil';

import { getConversations } from './data/mock';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('hoje');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('c1');
  const [plan, setPlan] = useState<Plan>('crescimento');

  function navigate(p: Page) {
    setCurrentPage(p);
  }

  function selectClient(id: string) {
    setSelectedClientId(id);
    setCurrentPage('cliente-detalhe');
  }

  function handleLogin() {
    setIsLoggedIn(true);
    setShowOnboarding(false);
    setCurrentPage('hoje');
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setShowLanding(true);
    setCurrentPage('hoje');
  }

  /** Upgrade sempre leva para a aba Plano & Consumo. */
  function goUpgrade() {
    setCurrentPage('configuracoes');
  }

  if (showLanding) return <Landing onEnter={() => setShowLanding(false)} />;

  if (!isLoggedIn) {
    if (showOnboarding) return <Onboarding onComplete={handleLogin} />;
    return <Login onLogin={handleLogin} onNavigate={navigate} onStartOnboarding={() => setShowOnboarding(true)} />;
  }

  const unreadCount = getConversations().reduce((s, c) => s + c.unread, 0);

  function renderPage() {
    switch (currentPage) {
      case 'hoje':
        return <Hoje onNavigate={navigate} onSelectClient={selectClient} plan={plan} />;
      case 'agenda':
        return <Agenda onNavigate={navigate} onSelectClient={selectClient} />;
      case 'novo-agendamento':
        return <NovoAgendamento onNavigate={navigate} />;
      case 'clientes':
        return <Clientes onNavigate={navigate} onSelectClient={selectClient} />;
      case 'cliente-detalhe':
        return <ClienteDetalhe clientId={selectedClientId} onNavigate={navigate} />;
      case 'novo-cliente':
        return <NovoCliente onNavigate={navigate} />;
      case 'whatsapp':
        return <Whatsapp plan={plan} onNavigate={navigate} onSelectClient={selectClient} onUpgrade={goUpgrade} />;
      case 'leads':
        return <Leads onNavigate={navigate} plan={plan} onUpgrade={goUpgrade} />;
      case 'novo-lead':
        return <NovoLead onNavigate={navigate} />;
      case 'configuracoes':
        return <Configuracoes plan={plan} onPlanChange={setPlan} />;
      case 'perfil':
        return <Perfil onLogout={handleLogout} />;
      default:
        return <Hoje onNavigate={navigate} onSelectClient={selectClient} plan={plan} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar
        current={currentPage}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        plan={plan}
        onPlanChange={setPlan}
        unreadCount={unreadCount}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header current={currentPage} onNavigate={navigate} onLogout={handleLogout} />
        <main className="flex-1 overflow-hidden flex flex-col" style={{ background: 'var(--background)' }}>
          {renderPage()}
        </main>
        <BottomNav current={currentPage} onNavigate={navigate} unreadCount={unreadCount} />
      </div>
    </div>
  );
}
