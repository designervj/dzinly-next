import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const id = new ObjectId(param.id);

    const body = await request.json();

    const { email, permissions, status, tenantId, role, name, updatedAt } =
      body;

    if (Array.isArray(tenantId)) {
      body.tenantId = tenantId.map((d) => new ObjectId(d));
    } else {
      body.tenantId = new ObjectId(tenantId);
    }

    const db = await getDatabase();
    const userColl = db.collection("users");

    const updateuser = await userColl.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          email,
          permissions,
          status,
          role,
          tenantId: body.tenantId,
          updatedAt,
        },
      }
    );

    if (updateuser.acknowledged) {
      return NextResponse.json({
        message: "User Updated successfully",
        success: true,
      });
    } else {
      return NextResponse.json({
        message: "Process Failed",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    });
  }
}
