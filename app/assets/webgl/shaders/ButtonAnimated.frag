precision mediump float;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uPlaneWidth;
uniform float uPlaneHeight;

uniform float uTime;
uniform float uPixelSize; // nombre de "pixels" sur la largeur

varying vec2 vUv;

#include Simplex3DNoise.glsl;

void main()
{
  // Quantifier les UV pour obtenir l'effet pixelisé
  float aspect = uPlaneWidth / uPlaneHeight;
  vec2 resolution = vec2(uPixelSize, uPixelSize / aspect);
  vec2 pixelatedUv = floor(vUv * resolution) / resolution;

  vec3 color = vec3(
    mix(uColor1, uColor2,
      clamp(
        snoise(vec3(pixelatedUv * vec2(1, 0.5), uTime)), 0.0, 1.0
      )
    )
  );

  gl_FragColor = vec4(
    color,
    1.0
  );
}
