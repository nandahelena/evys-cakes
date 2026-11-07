import { computeMissing, isReady, mergeDraft, type Draft } from '../lib/agent/schema';

const TODAY = '2026-11-07';
let failed = 0;

function check(name: string, cond: boolean) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
  if (!cond) failed++;
}

// data passada rejeitada
{
  const { draft, errors } = mergeDraft({}, { eventDate: '2026-11-01' }, { today: TODAY });
  check('data passada rejeitada', !draft.eventDate && !!errors.eventDate);
}
{
  const { draft, errors } = mergeDraft({}, { eventDate: TODAY }, { today: TODAY });
  check('hoje não é aceito (a partir de amanhã)', !draft.eventDate && !!errors.eventDate);
}
{
  const { draft } = mergeDraft({}, { eventDate: '2026-11-08' }, { today: TODAY });
  check('amanhã é aceito', draft.eventDate === '2026-11-08');
}
{
  const { errors } = mergeDraft({}, { eventDate: '2029-01-01' }, { today: TODAY });
  check('mais de 2 anos à frente rejeitado', !!errors.eventDate);
}
{
  const { errors } = mergeDraft({}, { eventDate: '2027-02-30' }, { today: TODAY });
  check('data inexistente no calendário rejeitada', !!errors.eventDate);
}

// telefone normalizado
{
  const { draft } = mergeDraft({}, { phone: '(11) 91234-5678' }, { today: TODAY });
  check('telefone normalizado para dígitos', draft.phone === '11912345678');
}
{
  const { draft, errors } = mergeDraft({}, { phone: '123' }, { today: TODAY });
  check('telefone curto rejeitado', !draft.phone && !!errors.phone);
}

// campo inválido não derruba os válidos
{
  const { draft, errors } = mergeDraft(
    {},
    { eventType: 'wedding', guests: 0, decor: 'premium', name: 'Ana' },
    { today: TODAY },
  );
  check(
    'campo inválido não derruba os válidos',
    draft.eventType === 'wedding' && draft.decor === 'premium' && draft.name === 'Ana' &&
      draft.guests === undefined && !!errors.guests,
  );
}

// chaves extras descartadas
{
  const { draft } = mergeDraft({}, { name: 'Ana', discount: 90, price: 10, __proto__: { x: 1 } }, { today: TODAY });
  check('chaves extras descartadas', Object.keys(draft).join(',') === 'name');
}

// campo vazio não apaga valor existente
{
  const current: Draft = { name: 'Ana Souza', guests: 50 };
  const { draft, errors } = mergeDraft(current, { name: '', guests: null, notes: '   ' }, { today: TODAY });
  check(
    'campo vazio não apaga valor existente',
    draft.name === 'Ana Souza' && draft.guests === 50 && Object.keys(errors).length === 0,
  );
}

// número em string aceito
{
  const { draft } = mergeDraft({}, { guests: '80' }, { today: TODAY });
  check('número em string aceito', draft.guests === 80);
}
{
  const { draft, errors } = mergeDraft({}, { guests: 'muitos' }, { today: TODAY });
  check('texto não numérico em guests rejeitado', draft.guests === undefined && !!errors.guests);
}

// sanitização de HTML no nome
{
  const { draft } = mergeDraft({}, { name: '<b>Ana</b>' }, { today: TODAY });
  check('HTML removido do nome', draft.name === 'bAna/b');
}

// missing / ready
{
  const full = mergeDraft(
    {},
    {
      eventType: 'birthday',
      eventDate: '2027-03-15',
      guests: 40,
      decor: 'simple',
      name: 'Maria Silva',
      phone: '11999998888',
    },
    { today: TODAY },
  ).draft;
  check('rascunho completo está ready', isReady(full, TODAY));
  check('rascunho vazio lista os 5 obrigatórios', computeMissing({}, TODAY).length === 5);
  check('decor/venue/notes/email são opcionais', computeMissing(full, TODAY).length === 0);
  check('decor aceita texto livre', mergeDraft({}, { decor: 'Tema safari, verde e amarelo' }, { today: TODAY }).draft.decor === 'Tema safari, verde e amarelo');
  check('convidados até 5000 (como o formulário)', mergeDraft({}, { guests: 1200 }, { today: TODAY }).draft.guests === 1200 && !!mergeDraft({}, { guests: 6000 }, { today: TODAY }).errors.guests);
}

console.log(failed === 0 ? '\nTodos os testes passaram.' : `\n${failed} teste(s) falharam.`);
process.exit(failed === 0 ? 0 : 1);
