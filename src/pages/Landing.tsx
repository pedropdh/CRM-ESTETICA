import { useState } from 'react';
import {
  Calendar, Users, TrendingUp, DollarSign, MessageSquare,
  Check, ArrowRight, ChevronDown, ChevronUp, Building2, Shield, Menu, X,
} from 'lucide-react';
import { getPlans } from '../data/mock';
import WhatsBubble from '../components/ui/WhatsBubble';

interface LandingProps {
  onEnter: () => void;
}

// Os 4 passos do ciclo que mantém a agenda cheia, cada um com a mensagem real.
const howItWorks = [
  {
    n: '01',
    title: 'Confirma o horário',
    desc: 'Um dia antes, o Lumina pergunta se a cliente vem. Quem responde SIM fica confirmada na agenda. Quem responde NÃO libera o horário na hora.',
    message: 'Oi Ana! Confirmando seu horário de amanhã às 09:00 para Toxina Botulínica. Responda SIM para confirmar ou NÃO para liberar o horário. 💚',
    reply: 'SIM',
  },
  {
    n: '02',
    title: 'Preenche a vaga que abriu',
    desc: 'Assim que um horário é liberado ou cancelado, quem está na lista de espera é avisada. A primeira que responder fica com a vaga.',
    message: 'Oi Mônica! Abriu uma vaga amanhã às 09:00 para Toxina Botulínica. Quer essa vaga? Responda QUERO que eu já reservo. 😊',
    reply: 'QUERO',
  },
  {
    n: '03',
    title: 'Chama para o retorno',
    desc: 'Cada procedimento tem seu intervalo. Quando chega a hora da próxima sessão, a cliente é lembrada sem você precisar olhar a planilha.',
    message: 'Oi Fernanda! Já faz quase 4 meses do seu preenchimento. Quer que eu separe um horário? Tenho quinta de manhã. 💚',
    reply: 'Quero sim!',
  },
  {
    n: '04',
    title: 'Traz de volta quem sumiu',
    desc: 'Cliente sem visita há 90 dias entra numa régua de reativação — a única mensagem aqui que é promocional.',
    message: 'Oi Roberta, senti sua falta por aqui! Faz 113 dias do seu último Fio de PDO. Quer voltar? Me responde que eu vejo um horário bom pra você.',
    reply: 'Vamos marcar 😍',
  },
];

const features = [
  {
    Icon: Calendar,
    title: 'Agenda + link de agendamento',
    desc: 'Visão de dia, semana e mês. E um link que a cliente abre e escolhe o horário sozinha.',
    color: '#0A6E6E',
    bg: '#E0F2F1',
  },
  {
    Icon: MessageSquare,
    title: 'WhatsApp que preenche a agenda',
    desc: 'Confirmação, lista de espera, recall e reativação — as quatro conversas que enchem a cadeira.',
    color: '#16A34A',
    bg: '#DCFCE7',
  },
  {
    Icon: Users,
    title: 'Prontuário com fotos',
    desc: 'Anamnese, alergias, histórico por sessão e fotos antes/depois na ficha de cada cliente.',
    color: '#0891B2',
    bg: '#E0F7FA',
  },
  {
    Icon: TrendingUp,
    title: 'Leads',
    desc: 'Todo mundo que chamou, num quadro: do primeiro contato ao horário marcado.',
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
  {
    Icon: DollarSign,
    title: 'Financeiro simples',
    desc: 'O que entrou hoje, o que está a receber e quem está devendo. Sem virar contabilidade.',
    color: '#D97706',
    bg: '#FEF3C7',
  },
];

const faqs = [
  {
    q: 'Meu número de WhatsApp continua funcionando no celular?',
    a: 'O número passa a operar pela API oficial do WhatsApp Business — é o que permite mandar confirmação e recall em escala sem risco de bloqueio. Na prática: o atendimento passa a acontecer pelo inbox do Lumina, que você abre no computador ou no próprio celular pelo navegador. O aplicativo comum do WhatsApp não roda mais nesse número ao mesmo tempo. Quem manda mensagem continua vendo o mesmo número de sempre.',
  },
  {
    q: 'Preciso instalar algum aplicativo?',
    a: 'Não. O Lumina funciona no navegador — computador, tablet ou celular.',
  },
  {
    q: 'Posso trazer minha lista de clientes?',
    a: 'Sim. Você importa uma planilha CSV ou Excel no primeiro acesso, ou depois, em Configurações.',
  },
  {
    q: 'O que conta como mensagem de promoção?',
    a: 'Só o que é promocional: reativação de quem sumiu e campanhas. Confirmação de horário, lista de espera e recall de retorno são mensagens de aviso e não têm limite em nenhum dos dois planos.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, sem multa. Você exporta seus dados antes de sair.',
  },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(o => !o)} className="w-full text-left py-5 border-b" style={{ borderColor: '#E1E8EF' }}>
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{q}</span>
        {open ? <ChevronUp size={18} style={{ color: '#0A6E6E', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: '#94A3B8', flexShrink: 0 }} />}
      </div>
      {open && <p className="mt-3 text-sm leading-relaxed" style={{ color: '#64748B' }}>{a}</p>}
    </button>
  );
}

export default function Landing({ onEnter }: LandingProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const plans = getPlans();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }

  const nav = [['Como funciona', 'como-funciona'], ['Recursos', 'recursos'], ['Preços', 'precos'], ['FAQ', 'faq']];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif', background: '#FFFFFF', color: '#0D1B2A' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(14,110,110,0.08)' }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-8">
          <div className="flex items-center gap-2.5 mr-auto">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0A6E6E' }}>
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lumina</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: '#475569' }}>
            {nav.map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ color: '#475569' }}>{label}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={onEnter} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ color: '#0D1B2A' }}>Entrar</button>
            <button onClick={onEnter} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: '#0A6E6E' }}>
              Começar grátis
            </button>
          </div>

          <button className="md:hidden p-2 rounded-lg" onClick={() => setMenuOpen(o => !o)} style={{ color: '#475569' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-5 pb-5 pt-2 space-y-2 border-t" style={{ borderColor: '#E1E8EF' }}>
            {nav.map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left py-2.5 text-sm font-medium"
                style={{ color: '#475569' }}>{label}</button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button onClick={onEnter} className="py-3 rounded-lg text-sm font-medium border text-center"
                style={{ borderColor: '#E1E8EF', color: '#0D1B2A' }}>Entrar</button>
              <button onClick={onEnter} className="py-3 rounded-lg text-sm font-semibold text-white text-center"
                style={{ background: '#0A6E6E' }}>Começar grátis</button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-20 px-5 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D1B2A 0%, #0A3D3D 50%, #0D1B2A 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #0D9488 0%, transparent 70%)', top: '-4rem', right: '10%' }} />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-5"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Cadeira vazia<br />
              <span style={{ color: '#4DD9CC' }}>custa caro.</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              O Lumina confirma, reativa e preenche a agenda da sua clínica de estética pelo WhatsApp —
              com agenda, prontuário e leads no mesmo lugar.
            </p>

            <button onClick={onEnter}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#0D9488' }}>
              Começar 14 dias grátis <ArrowRight size={18} />
            </button>

            <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Sem cartão de crédito · Cancele quando quiser
            </p>
          </div>

          {/* Demonstração da conversa */}
          <div className="rounded-2xl p-4 space-y-2.5" style={{ background: '#ECE5DD' }}>
            <WhatsBubble text="Oi Ana! Confirmando seu horário de amanhã às 09:00 para Toxina Botulínica. Responda SIM para confirmar ou NÃO para liberar o horário. 💚" time="09:00" />
            <WhatsBubble from="client" text="SIM" time="09:12" />
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'white' }}>
              <Check size={15} style={{ color: '#059669' }} />
              <span className="text-xs font-medium" style={{ color: '#065F46' }}>
                Horário confirmado na agenda automaticamente
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-16 md:py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: '#E0F2F1', color: '#0A6E6E' }}>
              Como funciona
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Quatro conversas que enchem a agenda
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#64748B' }}>
              Elas acontecem sozinhas, pelo seu WhatsApp, e o resultado aparece direto na agenda.
            </p>
          </div>

          <div className="space-y-6">
            {howItWorks.map((s, i) => (
              <div key={s.n} className="grid md:grid-cols-2 gap-6 items-center p-5 md:p-7 rounded-2xl"
                style={{ background: i % 2 === 0 ? '#F7F9FB' : '#FFFFFF', border: '1px solid #E1E8EF' }}>
                <div className={i % 2 === 0 ? '' : 'md:order-2'}>
                  <div className="text-3xl font-black mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#0A6E6E', opacity: 0.25, letterSpacing: '-2px' }}>
                    {s.n}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{s.desc}</p>
                </div>
                <div className={`rounded-2xl p-3.5 space-y-2 ${i % 2 === 0 ? '' : 'md:order-1'}`} style={{ background: '#ECE5DD' }}>
                  <WhatsBubble text={s.message} time="09:00" />
                  <WhatsBubble from="client" text={s.reply} time="09:12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECURSOS */}
      <section id="recursos" className="py-16 md:py-24 px-5" style={{ background: '#F7F9FB' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              O que tem dentro
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#64748B' }}>
              Cinco coisas, bem feitas. Nada além do que a clínica usa todo dia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E1E8EF' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section id="precos" className="py-16 md:py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Dois planos, só isso
            </h2>
            <p style={{ color: '#64748B' }}>14 dias grátis. Sem cartão de crédito.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {plans.map((p, i) => {
              const highlight = i === 1;
              return (
                <div key={p.id} className="relative rounded-2xl p-6 md:p-7 flex flex-col"
                  style={{
                    background: highlight ? 'linear-gradient(160deg, #0A3D3D 0%, #0D1B2A 100%)' : '#FFFFFF',
                    border: highlight ? '2px solid #0D9488' : '1px solid #E1E8EF',
                  }}>
                  {highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                      style={{ background: '#0D9488', color: 'white' }}>
                      MAIS ESCOLHIDO
                    </div>
                  )}
                  <div className="mb-5">
                    <div className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: highlight ? 'rgba(255,255,255,0.5)' : '#94A3B8' }}>{p.name}</div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-black" style={{ fontFamily: 'Instrument Sans, sans-serif', color: highlight ? '#4DD9CC' : '#0A6E6E' }}>
                        R${p.price}
                      </span>
                      <span className="text-sm pb-1" style={{ color: highlight ? 'rgba(255,255,255,0.4)' : '#94A3B8' }}>/mês</span>
                    </div>
                    <p className="text-sm" style={{ color: highlight ? 'rgba(255,255,255,0.55)' : '#64748B' }}>{p.tagline}</p>
                  </div>

                  {/* O preço por profissional, explicado em uma linha */}
                  <div className="p-3 rounded-xl mb-4 text-xs leading-relaxed"
                    style={{ background: highlight ? 'rgba(255,255,255,0.07)' : '#F7F9FB', color: highlight ? 'rgba(255,255,255,0.75)' : '#475569' }}>
                    {p.professionalsIncluded} profissional{p.professionalsIncluded > 1 ? 'is' : ''} incluído{p.professionalsIncluded > 1 ? 's' : ''};
                    cada profissional a mais custa R$ {p.extraProfessionalPrice}/mês, até {p.professionalsMax}.
                    Usuários que não atendem (recepção) não custam nada.
                  </div>

                  <ul className="space-y-2.5 mb-5 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: highlight ? 'rgba(13,148,136,0.3)' : '#E0F2F1' }}>
                          <Check size={10} style={{ color: highlight ? '#4DD9CC' : '#0A6E6E' }} />
                        </span>
                        <span style={{ color: highlight ? 'rgba(255,255,255,0.8)' : '#334155' }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-xs mb-4 p-2.5 rounded-lg"
                    style={{ background: highlight ? 'rgba(255,255,255,0.07)' : '#ECFDF5', color: highlight ? 'rgba(255,255,255,0.7)' : '#065F46' }}>
                    Mensagens de aviso <strong>ilimitadas</strong> · mensagens de promoção: <strong>{p.marketingQuota}/mês</strong>
                  </div>

                  <button onClick={onEnter}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold"
                    style={highlight ? { background: '#0D9488', color: 'white' } : { background: '#F1F5F9', color: '#0D1B2A' }}>
                    Começar 14 dias grátis
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm mt-8" style={{ color: '#64748B' }}>
            Tem mais de uma unidade?{' '}
            <a href="#" style={{ color: '#0A6E6E', fontWeight: 600 }}>Fale com a gente.</a>
          </p>
        </div>
      </section>

      {/* RESULTADOS — em breve, sem número inventado */}
      <section className="py-14 px-5" style={{ background: '#F7F9FB', borderTop: '1px solid #E1E8EF', borderBottom: '1px solid #E1E8EF' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: '#E0F2F1', color: '#0A6E6E' }}>
            Em breve
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Resultados das primeiras clínicas
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
            O Lumina está começando. Assim que as primeiras clínicas tiverem alguns meses de uso,
            publicamos aqui os números reais — taxa de comparecimento, vagas preenchidas pela lista
            de espera e clientes reativadas. Nada antes disso.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Perguntas frequentes
          </h2>
          {faqs.map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-20 px-5 mx-4 mb-10 rounded-3xl"
        style={{ background: 'linear-gradient(160deg, #0A3D3D 0%, #0D1B2A 100%)' }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Sua próxima cadeira vazia não precisa ficar vazia
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Comece hoje e veja a primeira confirmação sair amanhã de manhã.
          </p>
          <button onClick={onEnter}
            className="w-full sm:w-auto flex items-center justify-center gap-2 mx-auto px-8 py-4 rounded-xl text-base font-bold text-white"
            style={{ background: '#0D9488' }}>
            Começar 14 dias grátis <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="py-10 px-5" style={{ borderTop: '1px solid #E1E8EF' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0A6E6E' }}>
              <Building2 size={14} className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lumina</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94A3B8' }}>
            <Shield size={13} /> Dados tratados conforme a LGPD
          </div>
          <p className="text-xs" style={{ color: '#94A3B8' }}>© 2026 Lumina · Para clínicas de estética</p>
        </div>
      </footer>
    </div>
  );
}
