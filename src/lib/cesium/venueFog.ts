import type { Viewer } from 'cesium'
import { PostProcessStage, Cartesian3 } from 'cesium'

const FRAGMENT_SHADER = `
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform vec3 u_venueWC;
uniform float u_fogStart;
uniform float u_fogEnd;
uniform vec3 u_fogColor;

in vec2 v_textureCoordinates;

void main() {
  vec4 color = texture(colorTexture, v_textureCoordinates);
  float depth = czm_readDepth(depthTexture, v_textureCoordinates);

  if (depth > 0.9999) {
    out_FragColor = color;
    return;
  }

  vec4 eye = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);
  vec3 posEC = eye.xyz / eye.w;
  vec3 venueEC = (czm_view * vec4(u_venueWC, 1.0)).xyz;
  float d = length(posEC - venueEC);
  d = min(d, u_fogEnd);

  float start = u_fogStart;
  float w = 50.0;
  float fogFactor = 0.0;
  if (d > start - w) {
    fogFactor = smoothstep(start - w, u_fogEnd, d);
  }
  if (d <= u_fogStart) {
    fogFactor = 0.0;
  }

  vec3 rgb = mix(color.rgb, u_fogColor, fogFactor);
  out_FragColor = vec4(rgb, color.a);
}
`

let stage: PostProcessStage | null = null
let venueWCRef: Cartesian3 | null = null
let fogStartRef = 2000.0
let fogEndRef = 12000.0

const FOG_COLOR = new Cartesian3(0.04, 0.06, 0.09)

export interface VenueFogAPI {
  setEnabled: (enabled: boolean) => void
  setVenue: (positionWC: Cartesian3 | null) => void
  setDistances: (start: number, end: number) => void
}

/**
 * Creates (or returns) the venue-centered radial fog PostProcessStage.
 * Fog starts at u_fogStart (2000m), no fog inside 0–2000m.
 */
export function ensureVenueFog(viewer: Viewer): VenueFogAPI {
  if (!stage) {
    stage = viewer.scene.postProcessStages.add(
      new PostProcessStage({
        name: 'venueRadialFog',
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          u_venueWC: () => venueWCRef ?? Cartesian3.ZERO,
          u_fogStart: () => fogStartRef,
          u_fogEnd: () => fogEndRef,
          u_fogColor: FOG_COLOR,
        },
      })
    )
    stage.enabled = false
  }

  return {
    setEnabled(enabled: boolean) {
      if (stage) stage.enabled = enabled
    },
    setVenue(positionWC: Cartesian3 | null) {
      venueWCRef = positionWC
    },
    setDistances(start: number, end: number) {
      fogStartRef = start
      fogEndRef = end
    },
  }
}
