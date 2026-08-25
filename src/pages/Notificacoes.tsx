import { Calendar, MessageSquare, DollarSign, AlertCircle, User, Check } from 'lucide-react';

const notifications = [
  { id: 1, type: 'agenda', icon: Calendar, title: 'Novo agendamento confirmado', desc: 'Bianca Rodrigues agendou Toxina Botulínica para 26/08 às 09:00.', time: 'Agora mesmo', read: false, color: '#0A6E6E' },
  { id: 2, type: 'mensagem', icon: MessageSquare, title: 'Nova mensagem de Juliana Torres', desc: '"Já posso lavar o rosto?" — Responda pelo WhatsApp.', time: '32 min atrás', read: false, color: '#7C3AED' },
  { id: 3, type: 'financeiro', icon: DollarSign, title: 'Conta a vencer em 2 dias', desc: 'Aluguel Sala Jardins — R$ 6.800 vence em 25/08.', time: '1h atrás', read: false, color: '#D97706' },
  { id: 4, type: 'alerta', icon: AlertCircle, title: 'No-show registrado', desc: 'Tânia Alves não compareceu ao agendamento das 11:00.', time: '3h atrás', read: true, color: '#DC2626' },
  { id: 5, type: 'cliente', icon: User, title: 'Aniversário amanhã', desc: 'Fernanda Oliveira faz aniversário amanhã (24/08). Envie um cupom especial.', time: '5h atrás', read: true, color: '#059669' },
  { id: 6, type: 'agenda', icon: Calendar, title: '3 agendamentos para amanhã', desc: 'Roberta Lima (09:00), Carla Mendes (11:00), Mônica Pereira (14:30).', time: 'Ontem', read: true, color: '#0A6E6E' },
  { id: 7, type: 'mensagem', icon: MessageSquare, title: 'Fernanda respondeu', desc: '"Obrigada pela atenção! ❤️" — Confirmação da consulta de segunda.', time: 'Ontem', read: true, color: '#7C3AED' },
  { id: 8, type: 'financeiro', icon: DollarSign, title: 'Meta mensal em 97%', desc: 'Faturamento em R$ 58.420 de R$ 60.000 meta. Faltam R$ 1.580!', time: '2 dias atrás', read: true, color: '#059669' },
];

export default function Notificacoes() {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Notificações</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{unread} não lidas</p>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--accent)' }}>
            <Check size={14} /> Marcar todas como lidas
          </button>
        </div>

        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-xl transition-colors cursor-pointer hover:opacity-90 ${!n.read ? 'ring-1' : ''}`}
              style={{
                background: n.read ? 'var(--card)' : `${n.color}08`,
                border: '1px solid var(--border)',
                '--tw-ring-color': `${n.color}30`,
              } as React.CSSProperties}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${n.color}15` }}>
                <n.icon size={18} style={{ color: n.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className={`text-sm font-medium ${!n.read ? 'font-semibold' : ''}`}>{n.title}</div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{n.time}</span>
                </div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{n.desc}</p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: n.color }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
