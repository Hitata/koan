import { useState } from 'react'
import RunningPage from './pages/Running.jsx'
import BatTu2026 from './pages/BatTu2026.jsx'

const NAV_ITEMS = [
  { key: 'running', label: '🏃 Chạy Bộ' },
  { key: 'batu', label: '🔮 Bát Tự 2026' },
]

export default function App() {
  const [page, setPage] = useState('running')

  return (
    <div>
      {/* Top navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,253,247,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E8D5B5',
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 16px',
      }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            style={{
              padding: '7px 18px',
              borderRadius: 20,
              border: page === item.key ? '2px solid #8B4513' : '1px solid #D9C9AE',
              background: page === item.key
                ? 'linear-gradient(135deg, #FFF1D0, #FFEAB8)'
                : 'transparent',
              color: page === item.key ? '#7A4A0A' : '#8B7355',
              fontSize: 13,
              fontWeight: page === item.key ? 700 : 400,
              cursor: 'pointer',
              fontFamily: "'Segoe UI', sans-serif",
              transition: 'all 0.2s ease',
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {page === 'running' && <RunningPage />}
      {page === 'batu' && <BatTu2026 />}
    </div>
  )
}
