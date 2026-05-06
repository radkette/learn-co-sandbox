import { useEffect, useRef, useState, forwardRef } from 'react'
import { useQuiltStore } from '@/store/quiltStore'
import { getPiece } from '@/lib/pieces'

const CELL_MAX = 48
const CELL_MIN = 8

interface QuiltBoardProps {
  cols: number
  rows: number
  draggedPieceId: string | null
  onCellSizeChange: (size: number) => void
}

export const QuiltBoard = forwardRef<SVGSVGElement, QuiltBoardProps>(
  ({ cols, rows, draggedPieceId, onCellSizeChange }, svgRef) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [cellSize, setCellSize] = useState(40)
    const [hoveredKey, setHoveredKey] = useState<string | null>(null)

    const { boardPieces, selectedTrayPieceId, placePiece, rotatePiece, removePiece } =
      useQuiltStore()

    // Responsive cell sizing
    useEffect(() => {
      const el = containerRef.current
      if (!el) return
      const update = () => {
        const w = el.clientWidth
        const h = window.innerHeight * 0.65
        const byW = Math.floor(w / cols)
        const byH = Math.floor(h / rows)
        const next = Math.max(CELL_MIN, Math.min(CELL_MAX, Math.min(byW, byH)))
        setCellSize(next)
        onCellSizeChange(next)
      }
      update()
      const ro = new ResizeObserver(update)
      ro.observe(el)
      return () => ro.disconnect()
    }, [cols, rows, onCellSizeChange])

    function handleCellClick(col: number, row: number) {
      const key = `${col},${row}`
      const existing = boardPieces[key]
      const active = selectedTrayPieceId

      if (existing) {
        if (active) {
          // Replace with selected piece
          placePiece(col, row, active)
        } else {
          // Rotate existing piece
          rotatePiece(col, row)
        }
      } else if (active) {
        placePiece(col, row, active)
      }
    }

    const svgW = cols * cellSize
    const svgH = rows * cellSize

    return (
      <div ref={containerRef} className="board-wrap">
        <div className="board-scroll">
          <svg
            ref={svgRef}
            width={svgW}
            height={svgH}
            style={{ display: 'block', userSelect: 'none' }}
            aria-label={`Quilt board, ${cols} columns by ${rows} rows`}
          >
            {Array.from({ length: rows }, (_, row) =>
              Array.from({ length: cols }, (_, col) => {
                const key = `${col},${row}`
                const cell = boardPieces[key]
                const isHovered = hoveredKey === key
                const isDragTarget = draggedPieceId !== null && isHovered && !cell
                const x = col * cellSize
                const y = row * cellSize

                const piece = cell ? getPiece(cell.pieceId) : null
                const dragPiece = isDragTarget ? getPiece(draggedPieceId) : null

                return (
                  <g
                    key={key}
                    onClick={() => handleCellClick(col, row)}
                    onPointerEnter={() => setHoveredKey(key)}
                    onPointerLeave={() => setHoveredKey(null)}
                    style={{
                      cursor: cell
                        ? selectedTrayPieceId ? 'copy' : 'pointer'
                        : selectedTrayPieceId || draggedPieceId ? 'crosshair' : 'default',
                    }}
                    role="button"
                    aria-label={
                      cell
                        ? `Cell ${col + 1},${row + 1}: ${getPiece(cell.pieceId)?.name ?? 'piece'}, ${cell.rotation}°. Click to rotate`
                        : `Cell ${col + 1},${row + 1}: empty`
                    }
                  >
                    {/* Cell background */}
                    <rect
                      x={x} y={y}
                      width={cellSize} height={cellSize}
                      fill={
                        isDragTarget ? '#EBF0EB'
                        : isHovered && cell ? '#F0E8DA'
                        : '#FAF6F0'
                      }
                      stroke="rgba(192,168,130,0.45)"
                      strokeWidth={0.5}
                    />

                    {/* Placed piece */}
                    {piece && (
                      <g transform={`translate(${x},${y})`}>
                        <g transform={`rotate(${cell!.rotation},${cellSize / 2},${cellSize / 2})`}>
                          {piece.render(cellSize)}
                        </g>
                      </g>
                    )}

                    {/* Drag-over ghost */}
                    {dragPiece && (
                      <g transform={`translate(${x},${y})`} opacity={0.55}>
                        {dragPiece.render(cellSize)}
                      </g>
                    )}

                    {/* Remove button — shown on hover when cell is filled */}
                    {cell && isHovered && !draggedPieceId && (
                      <g
                        transform={`translate(${x + cellSize - 10}, ${y + 2})`}
                        onClick={(e) => { e.stopPropagation(); removePiece(col, row) }}
                        style={{ cursor: 'pointer' }}
                        aria-label="Remove piece"
                      >
                        <circle r={6} cx={6} cy={6} fill="white" stroke="rgba(192,168,130,0.8)" strokeWidth={0.75} />
                        <line x1={3.5} y1={3.5} x2={8.5} y2={8.5} stroke="#7A5C40" strokeWidth={1} strokeLinecap="round" />
                        <line x1={8.5} y1={3.5} x2={3.5} y2={8.5} stroke="#7A5C40" strokeWidth={1} strokeLinecap="round" />
                      </g>
                    )}
                  </g>
                )
              })
            )}
          </svg>
        </div>
      </div>
    )
  }
)
QuiltBoard.displayName = 'QuiltBoard'
