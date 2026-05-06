import { create } from 'zustand'

export interface QuiltDimensions {
  widthIn: number | ''
  heightIn: number | ''
  approxSquareIn: number | ''
}

export interface CalculatedGrid {
  squareSize: number
  cols: number
  rows: number
  actualWidth: number
  actualHeight: number
}

export type Rotation = 0 | 90 | 180 | 270

export interface BoardCell {
  pieceId: string
  rotation: Rotation
}

interface QuiltState {
  dimensions: QuiltDimensions
  calculatedGrid: CalculatedGrid | null
  boardPieces: Record<string, BoardCell>   // key: "col,row"
  selectedTrayPieceId: string | null

  setDimensions: (d: Partial<QuiltDimensions>) => void
  setCalculatedGrid: (g: CalculatedGrid | null) => void
  placePiece: (col: number, row: number, pieceId: string) => void
  removePiece: (col: number, row: number) => void
  rotatePiece: (col: number, row: number) => void
  selectTrayPiece: (id: string | null) => void
  clearBoard: () => void
}

const ROTATION_CYCLE: Rotation[] = [0, 90, 180, 270]

export const useQuiltStore = create<QuiltState>((set) => ({
  dimensions: { widthIn: '', heightIn: '', approxSquareIn: '' },
  calculatedGrid: null,
  boardPieces: {},
  selectedTrayPieceId: null,

  setDimensions: (d) =>
    set((s) => ({ dimensions: { ...s.dimensions, ...d } })),

  setCalculatedGrid: (g) => set({ calculatedGrid: g }),

  placePiece: (col, row, pieceId) =>
    set((s) => ({
      boardPieces: {
        ...s.boardPieces,
        [`${col},${row}`]: { pieceId, rotation: 0 },
      },
    })),

  removePiece: (col, row) =>
    set((s) => {
      const next = { ...s.boardPieces }
      delete next[`${col},${row}`]
      return { boardPieces: next }
    }),

  rotatePiece: (col, row) =>
    set((s) => {
      const key = `${col},${row}`
      const cell = s.boardPieces[key]
      if (!cell) return s
      const idx = ROTATION_CYCLE.indexOf(cell.rotation)
      const nextRotation = ROTATION_CYCLE[(idx + 1) % 4]
      return {
        boardPieces: {
          ...s.boardPieces,
          [key]: { ...cell, rotation: nextRotation },
        },
      }
    }),

  selectTrayPiece: (id) => set({ selectedTrayPieceId: id }),

  clearBoard: () => set({ boardPieces: {} }),
}))
