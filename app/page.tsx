import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProofBar from '@/components/SocialProofBar';
import HowItWorks from '@/components/HowItWorks';
import Services from '@/components/Services';
import CleaningChecklist from '@/components/CleaningChecklist';
import Pricing from '@/components/Pricing';
import WhyTidyway from '@/components/WhyTidyway';
import ServiceAreas from '@/components/ServiceAreas';
import Reviews from '@/components/Reviews';
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
        <CleaningChecklist />
        <Pricing />
        <WhyTidyway />
        <ServiceAreas />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
