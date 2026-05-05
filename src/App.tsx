import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from '@/components/RootLayout'
import StepDimensions from '@/pages/StepDimensions'
import StepCalculator from '@/pages/StepCalculator'
import StepBuilder from '@/pages/StepBuilder'
import StepColor from '@/pages/StepColor'
import StepCalculation from '@/pages/StepCalculation'
import StepExport from '@/pages/StepExport'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Navigate to="/step/1" replace />} />
          <Route path="step/1" element={<StepDimensions />} />
          <Route path="step/2" element={<StepCalculator />} />
          <Route path="step/3" element={<StepBuilder />} />
          <Route path="step/4" element={<StepColor />} />
          <Route path="step/5" element={<StepCalculation />} />
          <Route path="step/6" element={<StepExport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
