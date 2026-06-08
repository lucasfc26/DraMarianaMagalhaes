alter table public.availability_slots
  add column if not exists allowed_procedure_ids uuid[];

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

  if selected_slot.allowed_procedure_ids is not null
     and not (new.procedure_id = any(selected_slot.allowed_procedure_ids)) then
    raise exception 'Este horário não está disponível para o procedimento escolhido.';
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
