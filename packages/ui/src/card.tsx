import { type HTMLAttributes, forwardRef } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "neon"
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const baseStyles =
      variant === "glass"
        ? "glass rounded-2xl"
        : variant === "neon"
        ? "glass neon-border rounded-2xl"
        : "rounded-2xl border border-border bg-card"

    return (
      <div ref={ref} className={`${baseStyles} ${className}`} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col gap-1.5 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = "CardHeader"

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = "CardContent"

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardContent, CardFooter, type CardProps }