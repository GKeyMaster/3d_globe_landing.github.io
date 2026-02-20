import type { Stop } from '../lib/data/types'

interface StopListProps {
  stops: Stop[]
  selectedStopId: string | null
  onSelectStop: (stopId: string) => void
}

export function StopList({ stops, selectedStopId, onSelectStop }: StopListProps) {
  if (stops.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
          No stops available
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel" style={{ padding: 'var(--space-5)' }}>
      <h3 
        style={{ 
          fontSize: 'var(--font-size-lg)', 
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--text)',
          marginBottom: 'var(--space-4)',
          letterSpacing: 'var(--letter-spacing-tight)'
        }}
      >
        Tour Stops
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {stops.map((stop) => {
          const isSelected = stop.id === selectedStopId
          
          return (
            <button
              key={stop.id}
              onClick={() => onSelectStop(stop.id)}
              className="glass-panel-subtle interactive"
              style={{
                padding: 'var(--space-3)',
                textAlign: 'left',
                border: isSelected 
                  ? '1px solid var(--accent)' 
                  : '1px solid var(--border)',
                background: isSelected 
                  ? 'rgba(231, 209, 167, 0.05)' 
                  : 'rgba(12, 16, 24, 0.35)',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
                boxShadow: isSelected 
                  ? '0 0 20px rgba(231, 209, 167, 0.1)' 
                  : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {/* Order Number */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    background: isSelected ? 'var(--accent)' : 'var(--panel)',
                    color: isSelected ? 'var(--bg)' : 'var(--text-secondary)'
                  }}
                >
                  {stop.order}
                </div>
                
                {/* Stop Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                    <span 
                      style={{ 
                        fontWeight: 'var(--font-weight-medium)',
                        color: isSelected ? 'var(--text)' : 'var(--text-secondary)',
                        fontSize: 'var(--font-size-sm)'
                      }}
                    >
                      {stop.city}
                    </span>
                    <span 
                      style={{ 
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-family-mono)'
                      }}
                    >
                      {stop.countryCode}
                    </span>
                  </div>
                  <div 
                    style={{ 
                      fontSize: 'var(--font-size-xs)',
                      marginTop: 'var(--space-1)',
                      color: isSelected ? 'var(--accent-muted)' : 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {stop.venue}
                  </div>
                </div>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div 
                    style={{ 
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--accent)'
                    }}
                  />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}