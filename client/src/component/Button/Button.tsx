import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

const Button = ({ children, className = "", disabled, loading = false, ...props }: ButtonProps) => (
  <button className={`flex h-14 w-full items-center justify-center bg-primary-500 px-5 font-display text-base uppercase tracking-[0.12em] text-black shadow-button transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} disabled={disabled || loading} {...props}>
    {loading ? "Please wait…" : children}
  </button>
);

export default Button;
