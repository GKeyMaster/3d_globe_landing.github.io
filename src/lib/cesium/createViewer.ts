import {
  Viewer,
  EllipsoidTerrainProvider,
  UrlTemplateImageryProvider,
  WebMercatorTilingScheme,
  Rectangle,
  Credit
} from 'cesium'

export function createViewer(container: HTMLElement): Viewer {
  // Create terrain provider (no Ion required)
  const terrainProvider = new EllipsoidTerrainProvider()

  // Create viewer with minimal configuration
  const viewer = new Viewer(container, {
    // Terrain
    terrainProvider,
    
    // Disable UI clutter
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    
    // Keep credit display for attribution
    creditContainer: undefined
  })

  // GUARANTEE no Ion imagery remains
  viewer.imageryLayers.removeAll(true)

  // Create NASA GIBS WMTS REST provider using EPSG:3857 Web Mercator
  const nasaImageryProvider = new UrlTemplateImageryProvider({
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
    minimumLevel: 1, // GIBS Web Mercator zoom level 0 not supported
    maximumLevel: 8,
    tilingScheme: new WebMercatorTilingScheme(),
    // Limit to Web Mercator valid latitude range
    rectangle: Rectangle.fromDegrees(-180, -85.05112878, 180, 85.05112878),
    credit: new Credit('NASA EOSDIS GIBS')
  })

  // Add NASA imagery as the ONLY base layer
  const imageryLayer = viewer.imageryLayers.addImageryProvider(nasaImageryProvider)
  
  // Enable anisotropic filtering for better quality
  if (imageryLayer.imageryProvider && (imageryLayer.imageryProvider as any).enablePickFeatures !== undefined) {
    // Enable anisotropic filtering if available
    const provider = imageryLayer.imageryProvider as any
    if (provider._texture) {
      provider._texture.sampler = {
        ...provider._texture.sampler,
        magFilter: 9729, // LINEAR
        minFilter: 9987, // LINEAR_MIPMAP_LINEAR
        maximumAnisotropy: 16
      }
    }
  }

  // Premium globe visual settings
  viewer.scene.highDynamicRange = true
  viewer.scene.globe.maximumScreenSpaceError = 1.5 // Higher quality
  
  // Enable FXAA anti-aliasing
  if (viewer.scene.postProcessStages && viewer.scene.postProcessStages.fxaa) {
    viewer.scene.postProcessStages.fxaa.enabled = true
  }

  // DEV-ONLY: Verification logging
  if (import.meta.env.DEV) {
    console.log('🌍 Cesium Viewer Initialized - Tokenless EPSG:3857 Configuration')
    
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
        console.log(`   Rectangle: ${provider.rectangle ? 'Custom' : 'Default'}`)
        console.log(`   Tiling Scheme: ${provider.tilingScheme.constructor.name}`)
        if (providerAny.minimumLevel !== undefined) {
          console.log(`   Level Range: ${providerAny.minimumLevel}-${providerAny.maximumLevel}`)
        }
      }
    }
    
    console.log(`📊 Total imagery layers: ${layers.length}`)
    console.log(`🎨 HDR enabled: ${viewer.scene.highDynamicRange}`)
    console.log(`🔍 Screen space error: ${viewer.scene.globe.maximumScreenSpaceError}`)
    console.log(`✨ FXAA enabled: ${viewer.scene.postProcessStages?.fxaa?.enabled || false}`)
  }

  return viewer
}