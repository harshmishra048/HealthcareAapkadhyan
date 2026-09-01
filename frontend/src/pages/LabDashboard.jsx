/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, CalendarDays, Package, IndianRupee, Loader2, ArrowRight, CheckCircle2, Clock3, RefreshCw } from "lucide-react";
import API from "../api/axios";

const LabDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ stats: {}, labProfile: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try { setLoading(true); setError(""); const res = await API.get("/labs/dashboard/stats"); setData({ stats: res.data.stats || {}, labProfile: res.data.labProfile || null }); }
    catch (err) { setError(err.response?.data?.message || "Failed to load lab dashboard"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 font-bold text-slate-600 shadow"><Loader2 className="animate-spin text-cyan-600" />Loading diagnostic dashboard...</div></div>;

  const s = data.stats;
  const cards = [
    ["Active Packages", s.activePackages || 0, Package, "published offerings"],
    ["Appointments", s.totalAppointments || 0, CalendarDays, "all active bookings"],
    ["Pending", s.pending || 0, Clock3, "need confirmation"],
    ["Monthly Revenue", `₹${Number(s.monthlyRevenue || 0).toLocaleString("en-IN")}`, IndianRupee, "confirmed lifecycle"],
  ];

  return <div className="space-y-8">
    <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-cyan-600 to-emerald-500 p-6 text-white shadow-xl shadow-cyan-100">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur"><FlaskConical size={18}/>Lab Vendor Console</div><h1 className="text-3xl font-black">{data.labProfile?.labName || "Diagnostic Center"}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50">Run your diagnostic business from one place — profile, packages, bookings, status updates and operational visibility.</p></div>
        <div className="rounded-3xl bg-white/15 p-5 backdrop-blur"><p className="text-xs font-bold uppercase tracking-wider text-cyan-50">Verification</p><p className="mt-1 text-xl font-black">{data.labProfile?.isVerifiedByAdmin ? "Verified & Live" : "Pending Verification"}</p><p className="mt-1 text-xs text-cyan-50">{data.labProfile?.isActive ? "Listing is active" : "Listing is blocked"}</p></div>
      </div>
    </section>
    {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{cards.map(([title,value,Icon,suffix]) => <div key={title} className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-sm"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600"><Icon size={22}/></div><p className="text-sm font-semibold text-slate-500">{title}</p><p className="mt-2 text-3xl font-black text-slate-900">{value}</p><p className="mt-1 text-sm text-slate-500">{suffix}</p></div>)}</section>
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-xl font-black text-slate-900">Operations</h3><p className="text-sm text-slate-500">Jump directly into your daily workflow.</p></div><RefreshCw className="text-cyan-600" size={20}/></div><div className="space-y-3"><Action title="Manage packages" text="Create, edit, publish and archive test packages." onClick={() => navigate("/lab-dashboard/packages")}/><Action title="Manage appointments" text="Confirm bookings and move tests through their lifecycle." onClick={() => navigate("/lab-dashboard/appointments")}/><Action title="Update lab profile" text="Keep contact, timings and collection options current." onClick={() => navigate("/lab-dashboard/profile")}/></div></div>
      <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><CheckCircle2 className="text-emerald-600"/><h3 className="text-xl font-black text-slate-900">Appointment pipeline</h3></div><div className="space-y-3">{[["Pending",s.pending,"bg-amber-50 text-amber-700"],["Confirmed",s.confirmed,"bg-emerald-50 text-emerald-700"],["In progress",s.inProgress,"bg-cyan-50 text-cyan-700"],["Completed",s.completed,"bg-violet-50 text-violet-700"],["Cancelled",s.cancelled,"bg-red-50 text-red-700"]].map(([label,value,cls]) => <div key={label} className={`flex items-center justify-between rounded-2xl p-3 ${cls}`}><span className="font-bold">{label}</span><span className="font-black">{value || 0}</span></div>)}</div></div>
    </section>
  </div>;
};
const Action = ({ title, text, onClick }) => <button type="button" onClick={onClick} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50"><div><p className="font-black text-slate-900">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div><ArrowRight className="text-cyan-600" size={19}/></button>;
export default LabDashboard;
