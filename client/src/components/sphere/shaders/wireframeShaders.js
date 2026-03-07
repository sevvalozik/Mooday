export const wireframeVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uArousal;
  uniform float uIntensity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vBarycentric;

  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    // Wireframe gentle pulsing displacement
    float speed = 0.08 + uArousal * 0.1;
    float noise = snoise(position * 2.0 + uTime * speed);
    float pulse = sin(uTime * 0.5 + length(position) * 3.0) * 0.5 + 0.5;
    float displacement = noise * (0.01 + uArousal * 0.03) * uIntensity;
    displacement += pulse * 0.005 * uIntensity;

    vec3 newPosition = position + normal * displacement;
    vPosition = newPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

export const wireframeFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uArousal;
  uniform float uIntensity;
  uniform float uValence;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);

    // Grid lines using UV coordinates
    float gridX = abs(sin(vUv.x * 60.0));
    float gridY = abs(sin(vUv.y * 30.0));
    float grid = max(
      smoothstep(0.95, 1.0, gridX),
      smoothstep(0.95, 1.0, gridY)
    );

    // Diagonal lines for extra detail
    float diag = abs(sin((vUv.x + vUv.y) * 40.0));
    grid = max(grid, smoothstep(0.97, 1.0, diag) * 0.5);

    // Scanning line effect
    float scanLine = sin(vPosition.y * 20.0 - uTime * 2.0);
    scanLine = smoothstep(0.8, 1.0, scanLine);

    // Base wire color
    vec3 wireColor = mix(uColorA, uColorB, fresnel);

    // Data flow — color pulses along grid lines
    float dataFlow = sin(vUv.y * 30.0 - uTime * 3.0) * 0.5 + 0.5;
    wireColor = mix(wireColor, uColorA * 2.0, dataFlow * grid * 0.5);

    // Combine: transparent face + bright wire
    float faceAlpha = 0.05 + fresnel * 0.15;
    float wireAlpha = grid * (0.6 + uIntensity * 0.4);

    vec3 color = wireColor * wireAlpha + uColorA * faceAlpha;

    // Scan line highlight
    color += uColorA * scanLine * 0.15;

    // Node points at grid intersections
    float nodes = smoothstep(0.95, 1.0, gridX) * smoothstep(0.95, 1.0, gridY);
    color += vec3(1.0) * nodes * 0.8 * uIntensity;

    // Edge glow
    color += uColorA * fresnel * 0.4;

    float alpha = max(faceAlpha, wireAlpha) + fresnel * 0.3;

    float brightness = 0.9 + uValence * 0.1;
    color *= brightness;

    gl_FragColor = vec4(color, alpha);
  }
`;
