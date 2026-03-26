"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

interface InventoryFilterProps {
  styles: { value: string; label: string }[];
  colors: string[];
  initialStyles?: string[];
  initialColors?: string[];
  totalCount: number;
  onFilter: (filters: { styles: string[]; colors: string[]; search: string }) => void;
}

export default function InventoryFilter({
  styles,
  colors,
  initialStyles = [],
  initialColors = [],
  totalCount,
  onFilter,
}: InventoryFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialStyles);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFilterRef = useRef(onFilter);

  useEffect(() => {
    onFilterRef.current = onFilter;
  }, [onFilter]);

  const fireFilter = useCallback(
    (overrides: Partial<{ styles: string[]; colors: string[]; search: string }>) => {
      const filters = {
        styles: overrides.styles ?? selectedStyles,
        colors: overrides.colors ?? selectedColors,
        search: overrides.search ?? search,
      };
      onFilterRef.current(filters);
    },
    [selectedStyles, selectedColors, search]
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
    let next: string[];
    if (selectedStyles.includes(value)) {
      next = selectedStyles.filter((s) => s !== value);
    } else {
      next = [...selectedStyles, value];
    }
    setSelectedStyles(next);
    fireFilter({ styles: next });
  };

  const handleAllStyles = () => {
    setSelectedStyles([]);
    fireFilter({ styles: [] });
  };

  const handleColorClick = (color: string) => {
    let next: string[];
    if (selectedColors.includes(color)) {
      next = selectedColors.filter((c) => c !== color);
    } else {
      next = [...selectedColors, color];
    }
    setSelectedColors(next);
    fireFilter({ colors: next });
  };

  const handleAllColors = () => {
    setSelectedColors([]);
    fireFilter({ colors: [] });
  };

  const activeCount =
    selectedStyles.length + selectedColors.length + (search ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    setSelectedStyles([]);
    setSelectedColors([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onFilterRef.current({ styles: [], colors: [], search: "" });
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const allStylesSelected = selectedStyles.length === 0;
  const allColorsSelected = selectedColors.length === 0;

  const COLOR_HEX: Record<string, string> = {
    Beige: "#F5F5DC",
    Black: "#1a1a1a",
    Brown: "#8B4513",
    Cream: "#FFFDD0",
    Gray: "#9CA3AF",
    Tan: "#D2B48C",
    White: "#FFFFFF",
  };

  const pill = (
    isActive: boolean,
    onClick: () => void,
    label: string,
    key: string
  ) => (
    <button
      key={key}
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: "6px 14px",
        borderRadius: 50,
        border: isActive ? "2px solid var(--ccf-navy)" : "1.5px solid var(--ccf-gray-light)",
        background: isActive ? "var(--ccf-navy)" : "var(--ccf-white)",
        color: isActive ? "var(--ccf-white)" : "var(--ccf-black)",
        fontSize: "13px",
        fontWeight: isActive ? 600 : 400,
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );

  const colorPill = (
    isActive: boolean,
    onClick: () => void,
    label: string,
    key: string
  ) => {
    const hex = COLOR_HEX[label] || "#ccc";
    const isLight = label === "White" || label === "Cream" || label === "Beige";
    return (
      <button
        key={key}
        onClick={onClick}
        style={{
          flexShrink: 0,
          padding: "5px 12px 5px 8px",
          borderRadius: 50,
          border: isActive ? "2px solid var(--ccf-navy)" : "1.5px solid var(--ccf-gray-light)",
          background: isActive ? "var(--ccf-navy)" : "var(--ccf-white)",
          color: isActive ? "var(--ccf-white)" : "var(--ccf-black)",
          fontSize: "13px",
          fontWeight: isActive ? 600 : 400,
          fontFamily: "inherit",
          cursor: "pointer",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: hex,
            border: isLight ? "1.5px solid var(--ccf-gray-light)" : "1.5px solid transparent",
            flexShrink: 0,
          }}
        />
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        background: "var(--ccf-white)",
        borderRadius: 20,
        boxShadow: "0 2px 16px rgba(0,57,134,0.06)",
        padding: "20px 24px",
        marginBottom: 28,
        fontFamily: "var(--ccf-font-display), sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Search */}
      <div style={{ position: "relative" }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--ccf-gray)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
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
            padding: "10px 14px 10px 40px",
            border: "1.5px solid var(--ccf-gray-light)",
            borderRadius: 12,
            fontSize: 14,
            fontFamily: "inherit",
            color: "var(--ccf-black)",
            background: "var(--ccf-white)",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ccf-cyan)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ccf-gray-light)")}
        />
      </div>

      {/* Style row */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ccf-gray)", marginBottom: 6, display: "block" }}>
          Style
        </span>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none", flexWrap: "wrap" }}>
          {pill(allStylesSelected, handleAllStyles, "All", "style-all")}
          {styles.map((s) =>
            pill(selectedStyles.includes(s.value), () => handleStyleClick(s.value), s.label, `style-${s.value}`)
          )}
        </div>
      </div>

      {/* Color row — text pills, not swatches */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ccf-gray)", marginBottom: 6, display: "block" }}>
          Color
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {pill(allColorsSelected, handleAllColors, "All", "color-all")}
          {colors.map((color) =>
            colorPill(selectedColors.includes(color), () => handleColorClick(color), color, `color-${color}`)
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4, borderTop: "1px solid var(--ccf-gray-light)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              style={{
                background: "none",
                border: "none",
                color: "var(--ccf-cherry)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              Clear filters ({activeCount})
            </button>
          )}
        </div>
        <span style={{ fontSize: 13, color: "var(--ccf-gray)", fontWeight: 500 }}>
          {totalCount} {totalCount === 1 ? "couch" : "couches"}
        </span>
      </div>
    </div>
  );
}
