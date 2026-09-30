create table public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_name text not null,
  option_id text not null check (option_id in ('churrascaria','restaurante','sitio','espaco')),
  created_at timestamptz not null default now()
);

create unique index votes_voter_name_unique on public.votes (lower(voter_name));

grant insert on public.votes to anon;
grant all on public.votes to service_role;

alter table public.votes enable row level security;

create policy "Qualquer pessoa pode votar"
on public.votes for insert to anon
with check (true);

create or replace function public.get_vote_counts()
returns table(option_id text, total bigint)
language sql
security definer
set search_path = public
as $$
  select v.option_id, count(*)::bigint as total
  from public.votes v
  group by v.option_id;
$$;

grant execute on function public.get_vote_counts() to anon;
grant execute on function public.get_vote_counts() to service_role;