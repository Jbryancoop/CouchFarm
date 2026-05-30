/**
 * Small status pill shared across admin lead screens (inquiries, buy requests).
 * Generic over the entity — the caller passes the status string and a per-status
 * color map (Tailwind classes). Unknown statuses fall back to neutral gray.
 */
export function StatusBadge({
  status,
  colors,
}: {
  status: string;
  colors: Record<string, string>;
}) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
}
