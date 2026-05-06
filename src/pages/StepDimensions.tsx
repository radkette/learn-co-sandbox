import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { useQuiltStore } from '@/store/quiltStore'

const GRID_SQUARE_TOOLTIP =
  'A grid square is the finished size of one patch in your quilt — ' +
  'the measurement after all seams are sewn. Common sizes are 2", 3", 4", 4.5", ' +
  'and 6". Smaller squares give more detail; larger squares come together faster.'

interface FormErrors {
  width?: string
  height?: string
  squareSize?: string
}

function parsePositiveNumber(raw: string): number | null {
  const n = parseFloat(raw)
  return isFinite(n) && n > 0 ? n : null
}

function validate(width: string, height: string, squareSize: string): FormErrors {
  const errors: FormErrors = {}
  if (!parsePositiveNumber(width))
    errors.width = 'Enter a width greater than 0.'
  if (!parsePositiveNumber(height))
    errors.height = 'Enter a height greater than 0.'
  const sq = parsePositiveNumber(squareSize)
  if (!sq) {
    errors.squareSize = 'Enter a square size greater than 0.'
  } else {
    const w = parsePositiveNumber(width)
    const h = parsePositiveNumber(height)
    if (w && sq > w) errors.squareSize = "Square size can't be larger than the quilt width."
    else if (h && sq > h) errors.squareSize = "Square size can't be larger than the quilt height."
    else if (sq < 0.5) errors.squareSize = 'Minimum square size is 0.5 inches.'
  }
  return errors
}

export default function StepDimensions() {
  const navigate = useNavigate()
  const { dimensions, setDimensions } = useQuiltStore()

  const [width, setWidth] = useState(dimensions.widthIn === '' ? '' : String(dimensions.widthIn))
  const [height, setHeight] = useState(dimensions.heightIn === '' ? '' : String(dimensions.heightIn))
  const [squareSize, setSquareSize] = useState(
    dimensions.approxSquareIn === '' ? '' : String(dimensions.approxSquareIn),
  )
  const [seamAllowance, setSeamAllowance] = useState<number>(dimensions.seamAllowance ?? 0.25)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState({ width: false, height: false, squareSize: false })

  function handleBlur(field: keyof typeof touched) {
    setTouched((t) => ({ ...t, [field]: true }))
    const errs = validate(width, height, squareSize)
    setErrors(errs)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ width: true, height: true, squareSize: true })
    const errs = validate(width, height, squareSize)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setDimensions({
      widthIn: parsePositiveNumber(width)!,
      heightIn: parsePositiveNumber(height)!,
      approxSquareIn: parsePositiveNumber(squareSize)!,
      seamAllowance,
    })
    navigate('/step/2')
  }

  return (
    <Card variant="airy" style={{ maxWidth: 520 }}>
      <p className="text-eyebrow" style={{ marginBottom: 8 }}>Step 1 of 6</p>
      <h1 className="heading-display" style={{ marginBottom: 8 }}>Quilt Dimensions</h1>
      <p className="text-body text-muted" style={{ marginBottom: 28 }}>
        Enter your target finished size. We'll find a square size that divides evenly.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Finished size */}
        <fieldset style={{ border: 'none', padding: 0, margin: '0 0 24px' }}>
          <legend className="text-label" style={{ marginBottom: 12, display: 'block' }}>
            Finished quilt size <span className="text-muted" style={{ fontWeight: 400 }}>(inches)</span>
          </legend>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label" htmlFor="quilt-width">Width</label>
              <input
                id="quilt-width"
                className={['field-input', touched.width && errors.width ? 'field-input--error' : ''].join(' ')}
                type="number"
                inputMode="decimal"
                min="1"
                step="0.5"
                placeholder="60"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                onBlur={() => handleBlur('width')}
                aria-describedby={errors.width ? 'width-error' : undefined}
              />
              {touched.width && errors.width && (
                <p id="width-error" className="field-error">{errors.width}</p>
              )}
            </div>
            <span style={{ paddingTop: 30, color: 'var(--color-walnut)', fontWeight: 500, fontSize: 18 }}>×</span>
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label" htmlFor="quilt-height">Height</label>
              <input
                id="quilt-height"
                className={['field-input', touched.height && errors.height ? 'field-input--error' : ''].join(' ')}
                type="number"
                inputMode="decimal"
                min="1"
                step="0.5"
                placeholder="80"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                onBlur={() => handleBlur('height')}
                aria-describedby={errors.height ? 'height-error' : undefined}
              />
              {touched.height && errors.height && (
                <p id="height-error" className="field-error">{errors.height}</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Square size */}
        <div className="field" style={{ marginBottom: 32 }}>
          <label className="field-label" htmlFor="square-size" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Approximate grid square size
            <span className="text-muted" style={{ fontWeight: 400 }}>(inches)</span>
            <Tooltip content={GRID_SQUARE_TOOLTIP} />
          </label>
          <input
            id="square-size"
            className={['field-input', 'field-input--short', touched.squareSize && errors.squareSize ? 'field-input--error' : ''].join(' ')}
            type="number"
            inputMode="decimal"
            min="0.5"
            step="0.5"
            placeholder="4.5"
            value={squareSize}
            onChange={(e) => setSquareSize(e.target.value)}
            onBlur={() => handleBlur('squareSize')}
            aria-describedby={errors.squareSize ? 'square-error' : 'square-hint'}
          />
          {touched.squareSize && errors.squareSize ? (
            <p id="square-error" className="field-error">{errors.squareSize}</p>
          ) : (
            <p id="square-hint" className="field-hint">
              Whole or half-inch values work best — e.g. 3, 4.5, 6
            </p>
          )}
        </div>

        {/* Seam allowance picker */}
        <div style={{ marginBottom: 32 }}>
          <p className="text-label" style={{ marginBottom: 8 }}>Seam allowance</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { label: '¼"', value: 0.25 },
              { label: '⅜"', value: 0.375 },
              { label: '½"', value: 0.5 },
            ] as const).map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSeamAllowance(value)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  border: seamAllowance === value
                    ? '2px solid var(--color-sage, #7A9A7A)'
                    : '1.5px solid var(--color-border, #C0A882)',
                  background: seamAllowance === value
                    ? 'var(--color-sage-light, #EBF0EB)'
                    : 'transparent',
                  color: seamAllowance === value
                    ? 'var(--color-sage-dark, #3A5A3A)'
                    : 'var(--color-walnut, #7A5C40)',
                  fontWeight: seamAllowance === value ? 600 : 400,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="primary">
          Calculate square size →
        </Button>
      </form>
    </Card>
  )
}
