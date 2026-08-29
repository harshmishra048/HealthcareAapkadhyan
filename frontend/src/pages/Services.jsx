import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  // FaBedPulse,
  FaBell,
  FaFileMedical,
  // FaHospital,
  FaPrescriptionBottleMedical,
  // FaQrcode,
  // FaTruckMedical,
  // FaUserDoctor,
  // FaUserNurse,
  // FaVideo,
  FaCapsules,
  FaHandshake,
  FaPercent,
  FaVial,
  FaMicroscope,
  FaWheelchair,
  FaMotorcycle,
  FaStore,
} from "react-icons/fa6";

const services = [
  // =========================
  // EMERGENCY & PATIENT CARE
  // =========================
  // {
  //   title: "Emergency QR Profile",
  //   description:
  //     "Critical patient details available instantly during urgent care, helping healthcare professionals respond faster.",
  //   icon: FaQrcode,
  //   color: "from-fuchsia-500 to-purple-400",
  //   path: "/emergency-sos",
  // },
  // {
  //   title: "Emergency SOS",
  //   description:
  //     "Fast emergency request flow with live location support to help connect patients with nearby emergency assistance.",
  //   icon: FaTruckMedical,
  //   color: "from-red-500 to-orange-400",
  //   path: "/emergency-sos",
  // },

  // =========================
  // DOCTORS & HOSPITALS
  // =========================
  // {
  //   title: "Doctor Appointments",
  //   description:
  //     "Discover verified doctors and book appointments conveniently for consultations and planned healthcare needs.",
  //   icon: FaUserDoctor,
  //   color: "from-blue-500 to-cyan-400",
  //   path: "/doctors",
  // },
  // {
  //   title: "Specialist Discovery",
  //   description:
  //     "Find the right medical specialist across multiple healthcare fields based on your treatment requirements.",
  //   icon: FaUserNurse,
  //   color: "from-indigo-500 to-blue-400",
  //   path: "/doctors",
  // },
  // {
  //   title: "Nearby Hospitals",
  //   description:
  //     "Discover nearby hospitals with useful location details and direction support for faster care decisions.",
  //   icon: FaHospital,
  //   color: "from-purple-500 to-pink-400",
  //   path: "/hospitals",
  // },
  // {
  //   title: "Bed & Facility Access",
  //   description:
  //     "Explore hospital profiles and available facility information to make informed healthcare decisions.",
  //   icon: FaBedPulse,
  //   color: "from-emerald-500 to-teal-400",
  //   path: "/hospitals",
  // },
  // {
  //   title: "Video Consultation",
  //   description:
  //     "Access online consultation support for convenient remote healthcare interactions with doctors.",
  //   icon: FaVideo,
  //   color: "from-cyan-500 to-sky-400",
  //   path: "/doctors",
  // },

  // =========================
  // MEDICINES & PHARMACY
  // =========================
  // =========================
  // LAB TESTS & DIAGNOSTICS
  // =========================
  {
    title: "Blood Tests Booking",
    description:
      "Book essential blood tests conveniently through trusted diagnostic partners from one healthcare platform.",
    icon: FaVial,
    color: "from-red-500 to-rose-400",
    path: "/diagnostics",
  },
  {
    title: "Lab Test Discounts",
    description:
      "Save more on selected diagnostic services with a flat 15% discount on lab tests.",
    icon: FaPercent,
    color: "from-blue-500 to-cyan-400",
    path: "/diagnostics",
  },
  {
    title: "Partner Diagnostic Labs",
    description:
      "Access trusted diagnostic laboratories for reliable testing, sample collection, and healthcare reports.",
    icon: FaMicroscope,
    color: "from-sky-500 to-blue-400",
    path: "/diagnostics",
  },
  {
    title: "Partner Pharmacy Discounts",
    description:
      "Get access to exclusive discounts and better prices through our trusted network of partner pharmacies.",
    icon: FaPercent,
    color: "from-emerald-500 to-teal-400",
    path: "/medicines",
  },
  // =========================
  // HOME MEDICAL CARE
  // =========================
  {
    title: "Home Medical Equipment",
    description:
      "Get essential home healthcare equipment such as patient beds, wheelchairs, walkers, monitors, and more.",
    icon: FaWheelchair,
    color: "from-indigo-500 to-blue-400",
    path: "/medical-equipment",
  },
  {
    title: "Doorstep Delivery",
    description:
      "Get medicines, healthcare essentials, and selected medical products delivered conveniently to your doorstep.",
    icon: FaMotorcycle,
    color: "from-orange-500 to-amber-400",
    path: "/medicines",
  },
  {
    title: "Medicine Search",
    description:
      "Search for medicines and explore availability from connected medical stores for a more convenient purchase experience.",
    icon: FaCapsules,
    color: "from-lime-500 to-emerald-400",
    path: "/medicines",
  },
  {
    title: "Prescriptions",
    description:
      "Manage digital prescriptions conveniently while keeping important medication information organized and accessible.",
    icon: FaPrescriptionBottleMedical,
    color: "from-sky-500 to-blue-400",
    path: "/medicines",
  },
  {
    title: "Partner Medical Stores",
    description:
      "Connect with trusted local medical stores for genuine medicines, healthcare products, and convenient service.",
    icon: FaStore,
    color: "from-violet-500 to-fuchsia-400",
    path: "/medicines",
  },
  // =========================
  // HEALTH RECORDS & ALERTS
  // =========================
  {
    title: "Medical Reports",
    description:
      "Keep important lab reports, scans, prescriptions, and healthcare documents organized in one secure place.",
    icon: FaFileMedical,
    color: "from-amber-500 to-yellow-400",
    path: "/login",
  },
  {
    title: "Health Alerts",
    description:
      "Stay informed with helpful reminders for medicines, follow-ups, appointments, and important care tasks.",
    icon: FaBell,
    color: "from-rose-500 to-red-400",
    path: "/register",
  },

  // =========================
  // PARTNER NETWORK
  // =========================
  {
    title: "Partner Network",
    description:
      "Join the MedAmple healthcare network with opportunities for hospitals, doctors, pharmacies, labs, and medical partners.",
    icon: FaHandshake,
    color: "from-violet-500 to-fuchsia-400",
    path: "/partners",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const card = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const Services = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <section className="relative overflow-hidden px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-100/70 via-blue-50/70 to-transparent" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="inline-flex rounded-full border border-cyan-100 bg-white/85 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm backdrop-blur-md">
              MedAmple Care Suite
            </span>

            <h1 className="mt-5 bg-gradient-to-r from-slate-950 via-blue-800 to-cyan-700 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl lg:text-6xl">
              Healthcare Services
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              A complete healthcare platform connecting patients, doctors,
              pharmacies, diagnostic labs, hospitals, and home healthcare
              services — all in one place.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6"
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <motion.article
                  key={service.title}
                  variants={card}
                  whileHover={{ y: -8 }}
                  className="group relative h-full overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-xl shadow-cyan-100/40 backdrop-blur-xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                  <div className="relative flex h-full flex-col">
                    <div
                      className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${service.color} text-2xl text-white shadow-lg transition duration-300 group-hover:scale-105`}
                    >
                      <Icon />
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-950">
                      {service.title}
                    </h2>

                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                      {service.description}
                    </p>

                    <Link
                      to={service.path}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition group-hover:text-blue-700"
                    >
                      Explore
                      <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease: "easeOut" }}
            className="mt-12 flex flex-col items-center justify-center gap-4 rounded-3xl border border-cyan-100 bg-white/80 px-5 py-7 text-center shadow-xl shadow-cyan-100/50 backdrop-blur-xl sm:flex-row sm:justify-between sm:px-8 sm:text-left"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Start with the care flow you need.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Browse doctors, hospitals, medicines, diagnostic services, or
                home healthcare support from one connected platform.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Get Started
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
