"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "ccf-favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getFavoriteCount(): number {
  return getFavorites().length;
}

function setFavorites(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

const HEART_OUTLINE =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const HEART_FILLED =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const POP_KEYFRAMES = `
@keyframes ccf-heart-pop {
  0% { transform: scale(1) rotate(0deg); }
  30% { transform: scale(1.3) rotate(-8deg); }
  60% { transform: scale(1.3) rotate(6deg); }
  80% { transform: scale(1.05) rotate(-2deg); }
  100% { transform: scale(1) rotate(0deg); }
}
`;

interface FavoriteButtonProps {
  couchId: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({
  couchId,
  size = "md",
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);
  const styleInjectedRef = useRef(false);

  useEffect(() => {
    if (!styleInjectedRef.current) {
      const style = document.createElement("style");
      style.textContent = POP_KEYFRAMES;
      document.head.appendChild(style);
      styleInjectedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const favorites = getFavorites();
    setIsFavorited(favorites.includes(couchId));
  }, [couchId]);

  const handleClick = useCallback(() => {
    const favorites = getFavorites();
    let next: boolean;

    if (favorites.includes(couchId)) {
      setFavorites(favorites.filter((id) => id !== couchId));
      next = false;
    } else {
      setFavorites([...favorites, couchId]);
      next = true;
    }

    setIsFavorited(next);

    if (next) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
    }
  }, [couchId]);

  const btnSize = size === "sm" ? 32 : 40;
  const iconSize = size === "sm" ? 18 : 22;

  const color = isFavorited
    ? "var(--ccf-cherry, #FB104B)"
    : "var(--ccf-gray, #5A6A7E)";

  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: btnSize,
    height: btnSize,
    borderRadius: "var(--ccf-radius-pill, 50px)",
    border: "none",
    background: "var(--ccf-white, #ffffff)",
    cursor: "pointer",
    padding: 0,
    fontFamily: "var(--ccf-font-display, Rubik), sans-serif",
    transition: "box-shadow 0.15s ease",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    animation: animating ? "ccf-heart-pop 300ms ease-out" : "none",
  };

  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={handleClick}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorited}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <path
          d={isFavorited ? HEART_FILLED : HEART_OUTLINE}
          fill={isFavorited ? color : "none"}
          stroke={color}
          strokeWidth={isFavorited ? 0 : 2}
        />
      </svg>
    </button>
  );
}
