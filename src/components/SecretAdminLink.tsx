"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Wraps content with a hidden admin shortcut: clicking it 3 times in quick
 * succession navigates to /admin. Lets staff reach the portal without typing
 * the URL, while staying invisible to ordinary visitors.
 */
export function SecretAdminLink({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);

    if (clicks.current >= 3) {
      clicks.current = 0;
      router.push("/admin");
      return;
    }
    // Reset the streak if the clicks aren't quick enough.
    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 600);
  }

  return (
    <span onClick={handleClick} style={{ cursor: "default", userSelect: "none" }}>
      {children}
    </span>
  );
}
