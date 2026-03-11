import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const socials = [
    { icon: <Twitter size={24} />, href: "#", name: "Twitter" },
    { icon: <Github size={24} />, href: "#", name: "GitHub" },
    { icon: <Linkedin size={24} />, href: "#", name: "LinkedIn" },
    { icon: <Mail size={24} />, href: "mailto:hello@example.com", name: "Email" },
  ];

  return (
    <footer id="footer" className="bg-dark-gray pt-32 pb-12 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8"
          >
            Let's build <br/>
            <span className="text-neon-green">something</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <MagneticButton className="px-12 py-6 bg-neon-green text-deep-charcoal text-xl font-black uppercase tracking-widest rounded-full hover:bg-white transition-colors">
              Get in touch
            </MagneticButton>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-12">
          <p className="text-white/40 text-sm font-medium mb-8 md:mb-0">
            © {new Date().getFullYear()} Binyam. All rights reserved.
          </p>

          <div className="flex gap-6">
            {socials.map((social) => (
              <MagneticButton key={social.name} className="p-4 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-neon-green hover:border-neon-green/50 transition-colors">
                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.name}>
                  {social.icon}
                </a>
              </MagneticButton>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background large text */}
      <h1 className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-[15vw] font-black uppercase tracking-tighter text-white/5 pointer-events-none whitespace-nowrap">
        Binyam
      </h1>
    </footer>
  );
}
