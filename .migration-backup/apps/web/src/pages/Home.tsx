import Navbar from '@/components/navigation/Navbar';
import HeroSection from '@/components/sections/hero/HeroSection';
import WhySnibSection from '@/components/sections/features/WhySnibSection';
import NetworkSection from '@/components/sections/network/NetworkSection';
import CTASection from '@/components/sections/cta/CTASection';

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
