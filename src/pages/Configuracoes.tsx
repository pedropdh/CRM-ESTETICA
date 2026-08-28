import { useState } from 'react';
import { Building2, Users, Scissors, CreditCard, MessageSquare, Bell, Lock, Package, AlertCircle, Check } from 'lucide-react';
import type { Plan } from '../types';
import { getPlan, getPlans } from '../data/adminMock';

const sections = [
  { id: 'clinica', label: 'Clínica & Unidades', icon: Building2 },
  { id: 'equipe', label: 'Equipe & Permissões', icon: Users },
  { id: 'procedimentos', label: 'Procedimentos', icon: Scissors },
  { id: 'pagamentos', label: 'Formas de Pagamento', icon: CreditCard },
  { id: 'mensagens', label: 'Mensagens Automáticas', icon: MessageSquare },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'seguranca', label: 'Segurança & Acesso', icon: Lock },
  { id: 'plano', label: 'Plano & Cobrança', icon: Package },
];

const team = [
  { name: 'Dra. Marina Silva', email: 'marina@lumina.com.br', role: 'Administradora', status: 'ativo', color: '#0A6E6E' },
  { name: 'Camila Rocha', email: 'camila@lumina.com.br', role: 'Esteticista', status: 'ativo', color: '#7C3AED' },
  { name: 'Paulo Mendes', email: 'paulo@lumina.com.br', role: 'Enfermeiro', status: 'ativo', color: '#D97706' },
  { name: 'Sofia Andrade', email: 'sofia@lumina.com.br', role: 'Recepcionista', status: 'inativo', color: '#9CA3AF' },
];

const procedures = [
  { name: 'Toxina Botulínica', duration: 60, price: 900, commission: 35 },
  { name: 'Preenchimento Labial', duration: 45, price: 1200, commission: 35 },
  { name: 'Limpeza de Pele', duration: 75, price: 280, commission: 40 },
  { name: 'Bioestimulador de Colágeno', duration: 90, price: 1800, commission: 35 },
  { name: 'Fio de PDO', duration: 120, price: 2200, commission: 35 },
  { name: 'Drenagem Linfática', duration: 60, price: 120, commission: 40 },
];

const messageTemplates = [
  { name: 'Lembrete 24h antes', trigger: '24h antes do agendamento', msg: 'Olá {nome}! Lembrando do seu agendamento amanhã às {hora} para {procedimento}. 😊 Confirme sua presença respondendo SIM.' },
  { name: 'Confirmação de agendamento', trigger: 'Ao agendar', msg: 'Olá {nome}! Seu agendamento foi confirmado para {data} às {hora}. Aguardamos você! 🌟' },
  { name: 'Pós-atendimento', trigger: '2h após o atendimento', msg: 'Olá {nome}! Como está se sentindo após o procedimento? Qualquer dúvida, estamos aqui. 💚' },
  { name: 'Aniversário', trigger: 'Dia do aniversário', msg: 'Feliz aniversário, {nome}! 🎉 Como presente especial, preparamos 15% de desconto no seu próximo procedimento.' },
];

interface ConfiguracoesProps { plan?: Plan; }

export default function Configuracoes({ plan = 'pro' }: ConfiguracoesProps) {
  const currentPlan = getPlan(plan);
  const userLimit = currentPlan.users; // -1 = ilimitado
  const atTeamLimit = userLimit >= 0 && team.length > userLimit;
  const isBasico = plan === 'start';
  const [activeSection, setActiveSection] = useState('clinica');

  return (
    <div className="flex h-full overflow-hidden">
      {/* Section nav */}
      <nav className="w-52 shrink-0 border-r overflow-y-auto p-3"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        {sections.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveSection(id)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-colors mb-0.5"
            style={activeSection === id
              ? { background: 'var(--primary)', color: 'white' }
              : { color: 'var(--secondary-foreground)' }}>
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeSection === 'clinica' && (
          <div className="max-w-xl space-y-5">
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Dados da Clínica</h2>
            <div className="space-y-4 p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              {[
                { label: 'Nome da Clínica', value: 'Clínica Lumina Estética' },
                { label: 'CNPJ', value: '12.345.678/0001-90' },
                { label: 'E-mail Comercial', value: 'contato@lumina.com.br' },
                { label: 'Telefone', value: '(11) 3456-7890' },
                { label: 'Endereço', value: 'Rua das Flores, 123 — Jardins, São Paulo, SP' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
                  <input defaultValue={value} className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Horário de Abertura</label>
                  <input defaultValue="08:00" type="time" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Horário de Fechamento</label>
                  <input defaultValue="18:00" type="time" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
              </div>
            </div>
            <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
              Salvar Alterações
            </button>
          </div>
        )}

        {activeSection === 'equipe' && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Equipe & Permissões</h2>
              {!atTeamLimit && (
                <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                  + Convidar
                </button>
              )}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {userLimit < 0 ? `${team.length} usuários · sem limite no plano ${currentPlan.name}` : `${Math.min(team.length, userLimit)} de ${userLimit} usuários usados no plano ${currentPlan.name}`}
            </div>
            {atTeamLimit && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                <AlertCircle size={15} style={{ color: '#D97706', flexShrink: 0 }} />
                <span className="text-sm" style={{ color: '#92400E' }}>
                  Plano {currentPlan.name} inclui até <strong>{userLimit} usuário{userLimit === 1 ? '' : 's'}</strong>. Para adicionar mais membros, faça upgrade.
                </span>
              </div>
            )}
            <div className="space-y-2">
              {(userLimit >= 0 ? team.slice(0, userLimit) : team).map((m) => (
                <div key={m.name} className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: m.color }}>{m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{m.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.email}</div>
                  </div>
                  <select defaultValue={m.role} className="text-xs px-2 py-1 rounded-lg border outline-none"
                    style={{ background: 'var(--secondary)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    {['Administradora', 'Esteticista', 'Enfermeiro', 'Recepcionista'].map(r => <option key={r}>{r}</option>)}
                  </select>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={m.status === 'ativo' ? { background: '#ECFDF5', color: '#059669' } : { background: '#F9FAFB', color: '#9CA3AF' }}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'procedimentos' && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Catálogo de Procedimentos</h2>
              <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                + Adicionar
              </button>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--secondary)' }}>
                  <tr>{['Procedimento', 'Duração', 'Preço', 'Comissão', ''].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {procedures.map((p, i) => (
                    <tr key={i} className="hover:bg-secondary/50">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-xs">{p.duration} min</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--primary)' }}>R$ {p.price.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 text-xs">{p.commission}%</td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'mensagens' && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Modelos de Mensagem Automática</h2>
            {isBasico && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2"
                style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                <Lock size={15} style={{ color: '#6366F1', flexShrink: 0 }} />
                <span className="text-sm" style={{ color: '#3730A3' }}>
                  Mensagens automáticas de WhatsApp estão disponíveis no plano <strong>Pro</strong>.
                </span>
              </div>
            )}
            <p className="text-sm" style={{ color: 'var(--muted-foreground)', filter: isBasico ? 'blur(2px)' : 'none', pointerEvents: isBasico ? 'none' : 'auto' }}>
              Configure mensagens enviadas automaticamente pelo WhatsApp. Use {'{'}nome{'}'}, {'{'}hora{'}'}, {'{'}procedimento{'}'} como variáveis.
            </p>
            <div className="space-y-3">
              {messageTemplates.map((t, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Envio: {t.trigger}</div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="w-9 h-5 rounded-full relative" style={{ background: 'var(--primary)' }}>
                        <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                      </div>
                    </label>
                  </div>
                  <textarea defaultValue={t.msg} rows={2}
                    className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'plano' && (
          <div className="max-w-3xl space-y-5">
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Plano & Cobrança</h2>
            {/* Current plan */}
            <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)', color: 'white' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Plano {currentPlan.name}</div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>Ativo</span>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                R$ {currentPlan.price}<span className="text-sm font-normal opacity-70">/mês</span>
              </div>
              <div className="text-sm opacity-80">Próxima cobrança: 01/09/2026</div>
            </div>
            {/* Plans */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {getPlans().map((p) => {
                const isCurrent = p.id === plan;
                const features = [
                  p.professionals < 0 ? 'Profissionais ilimitados' : `Até ${p.professionals} profissionais`,
                  p.appointments < 0 ? 'Agendamentos ilimitados' : `${p.appointments} agendamentos/mês`,
                  p.whatsapp ? 'WhatsApp automático' : 'Sem WhatsApp automático',
                  p.ai ? 'Recursos de IA' : `${p.storageGb} GB de armazenamento`,
                ];
                return (
                  <div key={p.id} className="p-4 rounded-xl flex flex-col"
                    style={{
                      background: isCurrent ? 'var(--secondary)' : 'var(--card)',
                      border: isCurrent ? `2px solid var(--primary)` : '1px solid var(--border)'
                    }}>
                    <div className="font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{p.name}</div>
                    <div className="text-xl font-bold mb-3" style={{ color: 'var(--primary)', fontFamily: 'Instrument Sans, sans-serif' }}>
                      R$ {p.price}<span className="text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>/mês</span>
                    </div>
                    <ul className="space-y-1 mb-4 flex-1">
                      {features.map(f => (
                        <li key={f} className="text-xs flex items-center gap-1.5">
                          <Check size={11} style={{ color: 'var(--primary)' }} /> {f}
                        </li>
                      ))}
                    </ul>
                    {!isCurrent ? (
                      <button className="w-full py-1.5 rounded-lg text-xs font-semibold text-white"
                        style={{ background: 'var(--primary)' }}>Fazer upgrade</button>
                    ) : (
                      <div className="text-center text-xs font-medium" style={{ color: 'var(--primary)' }}>Plano atual</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!['clinica', 'equipe', 'procedimentos', 'mensagens', 'plano'].includes(activeSection) && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="font-semibold mb-1">{sections.find(s => s.id === activeSection)?.label}</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Configurações disponíveis em breve.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
