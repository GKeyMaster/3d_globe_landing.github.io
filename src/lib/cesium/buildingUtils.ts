import {
  Viewer,
  GeoJsonDataSource,
  Color,
  HeightReference,
  Material,
  ConstantProperty
} from 'cesium'
import type { Stop } from '../data/types'

/**
 * Manages 3D building visualization for venues
 */

const MAX_BUILDINGS_PER_STOP = 500 // Limit for performance

/**
 * Calculates building height from OSM properties
 */
function calculateBuildingHeight(properties: any): number {
  // Check for explicit height in meters
  if (properties.height) {
    const heightStr = String(properties.height).toLowerCase()
    const heightMatch = heightStr.match(/(\d+(?:\.\d+)?)/)
    if (heightMatch) {
      return parseFloat(heightMatch[1])
    }
  }
  
  // Check for building levels
  if (properties['building:levels']) {
    const levels = parseInt(String(properties['building:levels']), 10)
    if (!isNaN(levels) && levels > 0) {
      return levels * 3.2 // Assume 3.2m per floor
    }
  }
  
  // Check for building type for better defaults
  const buildingType = String(properties.building || '').toLowerCase()
  
  switch (buildingType) {
    case 'skyscraper':
      return 80 + Math.random() * 120 // 80-200m
    case 'commercial':
    case 'office':
      return 20 + Math.random() * 40 // 20-60m
    case 'industrial':
      return 8 + Math.random() * 12 // 8-20m
    case 'residential':
      return 12 + Math.random() * 18 // 12-30m
    case 'retail':
      return 4 + Math.random() * 8 // 4-12m
    case 'warehouse':
      return 6 + Math.random() * 10 // 6-16m
    default:
      // Random height for unknown buildings
      return 12 + Math.random() * 48 // 12-60m
  }
}

/**
 * Creates building material with slight variation
 */
function createBuildingMaterial(index: number): Material {
  // Create subtle variations in building colors
  const baseGray = 0.15 + (index % 7) * 0.02 // Slight variation
  const warmth = 0.05 + (index % 3) * 0.01 // Subtle warm tint
  
  return Material.fromType('Color', {
    color: new ConstantProperty(new Color(
      baseGray + warmth,     // R
      baseGray + warmth * 0.8, // G  
      baseGray,              // B
      0.9                    // A
    ))
  })
}

/**
 * Building manager for loading and displaying 3D buildings around venues
 */
export class BuildingManager {
  private viewer: Viewer
  private dataSources: Map<string, GeoJsonDataSource> = new Map()
  private loadingPromises: Map<string, Promise<void>> = new Map()

  constructor(viewer: Viewer) {
    this.viewer = viewer
  }

  /**
   * Loads and displays buildings for a specific stop
   */
  async loadBuildingsForStop(stop: Stop): Promise<void> {
    const stopId = stop.id
    
    // Check if already loaded or loading
    if (this.dataSources.has(stopId) || this.loadingPromises.has(stopId)) {
      return this.loadingPromises.get(stopId) || Promise.resolve()
    }
    
    console.log(`[Buildings] Loading buildings for ${stop.city}`)
    
    const loadingPromise = this.loadBuildingsInternal(stop)
    this.loadingPromises.set(stopId, loadingPromise)
    
    try {
      await loadingPromise
    } finally {
      this.loadingPromises.delete(stopId)
    }
  }

  /**
   * Internal method to load buildings
   */
  private async loadBuildingsInternal(stop: Stop): Promise<void> {
    const stopId = stop.id
    const buildingUrl = `/data/buildings/${stopId}.geojson`
    
    try {
      // Load GeoJSON data
      const dataSource = await GeoJsonDataSource.load(buildingUrl, {
        clampToGround: true
      })
      
      console.log(`[Buildings] Loaded ${dataSource.entities.values.length} buildings for ${stop.city}`)
      
      // Limit number of buildings for performance
      const entities = dataSource.entities.values
      const buildingsToShow = entities.slice(0, MAX_BUILDINGS_PER_STOP)
      
      if (entities.length > MAX_BUILDINGS_PER_STOP) {
        console.log(`[Buildings] Limiting to first ${MAX_BUILDINGS_PER_STOP} buildings for performance`)
        
        // Remove excess entities
        for (let i = MAX_BUILDINGS_PER_STOP; i < entities.length; i++) {
          dataSource.entities.remove(entities[i])
        }
      }
      
      // Configure 3D extrusion for each building
      buildingsToShow.forEach((entity, index) => {
        if (entity.polygon) {
          const properties = entity.properties?.getValue(this.viewer.clock.currentTime) || {}
          
          // Calculate height
          const height = calculateBuildingHeight(properties)
          
          // Configure polygon for 3D extrusion
          entity.polygon.extrudedHeight = new ConstantProperty(height)
          entity.polygon.heightReference = new ConstantProperty(HeightReference.CLAMP_TO_GROUND)
          
          // Apply material with variation
          entity.polygon.material = createBuildingMaterial(index)
          
          // Subtle outline for definition
          entity.polygon.outline = new ConstantProperty(true)
          entity.polygon.outlineColor = new ConstantProperty(new Color(0.1, 0.1, 0.1, 0.3))
          entity.polygon.outlineWidth = new ConstantProperty(1)
          
          // Set name for debugging
          entity.name = `Building ${index + 1} (${height.toFixed(1)}m)`
        }
      })
      
      // Add to viewer
      await this.viewer.dataSources.add(dataSource)
      this.dataSources.set(stopId, dataSource)
      
      console.log(`[Buildings] Configured ${buildingsToShow.length} 3D buildings for ${stop.city}`)
      
    } catch (error) {
      console.warn(`[Buildings] Failed to load buildings for ${stop.city}:`, error)
      // Don't throw - buildings are optional enhancement
    }
  }

  /**
   * Removes buildings for a specific stop
   */
  async removeBuildingsForStop(stopId: string): Promise<void> {
    const dataSource = this.dataSources.get(stopId)
    if (dataSource) {
      await this.viewer.dataSources.remove(dataSource)
      this.dataSources.delete(stopId)
      console.log(`[Buildings] Removed buildings for stop ${stopId}`)
    }
  }

  /**
   * Shows/hides buildings for a specific stop
   */
  setBuildingsVisibility(stopId: string, visible: boolean): void {
    const dataSource = this.dataSources.get(stopId)
    if (dataSource) {
      dataSource.show = visible
    }
  }

  /**
   * Clears all buildings
   */
  async clearAllBuildings(): Promise<void> {
    const promises = Array.from(this.dataSources.keys()).map(stopId => 
      this.removeBuildingsForStop(stopId)
    )
    await Promise.all(promises)
    console.log('[Buildings] Cleared all buildings')
  }

  /**
   * Gets loaded stop IDs
   */
  getLoadedStops(): string[] {
    return Array.from(this.dataSources.keys())
  }

  /**
   * Checks if buildings are loaded for a stop
   */
  areBuildingsLoaded(stopId: string): boolean {
    return this.dataSources.has(stopId)
  }
}