alter table public.availability_slots
  alter column procedure_id drop not null;

alter table public.availability_slots
  drop constraint if exists availability_slots_unique;

create or replace function public.prevent_availability_overlap()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
      from public.availability_slots existing
     where existing.slot_date = new.slot_date
       and existing.id <> new.id
       and new.start_time < existing.end_time
       and new.end_time > existing.start_time
  ) then
    raise exception 'Já existe disponibilidade cadastrada neste horário.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_availability_overlap_before_write on public.availability_slots;
create trigger prevent_availability_overlap_before_write
before insert or update on public.availability_slots
for each row execute function public.prevent_availability_overlap();

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

  if selected_slot.procedure_id is not null and selected_slot.procedure_id <> new.procedure_id then
    raise exception 'Este horário está disponível apenas para outro procedimento.';
  end if;

  select *
    into selected_procedure
    from public.procedures
   where id = new.procedure_id
     and active = true;

  if not found then
    raise exception 'Procedimento indisponível.';
  end if;

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

drop policy if exists "Public can create appointments" on public.appointments;
create policy "Public can create appointments"
on public.appointments for insert
to anon, authenticated
with check (
  slot_id is not null
  and procedure_id is not null
  and length(patient_name) > 1
  and length(patient_contact) > 3
);
