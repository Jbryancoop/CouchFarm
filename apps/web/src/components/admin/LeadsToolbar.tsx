"use client";

import { useRef, useState, useEffect } from "react";

export interface SortOption {
  value: string;
  label: string;
}

export interface LeadsToolbarState {
  search: string;
  statuses: string[];
  sort: string;
}

/**
 * Reusable admin toolbar for lead-style lists (inquiries, buy requests).
 * Provides a search input, a status multi-filter, and a sort select.
 * Generic over entity — the status set and sort options are passed in as props,
 * and the active state is reported up via onChange (controlled by the parent).
 */
export function LeadsToolbar({
  state,
  onChange,
  statusOptions,
  sortOptions,
  resultCount,
  onAdd,
  addLabel,
  searchPlaceholder = "Search name, email, phone...",
}: {
  state: LeadsToolbarState;
  onChange: (next: LeadsToolbarState) => void;
  statusOptions: string[];
  sortOptions: SortOption[];
  resultCount: number;
  onAdd: () => void;
  addLabel: string;
  searchPlaceholder?: string;
}) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchInput, setSearchInput] = useState(state.search);

  // Keep the local input in sync when the parent resets search (e.g. Clear).
  useEffect(() => {
    setSearchInput(state.search);
  }, [state.search]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ ...state, search: value });
    }, 250);
  }

  function toggleStatus(status: string) {
    const next = state.statuses.includes(status)
      ? state.statuses.filter((s) => s !== status)
      : [...state.statuses, status];
    onChange({ ...state, statuses: next });
  }

  function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ ...state, sort: e.target.value });
  }

  const activeFilters = state.statuses.length + (state.search ? 1 : 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearch}
          placeholder={searchPlaceholder}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        />
        <select
          value={state.sort}
          onChange={handleSort}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white sm:w-56"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onAdd}
          className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 py-2 rounded-lg transition whitespace-nowrap"
        >
          {addLabel}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {statusOptions.map((status) => {
          const active = state.statuses.includes(status);
          return (
            <button
              key={status}
              type="button"
              onClick={() => toggleStatus(status)}
              className={`text-xs px-3 py-1 rounded-full font-medium border transition ${
                active
                  ? "bg-brand-500 border-brand-500 text-white"
                  : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {status}
            </button>
          );
        })}
        {activeFilters > 0 && (
          <button
            type="button"
            onClick={() => onChange({ ...state, search: "", statuses: [] })}
            className="text-xs text-red-600 hover:underline ml-1"
          >
            Clear ({activeFilters})
          </button>
        )}
        <span className="ml-auto text-sm text-gray-500">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      </div>
    </div>
  );
}
