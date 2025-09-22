import React from "react";
import { clsx } from "clsx";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      showPasswordToggle = false,
      className,
      id,
      type,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputType, setInputType] = React.useState(type);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    React.useEffect(() => {
      if (showPasswordToggle && type === "password") {
        setInputType(showPassword ? "text" : "password");
      } else {
        setInputType(type);
      }
    }, [showPassword, type, showPasswordToggle]);

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    // Determine if we're on a white background by checking parent classes
    const isOnWhiteBackground =
      className?.includes("text-black") ||
      document
        .querySelector(".bg-white, .from-white, .to-gray-50")
        ?.contains(document.activeElement);

    return (
      <div className="space-y-2">
        <div className="relative">
          <input
            id={inputId}
            type={inputType}
            ref={ref}
            className={clsx(
              "peer w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 ease-in-out",
              isOnWhiteBackground
                ? "text-black placeholder-gray-500"
                : "text-white placeholder-transparent",
              "focus:outline-none",
              "border-white/20 hover:border-white/30",
              isFocused || hasValue
                ? "focus:border-blue-400 focus:bg-white/10 focus:shadow-lg focus:shadow-blue-500/20"
                : "",
              error ? "border-red-400 focus:border-red-400 bg-red-500/10" : "",
              showPasswordToggle && "pr-12",
              props.disabled && "opacity-50 cursor-not-allowed bg-white/5",
              className,
            )}
            placeholder={label || props.placeholder || ""}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {label && (
            <label
              htmlFor={inputId}
              className={clsx(
                "absolute left-4 transition-all duration-300 ease-in-out pointer-events-none",
                isOnWhiteBackground
                  ? "text-black font-medium"
                  : "text-white/70 font-medium",
                isFocused || hasValue || props.value || props.defaultValue
                  ? `-top-2.5 text-xs px-2 rounded ${isOnWhiteBackground ? "bg-white text-blue-600" : "bg-gradient-to-r from-blue-900 to-indigo-900 text-blue-300"}`
                  : "top-3 text-sm",
                error &&
                  (isFocused || hasValue || props.value || props.defaultValue)
                  ? isOnWhiteBackground
                    ? "text-red-600"
                    : "text-red-300"
                  : "",
              )}
            >
              {label}
            </label>
          )}

          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center group"
              onClick={() => setShowPassword(!showPassword)}
            >
              <div className="p-1 rounded-lg transition-all duration-200 group-hover:bg-white/10">
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-white/60 group-hover:text-white/80 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-white/60 group-hover:text-white/80 transition-colors" />
                )}
              </div>
            </button>
          )}

          {/* Focus ring effect */}
          <div
            className={clsx(
              "absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none",
              isFocused && !error
                ? "ring-2 ring-blue-400/50 ring-offset-2 ring-offset-transparent"
                : "",
              error && isFocused
                ? "ring-2 ring-red-400/50 ring-offset-2 ring-offset-transparent"
                : "",
            )}
          />
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
  },
);

Input.displayName = "Input";

export default Input;
