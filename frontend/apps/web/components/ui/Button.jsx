import Link from 'next/link'

export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 focus:outline-none focus:ring-0 focus:ring-primary active:scale-95'
  
  const variants = {
    primary: 'bg-primary hover:bg-emerald-700 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30',
    secondary: 'bg-white border-2 border-neutral-200 text-neutral-900 hover:border-primary hover:text-primary shadow-sm',
    accent: 'bg-amber-400 hover:bg-amber-500 text-neutral-900 shadow-lg shadow-amber-400/20',
    white: 'bg-white hover:bg-neutral-100 text-primary shadow-xl', // New variant for dark sections
    black: 'bg-neutral-800 hover:bg-neutral-900 text-white shadow-xl',
    
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}