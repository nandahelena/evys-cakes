create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  event_date date not null,
  event_type text not null,
  guests int not null,
  decor text,
  venue text,
  notes text,
  status text default 'quote_sent', -- quote_sent | viewed | won | lost
  loss_reason text,
  created_at timestamptz default now()
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  total numeric not null,
  breakdown jsonb,
  public_token text unique not null,
  sent_at timestamptz default now(),
  viewed_at timestamptz
);

-- Hackathon only: RLS disabled; dashboard is protected at the app level.
