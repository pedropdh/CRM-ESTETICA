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
import Campanhas from './pages/Campanhas';
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
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminClinicaDetalhe from './pages/AdminClinicaDetalhe';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminPlanos from './pages/AdminPlanos';
import AdminAssinaturas from './pages/AdminAssinaturas';
import AdminWhatsapp from './pages/AdminWhatsapp';
import AdminUso from './pages/AdminUso';
import AdminSuporte from './pages/AdminSuporte';
import AdminLogs from './pages/AdminLogs';
import AdminConfiguracoes from './pages/AdminConfiguracoes';
import AdminSidebar, { type AdminPage } from './components/AdminSidebar';
import { getClinic } from './data/adminMock';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('1');
  const [plan, setPlan] = useState<Plan>('pro');

  const [mode, setMode] = useState<'clinic' | 'admin'>('clinic');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPage, setAdminPage] = useState<AdminPage>('admin-dashboard');
  const [selectedClinicId, setSelectedClinicId] = useState('1');
  const [impersonatingClinicId, setImpersonatingClinicId] = useState<string | null>(null);

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

  function startImpersonate(clinicId: string) {
    // `Clinic.planId` and the clinic app's `Plan` are the same type — the
    // clinic sees exactly the tier the gestor set for it, no translation.
    const clinic = getClinic(clinicId);
    if (clinic) setPlan(clinic.planId);
    setImpersonatingClinicId(clinicId);
    setCurrentPage('dashboard');
  }

  function stopImpersonate() {
    setImpersonatingClinicId(null);
    setMode('admin');
    setAdminPage('admin-clinica-detalhe');
  }

  function renderAdminPage() {
    switch (adminPage) {
      case 'admin-clinica-detalhe':
        return (
          <AdminClinicaDetalhe
            clinicId={selectedClinicId}
            onBack={() => setAdminPage('admin-dashboard')}
            onImpersonate={startImpersonate}
            onNavigate={setAdminPage}
          />
        );
      case 'admin-usuarios':
        return <AdminUsuarios />;
      case 'admin-planos':
        return <AdminPlanos />;
      case 'admin-assinaturas':
        return <AdminAssinaturas />;
      case 'admin-whatsapp':
        return <AdminWhatsapp />;
      case 'admin-uso':
        return <AdminUso />;
      case 'admin-suporte':
        return <AdminSuporte />;
      case 'admin-logs':
        return <AdminLogs />;
      case 'admin-configuracoes':
        return <AdminConfiguracoes />;
      case 'admin-dashboard':
      default:
        return <AdminDashboard onSelectClinic={(id) => { setSelectedClinicId(id); setAdminPage('admin-clinica-detalhe'); }} />;
    }
  }

  if (mode === 'admin' && !impersonatingClinicId) {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} onBack={() => setMode('clinic')} />;
    }
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
        <AdminSidebar
          current={adminPage}
          onNavigate={setAdminPage}
          onLogout={() => { setIsAdminLoggedIn(false); setMode('clinic'); setAdminPage('admin-dashboard'); }}
        />
        {renderAdminPage()}
      </div>
    );
  }

  if (impersonatingClinicId) {
    const impersonated = getClinic(impersonatingClinicId);
    const NOTIF_COUNT = 3;
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white shrink-0" style={{ background: '#4F46E5' }}>
          <ShieldCheck size={14} />
          <span>Modo administrador do SaaS · Visualizando {impersonated?.name ?? 'clínica'} como suporte</span>
          <button onClick={stopImpersonate} className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-white/15 transition-colors">
            <ArrowLeft size={12} /> Sair do modo admin
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden" style={{ background: 'var(--background)' }}>
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
      </div>
    );
  }

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />;
  }

  if (!isLoggedIn) {
    if (showOnboarding) {
      return <Onboarding onComplete={handleLogin} />;
    }
    return <Login onLogin={handleLogin} onNavigate={navigate} onAdminAccess={() => setMode('admin')} />;
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
      case 'campanhas':
        return <Campanhas onNavigate={navigate} plan={plan} onUpgrade={goUpgrade} />;
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
