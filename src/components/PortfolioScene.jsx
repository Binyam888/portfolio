import { motion } from "framer-motion";
import styles from "./PortfolioScene.module.scss";

import {
  SiReact, SiNextdotjs, SiWordpress, SiPhp,
  SiStrapi, SiJavascript, SiSass, SiMongodb,
  SiExpress, SiNodedotjs, SiGithub, SiPostman
} from "react-icons/si";
import { SiOpenai } from "react-icons/si";

const SKILLS = [
  { name: "React",      Icon: SiReact,      color: "#61DAFB" },
  { name: "Next.js",    Icon: SiNextdotjs,  color: "#ffffff" },
  { name: "WordPress",  Icon: SiWordpress,  color: "#21759B" },
  { name: "PHP",        Icon: SiPhp,        color: "#777BB4" },
  { name: "Strapi",     Icon: SiStrapi,     color: "#4945FF" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Sass",       Icon: SiSass,       color: "#CF649A" },
  { name: "MongoDB",    Icon: SiMongodb,    color: "#4DB33D" },
  { name: "Express",    Icon: SiExpress,    color: "#aaaaaa" },
  { name: "Node.js",    Icon: SiNodedotjs,  color: "#68A063" },
  { name: "GitHub",     Icon: SiGithub,     color: "#ffffff" },
  { name: "Postman",    Icon: SiPostman,    color: "#FF6C37" },
  { name: "AI",         Icon: SiOpenai,     color: "#39FF14" },
];

function SkillCard({ skill, index }) {
  const { name, Icon, color } = skill;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{ "--accent": color }}
    >
      <div className={styles.iconWrap}>
        <Icon size={28} className={styles.icon} />
      </div>
      <span className={styles.skillName}>{name}</span>
    </motion.div>
  );
}

export default function PortfolioScene() {
  return (
    <section id="skills-scene" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.labelTag}>// Tech Stack</p>
          <h2 className={styles.sectionTitle}>
            Skills & <span className={styles.titleAccent}>Tools</span>
          </h2>
        </motion.div>

        <div className={styles.grid}>
          {SKILLS.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}