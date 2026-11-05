import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "neon"
  size?: "sm" | "md" | "lg"
}

const variantStyles = {
  primary:
    "gradient-neon text-white font-bold hover:opacity-90 neon-border",
  secondary:
    "glass text-foreground font-medium hover:bg-white/20",
  ghost:
    "text-muted-foreground hover:text-foreground bg-transparent",
  neon:
    "gradient-neon text-white font-bold neon-border hover:border-[hsl(280,80%,70%)]",
}

const sizeStyles = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-sm rounded-lg",
  lg: "px-8 py-4 text-base rounded-lg",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center transition-all duration-300 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, type ButtonProps }