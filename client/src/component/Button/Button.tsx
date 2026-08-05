import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

const Button = ({ children, className = "", disabled, loading = false, ...props }: ButtonProps) => (
  <button className={`auth-button ${className}`} disabled={disabled || loading} {...props}>
    {loading ? "Please wait…" : children}
  </button>
);

export default Button;
