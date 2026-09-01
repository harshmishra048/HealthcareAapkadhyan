import { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock3,
  BadgeCheck,
} from "lucide-react";
import API from "../../api/axios";

const initialForm = {
  labName: "",
  labType: "Diagnostic Lab",
  ownerName: "",
  registrationNumber: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  latitude: "",
  longitude: "",
  openingTime: "09:00",
  closingTime: "18:00",
  homeSampleCollection: true,
};

const LabProfile = () => {
  const [formData, setFormData] = useState(initialForm);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/labs/profile/me");
      const profile = res.data.labProfile;
      setProfileExists(true);
      setFormData({
        labName: profile.labName || "",
        labType: profile.labType || "Diagnostic Lab",
        ownerName: profile.ownerName || "",
        registrationNumber: profile.registrationNumber || "",
        phone: profile.phone || "",
        email: profile.email || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
        latitude: profile.latitude ?? "",
        longitude: profile.longitude ?? "",
        openingTime: profile.openingTime || "09:00",
        closingTime: profile.closingTime || "18:00",
        homeSampleCollection: Boolean(profile.homeSampleCollection),
      });
    } catch (err) {
      setProfileExists(false);
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Failed to load lab profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.labName.trim()) return "Lab name is required.";
    if (!formData.phone.trim()) return "Phone number is required.";
    if (!formData.address.trim()) return "Address is required.";
    if (!formData.city.trim()) return "City is required.";
    if (!formData.state.trim()) return "State is required.";
    if (!formData.pincode.trim()) return "Pincode is required.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        latitude: formData.latitude === "" ? null : Number(formData.latitude),
        longitude:
          formData.longitude === "" ? null : Number(formData.longitude),
      };

      const response = profileExists
        ? await API.patch("/labs/profile", payload)
        : await API.post("/labs/profile", payload);

      setProfileExists(true);
      setSuccess(response.data.message || "Lab profile saved successfully");
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save lab profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-600 shadow">
          <Loader2 className="animate-spin text-cyan-600" />
          Loading lab profile...
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
              <BadgeCheck size={18} />
              Lab Vendor Profile
            </div>
            <h1 className="text-3xl font-black">Diagnostic Center Setup</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50">
              Create your lab profile, set your operational timings, and make
              your diagnostic services visible to users.
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

      <form
        onSubmit={handleSubmit}
        className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur-xl"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Lab name
            </label>
            <input
              name="labName"
              value={formData.labName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="CityCare Diagnostics"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Lab type
            </label>
            <select
              name="labType"
              value={formData.labType}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
            >
              <option>Diagnostic Lab</option>
              <option>Pathology Lab</option>
              <option>Imaging Center</option>
              <option>Wellness Center</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Owner name
            </label>
            <input
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="Owner or manager name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Registration number
            </label>
            <input
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="MCD-12345"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="care@lab.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="Street, area, locality"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              City
            </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="Bengaluru"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              State
            </label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="Karnataka"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Pincode
            </label>
            <input
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="560001"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Latitude
            </label>
            <input
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="12.9716"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Longitude
            </label>
            <input
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="77.5946"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Opening time
            </label>
            <input
              name="openingTime"
              type="time"
              value={formData.openingTime}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Closing time
            </label>
            <input
              name="closingTime"
              type="time"
              value={formData.closingTime}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                name="homeSampleCollection"
                checked={formData.homeSampleCollection}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Home sample collection available
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
            {saving
              ? "Saving..."
              : profileExists
                ? "Update Lab Profile"
                : "Create Lab Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabProfile;
