import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// Collection name
const COLLECTION = 'user_projects';

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  let query = {};
  if (userId) {
    query = { user_id: userId };
  }
  const projects = await db.collection(COLLECTION).find(query).toArray();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();

  // Get next project_id from counters collection
//   const counter = await db.collection('counters').findOneAndUpdate(
//  { _id:"_id" },
//     { $inc: { seq: 1 } },
//     { upsert: true, returnDocument: 'after' }
//   );
//   const project_id = counter.value?.seq || 1;

//   // Add project_id to body
//   const newProject = { ...body, project_id };
  const result = await db.collection(COLLECTION).insertOne(body);
  const project = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const { _id, ...updateData } = body;
  if (!_id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(_id) }, { $set: updateData });
  const updated = await db.collection(COLLECTION).findOne({ _id: new ObjectId(_id) });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
