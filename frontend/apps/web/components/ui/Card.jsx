export function Card({ children, className = '', hover = false }) {
  const hoverClass = hover 
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20' 
    : ''
    
  return (
    <div
      className={`bg-white rounded-2xl border border-neutral-100 p-8 shadow-sm ${hoverClass} ${className}`}
    >
      {children}
    </div>
  )
}