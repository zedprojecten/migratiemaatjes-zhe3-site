/**
 * Radial orbital timeline, geïnspireerd op 21st.dev/jatin-yadav05/radial-orbital-timeline.
 *
 * - Vaste donkere gradient achtergrond zodat het component identiek werkt op
 *   light en dark themes (eigen kleurwereld los van de site-tokens).
 * - Mobile-responsive: orbit-radius schaalt mee met container width via
 *   ResizeObserver, kleinere height op mobile.
 * - Auto-rotation pauzeert wanneer een node geexpand is, hervat na collapse.
 * - Backward compat: accepteert simpele items zonder id/icon/relatedIds/energy.
 */

import { useEffect, useRef, useState, type ElementType } from "react";
import { ArrowRight, Calendar, Link2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrbitalStatus = "completed" | "in-progress" | "pending" | "active";

export interface OrbitalTimelineItem {
  id?: number;
  title: string;
  description?: string;
  date?: string;
  category?: string;
  icon?: ElementType;
  relatedIds?: number[];
  status?: OrbitalStatus;
  energy?: number;
}

interface OrbitalTimelineProps {
  items: OrbitalTimelineItem[];
  className?: string;
}

const STATUS_BADGE: Record<OrbitalStatus, string> = {
  completed: "text-emerald-300 bg-emerald-500/15 border-emerald-400/40",
  active: "text-cyan-300 bg-cyan-500/15 border-cyan-400/40",
  "in-progress": "text-amber-300 bg-amber-500/15 border-amber-400/40",
  pending: "text-zinc-300 bg-zinc-500/15 border-zinc-400/30",
};

const STATUS_LABEL: Record<OrbitalStatus, string> = {
  completed: "VOLTOOID",
  active: "ACTIEF",
  "in-progress": "BEZIG",
  pending: "GEPLAND",
};

export default function OrbitalTimeline({
  items,
  className,
}: OrbitalTimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [radius, setRadius] = useState(180);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  const normalized = items.map((item, idx) => ({
    id: item.id ?? idx + 1,
    title: item.title,
    description: item.description ?? "",
    date: item.date ?? "",
    category: item.category ?? "",
    icon: item.icon ?? Calendar,
    relatedIds: item.relatedIds ?? [],
    status: item.status ?? "pending",
    energy: item.energy ?? 70,
  }));

  // Responsive radius: schaal mee met container, klein op mobile.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      // Radius is ~30% van de smalste dimensie, met floor 100 en cap 220.
      const min = Math.min(w, h);
      setRadius(Math.max(100, Math.min(220, Math.round(min * 0.3))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!autoRotate) return;
    const t = setInterval(() => {
      setRotationAngle((a) => Number(((a + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(t);
  }, [autoRotate]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedId(null);
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      setAutoRotate(true);
    } else {
      setExpandedId(id);
      setAutoRotate(false);
      const idx = normalized.findIndex((it) => it.id === id);
      if (idx >= 0) {
        const target = (idx / normalized.length) * 360;
        setRotationAngle(270 - target);
      }
    }
  };

  const isRelatedToActive = (id: number) => {
    if (expandedId == null) return false;
    const active = normalized.find((it) => it.id === expandedId);
    return active?.relatedIds.includes(id) ?? false;
  };

  const calcPos = (idx: number) => {
    const angle = ((idx / normalized.length) * 360 + rotationAngle) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);
    const zIndex = Math.round(100 + 50 * Math.cos(rad));
    const opacity = Math.max(0.55, 0.55 + 0.45 * ((1 + Math.sin(rad)) / 2));
    return { x, y, zIndex, opacity };
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={cn(
        "relative w-full h-[420px] sm:h-[520px] md:h-[640px] flex items-center justify-center overflow-hidden rounded-3xl",
        className,
      )}
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, hsl(225 50% 20%) 0%, hsl(230 60% 10%) 60%, hsl(232 70% 6%) 100%)",
      }}
    >
      {/* Subtiele star-flecken voor depth (geen lib nodig) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 60% 70%, white, transparent), radial-gradient(1px 1px at 80% 20%, white, transparent), radial-gradient(1px 1px at 40% 80%, white, transparent), radial-gradient(1.5px 1.5px at 10% 50%, white, transparent), radial-gradient(1.5px 1.5px at 90% 60%, white, transparent), radial-gradient(1px 1px at 50% 10%, white, transparent)",
          backgroundSize: "100% 100%",
        }}
      />

      <div
        ref={orbitRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Center node: pulserende cyan blob met dubbele ping-rings */}
        <div className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 shadow-[0_0_40px_rgba(45,212,191,0.6)] animate-pulse">
          <div className="absolute h-20 w-20 rounded-full border border-cyan-300/30 animate-ping opacity-70" />
          <div
            className="absolute h-24 w-24 rounded-full border border-cyan-300/15 animate-ping opacity-50"
            style={{ animationDelay: "0.5s" }}
          />
          <div className="h-7 w-7 rounded-full bg-white/90 backdrop-blur-md" />
        </div>

        {/* Orbit ring - duidelijk zichtbaar */}
        <div
          className="absolute rounded-full border border-cyan-300/25"
          style={{ width: radius * 2, height: radius * 2 }}
        />
        <div
          className="absolute rounded-full border border-white/10"
          style={{ width: radius * 2 + 24, height: radius * 2 + 24 }}
        />

        {/* Nodes */}
        {normalized.map((item, idx) => {
          const pos = calcPos(idx);
          const isExpanded = expandedId === item.id;
          const isRelated = isRelatedToActive(item.id);
          const Icon = item.icon;
          const status = item.status as OrbitalStatus;

          return (
            <div
              key={item.id}
              className="absolute transition-all duration-700 cursor-pointer"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                zIndex: isExpanded ? 200 : pos.zIndex,
                opacity: isExpanded ? 1 : pos.opacity,
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              {/* Energy glow ring */}
              <div
                className={cn(
                  "absolute rounded-full -inset-1 pointer-events-none",
                  isRelated && "animate-pulse",
                )}
                style={{
                  background:
                    "radial-gradient(circle, rgba(45,212,191,0.4) 0%, rgba(45,212,191,0) 70%)",
                  width: `${item.energy * 0.5 + 50}px`,
                  height: `${item.energy * 0.5 + 50}px`,
                  left: `-${(item.energy * 0.5 + 10) / 2}px`,
                  top: `-${(item.energy * 0.5 + 10) / 2}px`,
                }}
              />

              {/* Node circle - altijd licht over donkere bg */}
              <div
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-lg",
                  isExpanded
                    ? "scale-150 bg-white text-zinc-900 border-cyan-300 shadow-[0_0_30px_rgba(45,212,191,0.7)]"
                    : isRelated
                      ? "bg-cyan-300/95 text-zinc-900 border-cyan-200 animate-pulse"
                      : "bg-zinc-800/90 text-white border-cyan-300/50 hover:bg-zinc-700",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Label onder node - altijd zichtbaar in licht over dark bg */}
              <div
                className={cn(
                  "absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300",
                  isExpanded ? "scale-110 text-white" : "text-white/80",
                )}
                style={{
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                }}
              >
                {item.title}
              </div>

              {/* Detail card */}
              {isExpanded && (
                <div
                  className="absolute top-24 left-1/2 -translate-x-1/2 w-64 max-w-[80vw] rounded-lg border border-cyan-300/30 bg-zinc-950/95 backdrop-blur-lg p-4 shadow-[0_0_30px_rgba(45,212,191,0.25)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-3 w-px bg-cyan-300/60" />
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border",
                        STATUS_BADGE[status],
                      )}
                    >
                      {STATUS_LABEL[status]}
                    </span>
                    {item.date && (
                      <span className="text-xs font-mono text-white/60">
                        {item.date}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-white">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="mt-2 text-xs leading-relaxed text-white/80">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-3 border-t border-white/10 pt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <Zap size={10} />
                        Voortgang
                      </span>
                      <span className="font-mono">{item.energy}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{ width: `${item.energy}%` }}
                      />
                    </div>
                  </div>

                  {item.relatedIds.length > 0 && (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <div className="mb-2 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-white/70">
                        <Link2 size={10} />
                        Verbonden met
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.relatedIds.map((relId) => {
                          const rel = normalized.find((it) => it.id === relId);
                          if (!rel) return null;
                          return (
                            <button
                              key={relId}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(relId);
                              }}
                              className="flex items-center gap-1 rounded border border-cyan-300/30 bg-transparent px-2 py-1 text-[10px] text-white/80 hover:bg-cyan-300/10 hover:text-white transition"
                            >
                              {rel.title}
                              <ArrowRight size={8} className="text-cyan-300/70" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
