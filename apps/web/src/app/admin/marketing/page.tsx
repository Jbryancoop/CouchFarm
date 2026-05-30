import { prisma } from "@/lib/db";
import { platforms } from "@/lib/config";
import { CreateLinkForm } from "./CreateLinkForm";
import { DeleteLinkButton } from "./DeleteLinkButton";

export default async function AdminMarketingPage() {
  const links = await prisma.marketingLink.findMany({
    orderBy: { createdAt: "desc" },
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Marketing Links</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <CreateLinkForm />
        </div>

        {/* Links List */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-xl overflow-hidden">
            {links.length === 0 ? (
              <p className="p-8 text-center text-gray-500">No marketing links yet. Create one to start tracking.</p>
            ) : (
              <div className="divide-y">
                {links.map((link) => {
                  const platformLabel = platforms.find((p) => p.value === link.platform)?.label || link.platform;
                  const fullUrl = `${baseUrl}/go/${link.slug}`;
                  return (
                    <div key={link.id} className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold">{link.name}</h3>
                          <p className="text-xs text-gray-500 break-all">{fullUrl}</p>
                        </div>
                        <DeleteLinkButton id={link.id} />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        {platformLabel && (
                          <span className="text-gray-500">
                            Platform: <span className="text-gray-700">{platformLabel}</span>
                          </span>
                        )}
                        {link.campaign && (
                          <span className="text-gray-500">
                            Campaign: <span className="text-gray-700">{link.campaign}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex gap-6 mt-2">
                        <div className="text-center">
                          <p className="text-lg font-bold">{link.clicks}</p>
                          <p className="text-xs text-gray-500">Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{link.leads}</p>
                          <p className="text-xs text-gray-500">Leads</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{link.sales}</p>
                          <p className="text-xs text-gray-500">Sales</p>
                        </div>
                        {link.clicks > 0 && (
                          <div className="text-center">
                            <p className="text-lg font-bold">
                              {((link.leads / link.clicks) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500">Conv. Rate</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
