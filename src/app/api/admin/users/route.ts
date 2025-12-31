// Utility to flatten permissions object to string[]
function flattenPermissions(permissionsObj: any, prefix = ""): string[] {
  let result: string[] = [];
  for (const key in permissionsObj) {
    if (typeof permissionsObj[key] === "object" && !Array.isArray(permissionsObj[key])) {
      // Nested object (e.g., franchise, client, business)
      for (const subKey in permissionsObj[key]) {
        if (permissionsObj[key][subKey]) {
          result.push(`${key}:${subKey}`);
        }
      }
    } else if (Array.isArray(permissionsObj[key])) {
      for (const action of permissionsObj[key]) {
        result.push(`${key}:${action}`);
      }
    } else if (typeof permissionsObj[key] === "boolean" && permissionsObj[key]) {
      result.push(key);
    }
  }
  return result;
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/mongodb";
import { RBACService } from "@/lib/rbac/rbac-service";
import { DEFAULT_USER_PERMISSIONS } from "@/lib/rbac/roles";
import { User, UserRole } from "@/types";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role === "superadmin") {
          const users = await RBACService.getAllUsers()
         console.log("all Users00000", users)
      return NextResponse.json({ users });
    } else {
      const userId = new ObjectId(session.user.id);
      const tenantId = new ObjectId(session.user.tenantId);

      // Check if user has permission to read users
      const hasPermission = await RBACService.hasPermission(
        userId,
        "users",
        "read",
        {
          tenantId,
        }
      );

      if (!hasPermission) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Get manageable users for this user
      const users = await RBACService.getManageableUsers(userId, tenantId);

      return NextResponse.json({ users });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    // Check if user has permission to create users
    const hasPermission = await RBACService.hasPermission(
      userId,
      "users",
      "create",
      {
        tenantId,
      }
    );

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, role, password, metadata } = body;

    // Validate required fields
    if (!email || !name || !role || !password) {
      return NextResponse.json(
        { error: "Email, name, role, and password are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["A", "F", "B", "C", "D", "E", "G"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if the current user can manage this role
    const currentUser = (await (await getDb())
      .collection("users")
      .findOne({ _id: userId })) as User;
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const canManage = await RBACService.canUserManageUser(
      userId,
      new ObjectId()
    );
    if (!canManage && role !== "G") {
      // Allow creating guest users
      return NextResponse.json(
        { error: "Cannot create user with this role" },
        { status: 403 }
      );
    }

    // Check if email already exists
    const db = await getDb();
    const existingUser = await db
      .collection("users")
      .findOne({ email, tenantId });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Get default permissions for the role
    const defaultPermissions = DEFAULT_USER_PERMISSIONS[role as UserRole];

    // Flatten permissions object to string[]
    const flattenedPermissions = flattenPermissions(defaultPermissions);

    // Create new user
    const newUser: Omit<User, "_id"> = {
      tenantId,
      email,
      name,
      role: role as UserRole,
      passwordHash,
      status: "active",
      permissions: flattenedPermissions,
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    // Log the user creation
    await RBACService.logActivity(
      tenantId,
      userId,
      "create",
      "user",
      result.insertedId,
      { email, name, role }
    );

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
