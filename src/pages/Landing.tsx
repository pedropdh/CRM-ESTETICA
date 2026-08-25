import { useState } from 'react';
import {
  Calendar, Users, TrendingUp, DollarSign, MessageSquare, BarChart2,
  Check, ArrowRight, Star, ChevronDown, ChevronUp, Building2, Zap,
  Shield, Clock, Play, Menu, X
} from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
}

const features = [
  {
    icon: Calendar,
    title: 'Agenda Inteligente',
    desc: 'Visualização diária, semanal e mensal. Lembretes automáticos via WhatsApp para zerar no-shows.',
    color: '#0A6E6E',
    bg: '#E0F2F1',
  },
  {
    icon: TrendingUp,
    title: 'Funil de Leads',
    desc: 'Kanban visual do primeiro contato até o fechamento. Nunca perca uma oportunidade de venda.',
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
  {
    icon: Users,
    title: 'Prontuário Digital',
    desc: 'Anamnese, fotos antes/depois e histórico completo de cada paciente, organizados por sessão.',
    color: '#0891B2',
    bg: '#E0F7FA',
  },
  {
    icon: DollarSign,
    title: 'Financeiro Completo',
    desc: 'Contas a pagar e receber, comissões automáticas por profissional e fechamento de caixa diário.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: MessageSquare,
    title: 'Central de Mensagens',
    desc: 'Histórico de conversas WhatsApp por cliente. Campanhas segmentadas com um clique.',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    icon: BarChart2,
    title: 'Relatórios & BI',
    desc: 'Taxa de conversão, no-show, faturamento por profissional e dashboard multi-unidade.',
    color: '#DC2626',
    bg: '#FEE2E2',
  },
];

const steps = [
  { n: '01', title: 'Cadastre sua clínica', desc: 'Configure equipe, procedimentos e horários em menos de 10 minutos com nosso wizard guiado.' },
  { n: '02', title: 'Importe seus clientes', desc: 'Transfira sua base atual via CSV ou Excel. Nosso time faz a migração gratuitamente para você.' },
  { n: '03', title: 'Comece a crescer', desc: 'Agenda, leads e financeiro integrados. Acompanhe os resultados em tempo real no dashboard.' },
];

const testimonials = [
  {
    name: 'Dra. Renata Castilho',
    role: 'Proprietária · Clínica Castilho Estética, SP',
    avatar: 'RC',
    stars: 5,
    text: 'Reduzi o no-show de 18% para 3% em dois meses só com os lembretes automáticos do WhatsApp. O financeiro integrado me poupou horas de planilha toda semana.',
  },
  {
    name: 'Dra. Camila Braga',
    role: 'Sócia · Espaço Braga & Lima, RJ',
    avatar: 'CB',
    stars: 5,
    text: 'O funil de leads é exatamente o que faltava. Antes eu perdia contatos no caderno. Hoje converto 62% dos leads em agendamentos. Triplicamos o faturamento.',
  },
  {
    name: 'Tatiane Moura',
    role: 'Gestora · Rede Moura Beauty (4 unidades)',
    avatar: 'TM',
    stars: 5,
    text: 'Gerencio 4 unidades e 22 profissionais em uma tela só. O dashboard multi-unidade me dá uma visão que eu nunca tinha antes. Indispensável para redes.',
  },
];

const plans = [
  {
    name: 'Básico',
    price: 97,
    desc: 'Ideal para clínicas solos ou recém abertas',
    features: ['1 profissional', '100 agendamentos/mês', 'Agenda digital', 'Prontuário básico', 'Relatórios essenciais'],
    missing: ['Funil de leads', 'WhatsApp automático', 'Financeiro completo'],
    cta: 'Começar grátis',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 297,
    desc: 'Para clínicas em crescimento acelerado',
    features: ['Até 5 profissionais', 'Agendamentos ilimitados', 'Funil de leads completo', 'WhatsApp automático', 'Financeiro + comissões', 'Relatórios avançados'],
    missing: ['Multi-unidade'],
    cta: 'Começar 14 dias grátis',
    highlight: true,
  },
  {
    name: 'Redes',
    price: 697,
    desc: 'Para redes e franquias com múltiplas unidades',
    features: ['Profissionais ilimitados', 'Unidades ilimitadas', 'Dashboard consolidado', 'API própria', 'Onboarding dedicado', 'SLA 99,9% garantido'],
    missing: [],
    cta: 'Falar com vendas',
    highlight: false,
  },
];

const faqs = [
  { q: 'Preciso instalar algum aplicativo?', a: 'Não. O Lumina CRM funciona 100% no navegador — desktop, tablet ou celular. Basta acessar o link e usar.' },
  { q: 'E os meus dados atuais? Posso migrar?', a: 'Sim. Aceitamos importação via CSV e Excel. Nos planos Pro e Redes, nosso time faz a migração completa gratuitamente.' },
  { q: 'O sistema se integra com WhatsApp?', a: 'Sim. Conectamos com a API oficial do WhatsApp Business para lembretes automáticos, campanhas e histórico de conversas por cliente.' },
  { q: 'Funciona para clínica com mais de uma unidade?', a: 'Sim. O plano Redes oferece dashboard consolidado multi-unidade, com comparação de desempenho entre filiais e relatórios individuais por unidade.' },
  { q: 'Posso cancelar quando quiser?', a: 'Sim, sem multa e sem burocracia. Você exporta todos os seus dados antes de sair.' },
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

const HERO_IMG = 'https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80';
const FACIAL_IMG1 = 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80';
const FACIAL_IMG2 = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80';
const FACIAL_IMG3 = 'https://images.unsplash.com/photo-1731514771613-991a02407132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80';

export default function Landing({ onEnter }: LandingProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif', background: '#FFFFFF', color: '#0D1B2A' }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(14,110,110,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-8">
          <div className="flex items-center gap-2.5 mr-auto">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0A6E6E' }}>
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#0D1B2A' }}>Lumina CRM</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: '#475569' }}>
            {[['Recursos', 'recursos'], ['Como funciona', 'como-funciona'], ['Preços', 'precos'], ['FAQ', 'faq']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-teal-700 transition-colors"
                style={{ color: '#475569' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0A6E6E')}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={onEnter} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
              style={{ color: '#0D1B2A' }}>
              Entrar
            </button>
            <button onClick={onEnter}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#0A6E6E' }}>
              Começar grátis
            </button>
          </div>

          <button className="md:hidden p-2 rounded-lg" onClick={() => setMenuOpen(o => !o)} style={{ color: '#475569' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-5 pt-2 space-y-2 border-t" style={{ borderColor: '#E1E8EF' }}>
            {[['Recursos', 'recursos'], ['Como funciona', 'como-funciona'], ['Preços', 'precos'], ['FAQ', 'faq']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="block w-full text-left py-2 text-sm font-medium" style={{ color: '#475569' }}>{label}</button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button onClick={onEnter} className="py-2.5 rounded-lg text-sm font-medium border text-center"
                style={{ borderColor: '#E1E8EF', color: '#0D1B2A' }}>Entrar</button>
              <button onClick={onEnter} className="py-2.5 rounded-lg text-sm font-semibold text-white text-center"
                style={{ background: '#0A6E6E' }}>Começar grátis</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D1B2A 0%, #0A3D3D 50%, #0D1B2A 100%)' }}>
        {/* background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #0D9488 0%, transparent 70%)', top: '-4rem', right: '10%' }} />
          <div className="absolute w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #4DD9CC 0%, transparent 70%)', bottom: '0', left: '5%' }} />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(13,148,136,0.2)', color: '#4DD9CC', border: '1px solid rgba(77,217,204,0.25)' }}>
              <Zap size={12} /> Novo: Campanhas de WhatsApp em massa
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              O CRM feito para
              <span className="block" style={{ color: '#4DD9CC' }}>clínicas estéticas</span>
              brasileiras
            </h1>

            <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Agenda, prontuário, funil de leads, financeiro e WhatsApp integrados num só lugar.
              Pare de usar planilha e comece a crescer de verdade.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onEnter}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: '#0D9488' }}>
                Começar 14 dias grátis <ArrowRight size={18} />
              </button>
              <button onClick={onEnter}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium transition-all hover:bg-white/10"
                style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Play size={16} fill="white" /> Ver demonstração
              </button>
            </div>

            <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Sem cartão de crédito · Cancele quando quiser · Suporte em português
            </p>
          </div>

          {/* Hero image stack */}
          <div className="relative h-80 md:h-96">
            <img src={HERO_IMG} alt="Clínica moderna" className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              style={{ opacity: 0.35 }} />
            <div className="absolute inset-0 rounded-2xl"
              style={{ background: 'linear-gradient(to right, #0D1B2A 0%, transparent 40%, transparent 60%, #0D1B2A 100%)' }} />

            {/* floating cards */}
            <div className="absolute left-4 top-6 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.5)' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
                <span className="text-xs font-semibold text-gray-500">HOJE</span>
              </div>
              <div className="text-sm font-bold" style={{ color: '#0D1B2A' }}>14 agendamentos</div>
              <div className="text-xs" style={{ color: '#64748B' }}>2 pendentes de confirmação</div>
            </div>

            <div className="absolute right-4 top-6 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.5)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>FATURAMENTO</div>
              <div className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#059669' }}>R$ 58.420</div>
              <div className="text-xs font-medium" style={{ color: '#059669' }}>↑ 12% vs. mês anterior</div>
            </div>

            <div className="absolute bottom-6 left-4 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.5)' }}>
              <div className="text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>NO-SHOW</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#0A6E6E' }}>4,2%</div>
                <div className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: '#ECFDF5', color: '#059669' }}>▼ Meta atingida</div>
              </div>
            </div>

            <div className="absolute bottom-6 right-4 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.5)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>LEADS HOJE</div>
              <div className="text-xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#7C3AED' }}>+8 leads</div>
              <div className="text-xs" style={{ color: '#64748B' }}>3 pelo Instagram</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="py-10 px-6" style={{ background: '#F7F9FB', borderBottom: '1px solid #E1E8EF' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: '#94A3B8' }}>
            Mais de 1.400 clínicas estéticas confiam no Lumina CRM
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {[
              { n: '1.400+', label: 'Clínicas ativas' },
              { n: '240k', label: 'Agendamentos/mês' },
              { n: 'R$ 48M', label: 'Faturamento gerenciado' },
              { n: '4,9★', label: 'Avaliação média' },
              { n: '98%', label: 'Satisfação dos clientes' },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#0A6E6E' }}>{n}</div>
                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="recursos" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: '#E0F2F1', color: '#0A6E6E' }}>
              Tudo integrado
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Cada ferramenta que sua clínica precisa
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#64748B' }}>
              Sem integrações manuais, sem abas abertas, sem dor de cabeça. Um sistema, uma assinatura.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl group hover:shadow-lg transition-all duration-200 cursor-default"
                style={{ background: '#FFFFFF', border: '1px solid #E1E8EF' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E1E8EF'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISUAL SHOWCASE ── */}
      <section className="py-20 px-6" style={{ background: '#F7F9FB' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: '#EDE9FE', color: '#7C3AED' }}>
              Prontuário digital
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Tudo sobre sua paciente em uma tela só
            </h2>
            <p className="text-base leading-relaxed mb-7" style={{ color: '#64748B' }}>
              Histórico de atendimentos, anamnese completa com assinatura digital, galeria de fotos organizada por sessão e conversa de WhatsApp — tudo no prontuário.
            </p>
            <ul className="space-y-3">
              {['Anamnese com assinatura digital da paciente', 'Fotos antes/depois organizadas por sessão', 'Histórico financeiro com formas de pagamento', 'Chat WhatsApp integrado ao cadastro'].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: '#E0F2F1' }}>
                    <Check size={11} style={{ color: '#0A6E6E' }} />
                  </div>
                  <span className="text-sm" style={{ color: '#334155' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={FACIAL_IMG1} alt="Tratamento facial" className="rounded-2xl w-full h-52 object-cover" />
            <img src={FACIAL_IMG2} alt="Limpeza de pele" className="rounded-2xl w-full h-52 object-cover mt-6" />
            <img src={FACIAL_IMG3} alt="Procedimento estético" className="col-span-2 rounded-2xl w-full h-44 object-cover" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: '#E0F2F1', color: '#0A6E6E' }}>
              Simples de começar
            </div>
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Do zero ao sistema em 3 passos
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px -translate-x-8 z-0"
                    style={{ background: 'linear-gradient(to right, #0A6E6E40, transparent)' }} />
                )}
                <div className="relative z-10">
                  <div className="text-4xl font-black mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#E0F2F1', letterSpacing: '-2px' }}>{s.n}</div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6"
        style={{ background: 'linear-gradient(160deg, #0D1B2A 0%, #0A3D3D 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FBBF24" style={{ color: '#FBBF24' }} />)}
            </div>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Clínicas que já transformaram seus resultados
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex mb-3">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} size={14} fill="#FBBF24" style={{ color: '#FBBF24' }} />)}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0A6E6E, #0D9488)' }}>{t.avatar}</div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="precos" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: '#E0F2F1', color: '#0A6E6E' }}>
              Preços transparentes
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Plano certo para cada momento
            </h2>
            <p style={{ color: '#64748B' }}>Comece grátis por 14 dias. Sem cartão de crédito.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.name} className="relative rounded-2xl p-7 flex flex-col"
                style={{
                  background: p.highlight ? 'linear-gradient(160deg, #0A3D3D 0%, #0D1B2A 100%)' : '#FFFFFF',
                  border: p.highlight ? '2px solid #0D9488' : '1px solid #E1E8EF',
                  transform: p.highlight ? 'scale(1.03)' : 'none',
                  boxShadow: p.highlight ? '0 20px 60px rgba(10,110,110,0.25)' : 'none',
                }}>
                {p.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#0D9488', color: 'white' }}>
                    MAIS POPULAR
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: p.highlight ? 'rgba(255,255,255,0.5)' : '#94A3B8' }}>{p.name}</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black" style={{ fontFamily: 'Instrument Sans, sans-serif', color: p.highlight ? '#4DD9CC' : '#0A6E6E' }}>
                      R${p.price}
                    </span>
                    <span className="text-sm pb-1" style={{ color: p.highlight ? 'rgba(255,255,255,0.4)' : '#94A3B8' }}>/mês</span>
                  </div>
                  <p className="text-sm" style={{ color: p.highlight ? 'rgba(255,255,255,0.55)' : '#64748B' }}>{p.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-5 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: p.highlight ? 'rgba(13,148,136,0.25)' : '#E0F2F1' }}>
                        <Check size={10} style={{ color: p.highlight ? '#4DD9CC' : '#0A6E6E' }} />
                      </div>
                      <span style={{ color: p.highlight ? 'rgba(255,255,255,0.8)' : '#334155' }}>{f}</span>
                    </li>
                  ))}
                  {p.missing.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm opacity-40">
                      <div className="w-4.5 h-4.5 rounded-full shrink-0" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }} />
                      <span style={{ color: p.highlight ? 'rgba(255,255,255,0.4)' : '#94A3B8', textDecoration: 'line-through' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={onEnter}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                  style={p.highlight
                    ? { background: '#0D9488', color: 'white' }
                    : { background: '#F1F5F9', color: '#0D1B2A' }}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: '#94A3B8' }}>
            Todos os planos incluem suporte em português, SSL, backups automáticos diários e atualizações gratuitas.
          </p>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="py-14 px-6" style={{ background: '#F7F9FB', borderTop: '1px solid #E1E8EF' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'LGPD Compliant', sub: 'Dados protegidos conforme a lei brasileira' },
            { icon: Clock, title: '99,9% Uptime', sub: 'Disponibilidade garantida em SLA' },
            { icon: Zap, title: 'Suporte humano', sub: 'Via WhatsApp em horário comercial' },
            { icon: Building2, title: 'Servidor no Brasil', sub: 'Infraestrutura AWS São Paulo' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#E0F2F1' }}>
                <Icon size={20} style={{ color: '#0A6E6E' }} />
              </div>
              <div className="font-semibold text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{title}</div>
              <div className="text-xs" style={{ color: '#94A3B8' }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Perguntas frequentes
          </h2>
          <div>
            {faqs.map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 mx-6 mb-10 rounded-3xl"
        style={{ background: 'linear-gradient(160deg, #0A3D3D 0%, #0D1B2A 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Building2 size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Sua clínica merece um sistema à altura
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Junte-se a 1.400+ clínicas que já automatizaram a gestão e aumentaram o faturamento com o Lumina CRM.
          </p>
          <button onClick={onEnter}
            className="flex items-center gap-2 mx-auto px-8 py-4 rounded-xl text-base font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ background: '#0D9488' }}>
            Começar 14 dias grátis <ArrowRight size={18} />
          </button>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Sem cartão · Sem compromisso · Suporte em português
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6" style={{ borderTop: '1px solid #E1E8EF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0A6E6E' }}>
                  <Building2 size={14} className="text-white" />
                </div>
                <span className="font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lumina CRM</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                O sistema de gestão feito para clínicas estéticas brasileiras crescerem com inteligência.
              </p>
            </div>
            {[
              { title: 'Produto', links: ['Recursos', 'Preços', 'Novidades', 'Integrações', 'API'] },
              { title: 'Empresa', links: ['Sobre', 'Blog', 'Parceiros', 'Carreiras', 'Imprensa'] },
              { title: 'Suporte', links: ['Central de ajuda', 'WhatsApp', 'Status', 'Termos de uso', 'Privacidade'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#94A3B8' }}>{title}</h4>
                <ul className="space-y-2">
                  {links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm transition-colors hover:text-teal-700"
                        style={{ color: '#64748B' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#0A6E6E')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ borderTop: '1px solid #E1E8EF' }}>
            <p className="text-xs" style={{ color: '#94A3B8' }}>© 2026 Lumina CRM. Todos os direitos reservados.</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}>Feito com ♥ para clínicas estéticas brasileiras</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
