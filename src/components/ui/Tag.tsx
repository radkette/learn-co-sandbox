import type { HTMLAttributes } from 'react'

type TagVariant = 'sage' | 'linen'

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant
}

export function Tag({ variant = 'linen', className = '', children, ...props }: TagProps) {
  const cls = ['tag', `tag--${variant}`, className].filter(Boolean).join(' ')
  return (
    <span className={cls} {...props}>
      {children}
    </span>
  )
}
