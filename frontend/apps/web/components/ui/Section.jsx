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



// components/ui/Section.jsx
// export function Section({ children, className = '', alt = false, dark = false }) {
//   let bgClass = 'bg-white'
//   if (alt) bgClass = 'bg-neutral-50'
//   if (dark) bgClass = 'bg-neutral-900 text-white'
  
//   // By putting ${className} LAST, your custom pt-12 will win the fight
//   return (
//     <section className={`py-16 md:py-24 ${bgClass} ${className}`}>
//       {children}
//     </section>
//   )
// }