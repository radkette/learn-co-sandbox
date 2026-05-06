import type { BoardCell, CalculatedGrid, PaletteColor } from '@/store/quiltStore'

export interface FabricRequirement {
  colorId: string | null   // null = default/uncolored cells
  name: string
  hex: string | null
  cells: number
  yards: number
}

export interface YardageSummary {
  fabrics: FabricRequirement[]
  backing: { yards: number; seamed: boolean }
  binding: { yards: number; strips: number }
  batting: { width: number; height: number }
}

function roundUpToEighth(yards: number): number {
  return Math.ceil(yards * 8) / 8
}

function cellsToYards(cells: number, cutSize: number): number {
  const perStrip = Math.floor(44 / cutSize)
  const strips = Math.ceil(cells / perStrip)
  return roundUpToEighth((strips * cutSize * 1.1) / 36)
}

export function calculateYardage(
  boardPieces: Record<string, BoardCell>,
  cellColors: Record<string, { a?: string; b?: string }>,
  palette: PaletteColor[],
  grid: CalculatedGrid,
  seamAllowance: number = 0.25,
): YardageSummary {
  const cutSize = grid.squareSize + seamAllowance * 2

  // Tally cells per colorId (A and B assignments summed per colorId)
  const tally: Record<string, number> = {}
  let uncolored = 0
  for (const key of Object.keys(boardPieces)) {
    const cell = cellColors[key]
    const aId = cell?.a
    const bId = cell?.b
    if (aId) {
      tally[aId] = (tally[aId] ?? 0) + 1
    }
    if (bId) {
      tally[bId] = (tally[bId] ?? 0) + 1
    }
    if (!aId && !bId) {
      uncolored++
    }
  }

  const fabrics: FabricRequirement[] = []

  for (const color of palette) {
    const cells = tally[color.id] ?? 0
    if (cells === 0) continue
    fabrics.push({
      colorId: color.id,
      name: color.name,
      hex: color.hex,
      cells,
      yards: cellsToYards(cells, cutSize),
    })
  }

  if (uncolored > 0) {
    fabrics.push({
      colorId: null,
      name: 'Default Fabric',
      hex: null,
      cells: uncolored,
      yards: cellsToYards(uncolored, cutSize),
    })
  }

  fabrics.sort((a, b) => b.cells - a.cells)

  // Backing: quilt + 8" each side; seam if width > 40" usable
  const backingH = grid.actualHeight + 8
  const seamed = grid.actualWidth + 8 > 40
  const backingYards = roundUpToEighth(
    (seamed ? backingH * 2 : backingH) / 36 + 0.25
  )

  // Binding: 2.5"-wide strips from 40" usable width
  const perimeter = 2 * (grid.actualWidth + grid.actualHeight)
  const strips = Math.ceil((perimeter + 10) / 40)
  const bindingYards = roundUpToEighth((strips * 2.5) / 36 + 0.125)

  return {
    fabrics,
    backing: { yards: backingYards, seamed },
    binding: { yards: bindingYards, strips },
    batting: { width: grid.actualWidth + 4, height: grid.actualHeight + 4 },
  }
}

// Format yards as a fraction string: 1.375 → "1⅜ yd"
export function fmtYards(yards: number): string {
  const FRACS = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞']
  const whole = Math.floor(yards)
  const fracIdx = Math.round((yards - whole) * 8)
  const frac = FRACS[fracIdx] ?? ''
  if (whole === 0) return frac ? `${frac} yd` : '< ⅛ yd'
  return frac ? `${whole}${frac} yd` : `${whole} yd`
}
