import type { HTMLAttributes } from 'react'

type CardVariant = 'airy' | 'dense'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

export function Card({ variant = 'airy', className = '', children, ...props }: CardProps) {
  const cls = ['card', `card--${variant}`, className].filter(Boolean).join(' ')
  return (
    <div className={cls} {...props}>
      {children}
    </div>
  )
}
