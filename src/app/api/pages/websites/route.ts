import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  // websiteId is required
  if (!id) {
    return NextResponse.json(
      { error: "Please provide websiteId (id)" },
      { status: 400 }
    );
  }

  let result;
  const db = await getDatabase();
  const collection = await db.collection("pages");
  const webs = new ObjectId(String(id));

  // If both slug and websiteId are provided, find one specific page
  if (slug) {
    result = await collection.findOne({ slug: slug, websiteId: webs });

    if (!result) {
      return NextResponse.json(
        { error: "No page found with the given slug and websiteId" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  }

  // If only websiteId is provided, return all pages for that website
  result = await collection.find({ websiteId: webs }).toArray();

  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageId = searchParams.get("id");
  const websiteId = searchParams.get("websiteId");

  // Must provide either pageId or websiteId
  if (!pageId && !websiteId) {
    return NextResponse.json(
      { error: "Please provide either 'id' (page ID) or 'websiteId'" },
      { status: 400 }
    );
  }

  try {
    const db = await getDatabase();
    const collection = db.collection("pages");

    // Delete by page ID
    if (pageId) {
      const _id = new ObjectId(pageId);
      const result = await collection.deleteOne({ _id });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: "Page not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Page deleted successfully",
        deletedId: pageId,
      });
    }

    // Delete by website ID (delete all pages for a website)
    if (websiteId) {
      const websiteObjectId = new ObjectId(websiteId);
      const result = await collection.deleteMany({ websiteId: websiteObjectId });

      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} page(s) deleted successfully`,
        deletedCount: result.deletedCount,
        websiteId: websiteId,
      });
    }
  } catch (error: any) {
    console.error("Error deleting page(s):", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete page(s)" },
      { status: 500 }
    );
  }
}

