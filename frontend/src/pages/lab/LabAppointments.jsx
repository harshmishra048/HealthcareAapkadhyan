/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  IndianRupee,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";
import API from "../../api/axios";

const statusOptions = ["all", "pending", "confirmed", "in_progress", "completed", "cancelled"];

const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

const LabAppointments = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/labs/appointments/my-lab", {
        params: { status, search },
      });
      setItems(response.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const transition = async (id, next) => {
    const note =
      next === "cancelled"
        ? window.prompt("Cancellation reason (optional):") || "Cancelled by lab"
        : "";

    try {
      setAction(id);
      await API.patch(`/labs/appointments/${id}/status`, { status: next, note });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment");
    } finally {
      setAction(null);
    }
  };

  const counts = useMemo(
    () =>
      statusOptions.slice(1).reduce(
        (summary, currentStatus) => ({
          ...summary,
          [currentStatus]: items.filter((item) => item.status === currentStatus).length,
        }),
        {},
      ),
    [items],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 font-bold text-slate-600 shadow">
          <Loader2 className="animate-spin text-cyan-600" />
          Loading appointments...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] bg-gradient-to-r from-cyan-600 to-emerald-500 p-6 text-white shadow-xl shadow-cyan-100">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
          <CalendarDays size={18} />
          Lab Operations
        </div>
        <h1 className="mt-3 text-3xl font-black">Appointment Management</h1>
        <p className="mt-2 text-sm text-cyan-50">
          Review bookings, contact patients, and move every test through a controlled lifecycle.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-5">
        {statusOptions.slice(1).map((itemStatus) => (
          <button
            key={itemStatus}
            type="button"
            onClick={() => setStatus(itemStatus)}
            className={`rounded-2xl border p-3 text-left ${
              status === itemStatus ? "border-cyan-300 bg-cyan-50" : "border-white/70 bg-white/90"
            }`}
          >
            <p className="text-xs font-bold uppercase text-slate-500">
              {itemStatus.replace("_", " ")}
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {counts[itemStatus] || 0}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/70 bg-white/90 p-4 shadow-sm md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
          <Search size={18} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && load()}
            placeholder="Search patient, phone, email, package or booking ID"
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/80 p-8 text-center text-slate-500">
            No appointments found.
          </div>
        ) : (
          items.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              action={action}
              onTransition={transition}
            />
          ))
        )}
      </div>
    </div>
  );
};

const AppointmentCard = ({ appointment, action, onTransition }) => {
  const patient = appointment.patient || {};
  const phone = patient.phone || "";
  const email = patient.email || "";
  const whatsappPhone = normalizePhone(phone);
  const whatsappText = encodeURIComponent(
    `Hello ${patient.fullName || "Patient"}, this is regarding your lab appointment ${appointment.appointmentCode || appointment._id} for ${appointment.packageName}.`,
  );

  return (
    <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-slate-900">
              {patient.fullName || "Patient"}
            </h3>
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase text-cyan-700">
              {appointment.status.replace("_", " ")}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {appointment.packageName} • Rs. {appointment.package?.price ?? appointment.totalAmount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Booking: {appointment.appointmentCode || appointment._id}
          </p>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <CalendarDays size={15} className="mr-1 inline text-cyan-600" />
              {new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })}
            </p>
            <p>{appointment.preferredTime} • {appointment.sampleType}</p>
            <p className="font-semibold text-emerald-700">
              <IndianRupee size={15} className="mr-1 inline" />
              {appointment.totalAmount}
            </p>
            <p>{appointment.notes || "No notes"}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-black text-slate-900">
            <UserRound size={16} className="mr-1 inline text-cyan-700" />
            Patient Contact
          </p>
          <p className="mt-2 text-sm font-bold text-slate-700">
            {patient.fullName || "Patient"}
          </p>
          {phone && (
            <p className="mt-2 text-sm font-semibold text-slate-600">
              <Phone size={14} className="mr-1 inline text-cyan-700" />
              {phone}
            </p>
          )}
          {email && (
            <p className="mt-1 truncate text-sm font-semibold text-slate-600">
              <Mail size={14} className="mr-1 inline text-cyan-700" />
              {email}
            </p>
          )}
          {!phone && !email && (
            <p className="mt-2 text-sm font-semibold text-slate-500">
              No patient contact shared.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 xl:min-w-40">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-700 transition hover:bg-cyan-100"
            >
              <Phone size={16} />
              Call Patient
            </a>
          )}
          {whatsappPhone && (
            <a
              href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(`Lab appointment ${appointment.appointmentCode || appointment._id}`)}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-100"
            >
              <Mail size={16} />
              Email
            </a>
          )}

          {appointment.status === "pending" && (
            <button disabled={action === appointment._id} onClick={() => onTransition(appointment._id, "confirmed")} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white disabled:opacity-60">
              Confirm
            </button>
          )}
          {appointment.status === "confirmed" && (
            <button disabled={action === appointment._id} onClick={() => onTransition(appointment._id, "in_progress")} className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-black text-white disabled:opacity-60">
              Start test
            </button>
          )}
          {appointment.status === "in_progress" && (
            <button disabled={action === appointment._id} onClick={() => onTransition(appointment._id, "completed")} className="rounded-xl bg-cyan-600 px-3 py-2 text-xs font-black text-white disabled:opacity-60">
              Complete
            </button>
          )}
          {["pending", "confirmed", "in_progress"].includes(appointment.status) && (
            <button disabled={action === appointment._id} onClick={() => onTransition(appointment._id, "cancelled")} className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 disabled:opacity-60">
              <XCircle size={14} />
              Cancel
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default LabAppointments;