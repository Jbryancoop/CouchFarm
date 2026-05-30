"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale";
  threshold?: number;
  duration?: number;
  once?: boolean;
  style?: React.CSSProperties;
}

const variantStyles: Record<string, { hidden: React.CSSProperties; visible: React.CSSProperties }> = {
  "fade-up": {
    hidden: { opacity: 0, transform: "translateY(20px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-left": {
    hidden: { opacity: 0, transform: "translateX(-20px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  "fade-right": {
    hidden: { opacity: 0, transform: "translateX(20px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  scale: {
    hidden: { opacity: 0, transform: "scale(0.95)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
};

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
  threshold = 0.15,
  duration = 500,
  once = true,
  style,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkViewport = () => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    // If already in viewport on mount, show immediately
    if (checkViewport()) {
      const timer = setTimeout(() => setIsVisible(true), delay || 50);
      return () => clearTimeout(timer);
    }

    // Set up IntersectionObserver for scroll-into-view
    let done = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          done = true;
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);

    // Scroll listener fallback for environments where IntersectionObserver
    // doesn't fire reliably (e.g. headless/preview browsers)
    const onScroll = () => {
      if (done) return;
      if (checkViewport()) {
        done = true;
        setIsVisible(true);
        if (once) {
          observer.unobserve(el);
          window.removeEventListener("scroll", onScroll, true);
        }
      }
    };
    window.addEventListener("scroll", onScroll, true);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [threshold, once, delay]);

  const styles = variantStyles[variant];
  const currentStyles = isVisible ? styles.visible : styles.hidden;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
        ...currentStyles,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StaggerChildren({
  children,
  className = "",
  staggerMs = 100,
  variant = "fade-up" as AnimateInProps["variant"],
  style,
}: {
  children: ReactNode[];
  className?: string;
  staggerMs?: number;
  variant?: AnimateInProps["variant"];
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {children.map((child, i) => (
        <AnimateIn key={i} delay={i * staggerMs} variant={variant}>
          {child}
        </AnimateIn>
      ))}
    </div>
  );
}
