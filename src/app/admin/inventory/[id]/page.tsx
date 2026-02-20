import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { CouchForm } from "../CouchForm";

export default async function EditCouchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const couch = await prisma.couch.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!couch) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Couch</h1>
      <CouchForm couch={couch} />
    </div>
  );
}
