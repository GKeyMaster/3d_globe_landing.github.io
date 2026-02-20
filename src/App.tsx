import { useEffect, useRef, useState } from 'react'
import { createViewer } from './cesium/createViewer'
import type { Viewer } from 'cesium'

function App() {
  const globeRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!globeRef.current) return

    const initViewer = async () => {
      try {
        const viewer = await createViewer(globeRef.current!)
        viewerRef.current = viewer
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize Cesium viewer:', error)
        setIsLoading(false)
      }
    }

    initViewer()

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy()
      }
    }
  }, [])

  return (
    <div className="app">
      <div 
        id="globe" 
        ref={globeRef}
        className="globe-container"
      />
      
      <div id="ui" className="ui-overlay">
        {isLoading && (
          <div className="loading-veil">
            <div className="loading-spinner" />
            <div className="loading-text">Initializing Globe...</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App