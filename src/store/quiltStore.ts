import { create } from 'zustand'

export interface QuiltDimensions {
  widthIn: number | ''
  heightIn: number | ''
  approxSquareIn: number | ''
  seamAllowance: number
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

export interface PaletteColor {
  id: string
  name: string
  hex: string
}

interface QuiltState {
  dimensions: QuiltDimensions
  calculatedGrid: CalculatedGrid | null
  boardPieces: Record<string, BoardCell>   // key: "col,row"
  selectedTrayPieceId: string | null
  palette: PaletteColor[]
  cellColors: Record<string, { a?: string; b?: string }>  // key: "col,row"
  selectedPaletteColorId: string | null
  quiltName: string

  setDimensions: (d: Partial<QuiltDimensions>) => void
  setCalculatedGrid: (g: CalculatedGrid | null) => void
  placePiece: (col: number, row: number, pieceId: string) => void
  removePiece: (col: number, row: number) => void
  rotatePiece: (col: number, row: number) => void
  selectTrayPiece: (id: string | null) => void
  clearBoard: () => void
  addColor: (hex: string, name: string) => void
  updateColor: (id: string, patch: Partial<Omit<PaletteColor, 'id'>>) => void
  removeColor: (id: string) => void
  paintCell: (col: number, row: number, colorId: string | null, target: 'a' | 'b') => void
  clearCellColors: () => void
  selectPaletteColor: (id: string | null) => void
  setQuiltName: (name: string) => void
}

const ROTATION_CYCLE: Rotation[] = [0, 90, 180, 270]
let colorSeq = 0

export const useQuiltStore = create<QuiltState>((set) => ({
  dimensions: { widthIn: '', heightIn: '', approxSquareIn: '', seamAllowance: 0.25 },
  calculatedGrid: null,
  boardPieces: {},
  selectedTrayPieceId: null,
  palette: [],
  cellColors: {},
  selectedPaletteColorId: null,
  quiltName: '',

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

  addColor: (hex, name) =>
    set((s) => ({
      palette: [...s.palette, { id: `c${++colorSeq}`, name, hex }],
    })),

  updateColor: (id, patch) =>
    set((s) => ({
      palette: s.palette.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  removeColor: (id) =>
    set((s) => {
      const nextColors: Record<string, { a?: string; b?: string }> = {}
      for (const [k, v] of Object.entries(s.cellColors)) {
        const updated: { a?: string; b?: string } = {}
        if (v.a && v.a !== id) updated.a = v.a
        if (v.b && v.b !== id) updated.b = v.b
        if (updated.a !== undefined || updated.b !== undefined) {
          nextColors[k] = updated
        }
      }
      return {
        palette: s.palette.filter((c) => c.id !== id),
        cellColors: nextColors,
        selectedPaletteColorId:
          s.selectedPaletteColorId === id ? null : s.selectedPaletteColorId,
      }
    }),

  paintCell: (col, row, colorId, target) =>
    set((s) => {
      const key = `${col},${row}`
      const existing = s.cellColors[key] ?? {}
      const next = { ...s.cellColors }
      if (colorId === null) {
        const updated = { ...existing }
        delete updated[target]
        if (Object.keys(updated).length === 0) {
          delete next[key]
        } else {
          next[key] = updated
        }
      } else {
        next[key] = { ...existing, [target]: colorId }
      }
      return { cellColors: next }
    }),

  clearCellColors: () => set({ cellColors: {} }),

  selectPaletteColor: (id) => set({ selectedPaletteColorId: id }),

  setQuiltName: (name) => set({ quiltName: name }),
}))
