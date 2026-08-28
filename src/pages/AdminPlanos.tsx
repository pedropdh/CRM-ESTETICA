import { useState } from 'react';
import { Layers, Check, X, Pencil, Users2, UserCog, Contact, CalendarCheck, MessageSquare, Sparkles, HardDrive, Building2 } from 'lucide-react';
import { getPlans, clinicsOnPlan, type SaasPlan } from '../data/adminMock';

function fmt(n: number, suffix = '') {
  return n < 0 ? 'Ilimitado' : `${n.toLocaleString('pt-BR')}${suffix}`;
}

export default function AdminPlanos() {
  const [, forceTick] = useState(0);
  const [editing, setEditing] = useState<SaasPlan | null>(null);
  const [form, setForm] = useState<SaasPlan | null>(null);

  function openEdit(p: SaasPlan) { setEditing(p); setForm({ ...p }); }
  function save() {
    if (!editing || !form) return;
    Object.assign(editing, form);
    setEditing(null);
    forceTick(t => t + 1);
  }

  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: 'var(--background)' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Planos</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Gerencie os planos, preços e limites oferecidos aos clientes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {getPlans().map(plan => (
          <div key={plan.id} className="p-5 rounded-xl flex flex-col" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-1">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#4F46E518' }}>
                <Layers size={16} style={{ color: '#4F46E5' }} />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: plan.status === 'ativo' ? '#F0FDF4' : '#F1F5F9', color: plan.status === 'ativo' ? '#16A34A' : '#64748B' }}>
                {plan.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="text-lg font-bold mt-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{plan.name}</div>
            <div className="text-2xl font-bold mt-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              R$ {plan.price}<span className="text-sm font-normal" style={{ color: 'var(--muted-foreground)' }}>/mês</span>
            </div>

            <div className="mt-4 space-y-2 text-xs flex-1" style={{ color: 'var(--secondary-foreground)' }}>
              <Row Icon={UserCog} label="Profissionais" value={fmt(plan.professionals)} />
              <Row Icon={Users2} label="Usuários" value={fmt(plan.users)} />
              <Row Icon={Contact} label="Clientes" value={fmt(plan.clients)} />
              <Row Icon={CalendarCheck} label="Agendamentos/mês" value={fmt(plan.appointments)} />
              <Row Icon={MessageSquare} label="WhatsApp" value={plan.whatsapp ? 'Incluído' : 'Não incluído'} ok={plan.whatsapp} />
              <Row Icon={Sparkles} label="IA" value={plan.ai ? 'Incluído' : 'Não incluído'} ok={plan.ai} />
              <Row Icon={HardDrive} label="Armazenamento" value={`${plan.storageGb} GB`} />
              <Row Icon={Building2} label="Clínicas neste plano" value={String(clinicsOnPlan(plan.id))} />
            </div>

            <button onClick={() => openEdit(plan)}
              className="mt-4 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: '#4F46E5' }}>
              <Pencil size={12} /> Editar plano
            </button>
          </div>
        ))}
      </div>

      {editing && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,27,42,0.5)' }} onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--card)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Editar plano {editing.name}</h3>
              <button onClick={() => setEditing(null)} className="p-1 rounded hover:bg-secondary"><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <Field label="Preço (R$/mês)">
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="admin-input" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Profissionais (-1 = ilimitado)">
                  <input type="number" value={form.professionals} onChange={e => setForm({ ...form, professionals: Number(e.target.value) })} className="admin-input" />
                </Field>
                <Field label="Usuários (-1 = ilimitado)">
                  <input type="number" value={form.users} onChange={e => setForm({ ...form, users: Number(e.target.value) })} className="admin-input" />
                </Field>
                <Field label="Clientes (-1 = ilimitado)">
                  <input type="number" value={form.clients} onChange={e => setForm({ ...form, clients: Number(e.target.value) })} className="admin-input" />
                </Field>
                <Field label="Agendamentos/mês">
                  <input type="number" value={form.appointments} onChange={e => setForm({ ...form, appointments: Number(e.target.value) })} className="admin-input" />
                </Field>
              </div>
              <Field label="Armazenamento (GB)">
                <input type="number" value={form.storageGb} onChange={e => setForm({ ...form, storageGb: Number(e.target.value) })} className="admin-input" />
              </Field>

              <div className="flex items-center gap-4 pt-1">
                <Toggle label="WhatsApp" checked={form.whatsapp} onChange={v => setForm({ ...form, whatsapp: v })} />
                <Toggle label="IA" checked={form.ai} onChange={v => setForm({ ...form, ai: v })} />
                <Toggle label="Plano ativo" checked={form.status === 'ativo'} onChange={v => setForm({ ...form, status: v ? 'ativo' : 'inativo' })} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>Cancelar</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: '#4F46E5' }}>Salvar alterações</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.admin-input { width: 100%; font-size: 0.875rem; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--card); color: var(--foreground); outline: none; }`}</style>
    </div>
  );
}

function Row({ Icon, label, value, ok }: { Icon: any; label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5" style={{ color: 'var(--muted-foreground)' }}><Icon size={12} /> {label}</span>
      <span className="font-medium flex items-center gap-1">
        {ok !== undefined && (ok ? <Check size={12} style={{ color: '#16A34A' }} /> : <X size={12} style={{ color: '#94A3B8' }} />)}
        {value}
      </span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-2 text-xs font-medium">
      <span className="w-8 h-4.5 rounded-full relative transition-colors" style={{ background: checked ? '#4F46E5' : '#E1E8EF', height: 18 }}>
        <span className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all" style={{ left: checked ? 16 : 2 }} />
      </span>
      {label}
    </button>
  );
}
