import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Only allow redirects to relative paths on this site. Blocks absolute URLs
 * ("https://evil.com") and protocol-relative URLs ("//evil.com") so a
 * marketing link can never be turned into an open redirect.
 */
function safePath(dest: string): string {
  if (dest.startsWith("/") && !dest.startsWith("//")) return dest;
  return "/inventory";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await prisma.marketingLink.findUnique({ where: { slug } });

  if (!link || !link.active) {
    return NextResponse.redirect(new URL("/", SITE_URL));
  }

  // Increment clicks
  await prisma.marketingLink.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  });

  // Redirect with ref parameter for downstream tracking
  const dest = new URL(safePath(link.destination), SITE_URL);
  dest.searchParams.set("ref", link.slug);

  return NextResponse.redirect(dest.toString());
}
