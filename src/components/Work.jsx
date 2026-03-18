import { motion } from "framer-motion";
import styles from "./Work.module.scss";

const projects = [
  {
    id: 1,
    title: "Project Alpha",
    category: "Web App",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Neon Studio",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Velocity Dashboard",
    category: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Quantum API",
    category: "Backend Services",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export default function Work() {
  return (
    <section id="work" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.sectionHeader}
        >
          <h2 className={styles.title}>
            Selected <span className={styles.titleAccent}>Work</span>
          </h2>
        </motion.div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={styles.card}
            >
              {/* Image with zoom effect */}
              <div
                className={styles.cardImage}
                style={{ backgroundImage: `url(${project.image})` }}
                aria-label={project.title}
              />

              {/* Overlay gradient */}
              <div className={styles.cardOverlay} />

              {/* Text content sliding up on hover */}
              <div className={styles.cardContent}>
                <span className={styles.cardCategory}>
                  {project.category}
                </span>
                <h3 className={styles.cardTitle}>{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
