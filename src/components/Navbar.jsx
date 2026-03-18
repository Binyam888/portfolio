import { Link } from "react-scroll";
import MagneticButton from "./MagneticButton";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Navbar.module.scss";

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
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ ease: "easeOut", duration: 0.8 }}
    >
      <div className={styles.headerInner}>

        {/* Left Side: Logo */}
        <div className={styles.logoWrap}>
          <Link to="hero" smooth={true} duration={800} className={styles.logoLink}>
            <motion.div
              className={styles.logo}
              whileHover={{ scale: 1.05 }}
            >
              BM<span className={styles.logoDot}>.</span>
            </motion.div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              smooth={true}
              duration={800}
              className={styles.navLink}
            >
              <MagneticButton className={styles.navLinkInner}>{link.name}</MagneticButton>
            </Link>
          ))}
        </nav>

        {/* Right Side: CTA / Mobile Toggle */}
        <div className={styles.ctaWrap}>
          <Link to="footer" smooth={true} duration={800}>
            <MagneticButton className={styles.ctaButton}>
              Contact
            </MagneticButton>
          </Link>

          {/* Mobile menu toggle */}
          <button className={styles.mobileToggle}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

      </div>
    </motion.header>
  );
}
