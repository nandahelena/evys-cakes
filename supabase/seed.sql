-- DADOS DE DEMONSTRAÇÃO do painel da Evy (fictícios). NÃO rode em produção com dados reais sem ler isto.
--
-- Como identificar: todo cliente de demonstração tem e-mail terminando em @demo.evys.test.
-- Como rodar: cole este arquivo inteiro no SQL Editor do Supabase. Pode rodar mais de uma vez
-- (ele apaga os dados de demonstração anteriores antes de inserir de novo, então as datas "rejuvenescem").
-- Como apagar tudo depois (rode só este bloco):
--
--   delete from quotes where order_id in (select o.id from orders o join customers c on c.id = o.customer_id where c.email like '%@demo.evys.test');
--   delete from orders where customer_id in (select id from customers where email like '%@demo.evys.test');
--   delete from customers where email like '%@demo.evys.test';
--
-- As datas são relativas a now(): eventos nos próximos ~2 meses e orçamentos enviados há alguns dias.

-- 1) Limpa demonstração anterior
delete from quotes where order_id in (
  select o.id from orders o join customers c on c.id = o.customer_id where c.email like '%@demo.evys.test'
);
delete from orders where customer_id in (select id from customers where email like '%@demo.evys.test');
delete from customers where email like '%@demo.evys.test';

-- 2) Insere clientes, pedidos e orçamentos
do $$
declare
  r record;
  cid uuid;
  oid uuid;
  sent timestamptz;
begin
  for r in
    select * from (values
      -- nome, telefone, e-mail, tipo, convidados, decoração, local, observações,
      -- dias até o evento, enviado há (dias), status, motivo da perda, visualizado há (dias), itens (jsonb)
      ('Mariana Albuquerque', '5511999990001', 'mariana.albuquerque@demo.evys.test', 'wedding', 120,
        'Mesa romântica, tons de rosa e dourado', 'Espaço Villa Jardim, Moema', 'Noivo vai ver o orçamento junto.',
        45, 5, 'quote_sent', null, null,
        '[{"id":"bolo-baunilha-ninho-trufado","name":"Bolo massa baunilha: ninho trufado","qty":4,"unit":"kg","unitPrice":92,"subtotal":368},
          {"id":"doces-tradicionais-brigadeiro","name":"Brigadeiro","qty":200,"unit":"un","unitPrice":1.45,"subtotal":290},
          {"id":"doces-gourmet-ninho-com-nutella","name":"Ninho com Nutella","qty":100,"unit":"un","unitPrice":1.9,"subtotal":190}]'),

      ('Camila Rocha', '5511999990002', 'camila.rocha@demo.evys.test', 'birthday', 40,
        'Tema safari, cores verde e amarelo', 'Casa da cliente, Vila Mariana', null,
        18, 3, 'quote_sent', null, null,
        '[{"id":"cupcake","name":"Cupcake","qty":36,"unit":"un","unitPrice":4,"subtotal":144,"choice":"massa chocolate · recheio brigadeiro"},
          {"id":"doces-tradicionais-brigadeiro","name":"Brigadeiro","qty":100,"unit":"un","unitPrice":1.45,"subtotal":145},
          {"id":"toppers-personalizado","name":"Topper simples personalizado","qty":1,"unit":"un","unitPrice":15,"subtotal":15}]'),

      ('Bruno Nogueira', '5511999990003', 'bruno.nogueira@demo.evys.test', 'corporate', 70,
        'Mesa clean, identidade da empresa em azul', 'Escritório na Av. Paulista', 'Confraternização de fim de ano.',
        25, 6, 'viewed', null, 4,
        '[{"id":"doces-gourmet-churros","name":"Churros","qty":150,"unit":"un","unitPrice":1.9,"subtotal":285},
          {"id":"mini-pao-de-mel","name":"Mini pão de mel","qty":30,"unit":"un","unitPrice":4,"subtotal":120,"choice":"recheio doce de leite"}]'),

      ('Thiago Martins', '5511999990004', 'thiago.martins@demo.evys.test', 'corporate', 100,
        'Sem decoração, só os doces em bandejas', 'Sala de eventos, Pinheiros', null,
        32, 4, 'viewed', null, 3,
        '[{"id":"doces-tradicionais-ninho","name":"Ninho","qty":200,"unit":"un","unitPrice":1.45,"subtotal":290},
          {"id":"doces-gourmet-oreo","name":"Oreo","qty":100,"unit":"un","unitPrice":1.9,"subtotal":190}]'),

      ('Fernanda Costa', '5511999990005', 'fernanda.costa@demo.evys.test', 'birthday', 60,
        'Festa de 15 anos, tema floral', 'Salão do condomínio, Tatuapé', null,
        30, 10, 'won', null, 9,
        '[{"id":"bolo-chocolate-brigadeiro","name":"Bolo massa chocolate: brigadeiro","qty":3,"unit":"kg","unitPrice":90,"subtotal":270},
          {"id":"doces-tradicionais-brigadeiro","name":"Brigadeiro","qty":100,"unit":"un","unitPrice":1.45,"subtotal":145},
          {"id":"doces-tradicionais-beijinho","name":"Beijinho","qty":100,"unit":"un","unitPrice":1.45,"subtotal":145},
          {"id":"toppers-parabens","name":"Topper simples \"Parabéns\"","qty":1,"unit":"un","unitPrice":10,"subtotal":10}]'),

      ('Fernanda Costa', '5511999990005', 'fernanda.costa@demo.evys.test', 'other', 35,
        'Chá de bebê, tons neutros', 'Casa da cliente, Tatuapé', 'Cliente antiga, já pediu antes.',
        9, 20, 'won', null, 19,
        '[{"id":"mini-pao-de-mel","name":"Mini pão de mel","qty":30,"unit":"un","unitPrice":4,"subtotal":120,"choice":"recheio ninho"},
          {"id":"surpresa-de-uva","name":"Surpresa de uva","qty":40,"unit":"un","unitPrice":2.5,"subtotal":100},
          {"id":"doces-tradicionais-beijinho","name":"Beijinho","qty":50,"unit":"un","unitPrice":1.45,"subtotal":72.5}]'),

      ('Larissa Duarte', '5511999990006', 'larissa.duarte@demo.evys.test', 'wedding', 90,
        'Rústico, flores do campo', 'Sítio em Cotia', 'Vai comparar com outros fornecedores.',
        52, 12, 'lost', 'price', 11,
        '[{"id":"bolo-chocolate-prestigio","name":"Bolo massa chocolate: prestígio","qty":4,"unit":"kg","unitPrice":90,"subtotal":360},
          {"id":"doces-tradicionais-brigadeiro","name":"Brigadeiro","qty":200,"unit":"un","unitPrice":1.45,"subtotal":290},
          {"id":"doces-gourmet-ferrero-rocher","name":"Ferrero Rocher","qty":100,"unit":"un","unitPrice":1.9,"subtotal":190}]'),

      ('Gustavo Ferreira', '5511999990007', 'gustavo.ferreira@demo.evys.test', 'birthday', 50,
        'Tema futebol', 'Quadra do prédio, Santana', null,
        14, 9, 'lost', 'other_vendor', 8,
        '[{"id":"cupcake","name":"Cupcake","qty":48,"unit":"un","unitPrice":4,"subtotal":192,"choice":"massa baunilha · recheio ninho"},
          {"id":"doces-tradicionais-brigadeiro","name":"Brigadeiro","qty":100,"unit":"un","unitPrice":1.45,"subtotal":145}]'),

      ('Aline Barbosa', '5511999990008', 'aline.barbosa@demo.evys.test', 'other', 35,
        'Chá de panela', 'Apartamento da cliente, Mooca', null,
        22, 16, 'lost', 'no_reply', null,
        '[{"id":"mini-pao-de-mel","name":"Mini pão de mel","qty":30,"unit":"un","unitPrice":4,"subtotal":120,"choice":"recheio brigadeiro"},
          {"id":"surpresa-de-uva","name":"Surpresa de uva","qty":30,"unit":"un","unitPrice":2.5,"subtotal":75},
          {"id":"doces-tradicionais-brigadeiro","name":"Brigadeiro","qty":50,"unit":"un","unitPrice":1.45,"subtotal":72.5}]'),

      ('Eduardo Silveira', '5511999990009', 'eduardo.silveira@demo.evys.test', 'corporate', 80,
        'Evento de lançamento, mesa institucional', 'Hotel no Itaim', 'Data do evento mudou e a agenda da Evy não comporta.',
        40, 11, 'lost', 'date', 10,
        '[{"id":"doces-gourmet-maracuja","name":"Maracujá","qty":100,"unit":"un","unitPrice":1.9,"subtotal":190},
          {"id":"doces-tradicionais-prestigio","name":"Prestígio","qty":150,"unit":"un","unitPrice":1.45,"subtotal":217.5}]'),

      ('Renata Gomes', '5511999990010', 'renata.gomes@demo.evys.test', 'other', 25,
        'Despedida de solteira, tema rosa', 'Casa de festas, Pompeia', 'Evento cancelado por imprevisto pessoal.',
        27, 13, 'lost', 'other', 12,
        '[{"id":"cupcake","name":"Cupcake","qty":24,"unit":"un","unitPrice":4,"subtotal":96,"choice":"massa cenoura · recheio doce de leite"},
          {"id":"doces-gourmet-bicho-de-pe-com-nutella","name":"Bicho de pé com Nutella","qty":50,"unit":"un","unitPrice":1.9,"subtotal":95}]')
    ) as t(name, phone, email, event_type, guests, decor, venue, notes,
           days_to_event, sent_days_ago, status, loss_reason, viewed_days_ago, items)
  loop
    -- reaproveita o cliente se ele já tiver sido criado nesta execução (cliente com 2 pedidos)
    select id into cid from customers where email = r.email;
    if cid is null then
      insert into customers (name, phone, email) values (r.name, r.phone, r.email) returning id into cid;
    end if;

    sent := now() - make_interval(days => r.sent_days_ago);

    insert into orders (customer_id, event_date, event_type, guests, decor, venue, notes, status, loss_reason, created_at)
    values (cid, (now() at time zone 'America/Sao_Paulo')::date + r.days_to_event, r.event_type, r.guests,
            r.decor, r.venue, r.notes, r.status, r.loss_reason, sent)
    returning id into oid;

    insert into quotes (order_id, total, breakdown, public_token, sent_at, viewed_at)
    values (
      oid,
      (select sum((l->>'subtotal')::numeric) from jsonb_array_elements(r.items::jsonb) l),
      jsonb_build_object('lines', r.items::jsonb, 'entradaPct', 0.6),
      md5(random()::text || clock_timestamp()::text),
      sent,
      case when r.viewed_days_ago is null then null else now() - make_interval(days => r.viewed_days_ago) end
    );
  end loop;
end $$;

-- 3) Conferência rápida
select c.name, o.event_type, o.event_date, o.status, o.loss_reason, q.total, q.sent_at::date as enviado_em
from orders o
join customers c on c.id = o.customer_id
join quotes q on q.order_id = o.id
where c.email like '%@demo.evys.test'
order by o.event_date;
