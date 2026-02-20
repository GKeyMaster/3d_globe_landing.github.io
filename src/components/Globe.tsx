import { useEffect, useRef, useState } from 'react'
import type { Viewer } from 'cesium'
import { createViewer } from '../lib/cesium/createViewer'

interface GlobeProps {
  onReady?: (viewer: Viewer) => void
}

export function Globe({ onReady }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const creditContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    let mounted = true

    const initializeViewer = async () => {
      try {
        // Create Cesium viewer with credit container
        const result = await createViewer(
          containerRef.current!, 
          creditContainerRef.current || undefined
        )
        
        if (!mounted) {
          result.viewer.destroy()
          return
        }

        viewerRef.current = result.viewer
        
        // Wait for imagery to be ready
        await result.isReady
        
        if (!mounted) return

        // Fade in the globe
        if (containerRef.current) {
          containerRef.current.style.opacity = '0'
          containerRef.current.style.transition = 'opacity 300ms ease-out'
          
          // Small delay to ensure everything is rendered
          setTimeout(() => {
            if (containerRef.current && mounted) {
              containerRef.current.style.opacity = '1'
              setIsLoading(false)
              onReady?.(result.viewer)
            }
          }, 100)
        }
      } catch (error) {
        console.error('Failed to initialize Cesium viewer:', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initializeViewer()

    // Cleanup on unmount
    return () => {
      mounted = false
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [onReady])

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="glass-panel" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div 
              style={{ 
                fontSize: 'var(--font-size-lg)', 
                color: 'var(--text)', 
                marginBottom: 'var(--space-2)' 
              }}
            >
              Loading experience...
            </div>
            <div 
              style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--text-muted)' 
              }}
            >
              Preparing high-resolution imagery
            </div>
          </div>
        </div>
      )}

      {/* Cesium Container */}
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0 // Start invisible, fade in when ready
        }}
      />

      {/* Hidden Credit Container */}
      <div 
        ref={creditContainerRef}
        style={{ display: 'none' }}
      />
    </>
  )
}