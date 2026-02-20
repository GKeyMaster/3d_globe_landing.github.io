import {
  Viewer,
  Entity,
  Cartesian3,
  Color,
  PolylineGlowMaterialProperty,
  ArcType,
  ConstantProperty
} from 'cesium'
import type { Stop } from '../data/types'

/**
 * Premium route visualization utilities for connecting tour stops
 */

/**
 * Creates elegant route polylines connecting tour stops in order
 */
export class RouteManager {
  private viewer: Viewer
  private routeEntities: Entity[] = []

  constructor(viewer: Viewer) {
    this.viewer = viewer
  }

  /**
   * Creates and adds route polylines connecting stops in tour order
   */
  addTourRoute(stops: Stop[]): void {
    this.clearRoutes()

    if (stops.length < 2) {
      console.log('[Route] Need at least 2 stops to create route')
      return
    }

    // Sort stops by order to ensure correct routing
    const sortedStops = [...stops].sort((a, b) => a.order - b.order)
    console.log(`[Route] Creating route for ${sortedStops.length} stops`)

    // Create route segments between consecutive stops
    for (let i = 0; i < sortedStops.length - 1; i++) {
      const fromStop = sortedStops[i]
      const toStop = sortedStops[i + 1]
      
      if (fromStop.lat != null && fromStop.lng != null && 
          toStop.lat != null && toStop.lng != null) {
        
        const routeSegment = this.createRouteSegment(fromStop, toStop, i)
        
        // Add subtle delay for elegant appearance
        setTimeout(() => {
          if (this.viewer && !this.viewer.isDestroyed()) {
            this.viewer.entities.add(routeSegment)
            this.routeEntities.push(routeSegment)
          }
        }, i * 200) // 200ms delay between each segment for smooth appearance
      }
    }

    console.log(`[Route] Added ${this.routeEntities.length} route segments`)
  }

  /**
   * Creates a single route segment between two stops
   */
  private createRouteSegment(fromStop: Stop, toStop: Stop, segmentIndex: number): Entity {
    const positions = [
      Cartesian3.fromDegrees(fromStop.lng!, fromStop.lat!),
      Cartesian3.fromDegrees(toStop.lng!, toStop.lat!)
    ]

    // Create elegant polyline with subtle glow
    const routeEntity = new Entity({
      id: `route-segment-${segmentIndex}`,
      polyline: {
        positions: positions,
        width: 3, // Thin, elegant line
        arcType: ArcType.GEODESIC, // Natural arc following Earth's curvature
        clampToGround: false, // Allow line to arc above surface
        material: new PolylineGlowMaterialProperty({
          glowPower: new ConstantProperty(0.15), // Subtle glow, not neon
          taperPower: new ConstantProperty(0.8), // Gentle taper
          color: new ConstantProperty(Color.fromCssColorString('#E7D1A7').withAlpha(0.8)) // Champagne with transparency
        }),
        // Ensure route renders beneath markers
        zIndex: -1,
        // Make visible at all zoom levels
        distanceDisplayCondition: undefined
      },
      // Store route metadata
      properties: {
        isRouteSegment: true,
        fromStopId: fromStop.id,
        toStopId: toStop.id,
        segmentIndex: segmentIndex
      }
    })

    return routeEntity
  }


  /**
   * Updates route visibility based on camera distance for elegant presentation
   */
  updateRouteVisibility(): void {
    const cameraHeight = this.viewer.camera.positionCartographic.height
    
    // Show route when zoomed out enough to see the tour overview
    // Hide when zoomed in close to individual venues for clean marker view
    const shouldShowRoute = cameraHeight > 800000 // Show when >800km altitude
    
    this.routeEntities.forEach(entity => {
      if (entity.polyline) {
        entity.show = shouldShowRoute
        
        // Adjust opacity based on zoom level for smooth transition
        const material = entity.polyline.material as PolylineGlowMaterialProperty
        if (material && shouldShowRoute) {
          const opacity = Math.min(1.0, (cameraHeight - 800000) / 2000000) // Fade in gradually
          const baseColor = Color.fromCssColorString('#E7D1A7')
          material.color = new ConstantProperty(baseColor.withAlpha(opacity * 0.8))
        }
      }
    })
  }

  /**
   * Highlights a specific route segment (for future interactivity)
   */
  highlightSegment(segmentIndex: number, highlight: boolean = true): void {
    const entity = this.routeEntities[segmentIndex]
    if (entity && entity.polyline) {
      const material = entity.polyline.material as PolylineGlowMaterialProperty
      if (material) {
        if (highlight) {
          material.glowPower = new ConstantProperty(0.25) // Stronger glow when highlighted
          material.color = new ConstantProperty(Color.fromCssColorString('#E7D1A7').withAlpha(1.0)) // Full opacity
        } else {
          material.glowPower = new ConstantProperty(0.15) // Normal glow
          material.color = new ConstantProperty(Color.fromCssColorString('#E7D1A7').withAlpha(0.8)) // Normal transparency
        }
      }
    }
  }

  /**
   * Gets all route entities
   */
  getRouteEntities(): Entity[] {
    return [...this.routeEntities]
  }

  /**
   * Removes all route entities
   */
  clearRoutes(): void {
    this.routeEntities.forEach(entity => {
      this.viewer.entities.remove(entity)
    })
    this.routeEntities = []
    console.log('[Route] Cleared all route segments')
  }

  /**
   * Creates a complete tour route with all segments
   */
  static createTourRoute(viewer: Viewer, stops: Stop[]): RouteManager {
    const routeManager = new RouteManager(viewer)
    routeManager.addTourRoute(stops)
    return routeManager
  }

  /**
   * Animates route appearance (for future enhancement)
   */
  animateRouteAppearance(duration: number = 2000): void {
    // Future implementation: animate route segments appearing one by one
    // This could be used when the tour route is first displayed
    console.log(`[Route] Route animation would take ${duration}ms`)
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.clearRoutes()
  }
}

/**
 * Utility function to create a simple route between stops
 */
export function addSimpleRoute(viewer: Viewer, stops: Stop[]): Entity[] {
  if (stops.length < 2) return []

  const sortedStops = [...stops].sort((a, b) => a.order - b.order)
  const routeEntities: Entity[] = []

  for (let i = 0; i < sortedStops.length - 1; i++) {
    const fromStop = sortedStops[i]
    const toStop = sortedStops[i + 1]
    
    if (fromStop.lat != null && fromStop.lng != null && 
        toStop.lat != null && toStop.lng != null) {
      
      const positions = [
        Cartesian3.fromDegrees(fromStop.lng, fromStop.lat),
        Cartesian3.fromDegrees(toStop.lng, toStop.lat)
      ]

      const routeEntity = viewer.entities.add({
        id: `simple-route-${i}`,
        polyline: {
          positions: positions,
          width: 2,
          arcType: ArcType.GEODESIC,
          material: Color.fromCssColorString('#E7D1A7').withAlpha(0.7),
          zIndex: -1
        }
      })

      routeEntities.push(routeEntity)
    }
  }

  return routeEntities
}

/**
 * Creates a premium route with enhanced visual effects
 */
export function addPremiumRoute(viewer: Viewer, stops: Stop[]): RouteManager {
  return RouteManager.createTourRoute(viewer, stops)
}