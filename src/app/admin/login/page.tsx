import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

type Props = {
  searchParams: Promise<{ setup?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <AdminLoginForm needsSetup={sp.setup === "1"} />;
}
