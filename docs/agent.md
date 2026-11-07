# Agente de IA da Evys Cakes (backend)

O agente conduz uma conversa diagnóstica e preenche um rascunho de pedido (`OrderDraft`). É um caminho alternativo ao formulário e gera o mesmo registro. Ele só COLETA dados: o preço é calculado depois por `lib/pricing.ts`.

## Arquitetura
```
Cliente (UI) --POST /api/chat {messages, draft}--> app/api/chat/route.ts
   (rate limit por IP, validação, erros amigáveis)
        |
        v
lib/agent/run.ts  runAgentTurn()  --(openai SDK, baseURL Groq)--> Groq chat.completions
   |-- prompt.ts   system prompt pt-BR (data de hoje, faltantes, rascunho como dado)
   |-- tools.ts    update_order_draft -> runTool()
   '-- schema.ts   mergeDraft / computeMissing / isReady (zod, campo a campo)
```

## API: `POST /api/chat`
- Request: `{ "messages": [{ "role": "user"|"assistant", "content": string }], "draft": Partial<OrderDraft> }`. Máx. 24 mensagens de até 1000 caracteres; a última é da cliente.
- Response 200: `{ "reply": string, "draft": Partial<OrderDraft>, "missing": string[], "ready": boolean }`.
- Com mais de 24 mensagens: 200 com `reply` sugerindo formulário/WhatsApp, sem chamar a Groq.
- Erros (`{ "error": "mensagem em pt-BR" }`): 400 entrada inválida, 429 limite (20 req/10 min por IP ou limite da Groq), 500/502 falha interna ou do provedor.

## Variáveis de ambiente
- `GROQ_API_KEY`: obrigatória, só no servidor.
- `GROQ_MODEL`: opcional; padrão `openai/gpt-oss-120b` (precisa suportar tool use; confira em console.groq.com/docs/models).

## Como testar
- `npm run agent:test`: conversa interativa no terminal.
- `npm run agent:cases`: 8 casos roteirizados (chamam a Groq de verdade). Pausa padrão de 20 s entre turnos (cota de tokens/min do plano gratuito); ajuste com `AGENT_CASE_PAUSE_MS`. Um caso só: `npm run agent:cases -- g`.
- `npx tsx scripts/test-schema.ts`: testes unitários do schema (sem rede).

## Decisões de projeto
- O agente NÃO calcula nem comenta preço; o prompt proíbe e o teste (c) verifica.
- O servidor valida tudo (inclusive o `draft` que vem do cliente) e decide `ready`; o modelo nunca decide.
- Obrigatórios: `eventType`, `eventDate`, `guests`, `decor`, `name`, `phone`. Opcionais: `venue`, `notes`, `email`.
- Limites: 24 mensagens, 1000 caracteres, 3 rodadas de ferramenta por turno, timeout de 20 s, 1 retry em erro transitório.
- Provedor: Groq via API compatível com OpenAI. Trocar de provedor mexe só em `lib/agent/run.ts`.
- `tool_use_failed` (chamada malformada): repete uma vez; se falhar, segue sem ferramenta e extrai os campos com uma chamada separada (`json_object`), validada pelo mesmo schema.
- Modelos `gpt-oss` raciocinam antes de responder e isso conta nos `max_tokens`; por isso enviamos `reasoning_effort: 'low'` (sem isso a resposta pode sair vazia).
- Se um turno grava/altera `notes` e a resposta não cita a Evy ou o WhatsApp, o servidor acrescenta essa orientação (não depende do modelo).
- Texto com cara de chamada de ferramenta vazada é descartado e trocado por uma frase padrão.
- Logs só com contagens, tokens, latência e modelo; nunca o conteúdo das mensagens.
- Cache Components está ligado, então a rota não exporta `runtime`/`dynamic` (incompatíveis). POST não é cacheado.

## Próximos passos
- Streaming (SSE) da resposta.
- Persistir conversas e rascunhos no Supabase.
- Rate limit com Redis/Upstash (o atual é em memória, por instância).
- Observabilidade de custo e limite de tokens por conversa.
- Aviso de privacidade (LGPD): os dados da conversa (nome, telefone) vão a um provedor externo (Groq); informar a cliente e obter consentimento.
