import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const param = await params;

  const id = param.id;

  const body = await req.json();
  try {
    if (!id) {
      return NextResponse.json({
        message: "Id Not Found",
        success: false,
      });
    }

    const db = await getDatabase();
    const websiteColl = db.collection("websites");

    const { name, serviceType, primaryDomain } = body;

    const checkWebsiteExist = await websiteColl.findOne({
      _id: new ObjectId(id),
    });

    if (!checkWebsiteExist) {
      return NextResponse.json({
        message: "Domain Not Found",
        success: false,
      });
    }

    const update = await websiteColl.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name,
          serviceType: serviceType,
          primaryDomain: primaryDomain,
        },
      }
    );

    if (update.acknowledged) {
      return NextResponse.json({
        message: "Updated SuccessFully",
        success: true,
      });
    } else {
      return NextResponse.json({
        message: "Updated UnSuccessFully",
        success: false,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: error,
      success: false,
    });
  }
}
