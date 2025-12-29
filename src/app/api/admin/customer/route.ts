import { auth } from "@/auth";
import { getDatabase } from "@/lib/db/mongodb";
import bcrypt from "bcryptjs";

import { NextRequest, NextResponse } from "next/server";


const COLLECTION_NAME = "users";


export async function POST(req: NextRequest, ctx: any) {
  const params = (await ctx?.params) ?? {};
   const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  try {
  debugger
   const db = await getDatabase();
    const body = await req.json();

      const existingUser = await db.collection('users').findOne({ email:body.email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

      const passwordHash = await bcrypt.hash(body.password, 12);
    
    const user={
email:body.email,
passwordHash:passwordHash,
name:body.name,
role:body.role,
permissions:[],
status:body.status,
 createdAt: body.createdAt,
  updatedAt:body.updatedAt,
  lastLoginAt:body.updatedAt,

    }
     
       const result = await db.collection(COLLECTION_NAME).insertOne(user);
    console.log(" user--")
     return NextResponse.json({
          success: true,
          data: { _id: result.insertedId, ...user},
        }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
