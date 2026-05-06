import type { ReactNode } from 'react'

const FA = '#E8E4DC'   // fabric A — warm light
const FB = '#FAF6F0'   // fabric B — near white
const SK = '#3D2B1F'   // stroke (inkwell)
const SW = 0.75        // stroke width

export interface PieceColors {
  a: string
  b: string
}

export interface PieceDef {
  id: string
  name: string
  render: (size: number, colors?: PieceColors) => ReactNode
}

export const PIECES: PieceDef[] = [
  {
    id: 'square',
    name: 'Solid Square',
    render: (s, colors) => (
      <rect width={s} height={s} fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW} />
    ),
  },
  {
    id: 'hst',
    name: 'Half-Square Triangle',
    render: (s, colors) => (
      <>
        <polygon points={`0,0 ${s},0 0,${s}`}       fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW} />
        <polygon points={`${s},0 ${s},${s} 0,${s}`} fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
      </>
    ),
  },
  {
    id: 'qst',
    name: 'Quarter-Square Triangle',
    render: (s, colors) => {
      const cx = s / 2, cy = s / 2
      return (
        <>
          <polygon points={`0,0 ${s},0 ${cx},${cy}`}       fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s},0 ${s},${s} ${cx},${cy}`} fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s},${s} 0,${s} ${cx},${cy}`} fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW} />
          <polygon points={`0,${s} 0,0 ${cx},${cy}`}       fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
        </>
      )
    },
  },
  {
    id: 'rect-h',
    name: 'Rectangle (H)',
    render: (s, colors) => (
      <>
        <rect               width={s} height={s / 2} fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW} />
        <rect y={s / 2}     width={s} height={s / 2} fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
      </>
    ),
  },
  {
    id: 'rect-v',
    name: 'Rectangle (V)',
    render: (s, colors) => (
      <>
        <rect               width={s / 2} height={s} fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW} />
        <rect x={s / 2}     width={s / 2} height={s} fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
      </>
    ),
  },
  {
    id: 'flying-geese',
    name: 'Flying Geese',
    render: (s, colors) => (
      <>
        <polygon points={`0,${s} ${s / 2},0 ${s},${s}`}   fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW} />
        <polygon points={`0,0 ${s / 2},0 0,${s}`}         fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
        <polygon points={`${s / 2},0 ${s},0 ${s},${s}`}   fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
      </>
    ),
  },
  {
    id: 'snowball',
    name: 'Snowball',
    render: (s, colors) => {
      const c = s * 0.28
      return (
        <>
          <polygon
            points={[
              `${c},0`, `${s - c},0`,
              `${s},${c}`, `${s},${s - c}`,
              `${s - c},${s}`, `${c},${s}`,
              `0,${s - c}`, `0,${c}`,
            ].join(' ')}
            fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW}
          />
          <polygon points={`0,0 ${c},0 0,${c}`}                     fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s - c},0 ${s},0 ${s},${c}`}           fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s},${s - c} ${s},${s} ${s - c},${s}`} fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`0,${s - c} ${c},${s} 0,${s}`}           fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
        </>
      )
    },
  },
  {
    id: 'bowtie',
    name: 'Bowtie',
    render: (s, colors) => {
      const cx = s / 2, cy = s / 2
      return (
        <>
          <polygon points={`0,0 ${cx},${cy} 0,${s}`}           fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s},0 ${s},${s} ${cx},${cy}`}     fill={colors?.a ?? FA} stroke={SK} strokeWidth={SW} />
          <polygon points={`0,0 ${s},0 ${cx},${cy}`}           fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`${cx},${cy} ${s},${s} 0,${s}`}     fill={colors?.b ?? FB} stroke={SK} strokeWidth={SW} />
        </>
      )
    },
  },
]

export function getPiece(id: string): PieceDef | undefined {
  return PIECES.find((p) => p.id === id)
}
