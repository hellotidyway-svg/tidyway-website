import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProofBar from '@/components/SocialProofBar';
import HowItWorks from '@/components/HowItWorks';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import WhyTidyway from '@/components/WhyTidyway';
import Reviews from '@/components/Reviews';
import ServiceAreas from '@/components/ServiceAreas';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SocialProofBar />
        <HowItWorks />
        <Services />
        <Pricing />
        <WhyTidyway />
        <Reviews />
        <ServiceAreas />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
