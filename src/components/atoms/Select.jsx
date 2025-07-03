import ApperIcon from '@/components/ApperIcon'

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 border-2 rounded-lg font-body text-secondary bg-white appearance-none transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const stateClasses = error
    ? 'border-error focus:border-error focus:ring-error/50'
    : 'border-gray-300 focus:border-primary focus:ring-primary/50'
  
  const disabledClasses = disabled
    ? 'bg-gray-50 cursor-not-allowed opacity-50'
    : 'cursor-pointer hover:border-gray-400'

  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <ApperIcon name="ChevronDown" size={20} className="text-gray-400" />
      </div>
    </div>
  )
}

export default Select