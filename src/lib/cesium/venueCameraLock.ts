import type { Viewer, Entity } from 'cesium'
import { Cartographic, Cartesian3 } from 'cesium'

const MIN_HEIGHT_ABOVE_SURFACE = 1

let aboveSurfaceRemoval: (() => void) | null = null

function enforceCameraAboveSurface(viewer: Viewer): void {
  const camera = viewer.camera
  const ellipsoid = viewer.scene.globe.ellipsoid
  const trackedEntity = viewer.trackedEntity
  const carto = Cartographic.fromCartesian(camera.positionWC, ellipsoid)

  if (carto.height >= MIN_HEIGHT_ABOVE_SURFACE) return

  const clamped = new Cartographic(carto.longitude, carto.latitude, MIN_HEIGHT_ABOVE_SURFACE)
  const surfacePos = ellipsoid.cartographicToCartesian(clamped, new Cartesian3())

  const venuePos = trackedEntity?.position?.getValue?.(viewer.clock.currentTime)
  if (venuePos) {
    const direction = Cartesian3.normalize(Cartesian3.subtract(venuePos, surfacePos, new Cartesian3()), new Cartesian3())
    const up = Cartesian3.normalize(surfacePos, new Cartesian3())
    camera.setView({
      destination: surfacePos,
      orientation: { direction, up },
    })
  } else {
    camera.setView({
      destination: surfacePos,
      orientation: { direction: camera.directionWC, up: camera.upWC },
    })
  }
}

const CONTROLLER_DEFAULTS = {
  enableTranslate: true,
  enableLook: true,
  enableTilt: true,
  enableRotate: true,
  enableZoom: true,
}

/**
 * Applies hard venue mode camera lock.
 * Camera tracks the entity; user can rotate and zoom but not pan/translate.
 */
export function applyVenueCameraLock(viewer: Viewer, entity: Entity): void {
  const controller = viewer.scene.screenSpaceCameraController

  controller.enableCollisionDetection = false
  viewer.trackedEntity = entity
  controller.enableTranslate = false
  controller.enableLook = false
  controller.enableTilt = true
  controller.enableRotate = true
  controller.enableZoom = true

  aboveSurfaceRemoval?.()
  const listener = () => enforceCameraAboveSurface(viewer)
  viewer.scene.postRender.addEventListener(listener)
  aboveSurfaceRemoval = () => {
    viewer.scene.postRender.removeEventListener(listener)
    aboveSurfaceRemoval = null
  }

  if (import.meta.env.DEV) {
    console.log('[VenueCameraLock] trackedEntity set', entity.id)
  }
}

/**
 * Removes venue lock and restores controller defaults for overview mode.
 */
export function removeVenueCameraLock(viewer: Viewer): void {
  const controller = viewer.scene.screenSpaceCameraController

  if (import.meta.env.DEV && viewer.trackedEntity) {
    console.log('[VenueCameraLock] trackedEntity cleared')
  }

  aboveSurfaceRemoval?.()
  aboveSurfaceRemoval = null
  viewer.trackedEntity = undefined
  controller.enableCollisionDetection = true
  controller.enableTranslate = CONTROLLER_DEFAULTS.enableTranslate
  controller.enableLook = CONTROLLER_DEFAULTS.enableLook
  controller.enableTilt = CONTROLLER_DEFAULTS.enableTilt
  controller.enableRotate = CONTROLLER_DEFAULTS.enableRotate
  controller.enableZoom = CONTROLLER_DEFAULTS.enableZoom
}
