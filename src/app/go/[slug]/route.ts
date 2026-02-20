import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await prisma.marketingLink.findUnique({ where: { slug } });

  if (!link || !link.active) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  // Increment clicks
  await prisma.marketingLink.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  });

  // Redirect with ref parameter for downstream tracking
  const dest = new URL(link.destination, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  dest.searchParams.set("ref", link.slug);

  return NextResponse.redirect(dest.toString());
}
