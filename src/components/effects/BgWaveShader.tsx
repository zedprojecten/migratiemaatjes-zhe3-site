import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface BgWaveShaderProps {
  /**
   * 3 hex-kleuren voor de wave gradient. Als niet gezet: theme-aware
   * default (donker palet in dark mode, licht palet in light mode).
   */
  colors?: [string, string, string];
  className?: string;
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
    float wave1 = sin(vUv.x * 6.0 + uTime * 0.8) * 0.5 + 0.5;
    float wave2 = sin(vUv.y * 4.0 - uTime * 0.6 + 2.0) * 0.5 + 0.5;
    float wave3 = cos(vUv.x * 3.0 + vUv.y * 5.0 + uTime * 0.4) * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, wave1);
    color = mix(color, uColor3, wave2 * wave3);
    float r = color.r + sin(vUv.x * 8.0 + uTime) * 0.05;
    float g = color.g + sin(vUv.y * 8.0 + uTime * 1.1) * 0.05;
    float b = color.b + cos(vUv.x * 6.0 + uTime * 0.9) * 0.05;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

function parseColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

const DEFAULT_DARK: [string, string, string] = ["#1a1a2e", "#16213e", "#0f3460"];
const DEFAULT_LIGHT: [string, string, string] = ["#dbeafe", "#fce7f3", "#e0e7ff"];

function WaveMesh({ colors }: { colors: [string, string, string] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: parseColor(colors[0]) },
      uColor2: { value: parseColor(colors[1]) },
      uColor3: { value: parseColor(colors[2]) },
    }),
    [colors],
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

function useThemeColors(
  override?: [string, string, string],
): [string, string, string] {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  if (override) return override;
  return isDark ? DEFAULT_DARK : DEFAULT_LIGHT;
}

export default function BgWaveShader({
  colors,
  className,
  fallbackClassName = "",
}: BgWaveShaderProps) {
  const resolved = useThemeColors(colors);
  return (
    <div className={cn("absolute inset-0 pointer-events-none z-0", className)}>
      {fallbackClassName && (
        <div className={cn("absolute inset-0", fallbackClassName)} />
      )}
      <Canvas
        key={`${resolved[0]}-${resolved[1]}-${resolved[2]}`}
        className="!absolute inset-0"
        gl={{ alpha: true }}
      >
        <WaveMesh colors={resolved} />
      </Canvas>
    </div>
  );
}
