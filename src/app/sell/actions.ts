"use server";

import { prisma } from "@/lib/db";

export async function submitBuyRequest(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
      return { success: false, error: "Name and email are required." };
    }

    await prisma.buyRequest.create({
      data: {
        name,
        email,
        phone: (formData.get("phone") as string) || null,
        brand: (formData.get("brand") as string) || null,
        style: (formData.get("style") as string) || null,
        color: (formData.get("color") as string) || null,
        condition: (formData.get("condition") as string) || null,
        age: (formData.get("age") as string) || null,
        askingPrice: formData.get("askingPrice")
          ? parseFloat(formData.get("askingPrice") as string)
          : null,
        description: (formData.get("description") as string) || null,
        source: (formData.get("source") as string) || null,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to submit. Please try again." };
  }
}
