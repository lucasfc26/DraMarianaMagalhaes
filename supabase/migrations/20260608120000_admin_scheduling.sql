create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text not null default 'Administrativo',
  is_admin boolean not null default true,
  must_change_password boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.procedures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes integer not null default 60 check (duration_minutes between 15 and 480),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  procedure_id uuid not null references public.procedures(id) on delete cascade,
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  is_available boolean not null default true,
  is_booked boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint availability_slots_time_check check (end_time > start_time),
  constraint availability_slots_unique unique (procedure_id, slot_date, start_time)
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  procedure_id uuid references public.procedures(id) on delete set null,
  slot_id uuid references public.availability_slots(id) on delete set null,
  procedure_name text not null,
  patient_name text not null,
  patient_contact text not null,
  patient_comment text,
  channel text not null default 'whatsapp' check (channel in ('whatsapp', 'email')),
  requested_date date,
  requested_time time,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists availability_slots_lookup_idx
  on public.availability_slots (procedure_id, slot_date, is_available, is_booked);

create index if not exists appointments_requested_date_idx
  on public.appointments (requested_date, requested_time);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_procedures_updated_at on public.procedures;
create trigger set_procedures_updated_at
before update on public.procedures
for each row execute function public.set_updated_at();

drop trigger if exists set_availability_slots_updated_at on public.availability_slots;
create trigger set_availability_slots_updated_at
before update on public.availability_slots
for each row execute function public.set_updated_at();

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

create or replace function public.reserve_appointment_slot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_slot public.availability_slots%rowtype;
  selected_procedure public.procedures%rowtype;
begin
  if new.slot_id is null then
    return new;
  end if;

  select *
    into selected_slot
    from public.availability_slots
   where id = new.slot_id
   for update;

  if not found or selected_slot.is_available = false or selected_slot.is_booked = true then
    raise exception 'Horário indisponível.';
  end if;

  select *
    into selected_procedure
    from public.procedures
   where id = selected_slot.procedure_id
     and active = true;

  if not found then
    raise exception 'Procedimento indisponível.';
  end if;

  new.procedure_id := selected_slot.procedure_id;
  new.procedure_name := selected_procedure.name;
  new.requested_date := selected_slot.slot_date;
  new.requested_time := selected_slot.start_time;

  update public.availability_slots
     set is_booked = true,
         updated_at = now()
   where id = selected_slot.id;

  return new;
end;
$$;

drop trigger if exists reserve_appointment_slot_before_insert on public.appointments;
create trigger reserve_appointment_slot_before_insert
before insert on public.appointments
for each row execute function public.reserve_appointment_slot();

alter table public.admin_profiles enable row level security;
alter table public.procedures enable row level security;
alter table public.availability_slots enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;
create policy "Admins can read admin profiles"
on public.admin_profiles for select
to authenticated
using (id = auth.uid() or public.current_user_is_admin());

drop policy if exists "Admins can manage admin profiles" on public.admin_profiles;
create policy "Admins can manage admin profiles"
on public.admin_profiles for all
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Public can read active procedures" on public.procedures;
create policy "Public can read active procedures"
on public.procedures for select
to anon, authenticated
using (active = true or public.current_user_is_admin());

drop policy if exists "Admins can manage procedures" on public.procedures;
create policy "Admins can manage procedures"
on public.procedures for all
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Public can read free slots" on public.availability_slots;
create policy "Public can read free slots"
on public.availability_slots for select
to anon, authenticated
using (
  (is_available = true and is_booked = false)
  or public.current_user_is_admin()
);

drop policy if exists "Admins can manage slots" on public.availability_slots;
create policy "Admins can manage slots"
on public.availability_slots for all
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Public can create appointments" on public.appointments;
create policy "Public can create appointments"
on public.appointments for insert
to anon, authenticated
with check (length(patient_name) > 1 and length(patient_contact) > 3);

drop policy if exists "Admins can manage appointments" on public.appointments;
create policy "Admins can manage appointments"
on public.appointments for all
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

insert into public.procedures (name, description, duration_minutes, sort_order)
values
  ('Limpeza dentária', 'Profilaxia e orientação preventiva.', 60, 10),
  ('Restauração', 'Tratamento restaurador para cáries e fraturas.', 60, 20),
  ('Placa DTM/bruxismo', 'Avaliação e placa miorrelaxante.', 60, 30),
  ('Urgência odontológica', 'Atendimento para dor, trauma ou inflamação.', 60, 40),
  ('Atendimento pediátrico', 'Cuidado odontológico acolhedor para crianças.', 60, 50),
  ('Clareamento consultório', 'Clareamento dental realizado em consultório.', 60, 60),
  ('Clareamento caseiro', 'Clareamento supervisionado para uso caseiro.', 60, 70),
  ('Botox', 'Aplicação para suavização de marcas de expressão.', 45, 80),
  ('Skinbooster', 'Hidratação profunda da pele com injetáveis.', 45, 90),
  ('Preenchimento labial', 'Contorno, hidratação e volume labial.', 60, 100),
  ('Preenchimento de mento', 'Harmonização da região do queixo.', 60, 110),
  ('Preenchimento de malar', 'Realce da maçã do rosto.', 60, 120),
  ('Bioestimuladores', 'Estímulo de colágeno e qualidade da pele.', 60, 130),
  ('Fios lisos', 'Fios lisos para cuidado com qualidade e firmeza da pele.', 60, 140)
on conflict do nothing;

-- Depois de criar a usuária no Supabase Auth, cadastre o acesso administrativo:
-- insert into public.admin_profiles (id, email, display_name)
-- values ('AUTH_USER_ID_AQUI', 'staff@professionalodontosys.com.br', 'Dra. Mariana');
