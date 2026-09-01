import { useEffect, useState } from "react";
import {
  Plus,
  Loader2,
  Trash2,
  Save,
  BadgeCheck,
  IndianRupee,
} from "lucide-react";
import API from "../../api/axios";

const initialForm = {
  packageName: "",
  category: "Routine",
  description: "",
  testsIncluded: "",
  price: "",
  turnaroundTime: "24-48 hours",
  sampleType: "Blood / Urine / Sample",
  isPopular: false,
};

const LabPackages = () => {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await API.get("/labs/packages/my");
      setPackages(res.data.packages || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.packageName.trim() || !formData.price) {
      setError("Package name and price are required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        testsIncluded: formData.testsIncluded
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        price: Number(formData.price),
      };

      await API.post("/labs/packages", payload);
      setSuccess("Package saved successfully.");
      setFormData(initialForm);
      fetchPackages();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save package");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    try {
      await API.patch(`/labs/packages/${id}`, { isActive: false });
      setSuccess("Package removed.");
      fetchPackages();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete package");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-600 shadow">
          <Loader2 className="animate-spin text-cyan-600" />
          Loading lab packages...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-r from-cyan-600 to-emerald-500 p-6 text-white shadow-xl shadow-cyan-100">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
              <BadgeCheck size={18} />
              Test Packages
            </div>
            <h1 className="text-3xl font-black">Package Catalog</h1>
            <p className="mt-2 text-sm text-cyan-50">
              Bundle tests into reusable health packages for patients.
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
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <Plus className="text-cyan-600" />
            <h3 className="text-xl font-bold text-slate-900">Create package</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Package name
              </label>
              <input
                name="packageName"
                value={formData.packageName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="Full Body Checkup"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              >
                <option>Basic</option>
                <option>Premium</option>
                <option>Routine</option>
                <option>Advanced</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Price
              </label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="1499"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Turnaround time
              </label>
              <input
                name="turnaroundTime"
                value={formData.turnaroundTime}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="24-48 hours"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Sample type
              </label>
              <input
                name="sampleType"
                value={formData.sampleType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="Blood / Urine / Sample"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Tests included
              </label>
              <input
                name="testsIncluded"
                value={formData.testsIncluded}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="CBC, LFT, KFT, Thyroid"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="Includes..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                Mark as popular package
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-cyan-200 transition hover:bg-cyan-700 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Package"}
            </button>
          </div>
        </form>

        <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-sm">
          <h3 className="mb-5 text-xl font-bold text-slate-900">
            Current packages
          </h3>

          <div className="space-y-4">
            {packages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                No packages created yet.
              </div>
            ) : (
              packages.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900">
                          {item.packageName}
                        </h4>
                        {item.isPopular && (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black uppercase text-amber-700">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.category} • {item.turnaroundTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700">
                        <IndianRupee size={12} />
                        {item.price}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {item.description || "No description added."}
                  </p>
                  {item.testsIncluded?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.testsIncluded.map((test, idx) => (
                        <span
                          key={`${test}-${idx}`}
                          className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700"
                        >
                          {test}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPackages;
