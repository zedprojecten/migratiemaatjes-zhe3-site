/**
 * Onderhoudsmodus-overlay (roadmap B6). Rendert ALLEEN als de Vercel-env
 * VITE_MAINTENANCE === "1" (gezet via het klantportaal; wijziging is actief
 * na de automatische redeploy, ~2 min). Bedrijfsnaam en contact blijven
 * zichtbaar zodat bezoekers niet tegen een dode muur aanlopen.
 */
export function MaintenanceOverlay() {
  // Cast i.p.v. directe typing: oudere site-tsconfigs missen vite/client-types.
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (env?.VITE_MAINTENANCE !== "1") return null;
  const business = env?.VITE_BUSINESS_NAME || "Deze site";
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10,10,12,0.97)",
        color: "#fff",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 420 }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Even onderhoud
        </h1>
        <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
          {business} is zo terug. We voeren kort onderhoud uit; probeer het over
          een paar minuten opnieuw.
        </p>
      </div>
    </div>
  );
}
