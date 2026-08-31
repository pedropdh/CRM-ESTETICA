import { Camera, Shield, LogOut } from 'lucide-react';
import { clinic, currentUser, roleLabels } from '../data/mock';

interface PerfilProps {
  onLogout: () => void;
}

export default function Perfil({ onLogout }: PerfilProps) {
  const initials = currentUser.name.replace('Dra. ', '').split(' ').map(n => n[0]).slice(0, 2).join('');
  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div className="max-w-lg mx-auto space-y-5">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Meu Perfil</h2>

        {/* Avatar */}
        <div className="flex items-center gap-5 p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{initials}</div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-white"
              style={{ background: 'var(--primary)', border: '2px solid white' }}>
              <Camera size={13} />
            </button>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{currentUser.name}</div>
            <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{roleLabels[currentUser.role]} · {clinic.name}</div>
            <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: '#ECFDF5', color: '#059669' }}>Ativo</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 rounded-xl space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Dados Pessoais</h3>
          {[
            { label: 'Nome completo', value: 'Marina Silva de Oliveira' },
            { label: 'E-mail', value: currentUser.email },
            { label: 'Telefone', value: '(11) 99887-6543' },
            { label: 'CRM / Registro profissional', value: 'CRM-SP 123456' },
            { label: 'Especialidade', value: 'Medicina Estética' },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
              <input defaultValue={value} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
            </div>
          ))}
          <button className="px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
            Salvar alterações
          </button>
        </div>

        {/* Security */}
        <div className="p-5 rounded-xl space-y-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="font-semibold text-sm flex items-center gap-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            <Shield size={15} style={{ color: 'var(--primary)' }} /> Segurança
          </h3>
          <button className="w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors"
            style={{ color: 'var(--foreground)' }}>
            Alterar senha
          </button>
          <button className="w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors"
            style={{ color: 'var(--foreground)' }}>
            Autenticação em dois fatores (2FA)
          </button>
          <button className="w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors"
            style={{ color: 'var(--foreground)' }}>
            Sessões ativas
          </button>
        </div>

        {/* Logout */}
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
          <LogOut size={15} /> Sair da conta
        </button>
      </div>
    </div>
  );
}
