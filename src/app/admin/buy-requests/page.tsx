import { prisma } from "@/lib/db";
import { couchStyles, conditions } from "@/lib/config";
import BuyRequestsContent from "./BuyRequestsContent";

export default async function AdminBuyRequestsPage() {
  const buyRequests = await prisma.buyRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <BuyRequestsContent
      buyRequests={buyRequests}
      styles={couchStyles.map((s) => ({ value: s.value, label: s.label }))}
      conditions={conditions.map((c) => ({ value: c.value, label: c.label }))}
    />
  );
}
