export function Container({ children, className = '', narrow = false, wide = false }) {
  const widthClass = narrow ? 'max-w-3xl' : wide ? 'max-w-7xl' : 'max-w-6xl'
  return (
    <div className={`mx-auto px-6 lg:px-12 ${widthClass} ${className}`}>
      {children}
    </div>
  )
}
