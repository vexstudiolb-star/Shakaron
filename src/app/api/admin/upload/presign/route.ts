import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { buildR2Key, createPresignedUploadUrl } from "@/lib/r2/client";

export async function POST(request: Request) {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, contentType, folder = "uploads" } = (await request.json()) as {
    fileName?: string;
    contentType?: string;
    folder?: string;
  };

  if (!fileName || !contentType?.startsWith("image/")) {
    return NextResponse.json({ error: "Valid image file required." }, { status: 400 });
  }

  const key = buildR2Key(folder, fileName);
  const result = await createPresignedUploadUrl({ key, contentType });

  return NextResponse.json(result);
}
