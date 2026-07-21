import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await getAdminSession();
  if (!isSupabaseConfigured()) redirect("/admin/login?setup=1");
  if (!isAdmin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-charcoal text-cream">
      <AdminNav />
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
