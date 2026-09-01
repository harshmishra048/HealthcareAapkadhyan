/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  FlaskConical,
  IndianRupee,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  XCircle,
} from "lucide-react";
import API from "../../api/axios";

const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

const PatientLabAppointments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/labs/appointments/my");
      setItems(response.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this diagnostic appointment?")) return;

    try {
      await API.patch(`/labs/appointments/${id}/cancel`, {});
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel appointment");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] bg-gradient-to-r from-cyan-600 to-emerald-500 p-6 text-white shadow-xl shadow-cyan-100">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
          <FlaskConical size={18} />
          My Diagnostics
        </div>
        <h1 className="mt-3 text-3xl font-black">Lab Appointments</h1>
        <p className="mt-2 text-sm text-cyan-50">
          Track every diagnostic booking and contact the lab when needed.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/80 p-10 text-center text-slate-500">
          You have no diagnostic appointments yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onCancel={() => cancel(appointment._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AppointmentCard = ({ appointment, onCancel }) => {
  const lab = appointment.labProfile || {};
  const phone = lab.phone || "";
  const whatsappPhone = normalizePhone(phone);
  const whatsappText = encodeURIComponent(
    `Hello ${lab.labName || "Lab"}, I want information about my appointment ${appointment.appointmentCode || appointment._id} for ${appointment.packageName}.`,
  );
  const address = [lab.address, lab.city, lab.state, lab.pincode]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">
              {appointment.packageName}
            </h2>
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase text-cyan-700">
              {appointment.status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <CalendarDays size={15} className="mr-1 inline text-cyan-600" />
              {new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })}
            </p>
            <p>
              <Clock3 size={15} className="mr-1 inline text-cyan-600" />
              {appointment.preferredTime}
            </p>
            <p>{appointment.sampleType}</p>
            <p className="font-bold text-emerald-700">
              <IndianRupee size={15} className="mr-1 inline" />
              {appointment.totalAmount}
            </p>
          </div>

          <p className="mt-2 text-xs font-semibold text-slate-400">
            Booking ID: {appointment.appointmentCode || appointment._id}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="font-black text-slate-900">{lab.labName || "Lab"}</p>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            <MapPin size={14} className="mr-1 inline text-cyan-700" />
            {address || "Lab address unavailable"}
          </p>
          {phone && (
            <p className="mt-2 text-sm font-bold text-slate-700">
              <Phone size={14} className="mr-1 inline text-cyan-700" />
              {phone}
            </p>
          )}
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Timings: {lab.openingTime || "09:00"} - {lab.closingTime || "18:00"}
          </p>
        </div>

        <div className="flex flex-col gap-2 xl:min-w-36">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-700 transition hover:bg-cyan-100"
            >
              <Phone size={16} />
              Call Lab
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
          {["pending", "confirmed"].includes(appointment.status) && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-black text-red-600 transition hover:bg-red-100"
            >
              <XCircle size={16} />
              Cancel
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PatientLabAppointments;