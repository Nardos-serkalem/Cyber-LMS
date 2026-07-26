import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-lemon-500 text-navy-900 hover:bg-lemon-200 active:bg-lemon-700",
  secondary: "bg-navy-900 text-lemon-500 hover:bg-navy-700 active:bg-navy-900",
  ghost: "bg-transparent text-navy-900 border border-navy-200 hover:bg-navy-50 active:bg-navy-100",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}