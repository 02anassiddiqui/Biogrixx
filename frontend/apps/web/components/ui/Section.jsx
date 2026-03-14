export function Section({ children, className = '', alt = false }) {
  const bgClass = alt ? 'bg-secondary' : 'bg-white'
  return (
    <section className={`py-16 md:py-24 ${bgClass} ${className}`}>
      {children}
    </section>
  )
}
