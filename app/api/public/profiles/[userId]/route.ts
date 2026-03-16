import { NextRequest, NextResponse } from "next/server";
import { getProfileByUserId, getPublicationsByUserId } from "@/lib/backend/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const profile = await getProfileByUserId(userId);
    const publications = await getPublicationsByUserId(userId);

    if (!profile) {
      return NextResponse.json({ error: "Profil topilmadi" }, { status: 404 });
    }

    return NextResponse.json({
      profile,
      publications,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Xatolik" },
      { status: 500 }
    );
  }
}
