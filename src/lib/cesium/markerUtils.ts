import {
  Viewer,
  Entity,
  Cartesian3,
  VerticalOrigin,
  HorizontalOrigin,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  ConstantProperty
} from 'cesium'
import type { Stop } from '../data/types'

/**
 * Creates a high-resolution, premium marker icon for venue locations
 */
export function createMarkerCanvas(isSelected = false): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const size = isSelected ? 48 : 40 // Much higher resolution
  canvas.width = size
  canvas.height = size
  
  const ctx = canvas.getContext('2d')!
  const center = size / 2
  const radius = isSelected ? 20 : 16
  
  // Enable high-quality rendering
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  
  // Create gradient for premium look
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius)
  if (isSelected) {
    gradient.addColorStop(0, '#F4E6C7') // Light champagne center
    gradient.addColorStop(0.7, '#E7D1A7') // Main champagne
    gradient.addColorStop(1, '#D4BE87') // Darker champagne edge
  } else {
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.9)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.7)')
  }
  
  // Outer glow/shadow
  ctx.shadowColor = isSelected ? '#E7D1A7' : 'rgba(255, 255, 255, 0.8)'
  ctx.shadowBlur = isSelected ? 8 : 6
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  
  // Main circle with gradient
  ctx.beginPath()
  ctx.arc(center, center, radius, 0, 2 * Math.PI)
  ctx.fillStyle = gradient
  ctx.fill()
  
  // Reset shadow for inner elements
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  
  // Inner ring for depth
  ctx.beginPath()
  ctx.arc(center, center, radius - 3, 0, 2 * Math.PI)
  ctx.strokeStyle = isSelected ? 'rgba(26, 31, 46, 0.3)' : 'rgba(12, 16, 24, 0.4)'
  ctx.lineWidth = 1
  ctx.stroke()
  
  // Center dot with subtle gradient
  const centerGradient = ctx.createRadialGradient(center, center, 0, center, center, 4)
  if (isSelected) {
    centerGradient.addColorStop(0, '#1A1F2E')
    centerGradient.addColorStop(1, 'rgba(26, 31, 46, 0.8)')
  } else {
    centerGradient.addColorStop(0, 'rgba(12, 16, 24, 0.9)')
    centerGradient.addColorStop(1, 'rgba(12, 16, 24, 0.6)')
  }
  
  ctx.beginPath()
  ctx.arc(center, center, 4, 0, 2 * Math.PI)
  ctx.fillStyle = centerGradient
  ctx.fill()
  
  // Highlight dot for premium feel
  ctx.beginPath()
  ctx.arc(center - 1, center - 1, 1.5, 0, 2 * Math.PI)
  ctx.fillStyle = isSelected ? 'rgba(244, 230, 199, 0.8)' : 'rgba(255, 255, 255, 0.6)'
  ctx.fill()
  
  return canvas
}

/**
 * Creates a Cesium Entity for a venue marker
 */
export function createVenueMarker(stop: Stop, isSelected = false): Entity {
  const position = Cartesian3.fromDegrees(stop.lng ?? 0, stop.lat ?? 0)
  const canvas = createMarkerCanvas(isSelected)
  
  return new Entity({
    id: stop.id,
    position: position,
    billboard: {
      image: new ConstantProperty(canvas),
      width: canvas.width,
      height: canvas.height,
      verticalOrigin: VerticalOrigin.BOTTOM,
      horizontalOrigin: HorizontalOrigin.CENTER,
      disableDepthTestDistance: Number.POSITIVE_INFINITY, // Always visible
      scale: 1.0,
      pixelOffset: new Cartesian3(0, -5, 0) // Slight offset for better positioning
    },
    // Store stop data for easy access
    properties: {
      stopId: stop.id,
      city: stop.city,
      venue: stop.venue,
      isVenueMarker: true
    }
  })
}

/**
 * Manages venue markers on the Cesium globe
 */
export class VenueMarkerManager {
  private viewer: Viewer
  private markers: Map<string, Entity> = new Map()
  private clickHandler: ScreenSpaceEventHandler | null = null
  private onMarkerClick: ((stopId: string) => void) | null = null
  private hoveredEntity: Entity | null = null

  constructor(viewer: Viewer) {
    this.viewer = viewer
    this.setupClickHandler()
  }

  /**
   * Sets up click handling for markers
   */
  private setupClickHandler(): void {
    this.clickHandler = new ScreenSpaceEventHandler(this.viewer.scene.canvas)
    
    // Handle clicks
    this.clickHandler.setInputAction((event: any) => {
      const pickedObject = this.viewer.scene.pick(event.position)
      
      if (defined(pickedObject) && defined(pickedObject.id)) {
        const entity = pickedObject.id as Entity
        
        // Check if this is a venue marker
        if (entity.properties?.isVenueMarker?.getValue()) {
          const stopId = entity.properties.stopId.getValue()
          console.log(`[Markers] Clicked venue marker: ${stopId}`)
          
          if (this.onMarkerClick) {
            this.onMarkerClick(stopId)
          }
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK)

    // Handle mouse move for hover effects
    this.clickHandler.setInputAction((event: any) => {
      const pickedObject = this.viewer.scene.pick(event.endPosition)
      
      if (defined(pickedObject) && defined(pickedObject.id)) {
        const entity = pickedObject.id as Entity
        
        // Check if this is a venue marker
        if (entity.properties?.isVenueMarker?.getValue()) {
          if (this.hoveredEntity !== entity) {
            // Reset previous hovered entity
            if (this.hoveredEntity && this.hoveredEntity.billboard) {
              this.hoveredEntity.billboard.scale = new ConstantProperty(1.0)
            }
            
            // Set new hovered entity
            this.hoveredEntity = entity
            if (entity.billboard) {
              entity.billboard.scale = new ConstantProperty(1.1) // Slight scale up on hover
            }
            
            // Change cursor to pointer
            this.viewer.canvas.style.cursor = 'pointer'
          }
        } else {
          this.clearHover()
        }
      } else {
        this.clearHover()
      }
    }, ScreenSpaceEventType.MOUSE_MOVE)
  }

  /**
   * Clears hover state
   */
  private clearHover(): void {
    if (this.hoveredEntity && this.hoveredEntity.billboard) {
      this.hoveredEntity.billboard.scale = new ConstantProperty(1.0)
    }
    this.hoveredEntity = null
    this.viewer.canvas.style.cursor = 'default'
  }

  /**
   * Sets the callback for when a marker is clicked
   */
  setOnMarkerClick(callback: (stopId: string) => void): void {
    this.onMarkerClick = callback
  }

  /**
   * Adds or updates markers for the given stops
   */
  updateMarkers(stops: Stop[], selectedStopId: string | null): void {
    console.log(`[Markers] Updating markers for ${stops.length} stops`)
    
    // Remove markers that are no longer needed
    const currentStopIds = new Set(stops.map(stop => stop.id))
    for (const [stopId, entity] of this.markers) {
      if (!currentStopIds.has(stopId)) {
        this.viewer.entities.remove(entity)
        this.markers.delete(stopId)
      }
    }

    // Add or update markers for current stops
    for (const stop of stops) {
      const isSelected = stop.id === selectedStopId
      const existingMarker = this.markers.get(stop.id)

      if (existingMarker) {
        // Update existing marker if selection state changed
        if (existingMarker.billboard) {
          existingMarker.billboard.image = new ConstantProperty(createMarkerCanvas(isSelected))
        }
      } else {
        // Create new marker
        const marker = createVenueMarker(stop, isSelected)
        this.viewer.entities.add(marker)
        this.markers.set(stop.id, marker)
      }
    }
  }

  /**
   * Updates the selection state of markers
   */
  updateSelection(selectedStopId: string | null): void {
    for (const [stopId, entity] of this.markers) {
      const isSelected = stopId === selectedStopId
      if (entity.billboard) {
        entity.billboard.image = new ConstantProperty(createMarkerCanvas(isSelected))
      }
    }
  }

  /**
   * Gets a marker by stop ID
   */
  getMarker(stopId: string): Entity | undefined {
    return this.markers.get(stopId)
  }

  /**
   * Gets all marker entities
   */
  getAllMarkers(): Entity[] {
    return Array.from(this.markers.values())
  }

  /**
   * Cleans up resources
   */
  destroy(): void {
    this.clearHover()
    
    if (this.clickHandler) {
      this.clickHandler.destroy()
      this.clickHandler = null
    }
    
    // Remove all markers
    for (const entity of this.markers.values()) {
      this.viewer.entities.remove(entity)
    }
    this.markers.clear()
  }
}