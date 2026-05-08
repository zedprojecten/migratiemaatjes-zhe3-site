import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface BgRippleShaderProps {
  colors?: [string, string, string];
  className?: string;
  /**
   * Tailwind class voor de CSS-fallback achter de WebGL canvas (zichtbaar
   * tijdens het laden + als WebGL niet werkt). Default `""` (transparant , 
   * laat de parent-bg zien). Was `bg-gradient-to-br from-indigo-950 ...`
   * dat hardcoded donker was; mismatcht met `colors` prop op lichte sites.
   */
  fallbackClassName?: string;
}

const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;
  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    float ring = sin(dist * 25.0 - uTime * 2.0) * 0.5 + 0.5;
    float ring2 = sin(dist * 15.0 + uTime * 1.5 + 1.5) * 0.5 + 0.5;
    float morph = sin(atan(center.y, center.x) * 3.0 + uTime * 0.5) * 0.02;
    float pattern = ring * 0.6 + ring2 * 0.4 + morph;
    vec3 color = mix(uColor1, uColor2, pattern);
    color = mix(color, uColor3, smoothstep(0.2, 0.5, dist));
    float fade = 1.0 - smoothstep(0.4, 0.7, dist);
    gl_FragColor = vec4(color, fade * 0.9 + 0.1);
  }
`;

function RippleMesh({ colors }: { colors: [string, string, string] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(colors[0]) },
      uColor2: { value: new THREE.Color(colors[1]) },
      uColor3: { value: new THREE.Color(colors[2]) },
    }),
    [colors],
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function BgRippleShader({
  colors = ["#0c0a3e", "#44318d", "#e98074"],
  className,
  fallbackClassName = "",
}: BgRippleShaderProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none z-0", className)}>
      {fallbackClassName && (
        <div className={cn("absolute inset-0", fallbackClassName)} />
      )}
      <Canvas className="!absolute inset-0" gl={{ alpha: true }}>
        <RippleMesh colors={colors} />
      </Canvas>
    </div>
  );
}
