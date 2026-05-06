import { Plus, Eraser } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useQuiltStore } from '@/store/quiltStore'

export function PalettePanel() {
  const {
    palette, cellColors, selectedPaletteColorId,
    selectPaletteColor, addColor, updateColor, removeColor, clearCellColors,
  } = useQuiltStore()

  const usedCount = (id: string) =>
    Object.values(cellColors).filter((v) => v.a === id || v.b === id).length

  const isEraser = selectedPaletteColorId === null

  return (
    <div className="palette-panel">
      <div style={{ marginBottom: 12 }}>
        <p className="text-eyebrow" style={{ margin: 0 }}>Color Palette</p>
      </div>

      {/* Eraser */}
      <div
        className={['palette-entry', isEraser ? 'palette-entry--selected' : ''].join(' ')}
        onClick={() => selectPaletteColor(null)}
        role="button"
        tabIndex={0}
        aria-pressed={isEraser}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectPaletteColor(null) }}
      >
        <div className="palette-eraser">
          <Eraser size={14} strokeWidth={1.5} />
        </div>
        <span className="palette-entry__label">Eraser</span>
        {isEraser && <div className="palette-entry__ring" aria-hidden="true" />}
      </div>

      {/* Color entries */}
      {palette.map((color) => {
        const isSelected = selectedPaletteColorId === color.id
        const count = usedCount(color.id)
        return (
          <div
            key={color.id}
            className={['palette-entry', isSelected ? 'palette-entry--selected' : ''].join(' ')}
            onClick={() => selectPaletteColor(isSelected ? null : color.id)}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                selectPaletteColor(isSelected ? null : color.id)
              }
            }}
          >
            {/* Color swatch — click opens native color picker */}
            <label
              className="palette-swatch-wrap"
              onClick={(e) => e.stopPropagation()}
              title="Change color"
            >
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(color.id, { hex: e.target.value })}
                className="palette-swatch-input"
              />
              <div className="palette-swatch" style={{ background: color.hex }} />
            </label>

            {/* Name input */}
            <input
              type="text"
              value={color.name}
              onChange={(e) => updateColor(color.id, { name: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              className="palette-entry__name"
              maxLength={20}
            />

            {/* Cell count badge */}
            {count > 0 && (
              <span className="palette-entry__count">{count}</span>
            )}

            {/* Delete */}
            <button
              className="palette-entry__delete"
              onClick={(e) => { e.stopPropagation(); removeColor(color.id) }}
              aria-label={`Remove ${color.name}`}
              tabIndex={-1}
            >
              ×
            </button>

            {isSelected && <div className="palette-entry__ring" aria-hidden="true" />}
          </div>
        )
      })}

      <Button
        variant="ghost"
        onClick={() => addColor('#C45A3A', `Color ${palette.length + 1}`)}
        style={{ marginTop: 10, width: '100%', justifyContent: 'center', gap: 6 }}
      >
        <Plus size={13} /> Add Color
      </Button>

      {Object.keys(cellColors).length > 0 && (
        <button
          className="palette-clear-btn"
          onClick={clearCellColors}
        >
          Clear all colors
        </button>
      )}

      <p className="field-hint" style={{ marginTop: 12 }}>
        Select a color, then click a section of any placed piece to paint it. Use the eraser to remove color.
      </p>
    </div>
  )
}
