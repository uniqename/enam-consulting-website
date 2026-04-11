import About from "../../features/landing/About";
import CallToAction from "../../features/landing/CallToAction";
import ClaritySprint from "../../features/landing/ClaritySprint";
import Contact from "../../features/landing/Contact";
import FAQ from "../../features/landing/FAQ";
import Hero from "../../features/landing/Hero";
import HowIWork from "../../features/landing/HowIWork";
import PortfolioPreview from "../../features/landing/PortfolioPreview";
import Services from "../../features/landing/ServiceTier";
import TrustedBy from "../../features/landing/TrustedBy";
import WhoIWorkWith from "../../features/landing/WhoIWorkWith";


const Landing = () => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <TrustedBy />
      <About />
      <Services />
      <WhoIWorkWith />
      <ClaritySprint />
      <HowIWork />
      <PortfolioPreview />
      <FAQ />
      <Contact />
      <CallToAction />
    </div>
  );
};

export default Landing;