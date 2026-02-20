import type { Stop, Scenario } from '../lib/data/types'
import { extractStopDetails } from '../lib/data/loadStops'
import { Users, Ticket, Coins, HandCoins, StickyNote, Target } from 'lucide-react'

interface StopPanelProps {
  stop: Stop | null
  scenario: Scenario
}

export function StopPanel({ stop, scenario }: StopPanelProps) {
  if (!stop) {
    return (
      <div className="glass-panel p-xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted text-lg mb-sm">No stop selected</div>
          <div className="text-muted text-sm">Select a stop from the list to view details</div>
        </div>
      </div>
    )
  }

  const details = extractStopDetails(stop, scenario)

  const bulletItems = [
    { label: 'Capacity', value: details.capacity, Icon: Users },
    { label: 'Ticket Price', value: details.ticketPrice, Icon: Ticket },
    { label: 'Projected Gross', value: details.projectedGross, Icon: Coins },
    { label: 'Net/Guarantee', value: details.netGuarantee, Icon: HandCoins },
    { label: 'Notes', value: details.notes, Icon: StickyNote },
    { label: 'Market Rationale', value: details.marketRationale, Icon: Target }
  ]

  // Separate metrics from notes
  const metrics = bulletItems.slice(0, 4) // Capacity, Ticket Price, Gross, Net
  const notes = bulletItems.slice(4)      // Notes, Market Rationale

  return (
    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <h2 
            style={{ 
              fontSize: 'var(--font-size-2xl)', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text)',
              letterSpacing: 'var(--letter-spacing-tight)'
            }}
          >
            {stop.city}
          </h2>
          <span 
            style={{
              fontSize: 'var(--font-size-xs)',
              fontFamily: 'var(--font-family-mono)',
              color: 'var(--accent)',
              background: 'rgba(231, 209, 167, 0.1)',
              padding: 'var(--space-1) var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)'
            }}
          >
            {stop.countryCode}
          </span>
        </div>
        <h3 
          style={{ 
            fontSize: 'var(--font-size-lg)', 
            color: 'var(--accent-muted)',
            fontWeight: 'var(--font-weight-medium)'
          }}
        >
          {stop.venue}
        </h3>
        {stop.lat && stop.lng && (
          <div 
            style={{ 
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-family-mono)',
              marginTop: 'var(--space-2)'
            }}
          >
            {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
          </div>
        )}
      </div>

      {/* Scenario Indicator */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            Viewing:
          </span>
          <span 
            style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              padding: 'var(--space-1) var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              background: scenario === 'upside' 
                ? 'rgba(231, 209, 167, 0.1)' 
                : 'var(--panel)',
              color: scenario === 'upside' 
                ? 'var(--accent)' 
                : 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }}
          >
            {scenario === 'base' ? 'Base Scenario' : 'Upside Scenario'}
          </span>
        </div>
      </div>

      {/* Metrics Grid - Finance Dashboard Style */}
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-1)',
          marginBottom: 'var(--space-6)'
        }}
      >
        {metrics.map((item, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3)',
              background: 'rgba(12, 16, 24, 0.25)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.background = 'rgba(12, 16, 24, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'rgba(12, 16, 24, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <item.Icon 
                size={16} 
                style={{ 
                  color: 'var(--text-muted)', 
                  opacity: 0.7 
                }} 
              />
              <span 
                style={{ 
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--text-secondary)'
                }}
              >
                {item.label}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span 
                style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: item.value === 'TBD' ? 'var(--text-muted)' : 'var(--text)',
                  fontStyle: item.value === 'TBD' ? 'italic' : 'normal'
                }}
              >
                {item.value}
              </span>
              {item.value === 'TBD' && (
                <span 
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-family-mono)',
                    background: 'var(--panel)',
                    padding: 'var(--space-1)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  TBD
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Notes Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {notes.map((item, index) => (
          <div key={index}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <item.Icon 
                size={14} 
                style={{ 
                  color: 'var(--text-muted)', 
                  opacity: 0.7 
                }} 
              />
              <span 
                style={{ 
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--text-secondary)'
                }}
              >
                {item.label}
              </span>
            </div>
            <div 
              style={{ 
                fontSize: 'var(--font-size-sm)',
                color: item.value === 'TBD' ? 'var(--text-muted)' : 'var(--text-secondary)',
                lineHeight: 'var(--line-height-relaxed)',
                paddingLeft: 'var(--space-5)',
                fontStyle: item.value === 'TBD' ? 'italic' : 'normal'
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div 
        style={{
          marginTop: 'var(--space-6)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-muted)'
        }}
      >
        <span>Stop #{stop.order}</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  )
}