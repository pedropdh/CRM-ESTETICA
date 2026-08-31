import { useState } from 'react';
import { Search, Plus, ChevronRight, Phone, Star, Users } from 'lucide-react';
import type { Client, Page } from '../types';
import {
  daysSinceLastVisit, formatBR, getClients, getNextReturn, isInactive, money,
} from '../data/mock';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

interface ClientesProps {
  onNavigate: (p: Page) => void;
  onSelectClient: (id: string) => void;
}

const stageColors: Record<Client['stage'], string> = {
  VIP: '#D97706',
  Frequente: '#7C3AED',
  Regular: '#0891B2',
  Nova: '#059669',
};

/** Chip "Ativa" / "Sem visita há N dias" — mesma regra usada na ficha. */
export function statusChip(client: Client) {
  const days = daysSinceLastVisit(client);
  return isInactive(client)
    ? { label: `Sem visita há ${days} dias`, color: '#D97706', bg: '#FFF7ED' }
    : { label: 'Ativa', color: '#059669', bg: '#ECFDF5' };
}

export default function Clientes({ onNavigate, onSelectClient }: ClientesProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todas' | 'ativas' | 'inativas'>('todas');

  const clients = getClients();
  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.phone.includes(search) || c.email.toLowerCase().includes(q);
    const matchStatus =
      filter === 'todas' || (filter === 'inativas' ? isInactive(c) : !isInactive(c));
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Toolbar */}
      <div className="px-3 md:px-6 py-2.5 flex flex-wrap items-center gap-2 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border flex-1 min-w-[180px]"
          style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cliente…" className="text-sm bg-transparent outline-none w-full"
            style={{ color: 'var(--foreground)' }} />
        </div>

        <div className="flex gap-1">
          {(['todas', 'ativas', 'inativas'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-lg text-xs font-medium capitalize"
              style={filter === f
                ? { background: 'var(--primary)', color: 'white' }
                : { background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
              {f}
            </button>
          ))}
        </div>

        <button onClick={() => onNavigate('novo-cliente')}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white ml-auto"
          style={{ background: 'var(--primary)' }}>
          <Plus size={14} /> Nova cliente
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 md:p-6">
        {filtered.length === 0 ? (
          <EmptyState Icon={Users} title="Nenhuma cliente encontrada"
            description="Ajuste a busca ou cadastre uma nova cliente."
            actionLabel="Nova cliente" onAction={() => onNavigate('novo-cliente')} />
        ) : (
          <>
            {/* Cartões — celular */}
            <div className="md:hidden space-y-2">
              {filtered.map(c => {
                const chip = statusChip(c);
                const next = getNextReturn(c);
                return (
                  <button key={c.id} onClick={() => onSelectClient(c.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <span className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{c.initials}</span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm font-medium truncate">{c.name}</span>
                        {c.stage === 'VIP' && <Star size={11} fill="#D97706" style={{ color: '#D97706' }} />}
                      </span>
                      <span className="block text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
                        {next ? `Retorno: ${next.procedure.name} em ${formatBR(next.dueISO)}` : 'Sem procedimento registrado'}
                      </span>
                      <span className="inline-block mt-1.5">
                        <Badge label={chip.label} color={chip.color} bg={chip.bg} />
                      </span>
                    </span>
                    <ChevronRight size={16} style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                );
              })}
            </div>

            {/* Tabela — desktop */}
            <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--secondary)' }}>
                  <tr>
                    {['Cliente', 'Contato', 'Última visita', 'Próximo retorno', 'Total gasto', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                        style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {filtered.map(c => {
                    const chip = statusChip(c);
                    const next = getNextReturn(c);
                    return (
                      <tr key={c.id} onClick={() => onSelectClient(c.id)}
                        className="hover:bg-secondary/50 transition-colors cursor-pointer">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                              style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{c.initials}</span>
                            <div>
                              <div className="font-medium text-sm flex items-center gap-1.5">
                                {c.name}
                                {c.stage === 'VIP' && <Star size={11} fill="#D97706" style={{ color: '#D97706' }} />}
                              </div>
                              <div className="text-xs" style={{ color: stageColors[c.stage] }}>{c.stage}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            <Phone size={10} /> {c.phone}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{formatBR(c.lastVisit)}</td>
                        <td className="px-4 py-3 text-xs">
                          {next ? (
                            <span style={{ color: next.overdue ? '#D97706' : 'var(--foreground)' }}>
                              {next.procedure.name} · {formatBR(next.dueISO)}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                          {c.totalSpent > 0 ? money(c.totalSpent) : '—'}
                        </td>
                        <td className="px-4 py-3"><Badge label={chip.label} color={chip.color} bg={chip.bg} /></td>
                        <td className="px-4 py-3"><ChevronRight size={16} style={{ color: 'var(--muted-foreground)' }} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Botão flutuante no celular */}
      <button onClick={() => onNavigate('novo-cliente')}
        className="md:hidden absolute bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg z-20"
        style={{ background: 'var(--primary)' }}>
        <Plus size={22} />
      </button>
    </div>
  );
}
