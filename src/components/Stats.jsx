import { motion } from "framer-motion";
import styles from "./Stats.module.scss";

const statItems = [
  { label: "Years Experience", value: "1.5", suffix: "+", color: "#39FF14" },
  { label: "Projects Completed", value: "120", suffix: "", color: "#00ffff" },
  { label: "Global Clients", value: "45", suffix: "", color: "#ff00ff" },
  { label: "Awards Won", value: "08", suffix: "", color: "#ffaa00" },
];

function StatCard({ item, index }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.cardBorder} style={{ "--accent": item.color }} />
      <div className={styles.cardValue} style={{ color: item.color }}>
        {item.value}
        <span className={styles.cardSuffix}>{item.suffix}</span>
      </div>
      <div className={styles.cardLabel}>{item.label}</div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section id="stats" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <h3 className={styles.label}>// Performance Data</h3>
            <h2 className={styles.title}>
              Driven by data.<br />
              <span className={styles.titleFaded}>Designed for impact.</span>
            </h2>
          </div>
          <p className={styles.headerDesc}>
            Real numbers that reflect a commitment to quality, craftsmanship, and client satisfaction.
          </p>
        </div>

        <div className={styles.grid}>
          {statItems.map((item, i) => (
            <StatCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
