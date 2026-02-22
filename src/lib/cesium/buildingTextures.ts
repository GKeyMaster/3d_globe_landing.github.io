import {
  ImageMaterialProperty,
  Cartesian2,
  Color,
  ConstantProperty,
} from 'cesium'

import facade1Url from '../../assets/textures/buildings/facade_01.webp?url'
import facade2Url from '../../assets/textures/buildings/facade_02.webp?url'
import roof1Url from '../../assets/textures/buildings/roof_01.webp?url'

// Dev log once
console.log('Building texture URLs:', { facade1Url, facade2Url, roof1Url })

let useFallbackProcedural = false
let preloadPromise: Promise<void> | null = null
let fallbackTextureDataUrl: string | null = null

/**
 * Load an image from URL. Rejects on failure.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}

/**
 * Preload all 3 building textures. On any failure, sets useFallbackProcedural=true.
 */
function preloadTextures(): Promise<void> {
  if (preloadPromise) return preloadPromise
  preloadPromise = Promise.all([
    loadImage(facade1Url),
    loadImage(facade2Url),
    loadImage(roof1Url),
  ])
    .then(() => {})
    .catch((err) => {
      console.warn('[Buildings] Texture preload failed, using procedural fallback:', err?.message ?? err)
      useFallbackProcedural = true
    })
  return preloadPromise
}

/**
 * Call before creating building materials. Resolves when textures are ready or fallback is active.
 * Does not block camera flight (building load is fire-and-forget).
 */
export function ensureTexturesReady(): Promise<void> {
  return preloadTextures()
}

function getFallbackTextureDataUrl(): string {
  if (fallbackTextureDataUrl) return fallbackTextureDataUrl
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 64
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, 64, 64)
  const img = ctx.getImageData(0, 0, 64, 64)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = Math.floor((Math.random() * 40) - 10)
    img.data[i] = Math.min(255, Math.max(0, img.data[i] + n))
    img.data[i + 1] = Math.min(255, Math.max(0, img.data[i + 1] + n))
    img.data[i + 2] = Math.min(255, Math.max(0, img.data[i + 2] + n))
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  fallbackTextureDataUrl = c.toDataURL('image/png')
  return fallbackTextureDataUrl
}

/**
 * Stable uint32 hash from string (FNV-1a style)
 */
export function stableHash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Choose facade texture path based on hash (facade_01 or facade_02)
 */
function chooseFacadeTexturePath(hash: number): string {
  return (hash % 2) === 0 ? facade1Url : facade2Url
}

/**
 * Tint color for facade: subtle brightness 0.85..1.05
 */
function getFacadeTint(hash: number): Color {
  const t = (hash % 21) / 20 // 0..1
  const brightness = 0.85 + t * 0.2
  const b = Math.round(255 * brightness)
  return Color.fromBytes(b, b, Math.round(b * 0.98), 255)
}

/**
 * Tint color for roof: subtle brightness
 */
function getRoofTint(hash: number): Color {
  const t = ((hash >> 8) % 21) / 20
  const brightness = 0.88 + t * 0.14
  const b = Math.round(255 * brightness)
  return Color.fromBytes(b, b, Math.round(b * 0.96), 255)
}

/**
 * Get facade material for a building. Uses photo texture or procedural fallback.
 */
export function getFacadeMaterial(hash: number): ImageMaterialProperty {
  const tint = getFacadeTint(hash)
  const image = useFallbackProcedural ? getFallbackTextureDataUrl() : chooseFacadeTexturePath(hash)
  return new ImageMaterialProperty({
    image,
    repeat: new Cartesian2(4, 1),
    color: new ConstantProperty(tint),
  })
}

/**
 * Get roof material for a building. Uses photo texture or procedural fallback.
 */
export function getRoofMaterial(hash: number): ImageMaterialProperty {
  const tint = getRoofTint(hash)
  const image = useFallbackProcedural ? getFallbackTextureDataUrl() : roof1Url
  return new ImageMaterialProperty({
    image,
    repeat: new Cartesian2(2, 2),
    color: new ConstantProperty(tint),
  })
}
