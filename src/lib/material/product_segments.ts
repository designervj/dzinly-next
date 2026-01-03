import { MaterialSegmentModel } from "@/components/admin/segment/types/SegmentModel";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "product_segments";

const toObjectId = (id: string | ObjectId) =>
  typeof id === "string" ? new ObjectId(id) : id;

const escapeRegExp = (s: string) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getSegmentById(
  id: string | ObjectId
): Promise<MaterialSegmentModel | null> {
  const db = await getDatabase();
  const col = db.collection<MaterialSegmentModel>(COLLECTION);
 
  return col.findOne({ _id: toObjectId(id) } as any);
}

export async function updateSegment(
  id: string | ObjectId,
  data: Partial<MaterialSegmentModel>
): Promise<MaterialSegmentModel | null> {
  const db = await getDatabase();
  const col = db.collection<MaterialSegmentModel>(COLLECTION);

  if (data.name) data.name = data.name.trim();

  const _id = toObjectId(id);

  const updateResult = await col.updateOne(
    { _id } as any,
    { $set: { ...data, updatedAt: new Date() } } as any
  );

  if (updateResult.matchedCount === 0) return null;

  return col.findOne({ _id } as any);
}


export async function createSegment(
  data: MaterialSegmentModel
): Promise<MaterialSegmentModel> {
  if (!data?.name?.trim()) throw new Error("Name is required");

  const db = await getDatabase();
  const col = db.collection<MaterialSegmentModel>(COLLECTION);

  // prevent duplicate name for the same userId (case-insensitive)
  const filter: any = {
    name: { $regex: `^${escapeRegExp(data.name)}$`, $options: "i" },
  };
  
  // Add userId to the filter if it exists
  if (data.userId) {
    filter.userId = typeof data.userId === 'string' ? data.userId : data.userId.toString();
  }
  
  const exists = await col.findOne(filter);
  if (exists) throw new Error("Segment with same name already exists for this user");

  const now = new Date();

  const doc: any = {
    ...data,
 
    name: data.name.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc as any);
  return { ...doc, _id: result.insertedId } as MaterialSegmentModel;
}


export async function deleteSegment(
  id: string | ObjectId
): Promise<boolean> {
  const db = await getDatabase();
  const col = db.collection<MaterialSegmentModel>(COLLECTION);

  const _id = toObjectId(id);
  const result = await col.deleteOne({ _id } as any);
  return result.deletedCount === 1;
}


export async function listSegments(websiteId:string): Promise<MaterialSegmentModel[]> {
  const db = await getDatabase();
  const col = db.collection<MaterialSegmentModel>(COLLECTION);
  const filter: any = {};
  if (websiteId) {
    // Use $or to match either websiteId OR userId
    filter.$or = [
      { websiteId: websiteId },
      { userId: "6941349ebc8a14e00bbc100d" }
    ];
  }
  return col.find(filter).sort({ name: 1 }).toArray();
}
