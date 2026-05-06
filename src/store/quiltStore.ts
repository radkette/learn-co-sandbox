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

interface QuiltState {
  dimensions: QuiltDimensions
  calculatedGrid: CalculatedGrid | null
  setDimensions: (d: Partial<QuiltDimensions>) => void
  setCalculatedGrid: (g: CalculatedGrid | null) => void
}

export const useQuiltStore = create<QuiltState>((set) => ({
  dimensions: { widthIn: '', heightIn: '', approxSquareIn: '' },
  calculatedGrid: null,
  setDimensions: (d) =>
    set((s) => ({ dimensions: { ...s.dimensions, ...d } })),
  setCalculatedGrid: (g) => set({ calculatedGrid: g }),
}))
