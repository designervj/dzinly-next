import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, toObjectId } from '@/lib/db/mongodb';

const COLLECTION = 'blocks';


export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { params } = context;
    const { id } = await params;
    const db = await getDatabase();
    const _id = toObjectId(id);
    const item = await db.collection(COLLECTION).findOne({ _id });
    if (!item) return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { params } = context;
    const { id } = await params;
    const db = await getDatabase();
    const _id = toObjectId(id);
    const body = await req.json();
    const { matchedCount } = await db.collection(COLLECTION).updateOne({ _id }, { $set: body });
    if (!matchedCount) return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    return NextResponse.json({ item: { ...body, _id } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { params } = context;
    const { id } = await params;
    const db = await getDatabase();
    const _id = toObjectId(id);
    const result = await db.collection(COLLECTION).deleteOne({ _id });
    if (!result.deletedCount) return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
