import { useState } from 'react';
import { Search, Filter, Plus, ChevronRight, Phone, Mail, Star } from 'lucide-react';
import type { Page } from '../types';

const clients = [
  { id: '1', name: 'Ana Carolina Medeiros', phone: '(11) 99234-5678', email: 'anacarolina@email.com', procedure: 'Toxina Botulínica', lastVisit: '15/08/2026', totalSpent: 8700, status: 'ativo', visits: 12, stage: 'VIP' },
  { id: '2', name: 'Fernanda Oliveira', phone: '(11) 97654-3210', email: 'fernanda@email.com', procedure: 'Preenchimento Labial', lastVisit: '10/08/2026', totalSpent: 6200, status: 'ativo', visits: 8, stage: 'Frequente' },
  { id: '3', name: 'Juliana Torres', phone: '(11) 98877-6655', email: 'juliana.torres@email.com', procedure: 'Limpeza de Pele', lastVisit: '02/08/2026', totalSpent: 1680, status: 'ativo', visits: 6, stage: 'Regular' },
  { id: '4', name: 'Patricia Santos', phone: '(11) 91234-5670', email: 'patricia.s@email.com', procedure: 'Bioestimulador', lastVisit: '20/07/2026', totalSpent: 5400, status: 'ativo', visits: 4, stage: 'Frequente' },
  { id: '5', name: 'Roberta Lima', phone: '(11) 92345-6781', email: 'roberta.l@email.com', procedure: 'Fio de PDO', lastVisit: '05/07/2026', totalSpent: 9800, status: 'ativo', visits: 15, stage: 'VIP' },
  { id: '6', name: 'Camila Duarte', phone: '(11) 93456-7892', email: 'camila.d@email.com', procedure: 'Drenagem Linfática', lastVisit: '18/06/2026', totalSpent: 840, status: 'inativo', visits: 3, stage: 'Novo' },
  { id: '7', name: 'Tatiana Ferreira', phone: '(11) 94567-8903', email: 'tati.f@email.com', procedure: 'Avaliação', lastVisit: '01/06/2026', totalSpent: 0, status: 'prospect', visits: 0, stage: 'Novo' },
  { id: '8', name: 'Mônica Pereira', phone: '(11) 95678-9014', email: 'monica.p@email.com', procedure: 'Toxina Botulínica', lastVisit: '22/08/2026', totalSpent: 3600, status: 'ativo', visits: 5, stage: 'Regular' },
];

const stageColors: Record<string, string> = {
  VIP: '#D97706',
  Frequente: '#7C3AED',
  Regular: '#0891B2',
  Novo: '#059669',
};

const statusConfig = {
  ativo: { label: 'Ativo', color: '#059669', bg: '#ECFDF5' },
  inativo: { label: 'Inativo', color: '#9CA3AF', bg: '#F9FAFB' },
  prospect: { label: 'Prospect', color: '#6366F1', bg: '#EEF2FF' },
};

interface ClientesProps {
  onNavigate: (p: Page) => void;
  onSelectClient: (id: string) => void;
}

export default function Clientes({ onNavigate, onSelectClient }: ClientesProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'todos' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-3 flex flex-wrap items-center gap-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cliente…" className="text-sm bg-transparent outline-none w-48"
            style={{ color: 'var(--foreground)' }} />
        </div>

        <div className="flex gap-1">
          {['todos', 'ativo', 'inativo', 'prospect'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize"
              style={statusFilter === s
                ? { background: 'var(--primary)', color: 'white' }
                : { background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
              {s === 'todos' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{filtered.length} clientes</span>
          <button onClick={() => onNavigate('novo-cliente')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={14} /> Novo Cliente
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="px-6 pt-4 pb-2 grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        {[
          { label: 'Total de clientes', value: clients.length, color: 'var(--primary)' },
          { label: 'Ativos', value: clients.filter(c => c.status === 'ativo').length, color: '#059669' },
          { label: 'Ticket médio', value: 'R$ ' + Math.round(clients.filter(c => c.totalSpent > 0).reduce((s, c) => s + c.totalSpent / c.visits, 0) / clients.filter(c => c.totalSpent > 0).length).toLocaleString('pt-BR'), color: 'var(--foreground)' },
          { label: 'VIP', value: clients.filter(c => c.stage === 'VIP').length, color: '#D97706' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--secondary)' }}>
              <tr>
                {['Cliente', 'Contato', 'Último Procedimento', 'Última Visita', 'Total Gasto', 'Categoria', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.map(c => {
                const sc = statusConfig[c.status as keyof typeof statusConfig];
                return (
                  <tr key={c.id} onClick={() => onSelectClient(c.id)}
                    className="hover:bg-secondary/50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>
                          {c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{c.name}</div>
                          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.visits} visitas</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        <Phone size={10} /> {c.phone}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Mail size={10} /> {c.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{c.procedure}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.lastVisit}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                      {c.totalSpent > 0 ? `R$ ${c.totalSpent.toLocaleString('pt-BR')}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {c.stage === 'VIP' && <Star size={11} fill="#D97706" style={{ color: '#D97706' }} />}
                        <span className="text-xs font-medium" style={{ color: stageColors[c.stage] || 'var(--muted-foreground)' }}>
                          {c.stage}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight size={16} style={{ color: 'var(--muted-foreground)' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
