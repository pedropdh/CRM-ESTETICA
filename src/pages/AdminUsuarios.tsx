import { useMemo, useState } from 'react';
import { Search, Users, UserCheck, UserX, UserPlus, Lock, Unlock, KeyRound, Pencil } from 'lucide-react';
import Badge, { userStatusMap, userRoleMap } from '../components/admin/Badge';
import StatCard from '../components/admin/StatCard';
import ConfirmModal from '../components/admin/ConfirmModal';
import { getUsers, getClinics, type UserRole, type UserStatus } from '../data/adminMock';

export default function AdminUsuarios() {
  const [search, setSearch] = useState('');
  const [clinicFilter, setClinicFilter] = useState('todas');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'todas'>('todas');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'todos'>('todos');
  const [pending, setPending] = useState<{ id: string; name: string; toStatus: UserStatus } | null>(null);
  const [, forceTick] = useState(0);

  const users = getUsers();
  const clinics = getClinics();

  const filtered = useMemo(() => users.filter(u => {
    const clinic = clinics.find(c => c.id === u.clinicId);
    return (clinicFilter === 'todas' || u.clinicId === clinicFilter) &&
      (roleFilter === 'todas' || u.role === roleFilter) &&
      (statusFilter === 'todos' || u.status === statusFilter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
       u.email.toLowerCase().includes(search.toLowerCase()) ||
       (clinic?.name.toLowerCase().includes(search.toLowerCase()) ?? false));
  }), [users, clinics, search, clinicFilter, roleFilter, statusFilter]);

  const total = users.length;
  const active = users.filter(u => u.status === 'ativo').length;
  const blocked = users.filter(u => u.status === 'bloqueado').length;
  const recent = users.filter(u => u.createdAt.includes('2026')).length;

  function confirmToggle() {
    if (!pending) return;
    const u = users.find(u => u.id === pending.id);
    if (u) u.status = pending.toStatus;
    setPending(null);
    forceTick(t => t + 1);
  }

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--background)' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Usuários</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Todos os usuários cadastrados em todas as clínicas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total de usuários" value={total} Icon={Users} color="#4F46E5" />
        <StatCard label="Ativos" value={active} Icon={UserCheck} color="#16A34A" />
        <StatCard label="Bloqueados" value={blocked} Icon={UserX} color="#DC2626" />
        <StatCard label="Novos" value={recent} Icon={UserPlus} color="#0891B2" sub="em 2026" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nome, e-mail ou clínica…"
            className="text-sm bg-transparent outline-none w-56" style={{ color: 'var(--foreground)' }} />
        </div>
        <select value={clinicFilter} onChange={e => setClinicFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none font-medium" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}>
          <option value="todas">Todas as clínicas</option>
          {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none font-medium" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}>
          <option value="todas">Todas as funções</option>
          <option value="admin">Administrador</option>
          <option value="profissional">Profissional</option>
          <option value="recepcao">Recepção</option>
        </select>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(['todos', 'ativo', 'bloqueado'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1.5 text-xs font-medium capitalize"
              style={statusFilter === s ? { background: '#4F46E5', color: 'white' } : { background: 'var(--card)', color: 'var(--muted-foreground)' }}>
              {s === 'todos' ? 'Todos' : userStatusMap[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--secondary)' }}>
            <tr>
              {['Nome', 'E-mail', 'Clínica', 'Função', 'Status', 'Último acesso', 'Cadastro', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filtered.map(u => {
              const clinic = clinics.find(c => c.id === u.clinicId);
              const roleCfg = userRoleMap[u.role];
              const statusCfg = userStatusMap[u.status];
              return (
                <tr key={u.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.email}</td>
                  <td className="px-4 py-3 text-xs">{clinic?.name ?? '—'}</td>
                  <td className="px-4 py-3"><Badge label={roleCfg.label} color={roleCfg.color} bg={roleCfg.bg} /></td>
                  <td className="px-4 py-3"><Badge label={statusCfg.label} color={statusCfg.color} bg={statusCfg.bg} /></td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.lastAccess}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button title="Editar" className="p-1.5 rounded-lg hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}><Pencil size={13} /></button>
                      <button title="Redefinir acesso" className="p-1.5 rounded-lg hover:bg-secondary transition-colors" style={{ color: 'var(--muted-foreground)' }}><KeyRound size={13} /></button>
                      {u.status === 'ativo' ? (
                        <button title="Bloquear" onClick={() => setPending({ id: u.id, name: u.name, toStatus: 'bloqueado' })}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors" style={{ color: '#DC2626' }}><Lock size={13} /></button>
                      ) : (
                        <button title="Reativar" onClick={() => setPending({ id: u.id, name: u.name, toStatus: 'ativo' })}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors" style={{ color: '#16A34A' }}><Unlock size={13} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-10 text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhum usuário encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pending && (
        <ConfirmModal
          title={pending.toStatus === 'bloqueado' ? `Bloquear ${pending.name}?` : `Reativar ${pending.name}?`}
          description={pending.toStatus === 'bloqueado'
            ? 'O usuário perde acesso imediato ao sistema da clínica até ser reativado.'
            : 'O usuário volta a ter acesso normal ao sistema da clínica.'}
          confirmLabel={pending.toStatus === 'bloqueado' ? 'Bloquear' : 'Reativar'}
          danger={pending.toStatus === 'bloqueado'}
          onConfirm={confirmToggle}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
