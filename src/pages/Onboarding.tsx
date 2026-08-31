import { useState } from 'react';
import { Building2, Scissors, Import, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { commonProcedures } from '../data/mock';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, title: 'Sua clínica', Icon: Building2 },
  { id: 2, title: 'Procedimentos', Icon: Scissors },
  { id: 3, title: 'Importar', Icon: Import },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(commonProcedures.map(p => [p.name, p.checked])),
  );

  const selectedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'var(--primary)' }}>
            <Building2 size={26} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Vamos deixar sua agenda cheia
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Três passos rápidos e você já começa a usar.
          </p>
        </div>

        {/* Progresso */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={s.id < step
                    ? { background: '#22C55E', color: 'white' }
                    : s.id === step
                    ? { background: 'var(--primary)', color: 'white' }
                    : { background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                  {s.id < step ? <Check size={16} /> : s.id}
                </div>
                <span className="text-xs mt-1.5"
                  style={{ color: s.id === step ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: s.id === step ? 600 : 400 }}>
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-12 sm:w-20 h-px mx-2" style={{ background: s.id < step ? '#22C55E' : 'var(--border)', marginBottom: 18 }} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-5 md:p-7" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Sua clínica</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">Nome da clínica</label>
                <input placeholder="Clínica Lumina Estética"
                  className="w-full px-3 py-3 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Seu WhatsApp</label>
                <input placeholder="(11) 99999-9999"
                  className="w-full px-3 py-3 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
                  É por esse número que saem as confirmações e os recalls.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Seus procedimentos</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Já marcamos os mais comuns em estética, com o intervalo de retorno preenchido —
                é ele que faz o recall funcionar. Desmarque o que não fizer.
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {commonProcedures.map(p => (
                  <button key={p.name} onClick={() => setChecked(c => ({ ...c, [p.name]: !c[p.name] }))}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                    style={{
                      background: checked[p.name] ? '#E0F2F1' : 'var(--secondary)',
                      border: `1px solid ${checked[p.name] ? 'rgba(10,110,110,0.3)' : 'var(--border)'}`,
                      minHeight: 56,
                    }}>
                    <span className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                      style={{ background: checked[p.name] ? 'var(--primary)' : 'white', border: '1px solid var(--border)' }}>
                      {checked[p.name] && <Check size={13} className="text-white" />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{p.name}</span>
                      <span className="block text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {p.durationMin} min · retorno a cada {p.returnIntervalDays} dias
                      </span>
                    </span>
                    <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--primary)' }}>
                      {p.price > 0 ? `R$ ${p.price}` : 'Grátis'}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>
                {selectedCount} procedimentos selecionados.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Importar sua planilha</h2>
              <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>
                Tem uma lista de clientes em Excel ou CSV? Solte aqui. Se preferir, pule — dá para importar depois.
              </p>
              <div className="border-2 border-dashed rounded-xl p-8 mb-4" style={{ borderColor: 'var(--border)' }}>
                <Import size={32} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' }} />
                <p className="font-medium text-sm mb-1">Arraste o arquivo ou toque para escolher</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>CSV ou Excel</p>
              </div>
              <button onClick={onComplete} className="text-sm underline" style={{ color: 'var(--accent)' }}>
                Pular esta etapa
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-5">
          <button onClick={() => step > 1 && setStep(s => s - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium"
            style={{ color: 'var(--muted-foreground)', visibility: step === 1 ? 'hidden' : 'visible', minHeight: 44 }}>
            <ArrowLeft size={15} /> Voltar
          </button>
          <button onClick={() => (step < 3 ? setStep(s => s + 1) : onComplete())}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: 'var(--primary)', minHeight: 44 }}>
            {step < 3 ? <>Próximo <ArrowRight size={15} /></> : <>Começar <ArrowRight size={15} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
