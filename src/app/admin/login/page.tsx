import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession, getAllowedAdminEmails } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ setup?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { isAdmin } = await getAdminSession();

  if (isAdmin) {
    redirect("/admin");
  }

  const allowlistConfigured = getAllowedAdminEmails().length > 0;

  return (
    <AdminLoginForm
      needsSetup={sp.setup === "1" || !isSupabaseConfigured()}
      allowlistConfigured={allowlistConfigured}
    />
  );
}
