import EmergencySection from "../components/landing/EmergencySection";
import HealthcareServices from "../components/landing/HealthcareServices";
import HowItWorks from "../components/landing/HowItWorks";
import PremiumCarousel from "../components/landing/PremiumCarousel";
import StatsCounter from "../components/landing/StatsCounter";
import Testimonials from "../components/landing/Testimonials";
import WhyUs from "../components/landing/WhyUs";

const Landing = () => {
  return (
    <div className="relative">
      <PremiumCarousel />
      <StatsCounter />
      <HealthcareServices />
      <HowItWorks />
      <WhyUs />
      <Testimonials />
    </div>
  );
};

export default Landing;
