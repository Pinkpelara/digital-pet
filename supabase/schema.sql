-- Companions schema (Supabase / Postgres)
-- Personality is a hidden per-instance seed: never client-writable, never sold.
-- Ownership is NEVER inserted by the anon/authenticated client.
-- Stripe webhook (service role) is the only production writer for ownership.

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  public_id text unique not null,
  auth_provider text not null default 'magic-link',
  created_at timestamptz not null default now()
);

create table if not exists companions (
  id text primary key,
  slug text unique not null,
  name text not null,
  item_id text not null,
  tagline text,
  description text,
  price_cents integer not null,
  default_stats jsonb not null default '{}',
  native_skills text[] not null default '{}',
  accent text,
  rive_src text,
  active boolean not null default true
);

create table if not exists items (
  id text primary key,
  sku text unique not null,
  slug text unique not null,
  kind text not null check (kind in ('companion','outfit','gadget','skill','drop')),
  name text not null,
  tagline text,
  description text,
  price_cents integer not null,
  currency text not null default 'usd',
  slot text check (slot in ('head','face','body','hand','back','feet')),
  skill_id text,
  species_id text references companions(id),
  limited boolean not null default false,
  limited_note text,
  unlocks_behavior text,
  behavior_note text,
  looks_good_with text[] not null default '{}',
  accent text,
  rive_src text,
  active boolean not null default true
);

create table if not exists ownership (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  item_id text not null references items(id),
  source text not null check (source in ('purchase','gift','demo','admin')),
  stripe_event_id text,
  granted_at timestamptz not null default now(),
  unique (user_id, item_id),
  unique (stripe_event_id)
);

create table if not exists companion_instances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  species_id text not null references companions(id),
  ownership_id uuid not null references ownership(id) on delete cascade,
  name text not null,
  public_id text unique not null,
  -- Hidden individual personality. Never shown as numbers, never editable.
  personality_seed jsonb not null default '{}',
  discovered_traits jsonb not null default '[]',
  behaviour_counters jsonb not null default '{}',
  secrets_found jsonb not null default '[]',
  favourite_spot text,
  created_at timestamptz not null default now()
);

create table if not exists equipped_items (
  instance_id uuid not null references companion_instances(id) on delete cascade,
  slot text not null check (slot in ('head','face','body','hand','back','feet')),
  item_id text not null references items(id),
  primary key (instance_id, slot)
);

create table if not exists unlocked_skills (
  instance_id uuid not null references companion_instances(id) on delete cascade,
  skill_id text not null,
  primary key (instance_id, skill_id)
);

create table if not exists discoveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  instance_id uuid not null references companion_instances(id) on delete cascade,
  kind text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists relationships (
  id uuid primary key default gen_random_uuid(),
  left_instance_id uuid not null references companion_instances(id) on delete cascade,
  right_instance_id uuid not null references companion_instances(id) on delete cascade,
  kind text not null,
  strength integer not null default 1,
  unique (left_instance_id, right_instance_id, kind)
);

create table if not exists item_compatibility (
  item_id text not null references items(id) on delete cascade,
  other_item_id text not null references items(id) on delete cascade,
  note text,
  primary key (item_id, other_item_id)
);

alter table users enable row level security;
alter table companions enable row level security;
alter table items enable row level security;
alter table ownership enable row level security;
alter table companion_instances enable row level security;
alter table equipped_items enable row level security;
alter table unlocked_skills enable row level security;
alter table discoveries enable row level security;
alter table relationships enable row level security;
alter table item_compatibility enable row level security;

-- Public catalog is readable by the world.
create policy companions_read on companions for select using (active = true);
create policy items_read on items for select using (active = true);
create policy compatibility_read on item_compatibility for select using (true);

-- Users may read themselves.
create policy users_self_read on users for select using (auth.uid() = id);
create policy users_self_update on users for update using (auth.uid() = id);

-- Inventory: read own rows. NO insert/update/delete for authenticated clients.
create policy ownership_self_read on ownership for select using (auth.uid() = user_id);
-- Intentionally omitted: insert/update/delete policies for `authenticated`.
-- Service role (webhook) bypasses RLS and is the only writer.

create policy instances_self_read on companion_instances for select using (auth.uid() = user_id);
create policy instances_self_update on companion_instances
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
-- No client insert: instances are created when ownership is granted.

create policy equipped_self_all on equipped_items
  for all using (
    exists (select 1 from companion_instances ci where ci.id = instance_id and ci.user_id = auth.uid())
  )
  with check (
    exists (select 1 from companion_instances ci where ci.id = instance_id and ci.user_id = auth.uid())
  );

create policy skills_self_read on unlocked_skills
  for select using (
    exists (select 1 from companion_instances ci where ci.id = instance_id and ci.user_id = auth.uid())
  );
-- No client insert for unlocked_skills — granted with ownership.

create policy discoveries_self_read on discoveries for select using (auth.uid() = user_id);

create policy relationships_self_read on relationships
  for select using (
    exists (select 1 from companion_instances ci where ci.id = left_instance_id and ci.user_id = auth.uid())
    or exists (select 1 from companion_instances ci where ci.id = right_instance_id and ci.user_id = auth.uid())
  );

-- Admin product CRUD uses the service role (or a dedicated admin JWT), never the anon key.
