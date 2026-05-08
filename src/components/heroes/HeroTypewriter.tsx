import { useState, useEffect } from "react";

interface HeroTypewriterProps {
  /** Lines to type out sequentially */
  lines: string[];
  /** Typing speed in ms per character (default 60) */
  typingSpeed?: number;
  /** Delay between lines in ms (default 1500) */
  lineDelay?: number;
  /** Whether to loop (default false) */
  loop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Hero with typewriter effect, heading types itself out letter by letter.
 * More "tech" feel than TextReveal. Good for SaaS, tech, innovation sites.
 */
export function HeroTypewriter({
  lines,
  typingSpeed = 60,
  lineDelay = 1500,
  loop = false,
  className = "",
  children,
}: HeroTypewriterProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const currentLine = lines[lineIndex] ?? "";

    if (!isDeleting && charIndex < currentLine.length) {
      const t = setTimeout(() => {
        setDisplayText(currentLine.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, typingSpeed);
      return () => clearTimeout(t);
    }

    if (!isDeleting && charIndex >= currentLine.length) {
      if (lineIndex < lines.length - 1 || loop) {
        const t = setTimeout(() => setIsDeleting(true), lineDelay);
        return () => clearTimeout(t);
      }
      return;
    }

    if (isDeleting && charIndex > 0) {
      const t = setTimeout(() => {
        setDisplayText(currentLine.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, typingSpeed / 2);
      return () => clearTimeout(t);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setLineIndex((l) => (l + 1) % lines.length);
    }
  }, [lines, lineIndex, charIndex, isDeleting, typingSpeed, lineDelay, loop]);

  return (
    <section
      className={`relative min-h-[80vh] flex items-center justify-center overflow-hidden ${className}`}
    >
      {children}
      <div className="relative z-10 container text-center">
        <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight min-h-[1.2em]">
          {displayText}
          <span className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 animate-blink align-middle" />
        </h1>
      </div>
    </section>
  );
}

export default HeroTypewriter;
