"use server";

import { prisma } from "@/lib/db";

export async function submitInquiry(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
      return { success: false, error: "Name and email are required." };
    }

    await prisma.customerInquiry.create({
      data: {
        name,
        email,
        phone: (formData.get("phone") as string) || null,
        preferredStyle: (formData.get("preferredStyle") as string) || null,
        preferredColor: (formData.get("preferredColor") as string) || null,
        hasSleeper: formData.get("hasSleeper") === "true",
        hasReclining: formData.get("hasReclining") === "true",
        budgetMin: formData.get("budgetMin") ? parseFloat(formData.get("budgetMin") as string) : null,
        budgetMax: formData.get("budgetMax") ? parseFloat(formData.get("budgetMax") as string) : null,
        message: (formData.get("message") as string) || null,
        source: (formData.get("source") as string) || null,
      },
    });

    // If there's a source tracking, increment leads
    const source = formData.get("source") as string;
    if (source) {
      await prisma.marketingLink.updateMany({
        where: { slug: source },
        data: { leads: { increment: 1 } },
      });
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to submit inquiry. Please try again." };
  }
}
