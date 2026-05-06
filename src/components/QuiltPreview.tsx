import { useQuiltStore } from '@/store/quiltStore'
import { getPiece } from '@/lib/pieces'

interface QuiltPreviewProps {
  cols: number
  rows: number
  maxWidth?: number
  maxHeight?: number
}

export function QuiltPreview({ cols, rows, maxWidth = 480, maxHeight = 360 }: QuiltPreviewProps) {
  const { boardPieces, cellColors, palette } = useQuiltStore()

  const cellSize = Math.min(
    Math.floor(maxWidth / cols),
    Math.floor(maxHeight / rows),
    48,
  )

  const svgW = cols * cellSize
  const svgH = rows * cellSize

  return (
    <svg
      width={svgW}
      height={svgH}
      style={{ display: 'block' }}
      aria-label={`Quilt preview, ${cols} × ${rows}`}
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const key = `${col},${row}`
          const cell = boardPieces[key]
          const x = col * cellSize
          const y = row * cellSize

          const colorId = cellColors[key]
          const paletteColor = colorId ? palette.find((p) => p.id === colorId) : null
          const pieceColors = paletteColor ? { a: paletteColor.hex, b: '#FAF6F0' } : undefined
          const piece = cell ? getPiece(cell.pieceId) : null

          return (
            <g key={key}>
              <rect
                x={x} y={y}
                width={cellSize} height={cellSize}
                fill="#FAF6F0"
                stroke="rgba(192,168,130,0.45)"
                strokeWidth={0.5}
              />
              {piece && (
                <g transform={`translate(${x},${y})`}>
                  <g transform={`rotate(${cell!.rotation},${cellSize / 2},${cellSize / 2})`}>
                    {piece.render(cellSize, pieceColors)}
                  </g>
                </g>
              )}
            </g>
          )
        })
      )}
    </svg>
  )
}
