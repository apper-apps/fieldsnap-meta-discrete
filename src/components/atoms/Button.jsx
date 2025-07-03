import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary focus:ring-primary/50 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-secondary to-secondary/90 text-white hover:from-secondary/90 hover:to-secondary focus:ring-secondary/50 shadow-lg hover:shadow-xl',
    accent: 'bg-gradient-to-r from-accent to-accent/90 text-white hover:from-accent/90 hover:to-accent focus:ring-accent/50 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-secondary hover:bg-gray-100 focus:ring-gray-500/50',
    danger: 'bg-gradient-to-r from-error to-error/90 text-white hover:from-error/90 hover:to-error focus:ring-error/50 shadow-lg hover:shadow-xl'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[32px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]'
  }
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer hover:scale-105'

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button