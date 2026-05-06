import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useQuiltStore } from '@/store/quiltStore'
import { calculateGrid, isExactFit, fmtIn } from '@/lib/calculateGrid'

const GRID_PREVIEW_MAX = 24

export default function StepCalculator() {
  const navigate = useNavigate()
  const { dimensions, setCalculatedGrid } = useQuiltStore()

  const { widthIn, heightIn, approxSquareIn } = dimensions

  const grid = useMemo(() => {
    if (!widthIn || !heightIn || !approxSquareIn) return null
    return calculateGrid(Number(widthIn), Number(heightIn), Number(approxSquareIn))
  }, [widthIn, heightIn, approxSquareIn])

  // If someone lands here directly with no dimensions, send them back
  if (!widthIn || !heightIn || !approxSquareIn) {
    return (
      <Card variant="airy" style={{ maxWidth: 520 }}>
        <p className="text-eyebrow" style={{ marginBottom: 8 }}>Step 2 of 6</p>
        <h1 className="heading-display" style={{ marginBottom: 16 }}>Square Size</h1>
        <p className="text-body text-muted" style={{ marginBottom: 24 }}>
          Please enter your quilt dimensions first.
        </p>
        <Button variant="secondary" onClick={() => navigate('/step/1')}>
          ← Back to dimensions
        </Button>
      </Card>
    )
  }

  if (!grid) return null

  const exact = isExactFit(grid, Number(widthIn), Number(heightIn))
  const targetChanged =
    grid.actualWidth !== Number(widthIn) || grid.actualHeight !== Number(heightIn)

  // Clamp preview grid for very large quilts
  const previewCols = Math.min(grid.cols, GRID_PREVIEW_MAX)
  const previewRows = Math.min(grid.rows, GRID_PREVIEW_MAX)
  const clipped = previewCols < grid.cols || previewRows < grid.rows

  function handleAccept() {
    setCalculatedGrid(grid!)
    navigate('/step/3')
  }

  return (
    <Card variant="airy" style={{ maxWidth: 560 }}>
      <p className="text-eyebrow" style={{ marginBottom: 8 }}>Step 2 of 6</p>
      <h1 className="heading-display" style={{ marginBottom: 24 }}>Square Size</h1>

      {/* Metric summary */}
      <div className="calc-metrics">
        <div className="metric-card">
          <p className="metric-value">{fmtIn(grid.squareSize)}"</p>
          <p className="metric-label">Square size</p>
        </div>
        <div className="metric-card">
          <p className="metric-value">{grid.cols} × {grid.rows}</p>
          <p className="metric-label">Grid (cols × rows)</p>
        </div>
        <div className="metric-card">
          <p className="metric-value">{fmtIn(grid.actualWidth)}" × {fmtIn(grid.actualHeight)}"</p>
          <p className="metric-label">Finished size</p>
        </div>
      </div>

      {/* Confirmation callout */}
      <p className="heading-italic calc-callout">
        {exact
          ? <>Your quilt will have <strong>{grid.cols} × {grid.rows}</strong> squares at <strong>{fmtIn(grid.squareSize)}"</strong>, giving a finished size of exactly <strong>{fmtIn(grid.actualWidth)}" × {fmtIn(grid.actualHeight)}"</strong>.</>
          : <>Your quilt will have <strong>{grid.cols} × {grid.rows}</strong> squares at <strong>{fmtIn(grid.squareSize)}"</strong>, giving a finished size of <strong>{fmtIn(grid.actualWidth)}" × {fmtIn(grid.actualHeight)}"</strong>{targetChanged ? ' — slightly different from your target.' : '.'}</>
        }
      </p>

      {/* Grid preview */}
      <div className="calc-preview-wrap">
        <div
          className="calc-preview-grid"
          style={{
            gridTemplateColumns: `repeat(${previewCols}, 1fr)`,
            gridTemplateRows: `repeat(${previewRows}, 1fr)`,
            aspectRatio: `${grid.cols} / ${grid.rows}`,
          }}
          aria-label={`${grid.cols} by ${grid.rows} quilt grid preview`}
        >
          {Array.from({ length: previewCols * previewRows }).map((_, i) => (
            <div key={i} className="calc-preview-cell" />
          ))}
        </div>
        {clipped && (
          <p className="field-hint" style={{ marginTop: 8, textAlign: 'center' }}>
            Preview shows {previewCols} × {previewRows} of {grid.cols} × {grid.rows} squares
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
        <Button variant="secondary" onClick={() => navigate('/step/1')}>
          ← Go back
        </Button>
        <Button variant="primary" onClick={handleAccept}>
          Accept and continue →
        </Button>
      </div>
    </Card>
  )
}
