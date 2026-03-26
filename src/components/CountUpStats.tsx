"use client";

import { useEffect, useRef, useState } from "react";

const stats: { value: number; suffix: string; label: string }[] = [
  { value: 500, suffix: "+", label: "Happy Customers" },
  { value: 100, suffix: "%", label: "Quality Inspected" },
  { value: 24, suffix: "hr", label: "Pickup or Delivery" },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let raf: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return count;
}

export function CountUpStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        background: "var(--ccf-white)",
        borderRadius: "var(--ccf-radius-lg)",
        boxShadow: "var(--ccf-shadow-md)",
        overflow: "hidden",
      }}
    >
      {stats.map((stat, idx) => (
        <StatItem key={stat.label} stat={stat} visible={visible} isLast={idx === stats.length - 1} />
      ))}
    </div>
  );
}

function StatItem({ stat, visible, isLast }: { stat: (typeof stats)[number]; visible: boolean; isLast: boolean }) {
  const count = useCountUp(stat.value, stat.value > 100 ? 2000 : 1200, visible);

  return (
    <div
      style={{
        padding: "1.5rem 0.75rem",
        textAlign: "center",
        borderRight: isLast ? "none" : "1px solid var(--ccf-gray-light)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--ccf-font-display)",
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          color: "var(--ccf-navy)",
          lineHeight: 1.1,
        }}
      >
        {count}
        <span style={{ color: "var(--ccf-cyan)" }}>{stat.suffix}</span>
      </div>
      <div style={{
        fontFamily: "var(--ccf-font-display)",
        fontWeight: 600,
        fontSize: "0.6875rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginTop: "0.375rem",
        color: "var(--ccf-gray)",
      }}>
        {stat.label}
      </div>
    </div>
  );
}
