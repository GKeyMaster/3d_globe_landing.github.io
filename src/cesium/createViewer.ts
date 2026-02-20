import * as Cesium from 'cesium'

export async function createViewer(container: HTMLElement): Promise<Cesium.Viewer> {
  // Explicitly disable Cesium Ion
  Cesium.Ion.defaultAccessToken = ''

  // Create viewer with all UI widgets disabled
  const viewer = new Cesium.Viewer(container, {
    // Disable all default UI widgets
    geocoder: false,
    baseLayerPicker: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    
    // Keep terrain as ellipsoid (default, no ion terrain)
    terrainProvider: new Cesium.EllipsoidTerrainProvider()
  })

  // Remove default imagery (ion-based) and use no imagery for now
  viewer.imageryLayers.removeAll()

  // Hide/minimize credits UI but keep compliance
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
  if (creditContainer) {
    creditContainer.style.display = 'none'
  }

  // Enable cinematic visual enhancements
  viewer.scene.globe.enableLighting = true
  viewer.scene.fog.enabled = true
  if (viewer.scene.skyAtmosphere) {
    viewer.scene.skyAtmosphere.show = true
  }
  viewer.scene.postProcessStages.fxaa.enabled = true

  // Set initial camera position for pleasing global view
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-75.0, 42.0, 25000000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45),
      roll: 0.0
    }
  })

  return viewer
}