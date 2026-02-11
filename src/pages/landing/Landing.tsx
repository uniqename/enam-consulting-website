import About from "../../features/landing/About";
import CallToAction from "../../features/landing/CallToAction";
import Hero from "../../features/landing/Hero";
import PortfolioPreview from "../../features/landing/PortfolioPreview";
import Services from "../../features/landing/ServiceTier";
import TrustedBy from "../../features/landing/TrustedBy";


const Landing = () => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <TrustedBy />
      <About />
      <Services />
      <PortfolioPreview />
      <CallToAction />
    </div>
  );
};

export default Landing;