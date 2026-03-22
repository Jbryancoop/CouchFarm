"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface HeroParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  style?: React.CSSProperties;
}

export function HeroParallax({
  children,
  speed = 0.3,
  className,
  style,
}: HeroParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const rafId = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isInViewport = rect.bottom > 0 && rect.top < windowHeight;
      if (!isInViewport) return;

      setOffset(window.scrollY * speed);
    });
  }, [speed]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isMobile, handleScroll]);

  if (isMobile) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `translateY(${offset}px)`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const rafId = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isInViewport = rect.bottom > 0 && rect.top < windowHeight;
      if (!isInViewport) return;

      setOffset(window.scrollY * speed);
    });
  }, [speed]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isMobile, handleScroll]);

  if (isMobile) {
    return (
      <div ref={ref} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        ...style,
        transform: `translateY(${offset}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
