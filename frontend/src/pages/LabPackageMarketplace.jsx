/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FlaskConical,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const categories = ["all", "Basic", "Routine", "Premium", "Advanced", "Custom"];
const sortOptions = [
  { label: "Popular first", value: "popular" },
  { label: "Price low to high", value: "price-asc" },
  { label: "Price high to low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

const defaultBookingForm = {
  appointmentDate: "",
  preferredTime: "09:00 AM",
  sampleType: "Home Collection",
  notes: "",
};

const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

const LabPackageMarketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingPackage, setBookingPackage] = useState(null);
  const [bookingForm, setBookingForm] = useState(defaultBookingForm);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    city: "",
    sample: "all",
    popularOnly: false,
    sort: "popular",
  });

  const enrichPackagesWithLabDetails = async (items) => {
    const labIds = Array.from(
      new Set(items.map((item) => item.labProfile?._id || item.labProfile).filter(Boolean)),
    );

    const labEntries = await Promise.all(
      labIds.map(async (labId) => {
        try {
          const response = await API.get(`/labs/${labId}`);
          return [labId, response.data.lab || response.data.labProfile || null];
        } catch {
          return [labId, null];
        }
      }),
    );

    const labMap = Object.fromEntries(labEntries.filter(([, lab]) => lab));

    return items.map((item) => {
      const labId = item.labProfile?._id || item.labProfile;
      return {
        ...item,
        labProfile: {
          ...(typeof item.labProfile === "object" ? item.labProfile : {}),
          ...(labMap[labId] || {}),
        },
      };
    });
  };

  const fetchPackagesFromPublicEndpoint = async () => {
    const response = await API.get("/labs/packages/public", {
      params: {
        search: filters.search.trim(),
        category: filters.category,
      },
    });

    return response.data.packages || [];
  };

  const fetchPackagesFromLegacyEndpoints = async () => {
    const labsResponse = await API.get("/labs/all");
    const labs = labsResponse.data.labs || [];

    const packageGroups = await Promise.all(
      labs.map(async (lab) => {
        try {
          const response = await API.get(`/labs/packages/profile/${lab._id}`);
          return (response.data.packages || []).map((item) => ({
            ...item,
            labProfile: item.labProfile || lab,
          }));
        } catch {
          return [];
        }
      }),
    );

    return packageGroups.flat();
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError("");

      let loadedPackages = [];

      try {
        loadedPackages = await fetchPackagesFromPublicEndpoint();
      } catch (err) {
        if (err.response?.status !== 404) throw err;
        loadedPackages = await fetchPackagesFromLegacyEndpoints();
      }

      const enrichedPackages = await enrichPackagesWithLabDetails(loadedPackages);
      setPackages(enrichedPackages);
    } catch (err) {
      setPackages([]);
      setError(err.response?.data?.message || "Failed to load lab packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [filters.category]);

  const cityOptions = useMemo(() => {
    const cities = packages
      .map((item) => item.labProfile?.city)
      .filter(Boolean)
      .map((city) => city.trim());

    return Array.from(new Set(cities)).sort((a, b) => a.localeCompare(b));
  }, [packages]);

  const visiblePackages = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    const filtered = packages.filter((item) => {
      const lab = item.labProfile || {};
      const haystack = [
        item.packageName,
        item.category,
        item.description,
        item.sampleType,
        item.turnaroundTime,
        lab.labName,
        lab.ownerName,
        lab.phone,
        lab.email,
        lab.address,
        lab.city,
        lab.state,
        ...(item.testsIncluded || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !term || haystack.includes(term);
      const matchesCity = !filters.city || lab.city === filters.city;
      const matchesSample =
        filters.sample === "all" ||
        String(item.sampleType || "").toLowerCase().includes(filters.sample);
      const matchesPopular = !filters.popularOnly || item.isPopular;

      return matchesSearch && matchesCity && matchesSample && matchesPopular;
    });

    return filtered.sort((a, b) => {
      if (filters.sort === "price-asc") return Number(a.price || 0) - Number(b.price || 0);
      if (filters.sort === "price-desc") return Number(b.price || 0) - Number(a.price || 0);
      if (filters.sort === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return Number(Boolean(b.isPopular)) - Number(Boolean(a.isPopular));
    });
  }, [filters, packages]);

  const stats = useMemo(
    () => ({
      packages: packages.length,
      labs: new Set(packages.map((item) => item.labProfile?._id).filter(Boolean)).size,
      popular: packages.filter((item) => item.isPopular).length,
    }),
    [packages],
  );

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const openBooking = (item) => {
    setError("");
    setSuccess("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "patient") {
      setError("Only patient accounts can book diagnostic appointments.");
      return;
    }

    setBookingPackage(item);
    setBookingForm({
      ...defaultBookingForm,
      sampleType: item.labProfile?.homeSampleCollection ? "Home Collection" : "Lab Visit",
    });
  };

  const bookPackage = async (event) => {
    event.preventDefault();

    if (!bookingPackage || !bookingForm.appointmentDate) {
      setError("Please select an appointment date.");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");

      await API.post("/labs/appointments", {
        labId: bookingPackage.labProfile?._id,
        packageId: bookingPackage._id,
        ...bookingForm,
      });

      setBookingPackage(null);
      setSuccess("Diagnostic appointment booked successfully.");
      navigate("/patient-dashboard/lab-appointments");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24">
      <section className="border-b border-cyan-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-black text-cyan-700">
              <FlaskConical size={18} />
              Verified diagnostic marketplace
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              Find lab packages uploaded by trusted lab vendors.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Compare prices, included tests, sample types, turnaround time and verified lab contact details before booking.
            </p>
          </div>

          <div className="grid content-end gap-3 sm:grid-cols-3">
            <StatCard label="Packages" value={stats.packages} />
            <StatCard label="Verified Labs" value={stats.labs} />
            <StatCard label="Popular" value={stats.popular} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {(error || success) && (
          <div className={`rounded-2xl border p-4 text-sm font-bold ${error ? "border-red-200 bg-red-50 text-red-600" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {error || success}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.8fr]">
            <div className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
              <Search size={18} className="text-slate-400" />
              <input
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && fetchPackages()}
                placeholder="Search package, test, lab, phone or city"
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <FilterSelect label="Category" value={filters.category} onChange={(value) => updateFilter("category", value)} options={categories.map((item) => ({ label: item === "all" ? "All categories" : item, value: item }))} />
            <FilterSelect label="City" value={filters.city} onChange={(value) => updateFilter("city", value)} options={[{ label: "All cities", value: "" }, ...cityOptions.map((city) => ({ label: city, value: city }))]} />
            <FilterSelect
              label="Sample"
              value={filters.sample}
              onChange={(value) => updateFilter("sample", value)}
              options={[
                { label: "Any sample", value: "all" },
                { label: "Blood", value: "blood" },
                { label: "Urine", value: "urine" },
                { label: "Home collection", value: "home" },
              ]}
            />
            <FilterSelect label="Sort" value={filters.sort} onChange={(value) => updateFilter("sort", value)} options={sortOptions} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <label className="inline-flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
              <input type="checkbox" checked={filters.popularOnly} onChange={(event) => updateFilter("popularOnly", event.target.checked)} className="h-4 w-4 accent-cyan-600" />
              Popular packages only
            </label>

            <button type="button" onClick={fetchPackages} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
              <SlidersHorizontal size={17} />
              Apply filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[35vh] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm font-black text-slate-600">
              <Loader2 className="animate-spin text-cyan-600" />
              Loading verified lab packages...
            </div>
          </div>
        ) : visiblePackages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <FlaskConical className="mx-auto text-cyan-600" size={34} />
            <h2 className="mt-4 text-xl font-black text-slate-900">No packages found</h2>
            <p className="mt-2 text-sm text-slate-500">If vendors already uploaded packages, approve the lab owner, verify the lab profile, and keep the package active.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visiblePackages.map((item) => (
              <PackageCard key={item._id} item={item} onBook={() => openBooking(item)} />
            ))}
          </div>
        )}
      </section>

      {bookingPackage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={bookPackage} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-cyan-600">Book diagnostic package</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">{bookingPackage.packageName}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{bookingPackage.labProfile?.labName}</p>
              </div>
              <button type="button" onClick={() => setBookingPackage(null)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormField label="Appointment date">
                <input required type="date" min={new Date().toISOString().slice(0, 10)} value={bookingForm.appointmentDate} onChange={(event) => setBookingForm((current) => ({ ...current, appointmentDate: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white" />
              </FormField>
              <FormField label="Preferred time">
                <input value={bookingForm.preferredTime} onChange={(event) => setBookingForm((current) => ({ ...current, preferredTime: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white" placeholder="09:00 AM" />
              </FormField>
              <FormField label="Sample option">
                <select value={bookingForm.sampleType} onChange={(event) => setBookingForm((current) => ({ ...current, sampleType: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white">
                  <option>Home Collection</option>
                  <option>Lab Visit</option>
                  <option>Walk-in</option>
                </select>
              </FormField>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-black uppercase text-emerald-700">Amount</p>
                <p className="mt-1 text-2xl font-black text-emerald-800">Rs. {Number(bookingPackage.price || 0).toLocaleString("en-IN")}</p>
              </div>
              <FormField label="Notes" className="sm:col-span-2">
                <textarea rows="3" value={bookingForm.notes} onChange={(event) => setBookingForm((current) => ({ ...current, notes: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white resize-none" placeholder="Any instructions for sample collection" />
              </FormField>
            </div>

            <button type="submit" disabled={bookingLoading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-cyan-100 transition hover:bg-cyan-700 disabled:opacity-60">
              {bookingLoading ? <Loader2 className="animate-spin" size={18} /> : <CalendarDays size={18} />}
              {bookingLoading ? "Booking..." : "Confirm booking"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <p className="text-xs font-black uppercase text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <label className="block">
    <span className="sr-only">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white">
      {options.map((option) => (
        <option key={`${label}-${option.value}`} value={option.value}>{option.label}</option>
      ))}
    </select>
  </label>
);

const PackageCard = ({ item, onBook }) => {
  const lab = item.labProfile || {};
  const phone = lab.phone || lab.owner?.phone || "";
  const email = lab.email || lab.owner?.email || "";
  const whatsappPhone = normalizePhone(phone);
  const whatsappText = encodeURIComponent(`Hello ${lab.labName || "Medample Lab"}, I want information about ${item.packageName}.`);

  return (
    <article className="flex min-h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black text-slate-950">{item.packageName}</h2>
            {item.isPopular && <Star className="fill-amber-400 text-amber-400" size={17} />}
          </div>
          <p className="mt-1 text-xs font-black uppercase text-cyan-600">{item.category}</p>
        </div>
        <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
          <IndianRupee size={14} />
          {Number(item.price || 0).toLocaleString("en-IN")}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
        <div className="flex items-start gap-2">
          <BadgeCheck className="mt-0.5 text-cyan-700" size={18} />
          <div className="min-w-0">
            <p className="font-black text-slate-900">{lab.labName || "Verified lab"}</p>
            {lab.ownerName && <p className="mt-1 text-xs font-bold text-slate-500">Vendor: {lab.ownerName}</p>}
            <p className="mt-1 text-sm font-semibold text-slate-500"><MapPin size={14} className="mr-1 inline" />{[lab.address, lab.city, lab.state, lab.pincode].filter(Boolean).join(", ") || "Location available after booking"}</p>
            {phone && <p className="mt-2 text-sm font-bold text-slate-700"><Phone size={14} className="mr-1 inline text-cyan-700" />{phone}</p>}
            {email && <p className="mt-1 truncate text-sm font-semibold text-slate-500"><Mail size={14} className="mr-1 inline text-cyan-700" />{email}</p>}
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{item.description || "Diagnostic package from a verified Medample lab partner."}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(item.testsIncluded || []).slice(0, 6).map((test, index) => (
          <span key={`${item._id}-${test}-${index}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{test}</span>
        ))}
      </div>

      <div className="mt-5 grid gap-2 text-sm font-semibold text-slate-500">
        <p><Clock3 size={15} className="mr-1 inline text-cyan-600" />{item.turnaroundTime || "24-48 hours"}</p>
        <p><CheckCircle2 size={15} className="mr-1 inline text-emerald-600" />{item.sampleType || "Blood / Urine / Sample"}</p>
      </div>

      <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
        {phone && <a href={`tel:${phone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-700 transition hover:bg-cyan-100"><Phone size={16} />Call</a>}
        {whatsappPhone && <a href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"><MessageCircle size={16} />WhatsApp</a>}
        <button type="button" onClick={onBook} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-3 py-2 text-sm font-black text-white shadow-lg shadow-cyan-100 transition hover:bg-cyan-700 sm:col-span-2">
          <CalendarDays size={17} />Book package
        </button>
      </div>
    </article>
  );
};

const FormField = ({ label, children, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="mb-2 block text-sm font-black text-slate-700">{label}</span>
    {children}
  </label>
);

export default LabPackageMarketplace;