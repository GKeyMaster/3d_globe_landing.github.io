import { useState, useRef, useEffect } from 'react'

export function CreditsPill() {
  const [isExpanded, setIsExpanded] = useState(false)
  const creditContainerRef = useRef<HTMLDivElement>(null)

  // Provide the credit container to Cesium
  useEffect(() => {
    if (creditContainerRef.current) {
      // Make the container available globally for Cesium
      ;(window as any).cesiumCreditContainer = creditContainerRef.current
    }
  }, [])

  return (
    <div className="relative">
      {/* Credits Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="glass-panel-subtle interactive"
        style={{
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(12, 16, 24, 0.25)',
          backdropFilter: 'var(--blur-sm)',
          transition: 'all var(--transition-fast)'
        }}
      >
        Credits
      </button>

      {/* Expanded Credits Panel */}
      {isExpanded && (
        <div
          className="absolute bottom-full right-0 mb-2 glass-panel"
          style={{
            minWidth: '280px',
            maxWidth: '400px',
            padding: 'var(--space-3)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-muted)',
            lineHeight: 'var(--line-height-relaxed)',
            animation: 'fadeInUp var(--transition-fast) ease-out forwards'
          }}
        >
          <div className="space-y-2">
            <div>
              <strong style={{ color: 'var(--text-secondary)' }}>Imagery:</strong>
              <br />
              NASA EOSDIS Global Imagery Browse Services (GIBS)
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)' }}>3D Engine:</strong>
              <br />
              CesiumJS - Open Source Geospatial Platform
            </div>
            
            {/* Cesium Credits Container */}
            <div 
              ref={creditContainerRef}
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-muted)',
                opacity: 0.7
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}