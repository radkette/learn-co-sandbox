import { useState, useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'

interface TooltipProps {
  content: string
}

export function Tooltip({ content }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <span ref={ref} className="tooltip-wrap">
      <button
        type="button"
        className="tooltip-trigger"
        aria-label="More information"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <HelpCircle size={14} />
      </button>
      {open && (
        <span role="tooltip" className="tooltip-bubble">
          {content}
        </span>
      )}
    </span>
  )
}
