import { useEffect, useState } from "react";
import { CalendarDays, Loader2, CheckCircle2, Clock3 } from "lucide-react";
import API from "../../api/axios";

const LabAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/labs/appointments/my-lab");
      setAppointments(res.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/labs/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-600 shadow">
          <Loader2 className="animate-spin text-cyan-600" />
          Loading appointments...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-r from-cyan-600 to-emerald-500 p-6 text-white shadow-xl shadow-cyan-100">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} />
          <div>
            <h1 className="text-3xl font-black">Appointment Management</h1>
            <p className="mt-1 text-sm text-cyan-50">
              Review and update patient diagnostic bookings.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/80 p-8 text-center text-slate-500">
            No appointments yet.
          </div>
        ) : (
          appointments.map((item) => (
            <div
              key={item._id}
              className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {item.patient?.fullName || "Patient"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.packageName} • {item.sampleType}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(item.appointmentDate).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase text-cyan-700">
                    {item.status}
                  </span>
                  <button
                    onClick={() => updateStatus(item._id, "confirmed")}
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(item._id, "in_progress")}
                    className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-black text-white"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus(item._id, "completed")}
                    className="rounded-xl bg-cyan-600 px-3 py-2 text-xs font-black text-white"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LabAppointments;
