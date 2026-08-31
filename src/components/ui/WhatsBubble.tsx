interface WhatsBubbleProps {
  text: string;
  from?: 'clinic' | 'client';
  time?: string;
  /** Envolve a bolha na "tela de celular" verde do WhatsApp. */
  framed?: boolean;
}

/**
 * Bolha de mensagem de WhatsApp. Usada na prévia das automações, na landing
 * e no inbox — sempre com a mesma aparência para a prévia parecer o real.
 */
export default function WhatsBubble({ text, from = 'clinic', time, framed }: WhatsBubbleProps) {
  const bubble = (
    <div className={`flex ${from === 'clinic' ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl shadow-sm"
        style={from === 'clinic'
          ? { background: '#DCF8C6', color: '#0D1B2A', borderBottomRightRadius: 4 }
          : { background: '#FFFFFF', color: '#0D1B2A', borderBottomLeftRadius: 4, border: '1px solid #E1E8EF' }}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        {time && <p className="text-xs mt-1 text-right" style={{ color: '#6B7C8A' }}>{time}</p>}
      </div>
    </div>
  );

  if (!framed) return bubble;

  return (
    <div className="rounded-2xl p-3 space-y-2"
      style={{ background: '#ECE5DD', border: '1px solid var(--border)' }}>
      {bubble}
    </div>
  );
}
