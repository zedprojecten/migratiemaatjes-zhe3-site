import { cn } from "@/lib/utils";

interface BgOrbsProps {
  colors?: string[];
  className?: string;
}

const defaults = [
  "hsl(220, 70%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(340, 65%, 50%)",
  "hsl(200, 75%, 45%)",
  "hsl(160, 60%, 45%)",
];

const orbConfigs = [
  { size: 500, top: "10%", left: "15%", anim: "bg-orb-float1", opacity: 0.35 },
  { size: 400, top: "60%", left: "70%", anim: "bg-orb-float2", opacity: 0.3 },
  { size: 600, top: "30%", left: "55%", anim: "bg-orb-float3", opacity: 0.25 },
  { size: 350, top: "75%", left: "20%", anim: "bg-orb-float4", opacity: 0.4 },
  { size: 450, top: "5%", left: "80%", anim: "bg-orb-float5", opacity: 0.3 },
];

export default function BgOrbs({ colors = defaults, className }: BgOrbsProps) {
  return (
    <>
      <style>{`
        @keyframes bg-orb-float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-40px)} }
        @keyframes bg-orb-float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,30px)} }
        @keyframes bg-orb-float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,35px)} }
        @keyframes bg-orb-float4 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-35px,-25px)} }
        @keyframes bg-orb-float5 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-30px)} }
      `}</style>
      <div className={cn("absolute inset-0 pointer-events-none z-0 overflow-hidden", className)}>
        {orbConfigs.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              background: colors[i % colors.length],
              filter: "blur(80px)",
              opacity: orb.opacity,
              animation: `${orb.anim} ${45 + i * 2.5}s ease-in-out infinite`,
              animationDelay: `${i * -3}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
