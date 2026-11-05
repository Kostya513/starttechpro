import { type HTMLAttributes, forwardRef } from "react"

interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: "light" | "strong"
}

const Glass = forwardRef<HTMLDivElement, GlassProps>(
  ({ intensity = "light", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${
          intensity === "strong" ? "glass-strong" : "glass"
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Glass.displayName = "Glass"

export { Glass, type GlassProps }