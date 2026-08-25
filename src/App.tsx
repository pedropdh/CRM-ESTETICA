import { useState } from 'react';
import type { Page, Plan } from './types';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Leads from './pages/Leads';
import Clientes from './pages/Clientes';
import ClienteDetalhe from './pages/ClienteDetalhe';
import Financeiro from './pages/Financeiro';
import Mensagens from './pages/Mensagens';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import Notificacoes from './pages/Notificacoes';
import Perfil from './pages/Perfil';
import NovoAgendamento from './pages/NovoAgendamento';
import NovoCliente from './pages/NovoCliente';
import NovoLead from './pages/NovoLead';
import EstadoVazio from './pages/EstadoVazio';
import AcessoNegado from './pages/AcessoNegado';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('1');
  const [plan, setPlan] = useState<Plan>('pro');

  function navigate(p: Page) {
    setCurrentPage(p);
  }

  function handleLogin() {
    setIsLoggedIn(true);
    setShowOnboarding(false);
    setCurrentPage('dashboard');
  }

  function goUpgrade() {
    setCurrentPage('configuracoes');
  }

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />;
  }

  if (!isLoggedIn) {
    if (showOnboarding) {
      return <Onboarding onComplete={handleLogin} />;
    }
    return <Login onLogin={handleLogin} onNavigate={navigate} />;
  }

  const NOTIF_COUNT = 3;

  function renderPage() {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} plan={plan} />;
      case 'agenda':
        return <Agenda onNavigate={navigate} />;
      case 'novo-agendamento':
        return <NovoAgendamento onNavigate={navigate} />;
      case 'clientes':
        return (
          <Clientes
            onNavigate={navigate}
            onSelectClient={(id) => { setSelectedClientId(id); navigate('cliente-detalhe'); }}
          />
        );
      case 'cliente-detalhe':
        return <ClienteDetalhe clientId={selectedClientId} onNavigate={navigate} />;
      case 'novo-cliente':
        return <NovoCliente onNavigate={navigate} />;
      case 'leads':
        return <Leads onNavigate={navigate} plan={plan} onUpgrade={goUpgrade} />;
      case 'novo-lead':
        return <NovoLead onNavigate={navigate} />;
      case 'financeiro':
        return <Financeiro plan={plan} />;
      case 'mensagens':
        return <Mensagens plan={plan} onUpgrade={goUpgrade} />;
      case 'relatorios':
        return <Relatorios plan={plan} />;
      case 'configuracoes':
        return <Configuracoes plan={plan} />;
      case 'notificacoes':
        return <Notificacoes />;
      case 'perfil':
        return <Perfil />;
      case 'estado-vazio':
        return <EstadoVazio onNavigate={navigate} />;
      case 'acesso-negado':
        return <AcessoNegado onNavigate={navigate} />;
      default:
        return <Dashboard onNavigate={navigate} plan={plan} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar
        current={currentPage}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        notifCount={NOTIF_COUNT}
        plan={plan}
        onPlanChange={setPlan}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header current={currentPage} onNavigate={navigate} notifCount={NOTIF_COUNT} />
        <main className="flex-1 overflow-hidden flex flex-col" style={{ background: 'var(--background)' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
