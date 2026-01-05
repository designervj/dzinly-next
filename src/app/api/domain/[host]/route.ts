import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ host: string }> }
) {
  const { host } = await params; //

  const db = await getDatabase();
  const collection = db.collection("websites");

  const website = await collection.findOne({
    primaryDomain: { $in: [host] },
  });

  // console.log("website---->",website)
  if (website) {
    return NextResponse.json({ item: website._id });
  }

  return NextResponse.json({ item: null });
}
