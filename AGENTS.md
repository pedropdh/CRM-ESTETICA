# Lumina — protótipo "Agenda Cheia"

React + Vite + Tailwind CSS v4 rodando dentro do Figma Make.

Isto é um **protótipo clicável**, não um produto. Não há backend, banco de
dados nem integração real: todo dado é mock em memória e reseta ao recarregar
a página. Toda ação de "Enviar" ou "Salvar" só atualiza estado local.

## Do que se trata

O Lumina é um CRM para clínicas de estética. A tese do produto está na
landing: *cadeira vazia custa caro*. O sistema confirma, reativa e preenche a
agenda pelo WhatsApp, com agenda, prontuário e leads no mesmo lugar.

Como o objetivo é **entender as telas e o funcionamento**, cada automação tem
uma tela que mostra visualmente o que ela faz: a mensagem que sai, o que
acontece quando a cliente responde e o que muda na agenda.

## Servidor de desenvolvimento

Já existe um servidor Vite rodando em `$PORT` (padrão 8443). Não é preciso
iniciá-lo manualmente. O preview recarrega sozinho ao salvar.

## Estrutura

- `src/main.tsx` — ponto de entrada React; importa `src/index.css` e monta
  `src/App.tsx` no `#root`.
- `src/App.tsx` — estado de navegação (`Page`), plano atual e cliente
  selecionada. É por onde começa qualquer trabalho de UI.
- `src/types.ts` — todos os tipos compartilhados.
- `src/data/mock.ts` — **fonte única de verdade** (ver abaixo).
- `src/index.css` — CSS global, tokens e `@import 'tailwindcss'`.
- `src/components/` — casca da aplicação: `Sidebar`, `BottomNav`, `Header`,
  `PlanGate`, `PlanSwitcher`.
- `src/components/ui/` — peças reutilizáveis: `Badge`, `StatCard`,
  `ConfirmModal`, `SlideOver`, `EmptyState`, `Toggle`, `WhatsBubble`.
- `src/pages/` — uma tela por arquivo.
- `vite.config.ts` — React, Tailwind v4 e plugins do Figma Make; alias `@`
  para `src`.

## Camada de dados única (`src/data/mock.ts`)

Formato de repositório: registros tipados + funções `get*()`. **Nenhuma
página declara sua própria cópia** de cliente, agenda, plano, procedimento ou
automação — tudo sai daqui. Quando existir backend, só estas funções mudam.

Entidades: `PlanInfo`, `Professional` (tem agenda, é cobrado), `User` (login,
papéis `dona | profissional | recepcao`, não é cobrado), `Procedure` (com
`returnIntervalDays`), `Client` (prontuário completo), `Appointment`,
`WaitlistEntry`, `Conversation` / `Message`, `Lead`, `Automation`.

**Mutação de estado**: as ações alteram o objeto dentro do array compartilhado
(ex.: `appt.status = 'cancelado'`) e a página chama um `forceTick` local para
re-renderizar. É proposital — sem backend, mutar o módulo singleton é o que
faz a ação parecer real ao navegar dentro da sessão.

A data de referência é `TODAY` em `mock.ts` (`2026-08-26`). Retornos previstos,
clientes inativas e "amanhã" são calculados a partir dela — não use
`new Date()` em página nenhuma.

## Planos — exatamente dois

| id | nome | preço | profissionais | adicional | marketing/mês |
|---|---|---|---|---|---|
| `essencial` | Essencial | R$ 149 | 1 incluído (máx. 3) | R$ 59 | 100 |
| `crescimento` | Crescimento | R$ 297 | 3 incluídos (máx. 10) | R$ 59 | 400 |

- **Não existe** limite de agendamentos, clientes, storage, usuários ou tokens.
- Confirmação, lista de espera e recall são **ilimitados nos dois planos**. Só
  mensagem de marketing (reativação promocional, campanha) consome franquia.
- Exclusivos do Crescimento: Funil de Leads, resposta automática a lead,
  reativação automática (no Essencial é manual), permissões por papel,
  comissões, relatório por profissional/origem, inbox multiatendente.
- `PlanGate` tem um único `requiredPlan: 'crescimento'`.
- Nunca escreva nome ou preço de plano fora de `mock.ts` — importe `getPlan()`
  / `getPlans()`.

## Navegação

Cinco itens + Configurações no rodapé: **Hoje · Agenda · Clientes · WhatsApp ·
Leads**. Financeiro e Desempenho são abas dentro de Configurações; os três
números do mês aparecem em Hoje. Notificações é um dropdown no header e Perfil
fica no menu do avatar — nenhum dos dois é página.

No celular a `Sidebar` some e a `BottomNav` assume os mesmos 5 itens.

## Telas

- **Hoje** — o que a dona vê primeiro, nesta ordem: alertas acionáveis
  (confirmação de amanhã, recall vencendo, lista de espera), agenda do dia com
  status de confirmação, dinheiro (entrou / a receber / meta), três números do
  mês e retenção (inativas há 90+ dias).
- **Agenda** — dia/semana/mês, status de confirmação em cada card, painel de
  lista de espera, e o modal "abriu uma vaga" ao cancelar um horário.
- **Clientes / ficha** — prontuário, anamnese, fotos, financeiro, chip
  "Ativa / Sem visita há N dias" e o próximo retorno previsto calculado pelo
  `returnIntervalDays` do último procedimento.
- **WhatsApp** — aba *Conversas* (inbox, selo de categoria por mensagem) e aba
  *Automações* (um card por regra; o `SlideOver` traz parâmetros, prévia da
  mensagem como bolha e o bloco **"O que acontece"**, que é o que explica o
  funcionamento). Abaixo das abas, o consumo de marketing do mês.
- **Leads** — kanban, origem "Link de agendamento" e configuração da resposta
  automática fora do horário. Bloqueado no Essencial.
- **Configurações** — 4 abas: Clínica & Equipe, Procedimentos, Financeiro,
  Plano & Consumo (+ Desempenho no Crescimento).
- **Onboarding** — 3 passos: clínica + WhatsApp, procedimentos pré-marcados
  com intervalo de retorno, importar planilha (pulável).

## Design

- Teal `#0A6E6E` (`--primary`), sidebar escura (`--sidebar-bg`), fonte
  Instrument Sans nos títulos e Inter no corpo. Tokens em `src/index.css`.
- Bolhas de WhatsApp usam sempre o `WhatsBubble` — a prévia da automação
  precisa parecer a mensagem real.
- Todo texto de interface em **português do Brasil**.
- `lucide-react` aqui é reduzido: **não existem ícones de marca** (`Instagram`
  não existe). Confirme que o ícone existe antes de usar; `Globe` serve de
  placeholder genérico para origem social.
- Alvos de toque de no mínimo 44px nas ações principais — todas as telas
  precisam funcionar a 390px de largura.

## Qualidade de código

- Use aspas duplas em strings com apóstrofo (`"We're here to help"`), ou
  escape-as. Apóstrofo solto em string com aspas simples quebra o build.
- Feche todas as tags JSX e mantenha as chaves balanceadas.
- Componentes são exportados como `default`.
- `pnpm build` (ou `./node_modules/.bin/vite build`) precisa passar antes de
  qualquer commit.

## O que este protótipo não faz

- **Nada é enviado de verdade.** Sem API do WhatsApp Business, sem gateway de
  pagamento, sem e-mail, sem NF-e.
- **Nenhuma automação roda sozinha.** Os disparos acontecem quando você clica
  no botão da tela; o que o protótipo mostra é *o que aconteceria*.
- **Não há login real, permissão real nem multi-unidade.** O `PlanSwitcher` na
  sidebar é um atalho de demonstração para ver a interface nos dois planos.
- Não existe painel administrativo neste repositório. O backoffice do SaaS foi
  arquivado no branch `archive/painel-gestor-saas` (ver `ARCHIVE.md` lá).
