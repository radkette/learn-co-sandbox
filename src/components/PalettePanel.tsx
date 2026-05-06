import { Plus, Eraser } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useQuiltStore } from '@/store/quiltStore'

export function PalettePanel() {
  const {
    palette, cellColors, selectedPaletteColorId,
    selectPaletteColor, addColor, updateColor, removeColor, clearCellColors,
    paintTarget, setPaintTarget,
  } = useQuiltStore()

  const usedCount = (id: string) =>
    Object.values(cellColors).filter((v) => v.a === id || v.b === id).length

  const isEraser = selectedPaletteColorId === null

  return (
    <div className="palette-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p className="text-eyebrow" style={{ margin: 0 }}>Color Palette</p>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['a', 'b'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPaintTarget(t)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: paintTarget === t
                  ? '2px solid var(--color-sage, #7A9A7A)'
                  : '1.5px solid var(--color-border, #C0A882)',
                background: paintTarget === t
                  ? 'var(--color-sage-light, #EBF0EB)'
                  : 'transparent',
                color: paintTarget === t
                  ? 'var(--color-sage-dark, #3A5A3A)'
                  : 'var(--color-walnut, #7A5C40)',
                fontWeight: paintTarget === t ? 700 : 400,
                fontSize: 13,
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-pressed={paintTarget === t}
              aria-label={`Paint fabric ${t.toUpperCase()}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
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
        Select a color and fabric (A or B), then click any placed piece. Use the eraser to remove color.
      </p>
    </div>
  )
}
