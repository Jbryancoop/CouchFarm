"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

interface InventoryFilterProps {
  styles: { value: string; label: string }[];
  colors: string[];
  initialStyle?: string;
  initialColor?: string;
  totalCount: number;
  onFilter: (filters: { style: string; color: string; search: string }) => void;
}

const COLOR_MAP: Record<string, string> = {
  Beige: "#F5F5DC",
  Black: "#1a1a1a",
  Blue: "#3B82F6",
  Brown: "#8B4513",
  Cream: "#FFFDD0",
  Gray: "#9CA3AF",
  Green: "#22C55E",
  Navy: "#003986",
  Orange: "#F97316",
  Red: "#EF4444",
  Tan: "#D2B48C",
  White: "#FFFFFF",
};

export default function InventoryFilter({
  styles,
  colors,
  initialStyle = "",
  initialColor = "",
  totalCount,
  onFilter,
}: InventoryFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFilterRef = useRef(onFilter);

  useEffect(() => {
    onFilterRef.current = onFilter;
  }, [onFilter]);

  const fireFilter = useCallback(
    (overrides: Partial<{ style: string; color: string; search: string }>) => {
      const filters = {
        style: overrides.style ?? selectedStyle,
        color: overrides.color ?? selectedColor,
        search: overrides.search ?? search,
      };
      onFilterRef.current(filters);
    },
    [selectedStyle, selectedColor, search]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fireFilter({ search: value });
    }, 300);
  };

  const handleStyleClick = (value: string) => {
    setSelectedStyle(value);
    fireFilter({ style: value });
  };

  const handleColorClick = (color: string) => {
    const next = selectedColor === color ? "" : color;
    setSelectedColor(next);
    fireFilter({ color: next });
  };

  const activeCount =
    (selectedStyle ? 1 : 0) + (selectedColor ? 1 : 0) + (search ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    setSelectedStyle("");
    setSelectedColor("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onFilterRef.current({ style: "", color: "", search: "" });
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div
      style={{
        background: "var(--ccf-white, #FFFFFF)",
        borderRadius: "var(--ccf-radius, 20px)",
        boxShadow: "var(--ccf-shadow, 0 4px 24px rgba(0,0,0,0.08))",
        padding: "24px",
        marginBottom: "32px",
        fontFamily: "var(--ccf-font-display, Rubik), sans-serif",
      }}
    >
      {/* Search input */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ccf-gray, #5A6A7E)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search couches..."
          style={{
            width: "100%",
            padding: "12px 16px 12px 42px",
            border: "1.5px solid var(--ccf-gray-light, #E8ECF1)",
            borderRadius: "var(--ccf-radius-sm, 12px)",
            fontSize: "15px",
            fontFamily: "inherit",
            color: "var(--ccf-black, #0A1628)",
            background: "var(--ccf-white, #FFFFFF)",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor =
              "var(--ccf-cyan, #0DD5FF)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor =
              "var(--ccf-gray-light, #E8ECF1)")
          }
        />
      </div>

      {/* Style pills */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
          marginBottom: "16px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {[{ value: "", label: "All" }, ...styles].map((s) => {
          const isActive = selectedStyle === s.value;
          return (
            <button
              key={s.value}
              onClick={() => handleStyleClick(s.value)}
              style={{
                flexShrink: 0,
                padding: "8px 18px",
                borderRadius: "var(--ccf-radius-pill, 50px)",
                border: isActive
                  ? "1.5px solid var(--ccf-navy, #003986)"
                  : "1.5px solid var(--ccf-navy, #003986)",
                background: isActive
                  ? "var(--ccf-navy, #003986)"
                  : "var(--ccf-white, #FFFFFF)",
                color: isActive
                  ? "var(--ccf-white, #FFFFFF)"
                  : "var(--ccf-navy, #003986)",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Color swatches */}
      {colors.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "var(--ccf-gray, #5A6A7E)",
              fontWeight: 500,
              marginRight: "4px",
            }}
          >
            Color
          </span>
          {colors.map((color) => {
            const hex = COLOR_MAP[color] || "#ccc";
            const isActive = selectedColor === color;
            const isLight =
              color === "White" || color === "Cream" || color === "Beige";
            return (
              <button
                key={color}
                title={color}
                onClick={() => handleColorClick(color)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: isLight
                    ? "1px solid var(--ccf-gray-light, #E8ECF1)"
                    : "1px solid transparent",
                  background: hex,
                  cursor: "pointer",
                  padding: 0,
                  outline: isActive
                    ? "3px solid var(--ccf-cyan, #0DD5FF)"
                    : "none",
                  outlineOffset: "2px",
                  transition: "outline 0.2s ease",
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Footer: active filters badge, clear all, result count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {activeCount > 0 && (
            <>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--ccf-navy, #003986)",
                  color: "var(--ccf-white, #FFFFFF)",
                  fontSize: "12px",
                  fontWeight: 600,
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  lineHeight: 1,
                }}
              >
                {activeCount}
              </span>
              <button
                onClick={clearAll}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ccf-cherry, #FB104B)",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                }}
              >
                Clear all
              </button>
            </>
          )}
        </div>
        <span
          style={{
            fontSize: "14px",
            color: "var(--ccf-gray, #5A6A7E)",
            fontWeight: 500,
          }}
        >
          {totalCount} {totalCount === 1 ? "couch" : "couches"}
        </span>
      </div>
    </div>
  );
}
