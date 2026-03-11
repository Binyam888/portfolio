import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const statItems = [
  { label: "Years Experience", value: "05", suffix: "+" },
  { label: "Projects Completed", value: "120", suffix: "" },
  { label: "Global Clients", value: "45", suffix: "" },
  { label: "Awards Won", value: "08", suffix: "" },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="stats" className="py-32 bg-dark-gray relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h3 className="text-neon-green font-bold tracking-widest uppercase mb-4 text-sm">
              // Performance Data
            </h3>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Driven by data.<br/>
              <span className="text-white/50">Designed for impact.</span>
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-white/60 max-w-sm md:text-right"
          >
            Delivering high-performance digital experiences with precision, speed, and cutting-edge aesthetics.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 p-px rounded-3xl overflow-hidden"
        >
          {statItems.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-dark-gray p-8 md:p-12 flex flex-col group relative overflow-hidden"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl md:text-7xl font-black text-white group-hover:text-neon-green transition-colors duration-300">
                    {stat.value}
                  </span>
                  <span className="text-2xl md:text-4xl font-bold text-neon-green ml-1">
                    {stat.suffix}
                  </span>
                </div>
                <div className="text-sm md:text-base text-white/50 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
