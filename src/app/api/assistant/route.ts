import { NextResponse } from "next/server";
import { generateAssistantReply } from "@/lib/assistant/respond";
import { isLocale } from "@/i18n/config";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: string; locale?: string };
    const message = body.message?.trim() ?? "";
    const locale = body.locale && isLocale(body.locale) ? body.locale : "en";

    const reply = generateAssistantReply(message, locale);
    return NextResponse.json(reply);
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again.", products: [] },
      { status: 500 }
    );
  }
}
