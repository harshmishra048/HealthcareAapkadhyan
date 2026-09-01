import { useEffect, useState } from "react";
import {
  FlaskConical,
  Loader2,
  Calendar,
  MapPin,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
import API from "../../api/axios";

const defaultForm = {
  labId: "",
  packageId: "",
  appointmentDate: "",
  preferredTime: "09:00 AM",
  sampleType: "Home Collection",
  notes: "",
};

const PatientLabServices = () => {
  const [labs, setLabs] = useState([]);
  const [selectedLabId, setSelectedLabId] = useState("");
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/labs/all");
      setLabs(res.data.labs || []);
      if (res.data.labs?.[0]) {
        setSelectedLabId(res.data.labs[0]._id);
        setFormData((prev) => ({ ...prev, labId: res.data.labs[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load diagnostic labs");
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async (labId) => {
    if (!labId) {
      setPackages([]);
      return;
    }

    try {
      const res = await API.get(`/labs/packages/profile/${labId}`);
      setPackages(res.data.packages || []);
      if (res.data.packages?.[0]) {
        setFormData((prev) => ({
          ...prev,
          packageId: res.data.packages[0]._id,
          labId,
        }));
      } else {
        setFormData((prev) => ({ ...prev, packageId: "", labId }));
      }
    } catch (err) {
      setPackages([]);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  useEffect(() => {
    fetchPackages(selectedLabId);
  }, [selectedLabId]);

  const handleBook = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!formData.labId || !formData.packageId || !formData.appointmentDate) {
      setError("Please select lab, package, and date.");
      return;
    }

    try {
      setBooking(true);
      await API.post("/labs/appointments", formData);
      setSuccess("Appointment booked successfully.");
      setFormData({
        ...defaultForm,
        labId: selectedLabId,
        packageId: packages[0]?._id || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-600 shadow">
          <Loader2 className="animate-spin text-cyan-600" />
          Loading diagnostic services...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-r from-cyan-600 to-emerald-500 p-6 text-white shadow-xl shadow-cyan-100">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
              <FlaskConical size={18} />
              Lab & Diagnostics
            </div>
            <h1 className="text-3xl font-black">Book Health Tests</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50">
              Explore trusted lab partners, compare health packages, and
              schedule diagnostic tests with home sample collection.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {labs.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/80 p-8 text-center text-slate-500">
              No diagnostic labs available right now.
            </div>
          ) : (
            labs.map((lab) => (
              <button
                key={lab._id}
                type="button"
                onClick={() => setSelectedLabId(lab._id)}
                className={`w-full rounded-[1.5rem] border p-5 text-left shadow-sm transition ${selectedLabId === lab._id ? "border-cyan-200 bg-cyan-50" : "border-white/70 bg-white/90"}`}
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {lab.labName}
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} /> {lab.city}, {lab.state}
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-700">
                    {lab.labType}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <form
          onSubmit={handleBook}
          className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-sm"
        >
          <h3 className="mb-6 text-xl font-black text-slate-900">
            Book appointment
          </h3>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Select package
              </label>
              <select
                value={formData.packageId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    packageId: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              >
                <option value="">Choose a package</option>
                {packages.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.packageName} • ₹{item.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Appointment date
              </label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    appointmentDate: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Preferred time
              </label>
              <input
                value={formData.preferredTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preferredTime: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="09:00 AM"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Sample type
              </label>
              <select
                value={formData.sampleType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sampleType: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              >
                <option>Home Collection</option>
                <option>Lab Visit</option>
                <option>Walk-in</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows="3"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="Any instructions or concerns"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={booking}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-cyan-200 transition hover:bg-cyan-700 disabled:opacity-60"
          >
            {booking ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Calendar size={18} />
            )}
            {booking ? "Booking..." : "Book Diagnostic Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientLabServices;
