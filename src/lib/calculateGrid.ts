import type { CalculatedGrid } from '@/store/quiltStore'

const HALF_INCH_STEPS = 0.5

/**
 * Returns all candidate square sizes (multiples of 0.5") that evenly divide
 * both dimensions, within ±50% of the target size.
 */
function candidateSizes(
  widthIn: number,
  heightIn: number,
  approxIn: number,
): number[] {
  const min = Math.max(HALF_INCH_STEPS, approxIn * 0.5)
  const max = approxIn * 1.5
  const candidates: number[] = []

  for (let s = HALF_INCH_STEPS; s <= max; s = Math.round((s + HALF_INCH_STEPS) * 100) / 100) {
    if (s < min) continue
    const colsExact = widthIn / s
    const rowsExact = heightIn / s
    if (
      Math.abs(colsExact - Math.round(colsExact)) < 0.001 &&
      Math.abs(rowsExact - Math.round(rowsExact)) < 0.001
    ) {
      candidates.push(s)
    }
  }
  return candidates
}

/**
 * Picks the candidate closest to the target. If none divide evenly,
 * falls back to the nearest half-inch that minimises overhang.
 */
export function calculateGrid(
  widthIn: number,
  heightIn: number,
  approxIn: number,
): CalculatedGrid {
  const exact = candidateSizes(widthIn, heightIn, approxIn)

  let squareSize: number

  if (exact.length > 0) {
    // Closest exact match
    squareSize = exact.reduce((best, s) =>
      Math.abs(s - approxIn) < Math.abs(best - approxIn) ? s : best,
    )
  } else {
    // No exact divisor — find nearest half-inch that minimises total remainder
    let bestScore = Infinity
    squareSize = approxIn

    for (let s = HALF_INCH_STEPS; s <= Math.max(widthIn, heightIn); s = Math.round((s + HALF_INCH_STEPS) * 100) / 100) {
      const score =
        Math.abs(s - approxIn) +
        (widthIn % s) / widthIn +
        (heightIn % s) / heightIn
      if (score < bestScore) {
        bestScore = score
        squareSize = s
      }
    }
  }

  const cols = Math.round(widthIn / squareSize)
  const rows = Math.round(heightIn / squareSize)

  return {
    squareSize,
    cols,
    rows,
    actualWidth: Math.round(cols * squareSize * 100) / 100,
    actualHeight: Math.round(rows * squareSize * 100) / 100,
  }
}

/** Returns true if the grid divides the dimensions exactly. */
export function isExactFit(grid: CalculatedGrid, widthIn: number, heightIn: number): boolean {
  return grid.actualWidth === widthIn && grid.actualHeight === heightIn
}

/** Formats a number cleanly — drops trailing .0 but keeps .5 */
export function fmtIn(n: number): string {
  return n % 1 === 0 ? String(n) : String(n)
}
