"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const stats: { value: number; suffix: string; label: string; icon: ReactNode }[] = [
  {
    value: 500,
    suffix: "+",
    label: "Happy Customers",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 mx-auto text-brand-500">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: 100,
    suffix: "%",
    label: "Quality Inspected",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 mx-auto text-ranch-500">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    value: 1,
    suffix: "-Day",
    label: "Same-Day Pickup",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 mx-auto text-brand-600">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
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
      // Ease out cubic
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
      className="bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 overflow-hidden"
    >
      {stats.map((stat) => (
        <StatItem key={stat.label} stat={stat} visible={visible} />
      ))}
    </div>
  );
}

function StatItem({ stat, visible }: { stat: (typeof stats)[number]; visible: boolean }) {
  const count = useCountUp(stat.value, stat.value > 100 ? 2000 : 1200, visible);

  return (
    <div className="py-6 px-3 text-center group hover:bg-gray-50/50 transition-colors">
      <div className="mb-2 group-hover:scale-110 transition-transform duration-300">
        {stat.icon}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-ranch-800">
        {count}
        <span className="text-brand-500">{stat.suffix}</span>
      </div>
      <div className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</div>
    </div>
  );
}
