"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  createdAt: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

const DURATION = 4000;

const typeConfig: Record<
  ToastType,
  { bg: string; text: string; icon: ReactNode }
> = {
  success: {
    bg: "#dcfce7",
    text: "#166534",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M4 9.5L7.5 13L14 5"
          stroke="#166534"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  error: {
    bg: "#fde8ed",
    text: "#FB104B",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M5 5L13 13M13 5L5 13"
          stroke="#FB104B"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  info: {
    bg: "#e0f7ff",
    text: "#0AB8DD",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="5" r="1.2" fill="#0AB8DD" />
        <path
          d="M9 8V14"
          stroke="#0AB8DD"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

/* ─── Single Toast ─── */

function ToastSlice({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = typeConfig[toast.type];

  useEffect(() => {
    // trigger enter animation on next frame
    requestAnimationFrame(() => setEntered(true));

    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 350);
    }, DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, onDismiss]);

  const handleClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 350);
  };

  const show = entered && !exiting;

  return (
    <div
      onClick={handleClick}
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px",
        borderRadius: "var(--ccf-radius-pill, 50px)",
        backgroundColor: config.bg,
        color: config.text,
        fontFamily: "var(--ccf-font-display, Rubik), sans-serif",
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.4,
        cursor: "pointer",
        boxShadow: "var(--ccf-shadow-md, 0 4px 16px rgba(0,0,0,0.12))",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(-16px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {config.icon}
      </span>
      <span>{toast.message}</span>

      {/* Progress bar */}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          backgroundColor: config.text,
          opacity: 0.3,
          borderRadius: "0 0 var(--ccf-radius-pill, 50px) var(--ccf-radius-pill, 50px)",
          animation: `toast-progress ${DURATION}ms linear forwards`,
        }}
      />

      {/* keyframes injected inline via a <style> tag at provider level */}
    </div>
  );
}

/* ─── Provider ─── */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, message, type, createdAt: Date.now() }]);
    },
    [],
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Keyframes for progress bar */}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      {/* Toast container */}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          top: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastSlice toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ─── Hook ─── */

export function useToast(): { showToast: (message: string, type?: ToastType) => void } {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
