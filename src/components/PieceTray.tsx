import { useQuiltStore } from '@/store/quiltStore'
import { PIECES } from '@/lib/pieces'

const TRAY_CELL = 40   // px per piece preview

interface PieceTrayProps {
  onDragStart: (pieceId: string) => void
  onDragEnd: () => void
}

export function PieceTray({ onDragStart, onDragEnd }: PieceTrayProps) {
  const { selectedTrayPieceId, selectTrayPiece } = useQuiltStore()

  return (
    <div className="tray-wrap">
      <p className="text-eyebrow" style={{ marginBottom: 10 }}>Pieces</p>
      <div className="tray-grid">
        {PIECES.map((piece) => {
          const isSelected = selectedTrayPieceId === piece.id
          return (
            <div
              key={piece.id}
              className={['tray-piece', isSelected ? 'tray-piece--selected' : ''].join(' ')}
              onClick={() => selectTrayPiece(isSelected ? null : piece.id)}
              onPointerDown={(e) => {
                e.preventDefault()
                selectTrayPiece(piece.id)
                onDragStart(piece.id)
              }}
              onPointerUp={onDragEnd}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={piece.name}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  selectTrayPiece(isSelected ? null : piece.id)
                }
              }}
            >
              <svg
                width={TRAY_CELL}
                height={TRAY_CELL}
                style={{ display: 'block', pointerEvents: 'none' }}
              >
                {piece.render(TRAY_CELL)}
              </svg>
              <span className="tray-label">{piece.name}</span>
              {isSelected && (
                <div className="tray-selected-ring" aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>
      <p className="field-hint" style={{ marginTop: 10 }}>
        Click a piece to select, then click any cell to place. Click a placed piece to rotate.
      </p>
    </div>
  )
}
