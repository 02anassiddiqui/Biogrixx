import Link from 'next/link'

export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
  const variants = {
    primary: 'bg-primary hover:bg-[#15803d] text-white',
    secondary: 'bg-transparent border-2 border-primary text-primary hover:bg-secondary',
    accent: 'bg-accent hover:bg-amber-400 text-neutral-900',
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
