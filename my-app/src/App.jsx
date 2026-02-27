import { useMemo, useState } from 'react'
import './App.css'

const DEFAULT_ELIMINATION_RATE = 0.15 // ‰ per hour (průměr)

export default function App() {
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
    // density of ethanol ~0.789 g/ml
    return drinks.reduce((sum, { ml, pct }) => sum + ml * (pct / 100) * 0.789, 0)
  }, [drinks])

  const r = gender === 'male' ? 0.68 : 0.55

  const promile = useMemo(() => {
    const w = parseFloat(weight)
    if (!w || w <= 0) return 0
    // Widmark: promile (‰) = grams_alcohol / (weight_kg * r)
    return totalGrams / (w * r)
  }, [totalGrams, weight, r])

  const soberHours = promile > 0 ? promile / DEFAULT_ELIMINATION_RATE : 0

  const soberDate = useMemo(() => {
    if (soberHours <= 0) return null
    const now = new Date()
    return new Date(now.getTime() + soberHours * 3600 * 1000)
  }, [soberHours])

  const formatHours = (hours) => {
    if (!hours || !isFinite(hours)) return '—'
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h} h ${m} min`
  }

  const formatDateShort = (d) => {
    if (!d) return '—'
    return d.toLocaleString()
  }

  const maxTimelineHours = Math.max(6, Math.min(24, soberHours))
  const timelinePercent = Math.min(100, (soberHours / maxTimelineHours) * 100)

  const validateAndProceed = () => {
    setError('')
    const w = parseFloat(weight)
    if (!w || w <= 0) {
      setError('Zadejte platnou váhu (kg).')
      return
    }
    if (drinks.length === 0) {
      setError('Přidejte alespoň jeden nápoj (ml a %).')
      return
    }
    setStep('result')
  }

  return (
    <div className="calculator">
      <h2>Alkohol kalkulačka</h2>

      {step === 'form' && (
        <div className="form-page">
          <div className="calc-grid">
            <div>
              <div className="calc-form">
                <div className="field">
                  <label>Pohlaví</label>
                  <div className="help">Položte, prosím, jaké je vaše pohlaví - ovlivňuje distribuci alkoholu v těle.</div>
                  <div className="gender-group">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                      />
                      Muž
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                      />
                      Žena
                    </label>
                  </div>
                </div>

                <div className="field">
                  <label>Váha (kg)</label>
                  <div className="help">Zadejte svou aktuální tělesnou hmotnost v kilogramech. Použije se ve výpočtu Widmarka.</div>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="např. 80"
                  />
                </div>

                <div className="field">
                  <label>Výška (cm) — volitelné</label>
                  <div className="help">Výška se nepotřebuje pro Widmarkův vzorec, ale může sloužit k další diagnostice nebo zobrazení.</div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="volitelné"
                  />
                </div>

                <div className="field">
                  <label>Přidat nápoj</label>
                  <div className="help">Zadejte objem nápoje (ml) a obsah alkoholu v procentech (% obj.).</div>
                  <div className="row">
                    <input
                      type="number"
                      placeholder="ml"
                      value={drinkMl}
                      onChange={(e) => setDrinkMl(e.target.value)}
                      style={{ width: '110px' }}
                    />
                    <input
                      type="number"
                      placeholder="% obj."
                      value={drinkPct}
                      onChange={(e) => setDrinkPct(e.target.value)}
                      style={{ width: '110px' }}
                    />
                    <button type="button" className="calculate" onClick={addDrink}>
                      Přidat
                    </button>
                  </div>
                  <div className="note">Např. 500 ml piva 5% → ml=500, % = 5</div>
                </div>

                <div className="field">
                  <label>Seznam nápojů</label>
                  <div className="help">Seznam nápojů zahrnutých do výpočtu. Můžete odebrat položky.</div>
                  <div>
                    {drinks.length === 0 && <div className="note">Žádné nápoje</div>}
                    {drinks.map((d, i) => (
                      <div key={i} className="row" style={{ justifyContent: 'space-between' }}>
                        <div>
                          {d.ml} ml · {d.pct}% · {(d.ml * (d.pct / 100) * 0.789).toFixed(1)} g alkoholu
                        </div>
                        <div>
                          <button onClick={() => removeDrink(i)}>Odebrat</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <div className="note" style={{ color: '#ffb3b3' }}>{error}</div>}

                <div className="actions">
                  <button className="calculate" onClick={validateAndProceed}>
                    Vypočítat
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="result">
                <div className="promile">Preview: {promile.toFixed(3)} ‰</div>
                <div className="promile-sub">Po zadání osnovních údajů a nápojů uvidíte podrobný výsledek.</div>
                <div className="note">Celkem čistého alkoholu: {totalGrams.toFixed(1)} g</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="result-page">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Výsledek</h3>
            <div>
              <button className="back-button" onClick={() => setStep('form')}>Zpět</button>
            </div>
          </div>

          <div className="result-panel">
            <div className="promile" style={{ marginBottom: '0.25rem' }}>{promile.toFixed(3)} ‰</div>
            <div className="promile-sub">Widmarkův výpočet. Celkem {totalGrams.toFixed(1)} g alkoholu.</div>

            <div className="graph-area">
              <div className="timeline" aria-hidden>
                <div className="bar" style={{ width: `${timelinePercent}%` }} />
                <div className="marker" style={{ left: '0%' }} />
              </div>
              <div className="time-labels">
                <div>Teď</div>
                <div>{formatHours(maxTimelineHours)} (škála)</div>
              </div>
            </div>

            <div className="result-text">
              <div className="sober-badge">Čas do střízlivění: {formatHours(soberHours)}</div>
              <div className="note">Odhadovaný čas, kdy budete střízliví: {formatDateShort(soberDate)}</div>
              <div className="note">Použité parametry: pohlaví = {gender}, váha = {weight} kg{height ? `, výška = ${height} cm` : ''}.</div>
              <div className="note">Eliminační rychlost použita = {DEFAULT_ELIMINATION_RATE} ‰/h (průměr).</div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
