import type { ReactNode } from 'react'

const FA = '#E8E4DC'   // fabric A — warm light
const FB = '#FAF6F0'   // fabric B — near white
const SK = '#3D2B1F'   // stroke (inkwell)
const SW = 0.75        // stroke width

export interface PieceDef {
  id: string
  name: string
  render: (size: number) => ReactNode
}

export const PIECES: PieceDef[] = [
  {
    id: 'square',
    name: 'Solid Square',
    render: (s) => (
      <rect width={s} height={s} fill={FA} stroke={SK} strokeWidth={SW} />
    ),
  },
  {
    id: 'hst',
    name: 'Half-Square Triangle',
    render: (s) => (
      <>
        <polygon points={`0,0 ${s},0 0,${s}`}       fill={FA} stroke={SK} strokeWidth={SW} />
        <polygon points={`${s},0 ${s},${s} 0,${s}`} fill={FB} stroke={SK} strokeWidth={SW} />
      </>
    ),
  },
  {
    id: 'qst',
    name: 'Quarter-Square Triangle',
    render: (s) => {
      const cx = s / 2, cy = s / 2
      return (
        <>
          <polygon points={`0,0 ${s},0 ${cx},${cy}`}       fill={FA} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s},0 ${s},${s} ${cx},${cy}`} fill={FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s},${s} 0,${s} ${cx},${cy}`} fill={FA} stroke={SK} strokeWidth={SW} />
          <polygon points={`0,${s} 0,0 ${cx},${cy}`}       fill={FB} stroke={SK} strokeWidth={SW} />
        </>
      )
    },
  },
  {
    id: 'rect-h',
    name: 'Rectangle (H)',
    render: (s) => (
      <>
        <rect               width={s} height={s / 2} fill={FA} stroke={SK} strokeWidth={SW} />
        <rect y={s / 2}     width={s} height={s / 2} fill={FB} stroke={SK} strokeWidth={SW} />
      </>
    ),
  },
  {
    id: 'rect-v',
    name: 'Rectangle (V)',
    render: (s) => (
      <>
        <rect               width={s / 2} height={s} fill={FA} stroke={SK} strokeWidth={SW} />
        <rect x={s / 2}     width={s / 2} height={s} fill={FB} stroke={SK} strokeWidth={SW} />
      </>
    ),
  },
  {
    id: 'flying-geese',
    name: 'Flying Geese',
    render: (s) => (
      <>
        {/* main goose triangle */}
        <polygon points={`0,${s} ${s / 2},0 ${s},${s}`}       fill={FA} stroke={SK} strokeWidth={SW} />
        {/* left sky */}
        <polygon points={`0,0 ${s / 2},0 0,${s}`}             fill={FB} stroke={SK} strokeWidth={SW} />
        {/* right sky */}
        <polygon points={`${s / 2},0 ${s},0 ${s},${s}`}       fill={FB} stroke={SK} strokeWidth={SW} />
      </>
    ),
  },
  // ── Agent-recommended additions ──────────────────────────────
  {
    id: 'snowball',
    name: 'Snowball',
    render: (s) => {
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
            fill={FA} stroke={SK} strokeWidth={SW}
          />
          <polygon points={`0,0 ${c},0 0,${c}`}                     fill={FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s - c},0 ${s},0 ${s},${c}`}           fill={FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s},${s - c} ${s},${s} ${s - c},${s}`} fill={FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`0,${s - c} ${c},${s} 0,${s}`}           fill={FB} stroke={SK} strokeWidth={SW} />
        </>
      )
    },
  },
  {
    id: 'bowtie',
    name: 'Bowtie',
    render: (s) => {
      const cx = s / 2, cy = s / 2
      return (
        <>
          <polygon points={`0,0 ${cx},${cy} 0,${s}`}           fill={FA} stroke={SK} strokeWidth={SW} />
          <polygon points={`${s},0 ${s},${s} ${cx},${cy}`}     fill={FA} stroke={SK} strokeWidth={SW} />
          <polygon points={`0,0 ${s},0 ${cx},${cy}`}           fill={FB} stroke={SK} strokeWidth={SW} />
          <polygon points={`${cx},${cy} ${s},${s} 0,${s}`}     fill={FB} stroke={SK} strokeWidth={SW} />
        </>
      )
    },
  },
]

export function getPiece(id: string): PieceDef | undefined {
  return PIECES.find((p) => p.id === id)
}
