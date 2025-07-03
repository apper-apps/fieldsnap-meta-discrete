import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  className = '',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={20} className="text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10 pr-10"
        {...props}
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          <ApperIcon name="X" size={20} />
        </button>
      )}
    </div>
  )
}

export default SearchBar