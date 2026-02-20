import { useEffect, useRef, useState } from 'react'
import { createViewer } from './cesium/createViewer'

function App() {
  const globeRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!globeRef.current) return

    let viewer: any = null

    const initializeGlobe = async () => {
      try {
        viewer = await createViewer(globeRef.current!)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize Cesium viewer:', error)
        setIsLoading(false)
      }
    }

    initializeGlobe()

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy()
      }
    }
  }, [])

  return (
    <div className="app">
      <div 
        ref={globeRef} 
        id="globe" 
        className="globe-container"
      />
      
      <div className="overlay-container">
        {/* Future UI overlay components will go here */}
      </div>

      {isLoading && (
        <div className="loading-veil">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Loading Earth...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App