import {
  FiShield,
  FiHeadphones,
  FiDollarSign,
  // FiRadio,
  // FiZap,
  // FiBriefcase,
} from "react-icons/fi";
import {
  FaUserDoctor,
  FaFlaskVial,
  FaTruckMedical,
  FaWheelchair,
  FaStore,
  // FaHospital,
} from "react-icons/fa6";

const features = [
  {
    title: "Trusted Local Pharmacies",
    desc: "Reliable pharmacy partners for genuine medicines and healthcare products.",
    hoverDesc:
      "We connect you with trusted local pharmacies that focus on genuine medicines, dependable service, and convenient access to essential healthcare products.",
    icon: FaStore,
  },
  {
    title: "Certified Partner Labs",
    desc: "Trusted diagnostic partners for dependable testing and reports.",
    hoverDesc:
      "Our diagnostic network connects patients with trusted partner laboratories for reliable testing, convenient sample collection, and accessible diagnostic reports.",
    icon: FaFlaskVial,
  },
  {
    title: "Genuine Medical Equipment",
    desc: "Quality equipment for patients and home healthcare needs.",
    hoverDesc:
      "Access genuine medical equipment for home healthcare, including patient beds, wheelchairs, walkers, nebulizers, BP monitors, oxygen concentrators, and other essential equipment.",
    icon: FaWheelchair,
  },
  {
    title: "Affordable Pricing",
    desc: "Quality healthcare services and products at competitive prices.",
    hoverDesc:
      "We aim to make essential healthcare more accessible through competitive pricing, partner discounts, and value-focused healthcare services without compromising quality.",
    icon: FiDollarSign,
  },
  {
    title: "Fast Home Delivery",
    desc: "Convenient doorstep delivery for medicines and healthcare essentials.",
    hoverDesc:
      "Get medicines and selected healthcare essentials delivered conveniently to your doorstep, helping you save time when healthcare products are needed at home.",
    icon: FaTruckMedical,
  },
  {
    title: "Quality Healthcare",
    desc: "Dependable healthcare services designed around your needs.",
    hoverDesc:
      "MedAmple brings medicines, diagnostics, medical equipment, pharmacies, and healthcare services together to provide a convenient and quality-focused healthcare experience.",
    icon: FaUserDoctor,
  },
  {
    title: "Professional Service",
    desc: "Reliable support through a connected healthcare network.",
    hoverDesc:
      "Our platform is designed to connect patients with healthcare professionals, pharmacies, diagnostic labs, hospitals, and medical service partners through a convenient and professional experience.",
    icon: FiHeadphones,
  },
  {
    title: "One Platform for Complete Healthcare",
    desc: "Medicines, diagnostics, equipment, and healthcare services in one place.",
    hoverDesc:
      "From medicines and lab tests to home medical equipment, partner pharmacies, diagnostic labs, and doorstep delivery, MedAmple brings essential healthcare services together on one platform.",
    icon: FiShield,
  },
];

const WhyUs = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-600">
            Why Choose Us
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Built for trust.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Designed for <br className="hidden sm:block" />
              complete care.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group h-[230px] [perspective:1000px]"
              >
                <div className="relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Side */}
                  <div className="absolute inset-0 flex flex-col rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm [backface-visibility:hidden]">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-lg text-white shadow-md">
                      <Icon />
                    </div>

                    <h3 className="text-base font-extrabold text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {item.desc}
                    </p>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 flex flex-col justify-center rounded-3xl border border-cyan-200 bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-xl shadow-cyan-100 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-xl backdrop-blur-sm">
                      <Icon />
                    </div>

                    <h3 className="text-lg font-extrabold">{item.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-white/90">
                      {item.hoverDesc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
