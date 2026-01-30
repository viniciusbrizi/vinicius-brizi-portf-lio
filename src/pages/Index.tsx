import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import PortfolioSection from '@/components/PortfolioSection';
import ContactSection from '@/components/ContactSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import InteractiveBackground from '@/components/InteractiveBackground';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      {/* Interactive particle background */}
      <InteractiveBackground />
      
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <ContactSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
      
      {/* WhatsApp floating button */}
      <WhatsAppButton />
    </div>
  );
};

export default Index;