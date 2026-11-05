import { type HTMLAttributes, forwardRef } from "react"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "strong" | "dark"
  neon?: boolean
}

const variantStyles = {
  light: "glass",
  strong: "glass-strong",
  dark: "glass-dark",
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = "light", neon = true, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${
          variantStyles[variant]
        } rounded-xl p-6 ${
          neon ? "neon-border" : ""
        } animate-fade-in ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"

export { GlassCard, type GlassCardProps }