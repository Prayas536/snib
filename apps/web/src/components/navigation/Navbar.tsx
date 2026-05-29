import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-[20px] border-b border-white/5 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('hero')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="url(#orbit)" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="12" cy="12" r="3" fill="hsl(var(--primary))" />
            <defs>
              <linearGradient id="orbit" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(var(--primary))" />
                <stop offset="1" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-bold text-xl tracking-tight text-white">SNIB</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Product', 'Features', 'Network', 'Pricing'].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2 rounded-full border border-transparent hover:border-white/10">
            Sign in
          </button>
          <button className="text-sm font-medium text-black bg-gradient-to-r from-primary to-secondary px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/5 p-6 flex flex-col gap-4 md:hidden"
          >
            {['Product', 'Features', 'Network', 'Pricing'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-lg font-medium text-white/70 hover:text-white transition-colors text-left"
              >
                {item}
              </button>
            ))}
            <hr className="border-white/10 my-2" />
            <button className="text-lg font-medium text-white text-left">Sign in</button>
            <button className="text-lg font-medium text-black bg-gradient-to-r from-primary to-secondary px-5 py-3 rounded-full text-center mt-2">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
