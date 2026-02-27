import React from 'react'

export default function Result({ promile, totalGrams, timelinePercent, maxTimelineHours, soberHours, soberDate, gender, weight, height, onBack, eliminationRate }) {
  const formatHours = (hours) => {
    if (!hours || !isFinite(hours)) return '—'
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h} h ${m} min`
  }

  const formatDateShort = (d) => (d ? d.toLocaleString() : '—')

  return (
    <div className="result-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Výsledek</h3>
        <div>
          <button className="back-button" onClick={onBack}>Zpět</button>
        </div>
      </div>

      <div className="result-panel">
        <div className="promile" style={{ marginBottom: '0.25rem' }}>{promile.toFixed(3)} ‰</div>
        <div className="promile-sub">Widmarkův výpočet. Celkem {totalGrams.toFixed(1)} g alkoholu.</div>

        <div className="graph-area">
          <div className="timeline" aria-hidden>
            <div className="bar" style={{ width: `${timelinePercent}%`, animation: 'fillBar 1000ms ease-in-out forwards' }} />
            <div className="marker" style={{ left: '0%' }} />
          </div>
          <div className="time-labels">
            <div>Teď</div>
            <div>{formatHours(maxTimelineHours)} (škála)</div>
          </div>
        </div>

        <div className="result-text">
          <div className="sober-badge">Čas do střízlivění: {formatHours(soberHours)}</div>
          <div className="note">Odhad střízlivosti: {formatDateShort(soberDate)}</div>
          <div className="note">Parametry: {gender}, {weight} kg{height ? `, ${height} cm` : ''}.</div>
          <div className="note">Eliminační rychlost = {eliminationRate} ‰/h.</div>
        </div>

      </div>
    </div>
  )
}
