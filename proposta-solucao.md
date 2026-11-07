# Proposta de solução — Evys Cakes

> Rascunho da equipe. Preços vêm das imagens do Cardápio 2026 em `docs-empreendedora/`, que a Evy confirmou ser a versão vigente. O que ainda precisa do OK dela está na seção 6.

## 1. Ideia em uma frase

O cliente monta o próprio pedido num site (cardápio com preços e fotos), o sistema gera o orçamento na hora, com validade e entrada de 60%, e o cliente reserva a data. A Evy entra para personalizar e fechar a venda.

**Por que dá certo:** os preços são fixos, então o sistema calcula o orçamento sozinho. Isso tira da Evy o trabalho de escrever o texto e cria o registro de leads que hoje não existe.

## 2. Fluxo completo

| # | Quem | O que acontece |
|---|---|---|
| 1 | Cliente | Manda mensagem no WhatsApp da Evy |
| 2 | WhatsApp Business | **Mensagem de saudação nativa** (sem bot, sem API) com texto curto + link do site |
| 3 | Site, passo 0 | Cliente informa nome, WhatsApp, data e tipo do evento, nº de convidados. **O lead é salvo aqui**, mesmo que ele desista depois |
| 4 | Site, cardápio | Fotos, itens, preço por unidade. Carrinho respeita os mínimos (seção 4). Botão fixo **"Quero algo personalizado"** (casamento, bolo decorado, outro) leva direto ao WhatsApp |
| 5 | Site, resumo | Itens, total, entrada de 60%, restante na retirada, regras. **Retirada é o padrão**, sem taxa de entrega no site |
| 6 | Site | **Gera a página do orçamento** (link próprio, com validade) e abre o WhatsApp com mensagem pronta + esse link (`wa.me`) |
| 7 | Cliente | Aperta "enviar". A conversa chega à Evy já com o pedido estruturado |
| 8 | Página do orçamento | Cliente pode **Reservar a data**, **Compartilhar** (noivo(a), família), **Pedir ajuste** ou **Tirar dúvida** |
| 9 | Evy | Vê o status no painel e assume a personalização (tema, cores, topper, entrega) pelo WhatsApp |

## 3. O "depois do orçamento" (a lacuna)

O gargalo confirmado é depois do orçamento: o cliente compara preço, valida com outra pessoa e some. Cada peça abaixo ataca uma dessas causas.

| Causa confirmada | Resposta no produto |
|---|---|
| Vai comparar preços | Página clara, com total, validade e fotos. Fica "viva" no celular dele, não se perde no meio do chat |
| Vai validar com o noivo(a) | Botão **Compartilhar** manda o mesmo link. Quem recebe vê tudo sem precisar da Evy |
| Demora e some | **Validade de 7 dias** (confirmada pela Evy). A página mostra a contagem regressiva |
| Ninguém retoma | Painel com lista **"retomar"** e mensagem pronta |
| Quer urgência | A contagem da validade já cria a urgência. Não há marcação de datas lotadas (a Evy dispensou), então o site não afirma escassez de vagas |

**Reservar a data = pagar a entrada.** A página mostra o valor da entrada (60%) e o Pix copia-e-cola. O cliente paga e manda o comprovante no WhatsApp. A Evy marca como **reservado** no painel. Leitura que fiz do cardápio: "encomenda só com o valor de entrada; sem isso é apenas orçamento". **Confirmar com ela.**

**Status do orçamento:** `enviado` → `aberto` → `reservado` / `expirado` / `ajuste pedido`.

**Retomada (painel da Evy):** lista de orçamentos abertos sem reserva e dos que expiram em 24h. Cada linha tem um botão que abre o WhatsApp com a mensagem pronta, e ela só aperta enviar. Exemplos:
- Lembrete: "Oi, [nome]! Seu orçamento vale até [data]. Posso ajudar com alguma dúvida?"
- Casamento: "Conseguiu mostrar para [noivo(a)]? O link serve para ele(a) ver tudo."

**Carrinho abandonado:** lead com nome, WhatsApp e data, mas sem orçamento gerado, aparece numa segunda lista "retomar".

**Por que sem envio automático:** mandar mensagem de dentro do número da Evy exige a API oficial do WhatsApp (aprovação da Meta, templates). Não cabe em um dia e a mensagem aprovada por ela mantém o tom pessoal.

## 4. Catálogo (preços das imagens do Cardápio 2026)

| Item | Preço | Unitário | Mínimo |
|---|---|---|---|
| Doces tradicionais (brigadeiro, beijinho, ninho, dois amores, prestígio) | R$ 145 / 100 un | R$ 1,45 | 50 doces |
| Doces gourmet (ninho com Nutella, maracujá, churros, ferrero rocher, brigadeiro, bicho de pé com Nutella, Romeu e Julieta, oreo, confete) | R$ 95 / 50 un | R$ 1,90 | 50 doces |
| Cupcake | R$ 4,00 | R$ 4,00 | 12 |
| Surpresa de uva | R$ 2,50 | R$ 2,50 | 30 |
| Mini pão de mel | R$ 4,00 | R$ 4,00 | 15 |
| Bolo, massa baunilha ou chocolate (por recheio) | R$ 90 a R$ 95 / kg | — | 1,5 kg |
| Topper simples "Parabéns" / personalizado / flores ou 3D | R$ 10 / R$ 15 / R$ 25 | — | pedir com 5 dias |

Os preços por kg de cada recheio estão em `cardapio-2026/massa-*.png`. Copiar de lá na hora de montar o JSON.

**Regras que o site aplica:**
- Mínimo de 50 doces **no pedido todo** (tradicionais e gourmet somados), não por sabor. Cupcake, surpresa de uva, mini pão de mel e bolo têm o mínimo da tabela.
- Pedido com no mínimo 7 dias de antecedência. Data mais próxima mostra "fale com a Evy", porque ela às vezes aceita.
- Entrada de 60%, sem devolução em desistência. Sem fiado.
- Retirada como padrão, sem taxa de entrega. Entrega só combinada no WhatsApp (se for Uber, o cliente solicita).

**Fora do catálogo:** a lista "Doces Finos" (trufados, pintados a mão, caixetas). A Evy confirmou que vale o Cardápio 2026.

## 5. Escopo para o hackathon

**Entra:**
1. Site com cardápio, fotos, carrinho e mínimos.
2. Passo 0 com captura de lead.
3. Página do orçamento com total, entrada, validade, compartilhar e "reservar" (Pix copia-e-cola).
4. Botão `wa.me` com mensagem pronta.
5. Painel simples: lista de orçamentos com status, "retomar" com mensagem pronta e marcar reservado.

**Fica para "próximos passos" (mostrar no pitch):** bot que envia mensagem pelo número dela (API oficial), pagamento com confirmação automática, calendário de capacidade, área para assessorias e buffets.

**Cuidados técnicos:**
- A chave Pix dela é um número de telefone. Guardar em variável de ambiente e **não commitar**.
- Na demo, simular a conversa do WhatsApp se não houver número de teste.

## 6. Perguntas para a Evy

**Já respondido pela Evy:** vale o Cardápio 2026; mínimo de 50 doces no pedido todo; validade de 7 dias; geralmente não cobra entrega (clientes retiram); o site não precisa sugerir quantidade; não precisa marcar datas lotadas; nome da marca é Evys Cakes.

**Ainda em aberto:**
1. 50 doces tradicionais custam R$ 72,50 (proporcional ao preço de 100) ou há outra regra?
2. "Encomenda apenas com o valor de entrada" significa que a data só é garantida com a entrada paga?

## 7. Hipóteses a validar (não confirmadas)

- O cliente aceita montar o pedido sozinho, e ver o preço antes de falar com ela não afasta quem hoje fecha na conversa. Teste barato: mandar o link para 3 clientes reais.
- O cliente abre o link (hoje recebe texto) e a Evy não perde o tom pessoal que sustenta as indicações.
- O ganho está no pós-orçamento (validade, compartilhar, retomada), e não só em acelerar a montagem.
