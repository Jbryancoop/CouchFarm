"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface LightboxImage {
  id: string;
  url: string;
  alt: string | null;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  title: string;
}

export function ImageLightbox({ images, title }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const isOpen = activeIndex !== null;
  const hasMultiple = images.length > 1;

  const open = useCallback((index: number) => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setActiveIndex(index);
  }, []);

  const close = useCallback(() => {
    setActiveIndex(null);
    // Restore focus to the element that triggered the lightbox
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 0);
  }, []);

  const goNext = useCallback(() => {
    if (!hasMultiple || activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, hasMultiple]);

  const goPrev = useCallback(() => {
    if (!hasMultiple || activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, hasMultiple]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          close();
          break;
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case "Tab": {
          // Basic focus trapping within the lightbox
          const focusable = backdropRef.current?.querySelectorAll<HTMLElement>(
            'button, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable || focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close, goNext, goPrev]);

  // Lock body scroll and focus close button when lightbox opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus the close button after render
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (images.length === 0) return null;

  const currentImage = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      {/* ── Thumbnail Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
        }}
      >
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => open(i)}
            aria-label={`View ${img.alt || title}, image ${i + 1} of ${images.length}`}
            style={{
              gridColumn: i === 0 ? "1 / -1" : undefined,
              aspectRatio: i === 0 ? "16 / 9" : "4 / 3",
              position: "relative",
              overflow: "hidden",
              borderRadius: "var(--ccf-radius-sm, 12px)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: "var(--ccf-cyan-bg, #e8f9fe)",
              boxShadow: "var(--ccf-shadow-lg)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <img
              src={img.url}
              alt={img.alt || title}
              loading={i === 0 ? "eager" : "lazy"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Hover overlay hint */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 57, 134, 0.08)",
                opacity: 0,
                transition: "opacity 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            />
          </button>
        ))}
      </div>

      {/* ── Lightbox Overlay ── */}
      {isOpen && currentImage && (
        <div
          ref={backdropRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Image gallery for ${title}, showing image ${activeIndex! + 1} of ${images.length}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(10, 22, 40, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "ccf-lightbox-fadein 0.25s ease-out",
          }}
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close lightbox"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              zIndex: 10001,
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(0, 57, 134, 0.6)",
              color: "var(--ccf-white, #fff)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontFamily: "var(--ccf-font-display, Rubik, sans-serif)",
              fontWeight: 700,
              lineHeight: 1,
              transition: "background 0.2s ease, border-color 0.2s ease",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(0, 57, 134, 0.9)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--ccf-cyan, #0DD5FF)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(0, 57, 134, 0.6)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>

          {/* Previous Arrow */}
          {hasMultiple && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10001,
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(0, 57, 134, 0.6)",
                color: "var(--ccf-white, #fff)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0, 57, 134, 0.9)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--ccf-cyan, #0DD5FF)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0, 57, 134, 0.6)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="13,4 7,10 13,16" />
              </svg>
            </button>
          )}

          {/* Main Image */}
          <img
            src={currentImage.url}
            alt={currentImage.alt || `${title}, image ${activeIndex! + 1}`}
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: "var(--ccf-radius, 20px)",
              boxShadow: "0 8px 40px rgba(0, 0, 0, 0.5)",
              userSelect: "none",
            }}
            draggable={false}
          />

          {/* Next Arrow */}
          {hasMultiple && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10001,
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(0, 57, 134, 0.6)",
                color: "var(--ccf-white, #fff)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0, 57, 134, 0.9)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--ccf-cyan, #0DD5FF)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0, 57, 134, 0.6)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="7,4 13,10 7,16" />
              </svg>
            </button>
          )}

          {/* Image Counter */}
          {hasMultiple && (
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--ccf-font-display, Rubik, sans-serif)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "rgba(255, 255, 255, 0.8)",
                background: "rgba(0, 57, 134, 0.6)",
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--ccf-radius-sm, 12px)",
                letterSpacing: "0.05em",
                userSelect: "none",
              }}
            >
              {activeIndex! + 1} / {images.length}
            </div>
          )}

          {/* Keyframes injected via style tag */}
          <style>{`
            @keyframes ccf-lightbox-fadein {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
