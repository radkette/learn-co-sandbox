import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { QuiltBoard } from '@/components/QuiltBoard'
import { PalettePanel } from '@/components/PalettePanel'
import { useQuiltStore } from '@/store/quiltStore'

export default function StepColor() {
  const navigate = useNavigate()
  const svgRef = useRef<SVGSVGElement>(null)
  const { calculatedGrid } = useQuiltStore()

  if (!calculatedGrid) {
    return (
      <div style={{ padding: 'var(--space-xl)' }}>
        <p className="text-body text-muted" style={{ marginBottom: 16 }}>
          Please complete steps 1 and 2 first.
        </p>
        <Button variant="secondary" onClick={() => navigate('/step/1')}>
          ← Back to start
        </Button>
      </div>
    )
  }

  const { cols, rows, squareSize, actualWidth, actualHeight } = calculatedGrid

  return (
    <div className="color-content">

      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="color-toolbar">
        <div>
          <p className="text-eyebrow" style={{ marginBottom: 2 }}>Step 4 of 6</p>
          <h1 className="heading-section">Add Color</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="text-muted" style={{ fontSize: 12 }}>
            {cols} × {rows} squares · {squareSize}" each · {actualWidth}" × {actualHeight}"
          </span>
          <Button variant="secondary" onClick={() => navigate('/step/3')}>← Back</Button>
          <Button variant="primary" onClick={() => navigate('/step/5')}>Calculate →</Button>
        </div>
      </div>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="color-main">
        <PalettePanel />
        <QuiltBoard
          ref={svgRef}
          mode="paint"
          cols={cols}
          rows={rows}
          draggedPieceId={null}
          onCellSizeChange={() => {}}
        />
      </div>
    </div>
  )
}
