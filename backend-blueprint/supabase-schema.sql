create table members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  tier text not null default 'free',
  status text not null default 'active',
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id),
  product_key text not null,
  provider text not null,
  provider_session_id text unique,
  status text not null default 'pending',
  amount_cents integer,
  created_at timestamptz not null default now()
);

create table service_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id),
  service text not null,
  contact text not null,
  budget text,
  details text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table fulfillment_tasks (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid references service_requests(id),
  task_type text not null,
  status text not null default 'queued',
  due_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
