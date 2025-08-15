import React from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helpText,
  options,
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  React.useEffect(() => {
    setHasValue(!!props.value || !!props.defaultValue);
  }, [props.value, props.defaultValue]);

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            'peer w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 ease-in-out appearance-none cursor-pointer',
            'text-white focus:outline-none pr-12',
            'border-white/20 hover:border-white/30',
            isFocused || hasValue 
              ? 'focus:border-blue-400 focus:bg-white/10 focus:shadow-lg focus:shadow-blue-500/20' 
              : '',
            error 
              ? 'border-red-400 focus:border-red-400 bg-red-500/10' 
              : '',
            props.disabled && 'opacity-50 cursor-not-allowed bg-white/5',
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        >
          {options.map(option => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-gray-800 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        {label && (
          <label
            htmlFor={selectId}
            className={clsx(
              'absolute left-4 transition-all duration-300 ease-in-out pointer-events-none',
              'text-white/70 font-medium',
              isFocused || hasValue || props.value || props.defaultValue
                ? '-top-2.5 text-xs bg-gradient-to-r from-blue-900 to-indigo-900 px-2 rounded text-blue-300'
                : 'top-3 text-sm',
              error && (isFocused || hasValue || props.value || props.defaultValue)
                ? 'text-red-300'
                : ''
            )}
          >
            {label}
          </label>
        )}

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <div className="p-1 rounded-lg transition-all duration-200">
            <ChevronDown className={clsx(
              'h-5 w-5 transition-all duration-300',
              isFocused ? 'text-blue-400 rotate-180' : 'text-white/60'
            )} />
          </div>
        </div>

        {/* Focus ring effect */}
        <div className={clsx(
          'absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none',
          isFocused && !error
            ? 'ring-2 ring-blue-400/50 ring-offset-2 ring-offset-transparent'
            : '',
          error && isFocused
            ? 'ring-2 ring-red-400/50 ring-offset-2 ring-offset-transparent'
            : ''
        )} />
      </div>

      {error && (
        <div className="flex items-center space-x-2 animate-in slide-in-from-left-1 duration-200">
          <div className="w-1 h-1 bg-red-400 rounded-full"></div>
          <p className="text-sm text-red-300 font-medium">{error}</p>
        </div>
      )}
      
      {helpText && !error && (
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-white/40 rounded-full"></div>
          <p className="text-sm text-white/60">{helpText}</p>
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;