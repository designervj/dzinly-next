import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, toObjectId } from '@/lib/db/mongodb';
import { BlockManagerModel } from '@/components/admin/blocksManager/types/BlockManagerModel';

const COLLECTION = 'blocks';

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase();
    const items = await db.collection(COLLECTION).find({}).toArray();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await req.json();
    const result = await db.collection(COLLECTION).insertOne(body);
    const item = { ...body, _id: result.insertedId };
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await req.json();
    if (!body._id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
    const _id = toObjectId(body._id);
    const { matchedCount } = await db.collection(COLLECTION).updateOne({ _id }, { $set: body });
    if (!matchedCount) return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    return NextResponse.json({ item: { ...body, _id } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = await getDatabase();
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
    const result = await db.collection(COLLECTION).deleteOne({ _id: toObjectId(_id) });
    if (!result.deletedCount) return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
