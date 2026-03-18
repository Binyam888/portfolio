import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import styles from "./Footer.module.scss";

export default function Footer() {
  const socials = [
    { icon: <Twitter size={24} />, href: "#", name: "Twitter" },
    { icon: <Github size={24} />, href: "#", name: "GitHub" },
    { icon: <Linkedin size={24} />, href: "#", name: "LinkedIn" },
    { icon: <Mail size={24} />, href: "mailto:hello@example.com", name: "Email" },
  ];

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.ctaSection}>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.ctaTitle}
          >
            Let's build <br/>
            <span className={styles.ctaAccent}>something</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <MagneticButton className={styles.ctaButton}>
              Get in touch
            </MagneticButton>
          </motion.div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Binyam. All rights reserved.
          </p>

          <div className={styles.socials}>
            {socials.map((social) => (
              <MagneticButton key={social.name} className={styles.socialButton}>
                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.name}>
                  {social.icon}
                </a>
              </MagneticButton>
            ))}
          </div>
        </div>
      </div>

      {/* Background large text */}
      <h1 className={styles.bgText}>Binyam</h1>
    </footer>
  );
}
