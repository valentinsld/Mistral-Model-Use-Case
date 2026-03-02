uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 modelMatrix;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main()
{
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vUv = uv;
  vWorldPosition = worldPos.xyz;
}
