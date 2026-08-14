import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPills,
  FaPercent,
  FaVial,
  FaMicroscope,
  FaWheelchair,
  FaMotorcycle,
  FaStore,
  FaArrowRight,
} from "react-icons/fa6";

const services = [
  {
    title: "Medicines Home Delivery",
    description:
      "Order your medicines conveniently and get them delivered safely to your doorstep.",
    icon: FaPills,
    color: "from-fuchsia-500 to-purple-400",
  },
  {
    title: "Partner Pharmacy Discounts",
    description:
      "Get exclusive discounts and better prices through our trusted partner pharmacies.",
    icon: FaPercent,
    color: "from-emerald-500 to-teal-400",
  },
  {
    title: "Blood Tests Booking",
    description:
      "Book essential blood tests easily with trusted diagnostic partners from one platform.",
    icon: FaVial,
    color: "from-red-500 to-rose-400",
  },
  {
    title: "Lab Test Discounts",
    description:
      "Save more on diagnostic tests with a flat 15% discount on selected lab services.",
    icon: FaPercent,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Home Medical Equipment",
    description:
      "Access essential home healthcare equipment including beds, wheelchairs, monitors and more.",
    icon: FaWheelchair,
    color: "from-indigo-500 to-blue-400",
  },
  {
    title: "Doorstep Delivery",
    description:
      "Get your healthcare essentials delivered quickly and conveniently right to your doorstep.",
    icon: FaMotorcycle,
    color: "from-orange-500 to-amber-400",
  },
  {
    title: "Partner Medical Stores",
    description:
      "Connect with reliable local medical stores for genuine healthcare products and support.",
    icon: FaStore,
    color: "from-purple-500 to-pink-400",
  },
  {
    title: "Partner Diagnostic Labs",
    description:
      "Access trusted diagnostic laboratories for reliable testing, reports and healthcare services.",
    icon: FaMicroscope,
    color: "from-sky-500 to-blue-400",
  },
];

const HealthcareServices = () => {
  const [visibleItems, setVisibleItems] = useState({});
  const sectionRef = useRef(null);

  const previewServices = services.slice(0, 5);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll("[data-animate]");
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.animate;

          if (entry.isIntersecting && id) {
            setVisibleItems((prev) => ({
              ...prev,
              [id]: true,
            }));
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-14 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -right-32 -top-32 h-64 w-64 rounded-full bg-blue-200 opacity-60 blur-3xl sm:h-80 sm:w-80" />

        <div className="animate-blob animation-delay-2000 absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-purple-200 opacity-60 blur-3xl sm:h-80 sm:w-80" />

        <div className="animate-blob animation-delay-4000 absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 opacity-50 blur-3xl sm:h-80 sm:w-80" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          data-animate="header"
          className={`mx-auto mb-12 max-w-4xl text-center transition-all duration-1000 sm:mb-16 ${
            visibleItems.header
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <span className="mb-4 inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-md">
            Complete Healthcare Services
          </span>

          <h2 className="bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Our Services
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg md:text-xl">
            From medicines and diagnostics to home medical equipment, MedAmple
            brings essential healthcare services together on one trusted
            platform.
          </p>

          <div className="mx-auto mt-7 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-5">
          {previewServices.map((service, index) => {
            const Icon = service.icon;
            const id = `service-${index}`;

            return (
              <article
                key={service.title}
                data-animate={id}
                style={{ transitionDelay: `${index * 70}ms` }}
                className={`group relative transition-all duration-700 ${
                  visibleItems[id]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
              >
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-6">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                  <div
                    className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${service.color} text-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon />
                  </div>

                  <h3 className="relative mb-2 text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                    {service.title}
                  </h3>

                  <p className="relative text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="relative mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Learn more
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              </article>
            );
          })}
        </div>

        <div
          data-animate="footer"
          className={`mt-14 flex justify-center transition-all delay-300 duration-1000 sm:mt-20 ${
            visibleItems.footer
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <Link
            to="/services"
            className="group inline-flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            Explore all our services
            <FaArrowRight className="text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HealthcareServices;
