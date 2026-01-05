import { getDatabase } from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const jsondata = await req.json();

    if (!jsondata)
      return NextResponse.json({
        success: false,
        message: "Product Not Added",
      });

    const db = await getDatabase();
    const products = db.collection("products");
    const variants = db.collection("variants");

    const {
      title,
      basePrice,
      description,
      segmentType,
      categories,
      brands,
      tags,
      options,
    } = jsondata.productdata;

    if (
      !title ||
      !basePrice ||
      !segmentType ||
      !categories ||
      options.length <= 0
    ) {
      return NextResponse.json({
        success: false,
        message: "Please Input Everything Needed",
      });
    }

    const productresponse = await products.insertOne(jsondata.productdata);

    const productvariants = jsondata.variantData;

    if (productvariants.length > 0) {
      const check = productvariants.every((d: any) => {
        return d.sku && d.price && d.attributes.length > 0;
      });

      if (!check) {
        await products.deleteOne({ _id: productresponse.insertedId });

        return NextResponse.json({
          success: false,
          message: "Issue in Variants",
        });
      }

      const finalVariants = productvariants.map((d: any) => ({
        ...d,
        productId: productresponse.insertedId,
        createdAt: new Date(),
      }));

      const variantResponse = await variants.insertMany(finalVariants);

      if (variantResponse.insertedCount !== finalVariants.length) {
        await products.deleteOne({ _id: productresponse.insertedId });

        const insertedIds = Object.values(variantResponse.insertedIds);

        if (insertedIds.length > 0) {
          await variants.deleteMany({
            _id: { $in: insertedIds },
          });
        }

        return NextResponse.json({
          success: false,
          message: "Variant insert mismatch",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product Added Successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
