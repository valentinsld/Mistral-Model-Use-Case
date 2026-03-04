precision mediump float;

uniform vec3 uColor;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec2 centered = vUv - 0.5;
  // Stretch: the plane is tilted so compensate the aspect to keep a round ellipse
  float dist = length(centered) * (3.0 * 1.0 / uOpacity);
  float alpha = smoothstep(1.0, 0.0, dist) * (uOpacity * 0.05);

  gl_FragColor = vec4(uColor, alpha);
}
