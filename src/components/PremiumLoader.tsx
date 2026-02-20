import { useEffect, useState } from 'react'

export type LoadingStage = 'boot' | 'data' | 'imagery' | 'viewer' | 'finalizing' | 'ready'

interface PremiumLoaderProps {
  stage: LoadingStage
  message?: string
  progress: number // 0..1
  show: boolean
}

const stageMessages: Record<LoadingStage, string> = {
  boot: 'Booting environment',
  data: 'Loading tour stops',
  imagery: 'Syncing earth imagery',
  viewer: 'Initializing globe renderer',
  finalizing: 'Calibrating camera',
  ready: 'Experience ready'
}

const stageChecklist = [
  { key: 'data', label: 'Stops loaded' },
  { key: 'imagery', label: 'Imagery ready' },
  { key: 'viewer', label: 'Globe ready' }
] as const

export function PremiumLoader({ stage, message, progress, show }: PremiumLoaderProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  // Smooth progress animation
  useEffect(() => {
    const startProgress = animatedProgress
    const targetProgress = progress
    const duration = 800 // ms
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      const currentProgress = startProgress + (targetProgress - startProgress) * eased
      
      setAnimatedProgress(currentProgress)
      
      if (t < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [progress, animatedProgress])

  const getChecklistItemState = (itemKey: string) => {
    const stageOrder: LoadingStage[] = ['boot', 'data', 'imagery', 'viewer', 'finalizing', 'ready']
    const currentIndex = stageOrder.indexOf(stage)
    const itemIndex = stageOrder.indexOf(itemKey as LoadingStage)
    
    if (currentIndex >= itemIndex) {
      return 'completed'
    }
    if (currentIndex === itemIndex - 1) {
      return 'active'
    }
    return 'pending'
  }

  if (!show) return null

  return (
    <div className="premium-loader">
      {/* Background layers */}
      <div className="premium-loader__background" />
      <div className="premium-loader__grain" />
      <div className="premium-loader__vignette" />
      
      {/* Ambient sweep animation */}
      <div className="premium-loader__sweep" />
      
      {/* Ghost UI preview */}
      <div className="premium-loader__ghost-ui">
        <div className="ghost-panel ghost-panel--left">
          <div className="ghost-line ghost-line--title" />
          <div className="ghost-line ghost-line--item" />
          <div className="ghost-line ghost-line--item" />
        </div>
        <div className="ghost-panel ghost-panel--right">
          <div className="ghost-line ghost-line--header" />
          <div className="ghost-line ghost-line--detail" />
          <div className="ghost-line ghost-line--detail" />
          <div className="ghost-line ghost-line--detail" />
        </div>
        <div className="ghost-shimmer" />
      </div>

      {/* Main loader card */}
      <div className="premium-loader__card">
        <div className="premium-loader__content">
          {/* Title section */}
          <div className="premium-loader__header">
            <h1 className="premium-loader__title">WORLD TOUR 2026</h1>
            <p className="premium-loader__subtitle">Premium Tour Pitch Experience</p>
          </div>

          {/* Progress section */}
          <div className="premium-loader__progress-section">
            <div className="premium-loader__progress-track">
              <div 
                className="premium-loader__progress-fill"
                style={{ 
                  transform: `scaleX(${animatedProgress})`,
                  transitionDuration: '0ms' // We handle animation manually
                }}
              />
            </div>
            <div className="premium-loader__progress-text">
              {Math.round(animatedProgress * 100)}%
            </div>
          </div>

          {/* Status message */}
          <div className="premium-loader__status">
            {message || stageMessages[stage]}
          </div>

          {/* Checklist */}
          <div className="premium-loader__checklist">
            {stageChecklist.map((item) => {
              const state = getChecklistItemState(item.key)
              return (
                <div 
                  key={item.key}
                  className={`premium-loader__checklist-item premium-loader__checklist-item--${state}`}
                >
                  <div className="premium-loader__check">
                    {state === 'completed' && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path 
                          d="M2 6L5 9L10 3" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {state === 'active' && <div className="premium-loader__pulse" />}
                  </div>
                  <span className="premium-loader__checklist-label">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}