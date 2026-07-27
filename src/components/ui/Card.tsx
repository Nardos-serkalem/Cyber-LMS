import type { HTMLAttributes } from "react";

type CardVariant = "default" | "highlight" | "secondary";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface-card border border-navy-200",
  highlight: "bg-lemon-50 text-lemon-700",
  secondary: "bg-navy-50 text-navy-700",
};

export function Card({ variant = "default", className = "", ...props }: CardProps) {
  return <div className={`rounded-xl p-4 ${variantClasses[variant]} ${className}`} {...props} />;
}