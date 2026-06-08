alter table public.procedures
  add column if not exists admin_profile_id uuid references public.admin_profiles(id) on delete cascade;

alter table public.availability_slots
  add column if not exists admin_profile_id uuid references public.admin_profiles(id) on delete cascade;

alter table public.appointments
  add column if not exists admin_profile_id uuid references public.admin_profiles(id) on delete cascade;

update public.procedures
   set admin_profile_id = (
     select id
       from public.admin_profiles
      where is_admin = true
      order by created_at asc
      limit 1
   )
 where admin_profile_id is null
   and exists (select 1 from public.admin_profiles where is_admin = true);

update public.availability_slots slot
   set admin_profile_id = procedure.admin_profile_id
  from public.procedures procedure
 where slot.procedure_id = procedure.id
   and slot.admin_profile_id is null
   and procedure.admin_profile_id is not null;

update public.availability_slots
   set admin_profile_id = (
     select id
       from public.admin_profiles
      where is_admin = true
      order by created_at asc
      limit 1
   )
 where admin_profile_id is null
   and exists (select 1 from public.admin_profiles where is_admin = true);

update public.appointments appointment
   set admin_profile_id = slot.admin_profile_id
  from public.availability_slots slot
 where appointment.slot_id = slot.id
   and appointment.admin_profile_id is null
   and slot.admin_profile_id is not null;

update public.appointments appointment
   set admin_profile_id = procedure.admin_profile_id
  from public.procedures procedure
 where appointment.procedure_id = procedure.id
   and appointment.admin_profile_id is null
   and procedure.admin_profile_id is not null;

update public.appointments
   set admin_profile_id = (
     select id
       from public.admin_profiles
      where is_admin = true
      order by created_at asc
      limit 1
   )
 where admin_profile_id is null
   and exists (select 1 from public.admin_profiles where is_admin = true);

create index if not exists procedures_admin_profile_idx
  on public.procedures (admin_profile_id, active, sort_order, name);

create index if not exists availability_slots_admin_profile_idx
  on public.availability_slots (admin_profile_id, slot_date, start_time);

create index if not exists appointments_admin_profile_idx
  on public.appointments (admin_profile_id, requested_date, requested_time);

drop index if exists availability_slots_lookup_idx;
create index if not exists availability_slots_lookup_idx
  on public.availability_slots (admin_profile_id, procedure_id, slot_date, is_available, is_booked);

create or replace function public.set_procedure_admin_profile_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.admin_profile_id is null then
    new.admin_profile_id := auth.uid();
  end if;

  if new.admin_profile_id is null
     or not exists (
       select 1
         from public.admin_profiles
        where id = new.admin_profile_id
          and is_admin = true
     ) then
    raise exception 'Perfil administrativo inválido.';
  end if;

  return new;
end;
$$;

drop trigger if exists procedures_set_admin_profile_id_before_write on public.procedures;
create trigger procedures_set_admin_profile_id_before_write
before insert or update of admin_profile_id on public.procedures
for each row execute function public.set_procedure_admin_profile_id();

create or replace function public.set_availability_slot_admin_profile_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  procedure_owner uuid;
begin
  if new.procedure_id is not null then
    select admin_profile_id
      into procedure_owner
      from public.procedures
     where id = new.procedure_id;

    if procedure_owner is null then
      raise exception 'Procedimento inválido para este horário.';
    end if;

    if new.admin_profile_id is null then
      new.admin_profile_id := procedure_owner;
    elsif new.admin_profile_id <> procedure_owner then
      raise exception 'Horário e procedimento pertencem a perfis administrativos diferentes.';
    end if;
  end if;

  if new.admin_profile_id is null then
    new.admin_profile_id := auth.uid();
  end if;

  if new.admin_profile_id is null
     or not exists (
       select 1
         from public.admin_profiles
        where id = new.admin_profile_id
          and is_admin = true
     ) then
    raise exception 'Perfil administrativo inválido.';
  end if;

  return new;
end;
$$;

drop trigger if exists availability_slots_set_admin_profile_id_before_write on public.availability_slots;
create trigger availability_slots_set_admin_profile_id_before_write
before insert or update of admin_profile_id, procedure_id on public.availability_slots
for each row execute function public.set_availability_slot_admin_profile_id();

create or replace function public.prevent_availability_overlap()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
      from public.availability_slots existing
     where existing.admin_profile_id = new.admin_profile_id
       and existing.slot_date = new.slot_date
       and existing.id <> new.id
       and new.start_time < existing.end_time
       and new.end_time > existing.start_time
  ) then
    raise exception 'Já existe disponibilidade cadastrada neste horário.';
  end if;

  return new;
end;
$$;

create or replace function public.set_appointment_admin_profile_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  slot_owner uuid;
  procedure_owner uuid;
begin
  if new.slot_id is not null then
    select admin_profile_id
      into slot_owner
      from public.availability_slots
     where id = new.slot_id;

    if slot_owner is null then
      raise exception 'Horário inválido.';
    end if;

    new.admin_profile_id := slot_owner;
  end if;

  if new.procedure_id is not null then
    select admin_profile_id
      into procedure_owner
      from public.procedures
     where id = new.procedure_id;

    if procedure_owner is null then
      raise exception 'Procedimento inválido.';
    end if;

    if new.admin_profile_id is null then
      new.admin_profile_id := procedure_owner;
    elsif new.admin_profile_id <> procedure_owner then
      raise exception 'Agendamento e procedimento pertencem a perfis administrativos diferentes.';
    end if;
  end if;

  if new.admin_profile_id is null then
    new.admin_profile_id := auth.uid();
  end if;

  return new;
end;
$$;

drop trigger if exists appointments_set_admin_profile_id_before_write on public.appointments;
create trigger appointments_set_admin_profile_id_before_write
before insert or update of admin_profile_id, procedure_id, slot_id on public.appointments
for each row execute function public.set_appointment_admin_profile_id();

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

  if not found
     or selected_slot.is_available = false
     or selected_slot.is_booked = true
     or selected_slot.admin_profile_id is null then
    raise exception 'Horário indisponível.';
  end if;

  if (selected_slot.slot_date + selected_slot.end_time) < (now() at time zone 'America/Fortaleza') then
    raise exception 'Este horário já passou.';
  end if;

  if selected_slot.procedure_id is not null and selected_slot.procedure_id <> new.procedure_id then
    raise exception 'Este horário está disponível apenas para outro procedimento.';
  end if;

  if selected_slot.allowed_procedure_ids is not null
     and not (new.procedure_id = any(selected_slot.allowed_procedure_ids)) then
    raise exception 'Este horário não está disponível para o procedimento escolhido.';
  end if;

  select *
    into selected_procedure
    from public.procedures
   where id = new.procedure_id
     and active = true
     and admin_profile_id = selected_slot.admin_profile_id;

  if not found then
    raise exception 'Procedimento indisponível.';
  end if;

  new.admin_profile_id := selected_slot.admin_profile_id;
  new.procedure_id := selected_procedure.id;
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

create or replace function public.cleanup_expired_availability_slots()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.availability_slots
   where is_booked = false
     and (slot_date + end_time) < (now() at time zone 'America/Fortaleza');
$$;

do $$
begin
  execute 'create extension if not exists pg_cron';
exception
  when others then
    raise notice 'pg_cron não pôde ser habilitado automaticamente. Habilite no Supabase para a limpeza agendada.';
end $$;

do $$
declare
  cleanup_job_id bigint;
begin
  select jobid
    into cleanup_job_id
    from cron.job
   where jobname = 'cleanup-expired-availability-slots'
   limit 1;

  if cleanup_job_id is not null then
    perform cron.unschedule(cleanup_job_id);
  end if;

  perform cron.schedule(
    'cleanup-expired-availability-slots',
    '15 * * * *',
    'select public.cleanup_expired_availability_slots();'
  );
exception
  when others then
    raise notice 'Limpeza automática não foi agendada porque pg_cron não está disponível. Execute public.cleanup_expired_availability_slots() manualmente ou habilite pg_cron.';
end $$;

drop policy if exists "Public can read active procedures" on public.procedures;
create policy "Public can read active procedures"
on public.procedures for select
to anon
using (active = true and admin_profile_id is not null);

drop policy if exists "Admins can manage procedures" on public.procedures;
create policy "Admins can manage procedures"
on public.procedures for all
to authenticated
using (public.current_user_is_admin() and admin_profile_id = auth.uid())
with check (public.current_user_is_admin() and admin_profile_id = auth.uid());

drop policy if exists "Public can read free slots" on public.availability_slots;
create policy "Public can read free slots"
on public.availability_slots for select
to anon
using (
  is_available = true
  and is_booked = false
  and admin_profile_id is not null
  and (slot_date + end_time) >= (now() at time zone 'America/Fortaleza')
);

drop policy if exists "Admins can manage slots" on public.availability_slots;
create policy "Admins can manage slots"
on public.availability_slots for all
to authenticated
using (public.current_user_is_admin() and admin_profile_id = auth.uid())
with check (public.current_user_is_admin() and admin_profile_id = auth.uid());

drop policy if exists "Public can create appointments" on public.appointments;
create policy "Public can create appointments"
on public.appointments for insert
to anon
with check (
  slot_id is not null
  and procedure_id is not null
  and admin_profile_id is not null
  and length(patient_name) > 1
  and length(patient_contact) > 3
);

drop policy if exists "Admins can manage appointments" on public.appointments;
create policy "Admins can manage appointments"
on public.appointments for all
to authenticated
using (public.current_user_is_admin() and admin_profile_id = auth.uid())
with check (public.current_user_is_admin() and admin_profile_id = auth.uid());
