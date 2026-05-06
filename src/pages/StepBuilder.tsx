import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { QuiltBoard } from '@/components/QuiltBoard'
import { PieceTray } from '@/components/PieceTray'
import { useQuiltStore } from '@/store/quiltStore'
import { getPiece } from '@/lib/pieces'

export default function StepBuilder() {
  const navigate = useNavigate()
  const { calculatedGrid, selectedTrayPieceId, selectTrayPiece, placePiece, clearBoard, clearCellColors } =
    useQuiltStore()

  const svgRef = useRef<SVGSVGElement>(null)
  const [cellSize, setCellSize] = useState(40)
  const [drag, setDrag] = useState<{ pieceId: string; x: number; y: number } | null>(null)

  const handleCellSizeChange = useCallback((size: number) => setCellSize(size), [])

  // Drag ghost — follows pointer
  useEffect(() => {
    if (!drag) return

    function onMove(e: PointerEvent) {
      setDrag((d) => d ? { ...d, x: e.clientX, y: e.clientY } : null)

      // Compute which cell is under the pointer and place on drop
      const svg = svgRef.current
      if (!svg || !calculatedGrid) return
      const rect = svg.getBoundingClientRect()
      const col = Math.floor((e.clientX - rect.left) / cellSize)
      const row = Math.floor((e.clientY - rect.top) / cellSize)
      const inBounds =
        col >= 0 && col < calculatedGrid.cols &&
        row >= 0 && row < calculatedGrid.rows
      // Just track hover — actual placement on pointerup
      if (!inBounds) return
    }

    function onUp(e: PointerEvent) {
      const svg = svgRef.current
      if (svg && calculatedGrid && drag) {
        const rect = svg.getBoundingClientRect()
        const col = Math.floor((e.clientX - rect.left) / cellSize)
        const row = Math.floor((e.clientY - rect.top) / cellSize)
        if (
          col >= 0 && col < calculatedGrid.cols &&
          row >= 0 && row < calculatedGrid.rows
        ) {
          placePiece(col, row, drag.pieceId)
        }
      }
      setDrag(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [drag, cellSize, calculatedGrid, placePiece])

  // Dismiss tray selection on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') selectTrayPiece(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectTrayPiece])

  // ── Viewport guard ────────────────────────────────────────────
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return (
      <div className="viewport-guard">
        <p className="heading-section" style={{ marginBottom: 12 }}>Larger screen needed</p>
        <p className="text-body text-muted">
          The quilt builder needs at least 1024px of screen width. Open it on a desktop or
          landscape tablet.
        </p>
      </div>
    )
  }

  // ── No grid yet ───────────────────────────────────────────────
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
  const dragPiece = drag ? getPiece(drag.pieceId) : null

  return (
    <div className="builder-content">

      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="builder-toolbar">
        <div>
          <p className="text-eyebrow" style={{ marginBottom: 2 }}>Step 3 of 6</p>
          <h1 className="heading-section">Quilt Builder</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="text-muted" style={{ fontSize: 12 }}>
            {cols} × {rows} squares · {squareSize}" each · {actualWidth}" × {actualHeight}"
          </span>
          <Button
            variant="ghost"
            onClick={() => { clearBoard(); clearCellColors() }}
            title="Clear board"
            style={{ padding: '6px 10px', gap: 6 }}
          >
            <Trash2 size={14} /> Clear
          </Button>
          <Button variant="secondary" onClick={() => navigate('/step/2')}>← Back</Button>
          <Button variant="primary" onClick={() => navigate('/step/4')}>Add Color →</Button>
        </div>
      </div>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="builder-main">
        <QuiltBoard
          ref={svgRef}
          cols={cols}
          rows={rows}
          draggedPieceId={drag?.pieceId ?? selectedTrayPieceId}
          onCellSizeChange={handleCellSizeChange}
        />
        <PieceTray
          onDragStart={(id) => {
            const pos = { x: 0, y: 0 }
            setDrag({ pieceId: id, ...pos })
          }}
          onDragEnd={() => setDrag(null)}
        />
      </div>

      {/* ── Drag ghost ──────────────────────────────────── */}
      {drag && dragPiece && (
        <div
          className="drag-ghost"
          style={{ left: drag.x - cellSize / 2, top: drag.y - cellSize / 2 }}
          aria-hidden="true"
        >
          <svg width={cellSize} height={cellSize}>
            {dragPiece.render(cellSize)}
          </svg>
        </div>
      )}
    </div>
  )
}
