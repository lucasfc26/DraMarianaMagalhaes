import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
  Clock,
  KeyRound,
  Loader2,
  LogOut,
  Plus,
  Settings,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Appointment,
  AvailabilitySlot,
  Procedure,
  callFunction,
  clearAdminSession,
  getAdminSession,
  isSupabaseConfigured,
  restFetch,
  toTimeLabel,
} from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

type Tab = "agenda" | "availability" | "procedures" | "settings";
type ViewMode = "day" | "week" | "month";

type AdminProfile = {
  id: string;
  email: string;
  display_name: string;
  must_change_password: boolean;
};

const weekdays = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
];

const statusLabels: Record<Appointment["status"], string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  done: "Concluído",
};

function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function monthValue(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function formatDateShort(value: string | null) {
  if (!value) return "Sem data";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function dateRange(startValue: string, endValue: string) {
  const dates: string[] = [];
  const start = new Date(`${startValue}T12:00:00`);
  const end = new Date(`${endValue}T12:00:00`);

  for (let current = start; current <= end; current = addDays(current, 1)) {
    dates.push(current.toISOString().slice(0, 10));
  }

  return dates;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("agenda");
  const [view, setView] = useState<ViewMode>("day");
  const [anchorDate, setAnchorDate] = useState(isoDate());
  const [month, setMonth] = useState(monthValue());
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [newProcedure, setNewProcedure] = useState({
    name: "",
    description: "",
    duration_minutes: 60,
  });

  const [newSlot, setNewSlot] = useState({
    procedure_id: "any",
    mode: "single" as "single" | "repeat",
    slot_date: isoDate(),
    start_date: isoDate(),
    end_date: isoDate(),
    weekdays: [1, 3, 5] as number[],
    start_time: "09:00",
    end_time: "10:00",
    interval_minutes: 60,
  });

  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirm: "",
  });

  const session = getAdminSession();

  const loadData = async () => {
    const currentSession = getAdminSession();
    if (!currentSession || !isSupabaseConfigured) {
      navigate({ to: "/admin/login" });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [profileData, procedureData, slotData, appointmentData] = await Promise.all([
        restFetch<AdminProfile[]>(`admin_profiles?select=*&id=eq.${currentSession.user.id}&limit=1`),
        restFetch<Procedure[]>("procedures?select=*&order=sort_order.asc,name.asc"),
        restFetch<AvailabilitySlot[]>(
          "availability_slots?select=*,procedures(name)&order=slot_date.asc,start_time.asc",
        ),
        restFetch<Appointment[]>("appointments?select=*&order=requested_date.asc,requested_time.asc,created_at.desc"),
      ]);

      if (!profileData[0]) {
        throw new Error("Usuário sem perfil administrativo cadastrado.");
      }

      setProfile(profileData[0]);
      setProcedures(procedureData);
      setSlots(slotData);
      setAppointments(appointmentData);

      setNewSlot((current) => ({ ...current, procedure_id: current.procedure_id || "any" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar o painel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleAppointments = useMemo(() => {
    const date = new Date(`${anchorDate}T12:00:00`);

    if (view === "day") {
      return appointments.filter((item) => item.requested_date === anchorDate);
    }

    if (view === "week") {
      const start = startOfWeek(date);
      const end = addDays(start, 6);
      return appointments.filter((item) => {
        if (!item.requested_date) return false;
        const current = new Date(`${item.requested_date}T12:00:00`);
        return current >= start && current <= end;
      });
    }

    return appointments.filter((item) => item.requested_date?.startsWith(anchorDate.slice(0, 7)));
  }, [anchorDate, appointments, view]);

  const monthSlots = slots.filter((slot) => slot.slot_date.startsWith(month));
  const activeProcedures = procedures.filter((procedure) => procedure.active);

  const logout = () => {
    clearAdminSession();
    navigate({ to: "/admin/login" });
  };

  const createProcedure = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await restFetch<Procedure[]>("procedures", {
        method: "POST",
        body: JSON.stringify({
          ...newProcedure,
          sort_order: procedures.length * 10 + 10,
          active: true,
        }),
      });
      setNewProcedure({ name: "", description: "", duration_minutes: 60 });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o procedimento.");
    } finally {
      setSaving(false);
    }
  };

  const updateProcedure = async (id: string, body: Partial<Procedure>) => {
    setSaving(true);
    setError("");

    try {
      await restFetch<Procedure[]>(`procedures?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o procedimento.");
    } finally {
      setSaving(false);
    }
  };

  const createSlot = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const targetDates =
        newSlot.mode === "single"
          ? [newSlot.slot_date]
          : dateRange(newSlot.start_date, newSlot.end_date).filter((date) =>
              newSlot.weekdays.includes(new Date(`${date}T12:00:00`).getDay()),
            );

      const startMinutes = timeToMinutes(newSlot.start_time);
      const endMinutes = timeToMinutes(newSlot.end_time);
      const slotsToCreate = targetDates.flatMap((date) => {
        const blocks = [];
        for (let current = startMinutes; current + newSlot.interval_minutes <= endMinutes; current += newSlot.interval_minutes) {
          blocks.push({
            procedure_id: newSlot.procedure_id === "any" ? null : newSlot.procedure_id,
            slot_date: date,
            start_time: minutesToTime(current),
            end_time: minutesToTime(current + newSlot.interval_minutes),
            is_available: true,
          });
        }
        return blocks;
      });

      if (!slotsToCreate.length) {
        throw new Error("Nenhum horário foi gerado. Revise os dias, horários e duração.");
      }

      await restFetch<AvailabilitySlot[]>("availability_slots", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(slotsToCreate),
      });
      setMonth((newSlot.mode === "single" ? newSlot.slot_date : newSlot.start_date).slice(0, 7));
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o horário.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async (id: string) => {
    setSaving(true);
    setError("");

    try {
      await restFetch<null>(`availability_slots?id=eq.${id}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível remover o horário.");
    } finally {
      setSaving(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment["status"]) => {
    setSaving(true);
    setError("");

    try {
      await restFetch<Appointment[]>(`appointments?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o agendamento.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (passwordForm.password !== passwordForm.confirm) {
        throw new Error("As senhas não conferem.");
      }

      await callFunction("complete-password-change", { password: passwordForm.password });
      setPasswordForm({ password: "", confirm: "" });
      setMessage("Senha alterada com sucesso.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível alterar a senha.");
    } finally {
      setSaving(false);
    }
  };

  if (!session || !isSupabaseConfigured) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-10">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/30 font-display">
              M
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Professional</div>
              <div className="font-display text-lg leading-none">OdontoSys</div>
            </div>
          </a>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground">{profile?.email || session.user.email}</span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors hover:border-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Acesso administrativo
            </div>
            <h1 className="font-display text-5xl leading-none md:text-6xl">
              Agenda <span className="italic text-gold-gradient">clínica</span>
            </h1>
          </div>

          <nav className="flex flex-wrap gap-2">
            {[
              { id: "agenda" as const, label: "Agenda", icon: CalendarDays },
              { id: "availability" as const, label: "Horários", icon: Clock },
              { id: "procedures" as const, label: "Procedimentos", icon: Stethoscope },
              { id: "settings" as const, label: "Configurações", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all ${
                    tab === item.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/20 text-muted-foreground hover:border-foreground/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {profile?.must_change_password && (
          <div className="mb-8 border border-gold/50 bg-gold/10 p-5 text-sm leading-relaxed">
            Você está usando uma senha temporária. Altere em Configurações para finalizar a recuperação.
          </div>
        )}

        {error && <div className="mb-8 border border-red-300 bg-red-50 p-5 text-sm text-red-700">{error}</div>}
        {message && <div className="mb-8 border border-gold/40 bg-gold/10 p-5 text-sm">{message}</div>}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {tab === "agenda" && (
              <section>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {(["day", "week", "month"] as ViewMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setView(mode)}
                        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                          view === mode ? "border-foreground bg-foreground text-background" : "border-foreground/20"
                        }`}
                      >
                        {mode === "day" ? "Dia" : mode === "week" ? "Semana" : "Mês"}
                      </button>
                    ))}
                  </div>
                  <input
                    type="date"
                    value={anchorDate}
                    onChange={(event) => setAnchorDate(event.target.value)}
                    className="border border-foreground/20 bg-transparent px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div className="grid gap-4">
                  {visibleAppointments.length === 0 && (
                    <div className="border border-dashed border-foreground/20 p-8 text-sm text-muted-foreground">
                      Nenhum agendamento para o período selecionado.
                    </div>
                  )}

                  {visibleAppointments.map((appointment) => (
                    <article key={appointment.id} className="border border-foreground/15 bg-card/60 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            {formatDateShort(appointment.requested_date)} ·{" "}
                            {appointment.requested_time ? toTimeLabel(appointment.requested_time) : "Sem horário"}
                          </div>
                          <h2 className="mt-2 font-display text-3xl">{appointment.patient_name}</h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {appointment.procedure_name} · {appointment.patient_contact}
                          </p>
                          {appointment.patient_comment && (
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed">{appointment.patient_comment}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(statusLabels) as Appointment["status"][]).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => updateAppointmentStatus(appointment.id, status)}
                              disabled={saving}
                              className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.18em] ${
                                appointment.status === status
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-foreground/20 text-muted-foreground"
                              }`}
                            >
                              {statusLabels[status]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {tab === "availability" && (
              <section className="grid gap-8 lg:grid-cols-12">
                <form onSubmit={createSlot} className="border border-foreground/15 bg-card/60 p-6 lg:col-span-4">
                  <div className="mb-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Novo horário
                  </div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Procedimento</label>
                  <select
                    value={newSlot.procedure_id}
                    onChange={(event) => setNewSlot({ ...newSlot, procedure_id: event.target.value })}
                    className="mt-3 w-full border border-foreground/20 bg-background px-4 py-3 text-sm"
                    required
                  >
                    <option value="any">Qualquer procedimento</option>
                    {activeProcedures.map((procedure) => (
                      <option key={procedure.id} value={procedure.id}>
                        {procedure.name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {[
                      { value: "single" as const, label: "Dia único" },
                      { value: "repeat" as const, label: "Recorrente" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setNewSlot({ ...newSlot, mode: item.value })}
                        className={`border px-4 py-3 text-xs uppercase tracking-[0.18em] ${
                          newSlot.mode === item.value
                            ? "border-foreground bg-foreground text-background"
                            : "border-foreground/20"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {newSlot.mode === "single" ? (
                    <>
                      <label className="mt-5 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Dia
                      </label>
                      <input
                        type="date"
                        value={newSlot.slot_date}
                        onChange={(event) => setNewSlot({ ...newSlot, slot_date: event.target.value })}
                        className="mt-3 w-full border border-foreground/20 bg-background px-4 py-3 text-sm"
                        required
                      />
                    </>
                  ) : (
                    <>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Início
                          </label>
                          <input
                            type="date"
                            value={newSlot.start_date}
                            onChange={(event) => setNewSlot({ ...newSlot, start_date: event.target.value })}
                            className="mt-3 w-full border border-foreground/20 bg-background px-4 py-3 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Fim</label>
                          <input
                            type="date"
                            value={newSlot.end_date}
                            onChange={(event) => setNewSlot({ ...newSlot, end_date: event.target.value })}
                            className="mt-3 w-full border border-foreground/20 bg-background px-4 py-3 text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-5">
                        <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Dias da semana
                        </label>
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {weekdays.map((day) => {
                            const checked = newSlot.weekdays.includes(day.value);
                            return (
                              <button
                                key={day.value}
                                type="button"
                                onClick={() =>
                                  setNewSlot({
                                    ...newSlot,
                                    weekdays: checked
                                      ? newSlot.weekdays.filter((value) => value !== day.value)
                                      : [...newSlot.weekdays, day.value],
                                  })
                                }
                                className={`border px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                                  checked ? "border-foreground bg-foreground text-background" : "border-foreground/20"
                                }`}
                              >
                                {day.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Início</label>
                      <input
                        type="time"
                        value={newSlot.start_time}
                        onChange={(event) => setNewSlot({ ...newSlot, start_time: event.target.value })}
                        className="mt-3 w-full border border-foreground/20 bg-background px-4 py-3 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Fim</label>
                      <input
                        type="time"
                        value={newSlot.end_time}
                        onChange={(event) => setNewSlot({ ...newSlot, end_time: event.target.value })}
                        className="mt-3 w-full border border-foreground/20 bg-background px-4 py-3 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <label className="mt-5 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Duração de cada horário
                  </label>
                  <select
                    value={newSlot.interval_minutes}
                    onChange={(event) => setNewSlot({ ...newSlot, interval_minutes: Number(event.target.value) })}
                    className="mt-3 w-full border border-foreground/20 bg-background px-4 py-3 text-sm"
                  >
                    {[30, 45, 60, 90, 120].map((minutes) => (
                      <option key={minutes} value={minutes}>
                        {minutes} minutos
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-xs uppercase tracking-[0.2em] text-background disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar horário
                  </button>
                </form>

                <div className="lg:col-span-8">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-4xl">Disponibilidade</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Escolha o mês para visualizar os horários.</p>
                    </div>
                    <input
                      type="month"
                      value={month}
                      onChange={(event) => setMonth(event.target.value)}
                      className="border border-foreground/20 bg-transparent px-4 py-3 text-sm"
                    />
                  </div>

                  <div className="grid gap-3">
                    {monthSlots.length === 0 && (
                      <div className="border border-dashed border-foreground/20 p-8 text-sm text-muted-foreground">
                        Nenhum horário disponível neste mês.
                      </div>
                    )}

                    {monthSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex flex-wrap items-center justify-between gap-4 border border-foreground/15 bg-background p-4"
                      >
                        <div>
                          <div className="font-display text-2xl">
                            {formatDateShort(slot.slot_date)} · {toTimeLabel(slot.start_time)} às {toTimeLabel(slot.end_time)}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {slot.procedure_id ? slot.procedures?.name || "Procedimento" : "Qualquer procedimento"} ·{" "}
                            {slot.is_booked ? "Reservado" : slot.is_available ? "Disponível" : "Oculto"}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteSlot(slot.id)}
                          disabled={saving || slot.is_booked}
                          className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {tab === "procedures" && (
              <section className="grid gap-8 lg:grid-cols-12">
                <form onSubmit={createProcedure} className="border border-foreground/15 bg-card/60 p-6 lg:col-span-4">
                  <div className="mb-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Novo procedimento
                  </div>
                  <input
                    value={newProcedure.name}
                    onChange={(event) => setNewProcedure({ ...newProcedure, name: event.target.value })}
                    className="w-full border-b border-foreground/20 bg-transparent pb-3 font-display text-2xl outline-none focus:border-foreground"
                    placeholder="Nome"
                    required
                  />
                  <textarea
                    value={newProcedure.description}
                    onChange={(event) => setNewProcedure({ ...newProcedure, description: event.target.value })}
                    className="mt-5 min-h-28 w-full border border-foreground/20 bg-transparent p-4 text-sm outline-none"
                    placeholder="Descrição curta"
                  />
                  <label className="mt-5 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Duração em minutos
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={newProcedure.duration_minutes}
                    onChange={(event) =>
                      setNewProcedure({ ...newProcedure, duration_minutes: Number(event.target.value) })
                    }
                    className="mt-3 w-full border border-foreground/20 bg-background px-4 py-3 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-xs uppercase tracking-[0.2em] text-background disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                    Salvar
                  </button>
                </form>

                <div className="grid gap-3 lg:col-span-8">
                  {procedures.map((procedure) => (
                    <div
                      key={procedure.id}
                      className="flex flex-wrap items-center justify-between gap-4 border border-foreground/15 bg-background p-5"
                    >
                      <div>
                        <h2 className="font-display text-3xl">{procedure.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {procedure.description || "Sem descrição"} · {procedure.duration_minutes} min
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateProcedure(procedure.id, { active: !procedure.active })}
                        disabled={saving}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                          procedure.active
                            ? "border-foreground bg-foreground text-background"
                            : "border-foreground/20 text-muted-foreground"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        {procedure.active ? "Ativo" : "Inativo"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === "settings" && (
              <section className="max-w-2xl border border-foreground/15 bg-card/60 p-6 md:p-8">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h2 className="font-display text-4xl">Alterar senha</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Use uma senha com pelo menos 8 caracteres. Depois de alterar, a senha temporária deixa de ser exigida.
                </p>

                <form onSubmit={changePassword} className="mt-8">
                  <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Nova senha</label>
                  <input
                    type="password"
                    value={passwordForm.password}
                    onChange={(event) => setPasswordForm({ ...passwordForm, password: event.target.value })}
                    className="mt-3 w-full border-b border-foreground/20 bg-transparent pb-3 font-display text-2xl outline-none focus:border-foreground"
                    required
                    minLength={8}
                  />

                  <label className="mt-7 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(event) => setPasswordForm({ ...passwordForm, confirm: event.target.value })}
                    className="mt-3 w-full border-b border-foreground/20 bg-transparent pb-3 font-display text-2xl outline-none focus:border-foreground"
                    required
                    minLength={8}
                  />

                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-8 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] text-background disabled:opacity-40"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                    Alterar senha
                  </button>
                </form>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
