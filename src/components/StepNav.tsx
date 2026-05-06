import { NavLink } from 'react-router-dom'

const STEPS = [
  { number: 1, path: '/step/1', label: 'Dimensions' },
  { number: 2, path: '/step/2', label: 'Square Size' },
  { number: 3, path: '/step/3', label: 'Quilt Builder' },
  { number: 4, path: '/step/4', label: 'Add Color' },
  { number: 5, path: '/step/5', label: 'Calculation' },
  { number: 6, path: '/step/6', label: 'Export' },
]

type StepState = 'completed' | 'active' | 'upcoming'

function stepState(stepNumber: number, current: number): StepState {
  if (stepNumber < current) return 'completed'
  if (stepNumber === current) return 'active'
  return 'upcoming'
}

interface StepNavProps {
  variant: 'progress' | 'sidebar'
  currentStep: number
}

export function StepNav({ variant, currentStep }: StepNavProps) {
  if (variant === 'progress') {
    return (
      <nav className="step-progress" aria-label="Progress">
        {STEPS.map((step, i) => {
          const state = stepState(step.number, currentStep)
          const connectorState = state === 'upcoming' ? 'upcoming' : 'done'
          return (
            <div key={step.path} style={{ display: 'contents' }}>
              {i > 0 && (
                <div
                  className={`step-progress__connector step-progress__connector--${connectorState}`}
                  aria-hidden="true"
                />
              )}
              <div className="step-progress__item">
                <NavLink
                  to={step.path}
                  className={`step-progress__dot step-progress__dot--${state}`}
                  aria-label={`Step ${step.number}: ${step.label}`}
                  aria-current={state === 'active' ? 'step' : undefined}
                >
                  <span className="step-progress__number" aria-hidden="true">
                    {step.number}
                  </span>
                </NavLink>
                <span className={`step-progress__label step-progress__label--${state}`}>
                  {step.label}
                </span>
              </div>
            </div>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="step-sidebar" aria-label="Steps">
      {STEPS.map((step) => {
        const state = stepState(step.number, currentStep)
        return (
          <NavLink
            key={step.path}
            to={step.path}
            className={`step-sidebar__item step-sidebar__item--${state}`}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            <span className={`step-sidebar__dot step-sidebar__dot--${state}`} aria-hidden="true" />
            <span className="step-sidebar__label">{step.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
