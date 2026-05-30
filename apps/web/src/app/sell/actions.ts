"use server";

import { prisma } from "@/lib/db";
import { isBot, isValidEmail, throttlePublicForm } from "@/lib/form-guard";
import { notifyNewBuyRequest } from "@/lib/email";

export async function submitBuyRequest(formData: FormData) {
  try {
    // Silently accept (but drop) submissions that trip the spam honeypot.
    if (isBot(formData)) return { success: true };

    if (!(await throttlePublicForm("buy-request"))) {
      return { success: false, error: "Too many submissions. Please try again later." };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
      return { success: false, error: "Name and email are required." };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const buyRequest = await prisma.buyRequest.create({
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

    // Email admins — never throws (logs internally), but await so the
    // serverless function doesn't terminate before the send completes.
    await notifyNewBuyRequest(buyRequest);

    return { success: true };
  } catch {
    return { success: false, error: "Failed to submit. Please try again." };
  }
}
