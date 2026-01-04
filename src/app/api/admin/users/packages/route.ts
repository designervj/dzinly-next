import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';
import { PackageModel } from '@/components/admin/users/package/packageType';


const COLLECTION = "packages";
// GET - Retrieve all packages for the authenticated user's tenant
export async function GET(request: NextRequest) {
  try {
    // const session = await auth();
    // console.log("session----->", session)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // const tenantId = session.user.tenantId;
    // if (!tenantId) {
    //   return NextResponse.json(
    //     { error: 'Tenant ID not found in session' },
    //     { status: 400 }
    //   );
    // }
    const db = await getDatabase();
    const col = db.collection<PackageModel>(COLLECTION);

    const filter: any = {};

    const packages = await col.find().toArray();
    console.log("packages", packages)

    return NextResponse.json({ packages, count: packages.length , ok:true});
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new package
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID not found in session' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: 'Name and type are required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const col = db.collection<PackageModel>(COLLECTION);

    // Create package object with timestamps
    const newPackage: Partial<PackageModel> = {
      ...body,
      tenantId: new ObjectId(tenantId),
      created: new Date(),
      updated: new Date(),
    };

    const result = await col.insertOne(newPackage as PackageModel);

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to create package' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Package created successfully',
        packageId: result.insertedId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing package
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID not found in session' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const col = db.collection<PackageModel>(COLLECTION);

    // Update package with new timestamp
    const result = await col.updateOne(
      { _id: new ObjectId(_id) },
      { 
        $set: {
          ...updateData,
          updated: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Package updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a package
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID not found in session' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('id');

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const col = db.collection<PackageModel>(COLLECTION);

    const result = await col.deleteOne({ _id: new ObjectId(packageId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Package deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
