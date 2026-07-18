-- Singleton table to track Telegram getUpdates offset
create table public.telegram_bot_state (
  id int primary key check (id = 1),
  update_offset bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.telegram_bot_state enable row level security;

create policy "Service role manages telegram bot state"
  on public.telegram_bot_state
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

insert into public.telegram_bot_state (id, update_offset) values (1, 0);