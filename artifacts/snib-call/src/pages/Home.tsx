import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import WhySnibSection from '@/components/features/WhySnibSection';
import NetworkSection from '@/components/network/NetworkSection';
import CTASection from '@/components/cta/CTASection';

export default function Home() {
  return (
    <main className="min-h-screen bg-background w-full overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />
      <HeroSection />
      <WhySnibSection />
      <NetworkSection />
      <CTASection />
    </main>
  );
}
