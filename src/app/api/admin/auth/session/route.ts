import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";

export async function GET() {
  const { user, isAdmin } = await getAdminSession();
  return NextResponse.json({ authenticated: Boolean(user), isAdmin, email: user?.email ?? null });
}
