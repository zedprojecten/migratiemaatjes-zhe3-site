/**
 * AnimatedChatDemo, typing-animatie chatbot widget met user/AI messages,
 * reference-badges, online-indicator en mac-style window chrome.
 *
 * Bron: huurchecker (Puntify) door Kick van Zurlohe, DemoChatAnimation.tsx,
 * geport en geneutraliseerd voor library-gebruik. Origineel sluit aan op
 * Puntify AI Coach met domain-specifieke content; deze versie heeft
 * herbruikbare demo-prompts. De animatielogica (IntersectionObserver,
 * char-by-char typing, ref-badge afterglow, typing-bubble) is identiek.
 */
import { useState, useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

const CHAT_HEIGHT = 520;

const RefBadge = ({ refText }: { refText: string }) => (
  <span
    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold mx-0.5 cursor-default"
    style={{
      background: "hsl(var(--primary) / 0.12)",
      color: "hsl(var(--primary))",
      border: "1px solid hsl(var(--primary) / 0.2)",
    }}
  >
    {refText}
  </span>
);

const renderTextWithRefs = (text: string, refs?: string[]) => {
  if (!refs || refs.length === 0) return text;
  return (
    <>
      {text}
      <span
        className="block mt-2 pt-2"
        style={{ borderTop: "1px solid var(--glass-border)" }}
      >
        {refs.map((r, i) => (
          <RefBadge key={i} refText={r} />
        ))}
      </span>
    </>
  );
};

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  refs?: string[];
}

interface AnimatedChatDemoProps {
  /** Custom script, anders default demo conversatie. */
  script?: ChatMessage[];
  /** Window-titel boven de chat. Default "AI Assistent". */
  windowTitle?: string;
  /** Online-label rechtsboven. Default "Online". */
  onlineLabel?: string;
}

const DEFAULT_SCRIPT: ChatMessage[] = [
  {
    role: "user",
    text: "Hoi, ik wil een nieuwe site voor mijn bakkerij. Hoe snel kan dat live?",
  },
  {
    role: "ai",
    text:
      "Hallo! Een bakkerij-site met online bestelmodule krijgen we binnen 5 werkdagen op je eigen domein. We bouwen op een snelle React + Vite stack met cache-vriendelijke afbeeldingen, dus Lighthouse-scores zitten standaard boven de 95.\n\nBelangrijkste keuzes voor jouw branche:\n\n1. Bestel-flow direct in de hero zodat klanten geen omweg hoeven te maken\n2. Mobiele optimalisatie voor zaterdagochtend-pieken\n3. Google My Business + lokale SEO ingebakken",
    refs: ["Case: Bakkerij De Korenmolen", "Pakket Snelstart"],
  },
  {
    role: "user",
    text:
      "Wat kost dat ongeveer en zit nazorg erbij?",
  },
  {
    role: "ai",
    text:
      "Vaste prijs van €2.450 inclusief domein-koppeling, hosting voor 12 maanden en 30 dagen onbeperkte aanpassingen na livegang. Daarna kun je instappen in een care-pakket vanaf €25 per maand voor maandelijkse updates en monitoring.\n\nIn de prijs zit:\n\n• Custom design op jouw merk\n• Tot 5 pagina's met SEO-fundament\n• Bestelformulier met mailbevestiging\n• 1 review-ronde plus revisierondes tot je tevreden bent",
    refs: ["Pakketten overzicht", "Algemene voorwaarden"],
  },
];

export default function AnimatedChatDemo({
  script,
  windowTitle = "AI Assistent",
  onlineLabel = "Online",
}: AnimatedChatDemoProps) {
  const chatScript = script ?? DEFAULT_SCRIPT;

  const [visibleMessages, setVisibleMessages] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMsgFullyTyped, setCurrentMsgFullyTyped] = useState<boolean[]>(
    [],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const chatScriptRef = useRef(chatScript);
  chatScriptRef.current = chatScript;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          startSequence();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markTyped = (idx: number) => {
    setCurrentMsgFullyTyped((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const startSequence = () => {
    let msgIndex = 0;
    const s = chatScriptRef.current;

    const showNext = () => {
      if (msgIndex >= s.length) return;

      if (s[msgIndex].role === "ai") {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(msgIndex + 1);
          setTypingIndex(0);
          typeText(msgIndex, () => {
            markTyped(msgIndex);
            msgIndex++;
            setTimeout(showNext, 800);
          });
        }, 1200);
      } else {
        setVisibleMessages(msgIndex + 1);
        setTypingIndex(s[msgIndex].text.length);
        markTyped(msgIndex);
        msgIndex++;
        setTimeout(showNext, 600);
      }
    };

    const typeText = (idx: number, onDone: () => void) => {
      const fullText = s[idx].text;
      let charIdx = 0;
      const interval = setInterval(() => {
        charIdx += 4;
        setTypingIndex(Math.min(charIdx, fullText.length));
        if (charIdx >= fullText.length) {
          clearInterval(interval);
          setTimeout(onDone, 300);
        }
      }, 15);
    };

    setTimeout(showNext, 500);
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-2xl mx-auto"
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid var(--glass-border)",
        background: "var(--glass-bg)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3.5"
        style={{
          borderBottom: "1px solid var(--glass-border)",
          background: "var(--glass-bg)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center -ml-12">
          <Bot className="h-4 w-4" style={{ color: "hsl(var(--primary))" }} />
          <span className="text-sm font-semibold">{windowTitle}</span>
        </div>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] text-muted-foreground">{onlineLabel}</span>
        </span>
      </div>

      <div
        className="px-5 py-5 space-y-4 overflow-y-auto"
        style={{ height: `${CHAT_HEIGHT}px` }}
      >
        {chatScript.slice(0, visibleMessages).map((msg, i) => {
          const isLast = i === visibleMessages - 1;
          const fullyTyped = currentMsgFullyTyped[i];
          const displayText =
            isLast && msg.role === "ai" && !fullyTyped
              ? msg.text.slice(0, typingIndex)
              : msg.text;

          const showRefs = fullyTyped && msg.role === "ai" && msg.refs;

          return (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-1"
                style={{
                  background:
                    msg.role === "ai"
                      ? "hsl(var(--primary) / 0.12)"
                      : "hsl(var(--foreground) / 0.08)",
                }}
              >
                {msg.role === "ai" ? (
                  <Bot className="h-4 w-4" style={{ color: "hsl(var(--primary))" }} />
                ) : (
                  <User className="h-4 w-4" style={{ color: "hsl(var(--foreground))" }} />
                )}
              </div>
              <div
                className="rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed"
                style={{
                  background:
                    msg.role === "user"
                      ? "hsl(var(--primary))"
                      : "var(--glass-bg)",
                  color: msg.role === "user" ? "hsl(var(--primary-foreground))" : undefined,
                  border: msg.role === "ai" ? "1px solid var(--glass-border)" : undefined,
                  whiteSpace: "pre-wrap",
                }}
              >
                {showRefs ? renderTextWithRefs(displayText, msg.refs) : displayText}
                {isLast && msg.role === "ai" && !fullyTyped && (
                  <span
                    className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
                    style={{
                      background: "hsl(var(--primary))",
                      verticalAlign: "text-bottom",
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
              style={{ background: "hsl(var(--primary) / 0.12)" }}
            >
              <Bot className="h-4 w-4" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
