import React from 'react'

export default function Header() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
      <img src="/vite.svg" alt="logo" style={{ height: 48 }} />
      <div>
        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Alkohol kalkulačka</div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Rychlý odhad promile a času do střízlivění</div>
      </div>
    </header>
  )
}
