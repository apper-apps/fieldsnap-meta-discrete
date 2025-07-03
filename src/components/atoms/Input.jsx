const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 border-2 rounded-lg font-body text-secondary placeholder-gray-400 transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const stateClasses = error
    ? 'border-error focus:border-error focus:ring-error/50'
    : 'border-gray-300 focus:border-primary focus:ring-primary/50'
  
  const disabledClasses = disabled
    ? 'bg-gray-50 cursor-not-allowed opacity-50'
    : 'bg-white hover:border-gray-400'

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
      {...props}
    />
  )
}

export default Input