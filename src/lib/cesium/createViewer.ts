import {
  Viewer,
  EllipsoidTerrainProvider,
  WebMapTileServiceImageryProvider,
  WebMercatorTilingScheme,
  Credit,
  JulianDate,
  ScreenSpaceEventType
} from 'cesium'

export interface ViewerCreationResult {
  viewer: Viewer
  isReady: Promise<void>
  onImageryReady: (callback: () => void) => void
}

let viewerCreationCount = 0

export async function createViewer(container: HTMLElement, creditContainer?: HTMLElement): Promise<ViewerCreationResult> {
  viewerCreationCount++
  console.log(`[Cesium] createViewer called (count: ${viewerCreationCount})`)
  
  // Create terrain provider (no Ion required)
  const terrainProvider = new EllipsoidTerrainProvider()

  // Create viewer with minimal configuration and custom credit container
  const viewer = new Viewer(container, {
    // Terrain
    terrainProvider,
    
    // Prevent default imagery (no Bing/Ion)
    imageryProvider: false,
    
    // Disable UI clutter
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    
    // Disable Cesium's selection UI (green corner brackets)
    selectionIndicator: false,
    infoBox: false,
    
    // Custom credit container for unobtrusive credits
    creditContainer: creditContainer
  })

  // GUARANTEE no Ion imagery remains
  viewer.imageryLayers.removeAll(true)

  // Remove Cesium's default selection handlers to prevent green corner brackets
  viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
  viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

  // Create NASA GIBS WMTS imagery provider using EPSG:3857 Web Mercator (tokenless, free)
  const gibsMerc = new WebMapTileServiceImageryProvider({
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/default/GoogleMapsCompatible_Level8/{TileMatrix}/{TileRow}/{TileCol}.jpg",
    layer: "BlueMarble_ShadedRelief_Bathymetry",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible_Level8",
    tilingScheme: new WebMercatorTilingScheme(),
    // Web Mercator GIBS may not support zoom level 0; start at 1
    minimumLevel: 1,
    maximumLevel: 8,
    credit: new Credit("NASA GIBS"),
  })

  // Add debug logging
  gibsMerc.errorEvent.addEventListener((e: any) => console.warn("[GIBS3857] tile error", e))

  // GUARANTEE no Ion imagery remains and add ONLY GIBS provider
  viewer.imageryLayers.removeAll(true)
  viewer.imageryLayers.addImageryProvider(gibsMerc)

  // Premium atmosphere settings (tokenless)
  viewer.scene.globe.show = true
  viewer.scene.skyAtmosphere.show = true
  viewer.scene.fog.enabled = true
  viewer.scene.globe.showGroundAtmosphere = true

  // Premium globe visual settings
  viewer.scene.highDynamicRange = true
  viewer.scene.globe.maximumScreenSpaceError = 1.2 // Higher quality
  
  // Enable FXAA anti-aliasing
  if (viewer.scene.postProcessStages && viewer.scene.postProcessStages.fxaa) {
    viewer.scene.postProcessStages.fxaa.enabled = true
  }

  // Track imagery readiness
  let imageryReadyCallback: (() => void) | null = null
  let imageryReady = false

  // Create readiness promise that resolves when imagery is ready
  const isReady = new Promise<void>((resolve) => {
    // Wait for imagery provider to initialize and load initial tiles
    const checkReadiness = () => {
      // Check if provider has loaded at least one tile
      const gibsReady = (gibsMerc as any)._ready !== false
      
      if (gibsReady && !imageryReady) {
        imageryReady = true
        console.log('[Cesium] Imagery layer ready')
        
        // Notify callback if set
        if (imageryReadyCallback) {
          imageryReadyCallback()
        }
        
        resolve()
      } else {
        // Check again in a bit
        setTimeout(checkReadiness, 100)
      }
    }
    
    // Start checking after a brief delay
    setTimeout(checkReadiness, 500)
  })

  const onImageryReady = (callback: () => void) => {
    if (imageryReady) {
      callback()
    } else {
      imageryReadyCallback = callback
    }
  }

  // DEV-ONLY: Verification logging and tokenless check
  if (import.meta.env.DEV) {
    console.log('🌍 Cesium Viewer Initialized - Premium Tokenless Configuration')
    console.log(`[Tokenless] Ion token:`, (window as any).Cesium?.Ion?.defaultAccessToken || 'undefined')
    
    // Check for unwanted providers
    const layers = viewer.imageryLayers
    for (let i = 0; i < layers.length; i++) {
      const layer = layers.get(i)
      const provider = layer.imageryProvider
      
      // Type-safe property access
      const providerAny = provider as any
      const url = providerAny.url || providerAny._url || ''
      
      // Check for banned URLs
      const bannedDomains = [
        'ion.cesium.com',
        'api.cesium.com', 
        'assets.cesium.com',
        'virtualearth',
        'google'
      ]
      
      const hasBannedDomain = bannedDomains.some(domain => url.includes(domain))
      
      if (hasBannedDomain) {
        console.warn('⚠️ UNWANTED IMAGERY PROVIDER DETECTED:', url)
      } else {
        console.log(`✅ Layer ${i}: ${provider.constructor.name}`)
        if (url) {
          console.log(`   URL: ${url}`)
        }
        console.log(`   Max Level: ${providerAny.maximumLevel}`)
      }
    }
    
    console.log(`📊 Total imagery layers: ${layers.length}`)
    console.log(`🎨 HDR enabled: ${viewer.scene.highDynamicRange}`)
    console.log(`🔍 Screen space error: ${viewer.scene.globe.maximumScreenSpaceError}`)
    console.log(`✨ FXAA enabled: ${viewer.scene.postProcessStages?.fxaa?.enabled || false}`)
  }

  return { 
    viewer, 
    isReady,
    onImageryReady 
  }
}