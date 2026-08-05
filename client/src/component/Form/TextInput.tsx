import { useState, type HTMLInputTypeAttribute } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps {
  id: string;
  label?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

const TextInput = ({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  registration,
  error,
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      {label && <label className="auth-label" htmlFor={id}>{label}</label>}
      <div className="relative">
        <input
          {...registration}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className={`auth-input ${isPassword ? "pr-16" : ""} ${error ? "border-danger focus:border-danger focus:ring-red-100" : ""}`}
          id={id}
          placeholder={placeholder}
          type={isPassword && showPassword ? "text" : type}
        />
        {isPassword && (
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 px-4 text-xs font-bold text-primary-600 hover:text-primary-700"
            onClick={() => setShowPassword((value) => !value)}
            type="button"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-danger" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
};

export default TextInput;
