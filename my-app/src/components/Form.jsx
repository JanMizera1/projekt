import React from 'react'

export default function Form(props) {
  const {
    gender,
    setGender,
    weight,
    setWeight,
    height,
    setHeight,
    drinkMl,
    setDrinkMl,
    drinkPct,
    setDrinkPct,
    addDrink,
    drinks,
    removeDrink,
    validateAndProceed,
    error,
  } = props

  return (
    <div>
      <div className="calc-form">
        <div className="field">
          <label>Pohlaví</label>
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
          <input
            type="number"
            min="1"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="80"
          />
        </div>

        <div className="field">
          <label>Výška (cm)</label>
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
          <label>Kolik ml / %</label>
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
              placeholder="%"
              value={drinkPct}
              onChange={(e) => setDrinkPct(e.target.value)}
              style={{ width: '110px' }}
            />
            <button type="button" className="calculate" onClick={addDrink}>
              Přidat
            </button>
          </div>
        </div>

        <div className="field">
          <label>Nápoje</label>
          <div>
            {drinks.length === 0 && <div className="note">Žádné</div>}
            {drinks.map((d, i) => (
              <div key={i} className="row" style={{ justifyContent: 'space-between' }}>
                <div>
                  {d.ml} ml · {d.pct}% · {(d.ml * (d.pct / 100) * 0.789).toFixed(1)} g
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
  )
}
