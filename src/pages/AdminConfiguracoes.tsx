import { useState } from 'react';
import { Building2, Bell, ShieldCheck, Plug, Upload } from 'lucide-react';

type Section = 'empresa' | 'notificacoes' | 'seguranca' | 'integracoes';

const sections: { id: Section; label: string; Icon: any }[] = [
  { id: 'empresa', label: 'Empresa', Icon: Building2 },
  { id: 'notificacoes', label: 'Notificações', Icon: Bell },
  { id: 'seguranca', label: 'Segurança', Icon: ShieldCheck },
  { id: 'integracoes', label: 'Integrações', Icon: Plug },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="w-9 h-5 rounded-full relative transition-colors shrink-0" style={{ background: checked ? '#4F46E5' : '#E1E8EF' }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: checked ? 18 : 2 }} />
    </button>
  );
}

function Row({ label, sub, control }: { label: string; sub?: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid var(--border)' }}>
      <div>
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{sub}</div>}
      </div>
      {control}
    </div>
  );
}

export default function AdminConfiguracoes() {
  const [section, setSection] = useState<Section>('empresa');

  const [company, setCompany] = useState({ name: 'Lumina SaaS', email: 'contato@lumina.app', phone: '(11) 4002-8922' });
  const [notif, setNotif] = useState({ email: true, overdue: true, system: true });
  const [security, setSecurity] = useState({ sessionTimeout: true, twoFactor: false, restrictIp: false });
  const [integrations, setIntegrations] = useState({ whatsapp: true, ai: true, payments: true });

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--background)' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Configurações</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Preferências gerais da plataforma Lumina SaaS</p>
      </div>

      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
        {sections.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setSection(id)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={section === id ? { borderColor: '#4F46E5', color: '#4F46E5' } : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="max-w-xl p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {section === 'empresa' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#4F46E518' }}>
                <Building2 size={26} style={{ color: '#4F46E5' }} />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
                <Upload size={13} /> Alterar logo
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Nome</label>
              <input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>E-mail</label>
              <input value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Telefone</label>
              <input value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
            </div>
            <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: '#4F46E5' }}>Salvar alterações</button>
          </div>
        )}

        {section === 'notificacoes' && (
          <div>
            <Row label="Notificações por e-mail" sub="Receber um resumo diário por e-mail" control={<Toggle checked={notif.email} onChange={v => setNotif({ ...notif, email: v })} />} />
            <Row label="Alertas de inadimplência" sub="Ser avisado quando uma clínica atrasar o pagamento" control={<Toggle checked={notif.overdue} onChange={v => setNotif({ ...notif, overdue: v })} />} />
            <Row label="Alertas de sistema" sub="Erros críticos, quedas de integração e falhas" control={<Toggle checked={notif.system} onChange={v => setNotif({ ...notif, system: v })} />} />
          </div>
        )}

        {section === 'seguranca' && (
          <div>
            <Row label="Expirar sessões inativas" sub="Encerrar sessões após 30 minutos sem atividade" control={<Toggle checked={security.sessionTimeout} onChange={v => setSecurity({ ...security, sessionTimeout: v })} />} />
            <Row label="Autenticação em dois fatores" sub="Exigir 2FA para todos os acessos administrativos" control={<Toggle checked={security.twoFactor} onChange={v => setSecurity({ ...security, twoFactor: v })} />} />
            <Row label="Restringir por IP" sub="Permitir acesso administrativo apenas de IPs autorizados" control={<Toggle checked={security.restrictIp} onChange={v => setSecurity({ ...security, restrictIp: v })} />} />
          </div>
        )}

        {section === 'integracoes' && (
          <div>
            <Row label="WhatsApp Business API" sub="Integração oficial para envio e recebimento de mensagens" control={<Toggle checked={integrations.whatsapp} onChange={v => setIntegrations({ ...integrations, whatsapp: v })} />} />
            <Row label="IA (assistente e automações)" sub="Recursos de inteligência artificial para os planos Business e Redes" control={<Toggle checked={integrations.ai} onChange={v => setIntegrations({ ...integrations, ai: v })} />} />
            <Row label="Gateway de pagamentos" sub="Processamento de cobranças e assinaturas" control={<Toggle checked={integrations.payments} onChange={v => setIntegrations({ ...integrations, payments: v })} />} />
          </div>
        )}
      </div>
    </div>
  );
}
