import { NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "@/lib/db/mongodb";
import bcrypt from "bcryptjs";

const schema = z.object({
  tenantData: z.object({
    slug: z
      .string()
      .min(3)
      .max(40)
      .regex(/^[a-z0-9-]+$/i, "Use letters, numbers or dashes"),
    name: z.string().min(3).max(80),
    email: z.string().email(),
    tenantType: z.string().min(3).max(80),
    plan: z.string().min(3).max(80),
    branding: z.object({
      primaryColor: z.string().min(3).max(80),
      secondaryColor: z.string().min(3).max(80),
      tertiaryColor: z.string().min(3).max(80),
      logo: z.string().nullish(),
      typography: z.string().min(3).max(80),
    }),
  }),
  userData: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(3).max(80),
    role: z.string().min(3).max(80),
  }),

  websiteData: z.object({
    name: z.string().min(2).max(80),
    serviceType: z.enum(["WEBSITE_ONLY", "ECOMMERCE"]).default("WEBSITE_ONLY"),
    primaryDomains: z.array(z.string()),
  }),
});

export async function POST(req: Request) {
  let tenantId: any = null;
  let userId: any = null;
  let websiteId: any = null;

  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { tenantData, userData, websiteData } = parsed.data;
    const db = await getDatabase();

    const tenantColl = db.collection("tenants");
    const userColl = db.collection("users");
    const websiteColl = db.collection("websites");

    // 1️⃣ Insert tenant
    const tenantRes = await tenantColl.insertOne({
      ...tenantData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    tenantId = tenantRes.insertedId;

    // 2️⃣ Insert user
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const userRes = await userColl.insertOne({
      ...userData,
      password: passwordHash,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    userId = userRes.insertedId;

    // 3️⃣ Insert website
    const websiteRes = await websiteColl.insertOne({
      ...websiteData,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    websiteId = websiteRes.insertedId;

    return NextResponse.json({
      ok: true,
      tenantId,
      userId,
      websiteId,
    });
  } catch (e: any) {
    // 🔥 ROLLBACK (reverse order)
    const db = await getDatabase();

    if (websiteId) {
      await db.collection("websites").deleteOne({ _id: websiteId });
    }

    if (userId) {
      await db.collection("users").deleteOne({ _id: userId });
    }

    if (tenantId) {
      await db.collection("tenants").deleteOne({ _id: tenantId });
    }

    // Handle duplicate key error
    if (e.code === 11000) {
      return NextResponse.json(
        { ok: false, error: "Email or domain already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { ok: false, error: e.message || "Internal error" },
      { status: 500 }
    );
  }
}
