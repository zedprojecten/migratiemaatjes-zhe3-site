import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.3;

    // Soft mesh gradient via layered sin/cos distortions
    float d1 = sin(uv.x * 3.0 + t) * cos(uv.y * 2.5 - t * 0.7) * 0.5 + 0.5;
    float d2 = cos(uv.x * 2.0 - t * 0.5) * sin(uv.y * 3.5 + t * 0.4) * 0.5 + 0.5;
    float d3 = sin((uv.x + uv.y) * 2.0 + t * 0.6) * 0.5 + 0.5;

    vec3 color = mix(uColor1, uColor2, smoothstep(0.2, 0.8, d1));
    color = mix(color, uColor3, smoothstep(0.3, 0.7, d2) * 0.6);
    color += (d3 - 0.5) * 0.08;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function parseHSL(cssVar: string, fallback: string): THREE.Color {
  try {
    const root = document.documentElement;
    const raw = getComputedStyle(root).getPropertyValue(cssVar).trim();
    if (raw) return new THREE.Color(`hsl(${raw})`);
  } catch { /* fallback */ }
  return new THREE.Color(fallback);
}

function GradientMesh({ themeKey }: { themeKey: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // useMemo afhankelijk van themeKey zodat de kleur-uniforms opnieuw
  // resolven na een dark/light switch. In dark mode: vaste cinematic
  // mesh-palet (deep purple-blue) zodat het premium gevoel blijft ook
  // als de site --primary warm-cream is. In light mode: brand tokens
  // van de site zelf.
  const uniforms = useMemo(() => {
    if (themeKey === "dark") {
      return {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#5b21b6") },
        uColor2: { value: new THREE.Color("#1e3a8a") },
        uColor3: { value: new THREE.Color("#0c1130") },
        uResolution: { value: new THREE.Vector2(1, 1) },
      };
    }
    return {
      uTime: { value: 0 },
      uColor1: { value: parseHSL("--primary", "#1a1a2e") },
      uColor2: { value: parseHSL("--accent", "#16213e") },
      uColor3: { value: parseHSL("--background", "#0f3460") },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeKey]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function useThemeKey(): string {
  const [key, setKey] = useState(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );
  useEffect(() => {
    const update = () =>
      setKey(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return key;
}

interface HeroShaderProps {
  children: ReactNode;
  className?: string;
}

export default function HeroShader({ children, className }: HeroShaderProps) {
  const themeKey = useThemeKey();
  return (
    <section className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      {/* WebGL canvas with CSS gradient fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary)/0.3)] via-[hsl(var(--background))] to-[hsl(var(--accent)/0.3)]">
        <Suspense fallback={null}>
          <Canvas
            key={themeKey}
            className="!absolute inset-0"
            gl={{ antialias: false, alpha: true, premultipliedAlpha: false }}
            camera={{ position: [0, 0, 1] }}
          >
            <GradientMesh themeKey={themeKey} />
          </Canvas>
        </Suspense>
      </div>

      {/* Children on top */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
        {children}
      </div>
    </section>
  );
}
