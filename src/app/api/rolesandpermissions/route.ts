import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase();
    const rolesColl = await db.collection("rolesandpermissions");

    const res = await rolesColl.find().toArray();

    if (res.length <= 0) {
      return NextResponse.json({ ok: false, message: "No Roles Present" });
    } else {
      return NextResponse.json({
        ok: true,
        roles: res,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: "Internal Error" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req).json();
    const searchParams = (await req).nextUrl.searchParams;

    const id = searchParams.get("id");
    const type = searchParams.get("type");
    const { name, code, permissions } = await body;

    if (!name || !code || permissions.length <= 0) {
      return NextResponse.json({
        ok: false,
        message: "Requires name, code or permissions",
      });
    }

    const db = await getDatabase();
    const rolesColl = await db.collection("rolesandpermissions");
    let res;
    if (type == "edit") {
      const getSingle = await rolesColl.findOne({ _id: new ObjectId(id!) });
      let filter;
      if (getSingle) {
        filter = permissions.filter((d: string) => {
          return !getSingle.permissions.includes(d);
        });
      }

      if (
        getSingle &&
        filter.length <= 0 &&
        name == getSingle.name &&
        code == getSingle.code
      ) {
        return NextResponse.json({
          ok: false,
          message: "No Changes Found",
        });
      }

      const updated = await rolesColl.updateOne(
        { _id: new ObjectId(id!) },
        {
          $set: {
            name,
            permissions,
            code,
          },
        }
      );
      if (updated.acknowledged) {
        const userColl = await db.collection("users");
        const update = await userColl.updateMany(
          { role: getSingle!.code },
          {
            $set: {
              role: name,
            },
            $addToSet: {
              permissions: {
                $each: filter,
              },
            },
          }
        );
     
        res = {
          name,
          permissions,
          code,
          _id: id,
        };
      }
    } else {
      const inserted = await rolesColl.insertOne({
        name,
        code,
        permissions,
      });
      res = {
        _id: inserted.insertedId,
        name,
        permissions,
        code,
      };
    }
    return NextResponse.json({
      ok: true,
      roles: res,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: "Internal Error" });
  }
}
