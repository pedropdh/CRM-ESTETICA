@AGENTS.md

# Lumina CRM — project-specific context

This is a **prototype**, not a production system. Everything below reflects
that: no backend, no database, no real integrations. Data lives in memory
and resets on page reload. Read this before exploring the codebase — it
should save you from re-discovering things that are already known.

## Two apps in one repo

- **Clinic CRM** (`src/pages/*.tsx` minus the `Admin*` ones) — what a
  clinic ("Clínica Lumina") sees: Dashboard, Agenda, Clientes, Leads,
  Campanhas, Financeiro, Mensagens, Relatórios, Configurações, etc.
  Entered via `Landing` → `Login`.
- **Gestor (SaaS admin) panel** (`src/pages/Admin*.tsx`,
  `src/components/AdminSidebar.tsx`, `src/components/admin/*`) — the
  Lumina SaaS owner's backoffice: sees every clinic, users, plans,
  subscriptions, WhatsApp connections, support tickets, audit logs.
  Entered via a small "Acesso administrativo" link at the bottom of the
  clinic `Login` screen, then its own `AdminLogin`.

They're wired together in `src/App.tsx`, which holds a `mode: 'clinic' |
'admin'` state plus `impersonatingClinicId`. **"Entrar como
administrador"** on a clinic's detail page (`AdminClinicaDetalhe`) doesn't
open a separate screen — it re-renders the *actual* clinic CRM with that
clinic's real plan (`startImpersonate` in `App.tsx`), wrapped in a purple
"Modo administrador do SaaS" banner. `stopImpersonate` returns to the
admin panel.

## Plan system — one source of truth

`Plan` in `src/types.ts` and `SaasPlanId` in `src/data/adminMock.ts` are
**the same type** (the latter is a type alias of the former). The plan
catalog — name, price, and every limit (professionals/users/clients/
appointments/storage/whatsapp/ai) — lives **only** in the `plans` array in
`src/data/adminMock.ts`, read via `getPlan(id)` / `getPlans()`.

**Never hardcode a plan name or price anywhere else.** Every place that
needs one — `Sidebar.tsx`, `PlanGate.tsx`, `Configuracoes.tsx`,
`Dashboard.tsx`, `Landing.tsx`, the admin pages — imports from
`data/adminMock.ts`. This used to be four independent, drifting copies of
the pricing table before it was unified; don't reintroduce a fifth.

Current tiers: **Start** (R$97) → **Pro** (R$247) → **Business** (R$497)
→ **Redes** (R$890). Feature gates that actually check the plan today:
- `plan === 'start'` locks Leads/Mensagens/Campanhas (`PlanGate`), trims
  Financeiro/Relatórios to basic tabs, and caps the team list in
  Configurações at `getPlan(plan).users`.
- `plan === 'redes'` is the only plan that unlocks the "Multi-unidade" tab
  in Relatórios (a real small comparison table, not just an upsell teaser).
- Business's only distinguishing flag (`ai: true`) is **not** wired to any
  feature yet — see Known gaps below.

## Mock data layer (`src/data/adminMock.ts`)

Shaped like a tiny repository so it can be swapped for Supabase later
without touching page components: typed records (`Clinic`, `AdminUserRecord`,
`Subscription`, `WhatsappConnection`, `Ticket`, `LogEntry`, `SaasPlan`) plus
`get*()` accessor functions. Nothing else in the app should declare its own
copy of clinics/users/plans — import from here.

**"Persistence" trick**: admin pages that let you suspend a clinic, block a
user, or change a plan mutate the plain object in the shared array directly
(e.g. `clinic.status = 'suspensa'`), then call a local `forceTick` state
update to re-render. This is intentional — there's no backend, so mutating
the singleton module state is what makes actions feel real across
navigation within a session. It resets on page reload.

## Reusable admin UI (`src/components/admin/`)

- `Badge.tsx` — status pill + every status→{label,color,bg} map
  (`clinicStatusMap`, `userStatusMap`, `ticketStatusMap`, etc.) and
  `usageColor(pct)` for the green/amber/red usage-bar convention.
- `StatCard.tsx` — the KPI tile used on every admin dashboard-style page.
- `ConfirmModal.tsx` — confirmation dialog for sensitive actions (suspend,
  cancel, block).
- `SlideOver.tsx` — right-side detail panel (used by WhatsApp connection
  detail and ticket conversation detail).

Reuse these instead of rebuilding card/table/modal markup — the whole
admin panel's visual consistency depends on it.

## Design language

- Clinic app: teal/`--primary` (`#0A6E6E`), dark sidebar via
  `var(--sidebar-bg)`. Tokens defined in `src/index.css`.
- Admin app: same dark sidebar token, but indigo accent (`#4F46E5`)
  everywhere instead of teal, to make it visually distinct from the
  clinic app it sometimes renders inside of (impersonation mode).
- `lucide-react` in this project is a cut-down version — **brand icons
  like `Instagram` don't exist**. Use `Globe` for generic social-icon
  placeholders. Verify an icon name exists before using it if unsure.

## Known gaps (intentional, not bugs — but worth knowing before touching related code)

- **No plan limit is actually enforced** except the team/user cap in
  Configurações. Adding a 6th client on the Start plan (300 limit) is not
  blocked anywhere. If asked to "respect plan limits," this is the
  remaining surface area.
- **"IA" is a plan flag with zero functionality behind it.** No screen
  uses it. If asked to build an AI feature, it doesn't exist yet in any
  form — not even a stub.
- **"WhatsApp automático" is rule-based, not AI.** Message templates in
  Configurações are static, trigger-based text (24h reminder, etc.);
  Mensagens is a manually-operated inbox. Nothing reads or responds to
  incoming messages autonomously.
- **Nothing actually sends anything.** No WhatsApp Business API, no
  payment gateway, no email, no NF-e. Every "Enviar" button updates local
  mock state only.
