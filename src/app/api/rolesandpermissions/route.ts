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
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;

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
    if (type == "edit" && id) {
      const getSingle = await rolesColl.findOne({ _id: new ObjectId(id) });
      console.log(getSingle, body);
      let filter: string[] = [];
      if (getSingle) {
        let map: any = {};
        for (let i of getSingle.permissions) {
          map[i] = (map[i] || 0) + 1;
        }

        for (let i of permissions) {
          map[i] = (map[i] || 0) + 1;
        }

        let t = Object.entries(map);
        filter = t.filter(([key, value]) => value == 1).map((d) => d[0]);
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
              permissions,
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
