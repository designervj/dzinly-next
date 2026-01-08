import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, toObjectId } from '@/lib/db/mongodb';
import { ThemeType } from '@/components/branding/theme-preset/ThemeType';

const COLLECTION = 'branding_theme_preset';

/**
 * GET - Fetch all themes or a single theme by ID
 * Query params: ?id=<theme_id> (optional)
 */
export async function GET(req: NextRequest) {
    try {
        const db = await getDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // If ID is provided, fetch single theme
        if (id) {
            const theme = await db.collection(COLLECTION).findOne({ _id: toObjectId(id) });

            if (!theme) {
                return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
            }

            return NextResponse.json({ item: theme });
        }

        // Otherwise, fetch all themes
        const items = await db.collection(COLLECTION).find({}).toArray();
        return NextResponse.json({ items });
    } catch (error) {
        console.error('GET /api/admin/branding/themes error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

/**
 * POST - Create a new theme
 * Body: ThemeType (without _id, createdAt, updatedAt)
 */
export async function POST(req: NextRequest) {
    try {
        const db = await getDatabase();
        const body = await req.json();

        // Validate required fields
        if (!body.name || !body.id) {
            return NextResponse.json(
                { error: 'Missing required fields: name and id are required' },
                { status: 400 }
            );
        }

        // Check if a theme with the same id already exists
        const existingTheme = await db.collection(COLLECTION).findOne({ id: body.id });
        if (existingTheme) {
            return NextResponse.json(
                { error: `Theme with id '${body.id}' already exists` },
                { status: 409 }
            );
        }

        // Prepare theme data with timestamps
        const themeData = {
            ...body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // If this is the first theme or marked as active, ensure it's the only active theme
        if (body.active) {
            await db.collection(COLLECTION).updateMany(
                { active: true },
                { $set: { active: false, updatedAt: new Date() } }
            );
        }

        const result = await db.collection(COLLECTION).insertOne(themeData);
        const item = { ...themeData, _id: result.insertedId };

        return NextResponse.json({ item }, { status: 201 });
    } catch (error) {
        console.error('POST /api/admin/branding/themes error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

/**
 * PUT - Update an existing theme
 * Query params: ?id=<theme_id>
 * Body: Partial<ThemeType>
 */
export async function PUT(req: NextRequest) {
    try {
        const db = await getDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
        }

        const _id = toObjectId(id);

        // Check if theme exists
        const existingTheme = await db.collection(COLLECTION).findOne({ _id });
        if (!existingTheme) {
            return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
        }

        // If setting this theme as active, deactivate all other themes
        if (body.active === true) {
            await db.collection(COLLECTION).updateMany(
                { _id: { $ne: _id }, active: true },
                { $set: { active: false, updatedAt: new Date() } }
            );
        }

        // Prepare update data (exclude _id and createdAt from update)
        const { _id: bodyId, createdAt, ...updateData } = body;
        const updatePayload = {
            ...updateData,
            updatedAt: new Date(),
        };

        // Update the theme
        const { matchedCount } = await db.collection(COLLECTION).updateOne(
            { _id },
            { $set: updatePayload }
        );

        if (!matchedCount) {
            return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
        }

        // Fetch and return the updated theme
        const updatedTheme = await db.collection(COLLECTION).findOne({ _id });
        return NextResponse.json({ item: updatedTheme });
    } catch (error) {
        console.error('PUT /api/admin/branding/themes error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

/**
 * DELETE - Delete a theme
 * Query params: ?id=<theme_id>
 */
export async function DELETE(req: NextRequest) {
    try {
        const db = await getDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
        }

        const _id = toObjectId(id);

        // Check if theme exists
        const theme = await db.collection(COLLECTION).findOne({ _id });
        if (!theme) {
            return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
        }

        // Prevent deletion of system themes
        if (theme.isSystemTheme) {
            return NextResponse.json(
                { error: 'Cannot delete system theme' },
                { status: 403 }
            );
        }

        // Check if this is the active theme
        const wasActive = theme.active;

        // Delete the theme
        const result = await db.collection(COLLECTION).deleteOne({ _id });

        if (!result.deletedCount) {
            return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
        }

        // If the deleted theme was active, activate the first available theme
        if (wasActive) {
            const firstTheme = await db.collection(COLLECTION).findOne({});
            if (firstTheme) {
                await db.collection(COLLECTION).updateOne(
                    { _id: firstTheme._id },
                    { $set: { active: true, updatedAt: new Date() } }
                );
            }
        }

        return NextResponse.json({ success: true, message: 'Theme deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/admin/branding/themes error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
