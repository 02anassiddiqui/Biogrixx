export function Card({ children, className = '', hover = false }) {
  const hoverClass = hover ? 'transition-shadow duration-200 hover:shadow-md' : ''
  return (
    <div
      className={`bg-white rounded-xl border border-neutral-200 p-6 shadow-sm ${hoverClass} ${className}`}
    >
      {children}
    </div>
  )
}
