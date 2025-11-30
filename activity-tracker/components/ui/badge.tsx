import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-white/5 text-text-secondary border border-white/10',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        danger: 'bg-danger/10 text-danger border border-danger/20',
        primary: 'bg-primary/10 text-primary border border-primary/20',
        glass: 'bg-white/5 text-text-primary border border-white/5 backdrop-blur-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  icon?: string
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
