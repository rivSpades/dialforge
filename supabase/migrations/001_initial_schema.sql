-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  daily_goal numeric default 200,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Offers
create table offers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  traffic_source text not null,
  payout_per_call numeric not null default 0,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table offers enable row level security;
create policy "Users can manage own offers" on offers using (auth.uid() = user_id);

-- Calls
create table calls (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  offer_id uuid references offers(id) on delete set null,
  call_id_external text not null,
  duration_seconds integer not null default 0,
  status text not null check (status in ('billable', 'non_billable', 'duplicate', 'fraud')),
  payout numeric not null default 0,
  caller_hash text not null default '',
  called_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}',
  created_at timestamptz default now()
);
alter table calls enable row level security;
create policy "Users can view own calls" on calls for select using (auth.uid() = user_id);
create index calls_user_called_at_idx on calls(user_id, called_at desc);

-- Daily spend
create table daily_spend (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  offer_id uuid references offers(id) on delete set null,
  spend_date date not null,
  amount numeric not null default 0,
  notes text,
  created_at timestamptz default now()
);
alter table daily_spend enable row level security;
create policy "Users can manage own spend" on daily_spend using (auth.uid() = user_id);
create index daily_spend_user_date_idx on daily_spend(user_id, spend_date desc);

-- TCPA compliance log (no RLS needed — service role only)
create table tcpa_compliance_log (
  id uuid default uuid_generate_v4() primary key,
  caller_hash text not null,
  action text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Webhook audit log (no RLS needed — service role only)
create table webhook_audit_log (
  id uuid default uuid_generate_v4() primary key,
  source_ip text not null,
  payload jsonb not null default '{}',
  processed boolean default false,
  error text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
