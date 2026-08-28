import { HardDrive, MessageSquare, Sparkles, Users, CalendarCheck, Contact, Coins, Zap } from 'lucide-react';
import Badge, { usageColor } from '../components/admin/Badge';
import StatCard from '../components/admin/StatCard';
import { getClinics, getPlan, overallUsagePct, whatsappOfClinic } from '../data/adminMock';

export default function AdminUso() {
  const clinics = getClinics();
  const totalStorage = clinics.reduce((s, c) => s + c.usage.storageGb, 0);
  const totalWhatsapp = clinics.reduce((s, c) => {
    const w = whatsappOfClinic(c.id);
    return s + (w ? w.sent + w.received : 0);
  }, 0);
  const totalAiTokens = clinics.reduce((s, c) => s + c.usage.aiTokens, 0);
  const totalUsers = clinics.reduce((s, c) => s + c.usage.users, 0);
  const totalAppointments = clinics.reduce((s, c) => s + c.usage.appointments, 0);
  const totalClients = clinics.reduce((s, c) => s + c.usage.clients, 0);

  const ranking = [...clinics].sort((a, b) => overallUsagePct(b) - overallUsagePct(a));
  const aiClinics = clinics.filter(c => c.usage.aiTokens > 0).sort((a, b) => b.usage.aiTokens - a.usage.aiTokens);
  const aiRequests = Math.round(totalAiTokens / 480);
  const aiCost = totalAiTokens * 0.00003; // fictitious per-token cost estimate

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--background)' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Uso & Consumo</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Central de acompanhamento do consumo de recursos da plataforma</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Armazenamento total" value={`${totalStorage.toFixed(1)} GB`} Icon={HardDrive} color="#4F46E5" />
        <StatCard label="Mensagens WhatsApp" value={totalWhatsapp.toLocaleString('pt-BR')} Icon={MessageSquare} color="#16A34A" sub="enviadas + recebidas" />
        <StatCard label="Consumo de IA" value={`${(totalAiTokens / 1000).toFixed(0)}k tokens`} Icon={Sparkles} color="#7C3AED" />
        <StatCard label="Usuários" value={totalUsers} Icon={Users} color="#0891B2" />
        <StatCard label="Agendamentos/mês" value={totalAppointments.toLocaleString('pt-BR')} Icon={CalendarCheck} color="#D97706" />
        <StatCard label="Clientes cadastrados" value={totalClients.toLocaleString('pt-BR')} Icon={Contact} color="#DC2626" />
      </div>

      {/* Ranking */}
      <div className="mb-6">
        <h2 className="text-sm font-bold mb-3">Clínicas com maior consumo</h2>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--secondary)' }}>
              <tr>
                {['Clínica', 'Plano', 'Uso', 'Limite', '% utilizado'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {ranking.map(c => {
                const plan = getPlan(c.planId);
                const pct = overallUsagePct(c);
                return (
                  <tr key={c.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-xs">{plan.name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.usage.appointments} agend./mês</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{plan.appointments < 0 ? 'Ilimitado' : `${plan.appointments} agend./mês`}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 w-36">
                        <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: usageColor(pct) }} />
                        </div>
                        <span className="text-xs font-medium" style={{ color: usageColor(pct) }}>{pct}%</span>
                        {pct >= 90 && <Badge label="Crítico" color="#DC2626" bg="#FEF2F2" />}
                        {pct >= 70 && pct < 90 && <Badge label="Atenção" color="#D97706" bg="#FFF7ED" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#16A34A' }} /> até 70%: normal</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#D97706' }} /> 70–90%: atenção</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#DC2626' }} /> acima de 90%: crítico</span>
        </div>
      </div>

      {/* AI consumption */}
      <div>
        <h2 className="text-sm font-bold mb-3">Consumo de IA</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <StatCard label="Tokens utilizados" value={`${(totalAiTokens / 1000).toFixed(0)}k`} Icon={Zap} color="#7C3AED" />
          <StatCard label="Requisições estimadas" value={aiRequests.toLocaleString('pt-BR')} Icon={Sparkles} color="#4F46E5" />
          <StatCard label="Custo estimado" value={`R$ ${aiCost.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} Icon={Coins} color="#D97706" sub="estimativa fictícia" />
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--secondary)' }}>
              <tr>
                {['Clínica', 'Plano', 'Tokens', 'Custo estimado'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {aiClinics.map(c => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-xs">{getPlan(c.planId).name}</td>
                  <td className="px-4 py-3 text-xs">{c.usage.aiTokens.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-xs font-medium">R$ {(c.usage.aiTokens * 0.00003).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {aiClinics.length === 0 && (
                <tr><td colSpan={4} className="text-center py-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhuma clínica com consumo de IA neste período</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
