import { useEffect, useState } from "react";
import {
  FlaskConical,
  CalendarDays,
  Stethoscope,
  Package,
  IndianRupee,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import API from "../api/axios";

const LabDashboard = () => {
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalAppointments: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    monthlyRevenue: 0,
  });
  const [labProfile, setLabProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/labs/dashboard/stats");
      setStats(res.data.stats || {});
      setLabProfile(res.data.labProfile || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load lab dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cards = [
    {
      title: "Packages",
      value: stats.totalPackages,
      icon: Package,
      suffix: "tests",
    },
    {
      title: "Appointments",
      value: stats.totalAppointments,
      icon: CalendarDays,
      suffix: "booked",
    },
    { title: "Pending", value: stats.pending, icon: Clock3, suffix: "waiting" },
    {
      title: "Revenue",
      value: `₹${stats.monthlyRevenue || 0}`,
      icon: IndianRupee,
      suffix: "this month",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-600 shadow">
          <Loader2 className="animate-spin text-cyan-600" />
          Loading diagnostic dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-r from-cyan-600 to-emerald-500 p-6 text-white shadow-xl shadow-cyan-100">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
              <FlaskConical size={18} />
              Lab Vendor Dashboard
            </div>
            <h1 className="text-3xl font-black">
              {labProfile?.labName || "Diagnostics Center"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50">
              Manage test packages, patient bookings, appointment follow-ups,
              and operational performance from one place.
            </p>
          </div>

          <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-cyan-50">
              Completed Tests
            </p>
            <p className="mt-1 text-3xl font-black">{stats.completed}</p>
            <p className="mt-1 text-xs text-cyan-50">Lifecycle completion</p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, suffix }) => (
          <div
            key={title}
            className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <Icon size={22} />
            </div>
            <h3 className="text-sm font-semibold text-slate-500">{title}</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{suffix}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Stethoscope className="text-cyan-600" />
            <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
          </div>

          <div className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50">
              <div>
                <p className="font-bold text-slate-900">Create Test Package</p>
                <p className="text-sm text-slate-500">
                  Add new lab pricing and package offerings
                </p>
              </div>
              <ArrowRight className="text-cyan-600" />
            </button>

            <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50">
              <div>
                <p className="font-bold text-slate-900">View Appointments</p>
                <p className="text-sm text-slate-500">
                  Track patient bookings and sample pickups
                </p>
              </div>
              <ArrowRight className="text-cyan-600" />
            </button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-900">Status Summary</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-3">
              <span className="font-semibold text-emerald-700">Confirmed</span>
              <span className="font-black text-emerald-700">
                {stats.confirmed}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-3">
              <span className="font-semibold text-amber-700">Pending</span>
              <span className="font-black text-amber-700">{stats.pending}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-cyan-50 p-3">
              <span className="font-semibold text-cyan-700">Completed</span>
              <span className="font-black text-cyan-700">
                {stats.completed}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LabDashboard;
