import { motion } from 'framer-motion';

export function Section({ children, className = '', alt = false, dark = false, primary = false }) {
  let bgClass = 'bg-white';
  if (alt) bgClass = 'bg-neutral-50';
  if (dark) bgClass = 'bg-neutral-950 text-white';
  if (primary) bgClass = 'bg-primary text-white';

  return (
    <section className={`py-20 md:py-32 overflow-hidden ${bgClass} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
