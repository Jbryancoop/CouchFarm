import { prisma } from "@/lib/db";
import { couchStyles } from "@/lib/config";
import InquiriesContent from "./InquiriesContent";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.customerInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <InquiriesContent
      inquiries={inquiries}
      styles={couchStyles.map((s) => ({ value: s.value, label: s.label }))}
    />
  );
}
