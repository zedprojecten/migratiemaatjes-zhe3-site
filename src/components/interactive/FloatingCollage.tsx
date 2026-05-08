import { cn } from "@/lib/utils";

interface FloatingCollageProps {
  images?: string[];
  className?: string;
}

const layouts = [
  { top: "5%", left: "10%", w: 180, h: 140, z: 3, delay: 0 },
  { top: "15%", left: "55%", w: 200, h: 160, z: 5, delay: -2 },
  { top: "45%", left: "5%", w: 160, h: 120, z: 2, delay: -4 },
  { top: "40%", left: "60%", w: 220, h: 170, z: 4, delay: -1 },
  { top: "70%", left: "25%", w: 190, h: 150, z: 6, delay: -3 },
  { top: "8%", left: "35%", w: 150, h: 110, z: 1, delay: -5 },
  { top: "65%", left: "65%", w: 170, h: 130, z: 3, delay: -2.5 },
];

export default function FloatingCollage({
  images,
  className,
}: FloatingCollageProps) {
  const count = Math.min(images?.length ?? 7, 7);

  return (
    <>
      <style>{`
        @keyframes collage-float {
          0%, 100% { transform: translateY(0px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
          50% { transform: translateY(-15px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        }
      `}</style>
      <div className={cn("relative h-[400px] md:h-[500px] w-full overflow-hidden", className)}>
        {layouts.slice(0, count).map((pos, i) => {
          const hasSrc = images?.[i]?.startsWith("http");
          return (
            <div
              key={i}
              className="absolute overflow-hidden rounded-xl shadow-lg"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.w,
                height: pos.h,
                zIndex: pos.z,
                animation: `collage-float ${4 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${pos.delay}s`,
              }}
            >
              {hasSrc ? (
                <img
                  src={images![i]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(${120 + i * 25}deg, hsl(${(i * 50) % 360}, 45%, 35%), hsl(${(i * 50 + 30) % 360}, 55%, 25%))`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
