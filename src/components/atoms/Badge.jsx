import ApperIcon from '@/components/ApperIcon'

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon = null,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-full transition-all duration-150 ease-out'
  
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />}
      {children}
    </span>
  )
}

export default Badge