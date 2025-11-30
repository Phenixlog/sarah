import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-white text-background hover:bg-white/90',
        primary:
          'bg-primary text-white hover:bg-primary/90',
        secondary:
          'bg-white/5 text-text-primary hover:bg-white/10 border border-white/10',
        outline:
          'border border-border text-text-primary hover:bg-white/5',
        ghost:
          'text-text-primary hover:bg-white/5',
        danger:
          'bg-danger text-white hover:bg-danger/90',
        success:
          'bg-success text-white hover:bg-success/90',
        glass:
          'bg-white/5 text-text-primary hover:bg-white/10 backdrop-blur-sm border border-white/10',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
