import React, { useMemo, useState } from 'react'
import Header from './Header'
import Form from './Form'
import Result from './Result'

const DEFAULT_ELIMINATION_RATE = 0.12

export default function AppContainer() {
  const [step, setStep] = useState('form')

  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')

  const [drinkMl, setDrinkMl] = useState('')
  const [drinkPct, setDrinkPct] = useState('')
  const [drinks, setDrinks] = useState([])

  const [error, setError] = useState('')

  const addDrink = () => {
    const ml = parseFloat(drinkMl)
    const pct = parseFloat(drinkPct)
    if (!ml || !pct) return
    setDrinks((d) => [...d, { ml, pct }])
    setDrinkMl('')
    setDrinkPct('')
  }

  const removeDrink = (i) => setDrinks((d) => d.filter((_, idx) => idx !== i))

  const totalGrams = useMemo(() => {
    return drinks.reduce((sum, { ml, pct }) => sum + ml * (pct / 100) * 0.789, 0)
  }, [drinks])

  const r = gender === 'male' ? 0.68 : 0.55

  const promile = useMemo(() => {
    const w = parseFloat(weight)
    if (!w || w <= 0) return 0
    return totalGrams / (w * r)
  }, [totalGrams, weight, r])

  const soberHours = promile > 0 ? promile / DEFAULT_ELIMINATION_RATE : 0

  const soberDate = useMemo(() => {
    if (soberHours <= 0) return null
    const now = new Date()
    return new Date(now.getTime() + soberHours * 3600 * 1000)
  }, [soberHours])

  const maxTimelineHours = Math.max(6, Math.min(24, soberHours))
  const timelinePercent = Math.min(100, (soberHours / maxTimelineHours) * 100)

  const validateAndProceed = () => {
    setError('')
    const w = parseFloat(weight)
    if (!w || w <= 0) {
      setError('Zadejte váhu (kg).')
      return
    }
    if (drinks.length === 0) {
      setError('Přidejte nápoj.')
      return
    }
    setStep('result')
  }

  return (
    <div>
      <Header />

      {step === 'form' && (
        <div className="form-page">
          <div className="calc-grid">
            <div>
              <Form
                gender={gender}
                setGender={setGender}
                weight={weight}
                setWeight={setWeight}
                height={height}
                setHeight={setHeight}
                drinkMl={drinkMl}
                setDrinkMl={setDrinkMl}
                drinkPct={drinkPct}
                setDrinkPct={setDrinkPct}
                addDrink={addDrink}
                drinks={drinks}
                removeDrink={removeDrink}
                validateAndProceed={validateAndProceed}
                error={error}
              />
            </div>
          </div>
        </div>
      )}

      {step === 'result' && (
        <Result
          promile={promile}
          totalGrams={totalGrams}
          timelinePercent={timelinePercent}
          maxTimelineHours={maxTimelineHours}
          soberHours={soberHours}
          soberDate={soberDate}
          gender={gender}
          weight={weight}
          height={height}
          onBack={() => setStep('form')}
          eliminationRate={DEFAULT_ELIMINATION_RATE}
        />
      )}
    </div>
  )
}
