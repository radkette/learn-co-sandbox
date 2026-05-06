import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useQuiltStore } from '@/store/quiltStore'
import { calculateYardage, fmtYards } from '@/lib/yardage'

export default function StepCalculation() {
  const navigate = useNavigate()
  const { calculatedGrid, boardPieces, cellColors, palette } = useQuiltStore()

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

  const totalCells = Object.keys(boardPieces).length

  if (totalCells === 0) {
    return (
      <div>
        <p className="text-eyebrow" style={{ marginBottom: 2 }}>Step 5 of 6</p>
        <h1 className="heading-section" style={{ marginBottom: 20 }}>Yardage</h1>
        <p className="text-body text-muted" style={{ marginBottom: 16 }}>
          No pieces placed yet. Head back to the builder to fill in your quilt.
        </p>
        <Button variant="secondary" onClick={() => navigate('/step/3')}>← Back to Builder</Button>
      </div>
    )
  }

  const { cols, rows, squareSize, actualWidth, actualHeight } = calculatedGrid
  const summary = calculateYardage(boardPieces, cellColors, palette, calculatedGrid)

  return (
    <div>
      <p className="text-eyebrow" style={{ marginBottom: 2 }}>Step 5 of 6</p>
      <h1 className="heading-section" style={{ marginBottom: 4 }}>Yardage</h1>
      <p className="text-muted" style={{ fontSize: 12, marginBottom: 24 }}>
        {cols} × {rows} squares · {squareSize}" each · {actualWidth}" × {actualHeight}" finished
      </p>

      {/* ── Fabric Requirements ── */}
      <div className="card card--dense" style={{ marginBottom: 16 }}>
        <p className="metric-label" style={{ marginBottom: 12 }}>Fabric Requirements</p>

        {summary.fabrics.length === 0 ? (
          <p className="field-hint">
            Add colors in step 4 to see per-fabric yardage. All {totalCells} blocks use Default Fabric.
          </p>
        ) : (
          <div className="yardage-list">
            {summary.fabrics.map((f) => (
              <div key={f.colorId ?? '__default'} className="yardage-row">
                <div
                  className="yardage-dot"
                  style={{
                    background: f.hex ?? '#E8E4DC',
                    border: f.hex ? 'none' : '1.5px dashed #C0A882',
                  }}
                />
                <span className="yardage-name">{f.name}</span>
                <span className="yardage-cells">{f.cells} block{f.cells !== 1 ? 's' : ''}</span>
                <span className="yardage-amount">{fmtYards(f.yards)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Backing · Binding · Batting ── */}
      <div className="calc-metrics" style={{ marginBottom: 16 }}>
        <div className="metric-card">
          <p className="metric-label" style={{ marginBottom: 6 }}>Backing</p>
          <p className="metric-value">{fmtYards(summary.backing.yards)}</p>
          <p className="field-hint" style={{ marginTop: 4 }}>
            {summary.backing.seamed ? 'Seamed — 2 widths' : 'Single width'}
          </p>
        </div>
        <div className="metric-card">
          <p className="metric-label" style={{ marginBottom: 6 }}>Binding</p>
          <p className="metric-value">{fmtYards(summary.binding.yards)}</p>
          <p className="field-hint" style={{ marginTop: 4 }}>
            {summary.binding.strips} strip{summary.binding.strips !== 1 ? 's' : ''} at 2½"
          </p>
        </div>
        <div className="metric-card">
          <p className="metric-label" style={{ marginBottom: 6 }}>Batting</p>
          <p className="metric-value">{summary.batting.width}" × {summary.batting.height}"</p>
          <p className="field-hint" style={{ marginTop: 4 }}>Finished size + 4" each side</p>
        </div>
      </div>

      {/* ── Notes ── */}
      <p className="calc-callout" style={{ fontSize: 13 }}>
        <strong>Estimates include</strong> ¼" seam allowance and 10% cutting waste.
        Fabric is calculated on 44" wide yardage, rounded up to the nearest ⅛ yard.
        {summary.backing.seamed && ' Backing requires seaming two lengths.'}
      </p>

      {/* ── Nav ── */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Button variant="secondary" onClick={() => navigate('/step/4')}>← Back</Button>
        <Button variant="primary" onClick={() => navigate('/step/6')}>Export →</Button>
      </div>
    </div>
  )
}
