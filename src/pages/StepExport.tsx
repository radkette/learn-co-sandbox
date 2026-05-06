import { useNavigate } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { QuiltPreview } from '@/components/QuiltPreview'
import { useQuiltStore } from '@/store/quiltStore'
import { calculateYardage, fmtYards } from '@/lib/yardage'

const MONTH_YEAR = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

export default function StepExport() {
  const navigate = useNavigate()
  const { calculatedGrid, boardPieces, cellColors, palette } = useQuiltStore()

  if (!calculatedGrid) {
    return (
      <div>
        <p className="text-eyebrow" style={{ marginBottom: 2 }}>Step 6 of 6</p>
        <h1 className="heading-section" style={{ marginBottom: 20 }}>Export & Print</h1>
        <p className="text-body text-muted" style={{ marginBottom: 16 }}>
          Please complete steps 1 and 2 first.
        </p>
        <Button variant="secondary" onClick={() => navigate('/step/1')}>← Back to start</Button>
      </div>
    )
  }

  const { cols, rows, squareSize, actualWidth, actualHeight } = calculatedGrid
  const summary = calculateYardage(boardPieces, cellColors, palette, calculatedGrid)

  return (
    <div>
      {/* ── Actions (hidden on print) ─────────────────── */}
      <div className="export-actions">
        <div>
          <p className="text-eyebrow" style={{ marginBottom: 2 }}>Step 6 of 6</p>
          <h1 className="heading-section">Export & Print</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="secondary" onClick={() => navigate('/step/5')}>← Back</Button>
          <Button
            variant="primary"
            onClick={() => window.print()}
            style={{ gap: 8 }}
          >
            <Printer size={14} /> Print / Save as PDF
          </Button>
        </div>
      </div>

      <p className="field-hint export-hint">
        Use your browser's print dialog to save as PDF or send to a printer.
      </p>

      {/* ── Print section ─────────────────────────────── */}
      <div className="print-section">

        {/* Header */}
        <div className="print-header">
          <span className="print-title">Patchwork</span>
          <span className="print-date">{MONTH_YEAR}</span>
        </div>
        <p className="print-subtitle">
          {actualWidth}" × {actualHeight}" quilt &middot; {squareSize}" blocks &middot; {cols} × {rows} grid
        </p>

        {/* Quilt preview */}
        <div className="print-quilt">
          <QuiltPreview cols={cols} rows={rows} maxWidth={480} maxHeight={360} />
        </div>

        {/* Fabric requirements */}
        {summary.fabrics.length > 0 && (
          <div className="print-block">
            <p className="print-section-label">Fabric Requirements</p>
            <div className="print-fabric-list">
              {summary.fabrics.map((f) => (
                <div key={f.colorId ?? '__default'} className="print-fabric-row">
                  <div
                    className="print-dot"
                    style={{
                      background: f.hex ?? '#E8E4DC',
                      border: f.hex ? 'none' : '1.5px dashed #C0A882',
                    }}
                  />
                  <span className="print-fabric-name">{f.name}</span>
                  <span className="print-fabric-cells">{f.cells} block{f.cells !== 1 ? 's' : ''}</span>
                  <span className="print-fabric-yards">{fmtYards(f.yards)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backing · Binding · Batting */}
        <div className="print-block">
          <p className="print-section-label">Construction</p>
          <div className="print-metrics">
            <div className="print-metric">
              <span className="print-metric__label">Backing</span>
              <span className="print-metric__value">{fmtYards(summary.backing.yards)}</span>
              <span className="print-metric__note">
                {summary.backing.seamed ? 'Seamed — 2 widths' : 'Single width'}
              </span>
            </div>
            <div className="print-metric">
              <span className="print-metric__label">Binding</span>
              <span className="print-metric__value">{fmtYards(summary.binding.yards)}</span>
              <span className="print-metric__note">
                {summary.binding.strips} strip{summary.binding.strips !== 1 ? 's' : ''} at 2½"
              </span>
            </div>
            <div className="print-metric">
              <span className="print-metric__label">Batting</span>
              <span className="print-metric__value">{summary.batting.width}" × {summary.batting.height}"</span>
              <span className="print-metric__note">Finished size + 4" each side</span>
            </div>
          </div>
        </div>

        <p className="print-footer-note">
          All fabric estimates include ¼" seam allowance and 10% cutting waste, calculated
          on 44"-wide yardage rounded up to the nearest ⅛ yard.
        </p>
      </div>
    </div>
  )
}
