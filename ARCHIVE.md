# Arquivo — Painel Gestor (SaaS)

Este branch guarda, na íntegra, o painel administrativo do Lumina: páginas `Admin*`, `AdminSidebar`, a camada `src/data/adminMock.ts` e o modo de impersonação em `App.tsx` (visão do dono do SaaS sobre clínicas, usuários, planos, assinaturas, conexões de WhatsApp, tickets e logs).

Foi arquivado porque é um backoffice construído antes de existirem clientes: gerencia um volume de clínicas, cobranças e suporte que ainda não existe, enquanto o esforço precisa ir para o produto que a clínica usa todo dia.

Volta a fazer sentido quando houver 20+ clínicas pagantes ou uma equipe de suporte que precise operar contas sem depender de acesso direto ao banco.

Do que foi construído aqui, duas coisas já foram reaproveitadas no produto principal: os componentes de UI (`Badge`, `StatCard`, `ConfirmModal`, `SlideOver`, promovidos para `src/components/ui/`) e o padrão de camada de dados — arquivo único de mock tipado com funções `get*()`, no formato de repositório, pronto para trocar por um backend real.

Não altere este branch: ele existe para ser consultado e recuperado como está.
