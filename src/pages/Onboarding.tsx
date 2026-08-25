import { useState } from 'react';
import { Building2, Users, Scissors, Import, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, title: 'Dados da Clínica', icon: Building2, desc: 'Informações básicas e fiscais' },
  { id: 2, title: 'Equipe', icon: Users, desc: 'Adicione seus profissionais' },
  { id: 3, title: 'Procedimentos', icon: Scissors, desc: 'Catálogo de serviços' },
  { id: 4, title: 'Importar Clientes', icon: Import, desc: 'Migre sua base de clientes' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'var(--primary)' }}>
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Configure sua clínica
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Leva apenas 5 minutos para começar a usar o Lumina CRM</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  s.id < step ? 'bg-green-500 text-white' :
                  s.id === step ? 'text-white' : 'bg-gray-100 text-gray-400'
                }`} style={s.id === step ? { background: 'var(--primary)' } : {}}>
                  {s.id < step ? <Check size={16} /> : s.id}
                </div>
                <span className="text-xs mt-1.5 hidden sm:block" style={{ color: s.id === step ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: s.id === step ? 600 : 400 }}>
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 sm:w-24 h-px mx-1 ${s.id < step ? 'bg-green-400' : ''}`}
                  style={{ background: s.id < step ? '#22C55E' : 'var(--border)', marginBottom: '18px' }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Dados da Clínica</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Nome da clínica *</label>
                  <input defaultValue="Clínica Lumina Estética" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">CNPJ *</label>
                  <input placeholder="00.000.000/0001-00" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Telefone</label>
                  <input placeholder="(11) 99999-9999" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Endereço</label>
                  <input placeholder="Rua das Flores, 123 — São Paulo, SP" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Regime tributário</label>
                  <select className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option>Simples Nacional</option>
                    <option>Lucro Presumido</option>
                    <option>Lucro Real</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Fuso horário</label>
                  <select className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option>América/São_Paulo (BRT)</option>
                    <option>América/Manaus (AMT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Equipe</h2>
              <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>Adicione os profissionais que usarão o sistema</p>
              <div className="space-y-3 mb-4">
                {['Dra. Marina Silva — Administradora', 'Camila Rocha — Esteticista', 'Paulo Mendes — Enfermeiro'].map((m) => (
                  <div key={m} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'var(--primary)' }}>{m[0]}</div>
                    <span className="text-sm flex-1">{m}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--primary)', color: 'white', opacity: 0.8 }}>Ativo</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-2.5 rounded-xl text-sm font-medium border-2 border-dashed transition-colors hover:opacity-80"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                + Convidar profissional
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Procedimentos</h2>
              <div className="space-y-2 mb-4">
                {[
                  { name: 'Toxina Botulínica', duration: 60, price: 900 },
                  { name: 'Preenchimento Labial', duration: 45, price: 1200 },
                  { name: 'Limpeza de Pele', duration: 75, price: 280 },
                  { name: 'Bioestimulador', duration: 90, price: 1800 },
                ].map((p) => (
                  <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.duration} min</div>
                    </div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                      R$ {p.price.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2.5 rounded-xl text-sm font-medium border-2 border-dashed"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                + Adicionar procedimento
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Importar Clientes</h2>
              <div className="border-2 border-dashed rounded-xl p-10 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ borderColor: 'var(--border)' }}>
                <Import size={36} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' }} />
                <p className="font-medium mb-1">Arraste o arquivo CSV ou clique para selecionar</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Suporta CSV e Excel. Máximo 50 MB.</p>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Ou <button className="underline" style={{ color: 'var(--accent)' }}>pule esta etapa</button> e importe depois em Configurações.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => step > 1 && setStep(s => s - 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
            style={{ color: 'var(--muted-foreground)', visibility: step === 1 ? 'hidden' : 'visible' }}>
            <ArrowLeft size={15} /> Voltar
          </button>
          <button
            onClick={() => step < 4 ? setStep(s => s + 1) : onComplete()}
            className="flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: 'var(--primary)' }}>
            {step < 4 ? (<>Próximo <ArrowRight size={15} /></>) : (<>Começar a usar <ArrowRight size={15} /></>)}
          </button>
        </div>
      </div>
    </div>
  );
}
