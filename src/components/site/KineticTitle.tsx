import type { ReactNode } from "react";

type TitleTag = "h1" | "h2" | "h3" | "p" | "span";

export function KineticTitle({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: TitleTag;
  className?: string;
}) {
  const words = children.split(/\s+/).filter(Boolean);
  return (
    <Tag className={`kinetic-title font-display ${className}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="kinetic-word">
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

export function PageHero({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-5 pb-4 pt-12 md:px-10 md:pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-blush/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-8 h-72 w-72 rounded-full bg-moss/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="kicker">{kicker}</p>
        <KineticTitle as="h1" className="mt-4 max-w-[14ch] text-5xl leading-[0.92] text-ink md:text-7xl lg:text-8xl">
          {title}
        </KineticTitle>
        {lede ? <div className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{lede}</div> : null}
        {children}
      </div>
    </section>
  );
}
