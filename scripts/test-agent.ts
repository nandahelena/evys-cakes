// Conversa interativa no terminal com o agente (chama a Groq de verdade).
// Uso: npm run agent:test   (digite "sair" para encerrar)
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { runAgentTurn, type ChatMessage } from '../lib/agent/run';
import type { Draft } from '../lib/agent/schema';

async function main() {
  const rl = readline.createInterface({ input, output });
  const messages: ChatMessage[] = [];
  let draft: Draft = {};

  console.log('Conversa com o agente da Evys Cakes. Digite "sair" para encerrar.\n');
  for (;;) {
    const text = (await rl.question('Você: ')).trim();
    if (!text) continue;
    if (text.toLowerCase() === 'sair') break;

    messages.push({ role: 'user', content: text });
    const started = Date.now();
    try {
      const res = await runAgentTurn({ messages, draft });
      messages.push({ role: 'assistant', content: res.reply });
      draft = res.draft;
      console.log(`\nAgente: ${res.reply}\n`);
      console.log('  preenchidos:', JSON.stringify(res.draft));
      console.log('  faltando   :', res.missing.join(', ') || '(nada)');
      console.log(`  ready=${res.ready}  tokens=${res.usage.promptTokens}+${res.usage.completionTokens}  ${Date.now() - started}ms\n`);
    } catch (err) {
      messages.pop();
      console.log(`\n[erro] ${err instanceof Error ? err.name + ': ' + err.message : String(err)}\n`);
    }
  }
  rl.close();
}

main();
