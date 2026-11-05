import { type HTMLAttributes, forwardRef } from "react"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "outline"
}

const variantStyles = {
  default: "glass text-emerald-400",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  outline: "border border-border text-muted-foreground bg-transparent",
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = "Badge"

export { Badge, type BadgeProps }