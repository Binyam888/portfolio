import { Link } from "react-scroll";
import MagneticButton from "./MagneticButton";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", to: "hero" },
    { name: "About", to: "about" },
    { name: "Stats", to: "stats" },
    { name: "Work", to: "work" },
  ];

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-4 bg-deep-charcoal/80 backdrop-blur-md shadow-sm " : "py-6 bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ ease: "easeOut", duration: 0.8 }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="hero" smooth={true} duration={800} className="cursor-pointer">
            <motion.div 
              className="text-2xl font-black tracking-tighter hover:text-neon-green transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              BM<span className="text-neon-green">.</span>
            </motion.div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex gap-8 items-center bg-white/5 rounded-full px-8 py-3 border border-white/10 backdrop-blur-md justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              smooth={true}
              duration={800}
              className="cursor-pointer text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors"
            >
              <MagneticButton className="px-2">{link.name}</MagneticButton>
            </Link>
          ))}
        </nav>

        {/* Right Side: CTA / Mobile Toggle */}
        <div className="flex-1 flex justify-end">
          <Link to="footer" smooth={true} duration={800}>
            <MagneticButton className="hidden md:block px-6 py-3 bg-neon-green text-deep-charcoal font-bold rounded-full hover:bg-white transition-colors">
              Contact
            </MagneticButton>
          </Link>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

      </div>
    </motion.header>
  );
}
