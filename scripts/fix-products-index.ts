import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dzinly';

async function fixProductsIndex() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');

    // Drop the existing index
    try {
      await collection.dropIndex('uniq_products_tenant_website_slug');
      console.log('✅ Dropped existing index: uniq_products_tenant_website_slug');
    } catch (error: any) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️  Index not found, will create new one');
      } else {
        throw error;
      }
    }

    // Create new partial unique index (only when slug is a string)
    await collection.createIndex(
      { tenantId: 1, websiteId: 1, slug: 1 },
      { 
        unique: true, 
        partialFilterExpression: { slug: { $type: 'string' } },
        name: 'uniq_products_tenant_website_slug' 
      }
    );
    console.log('✅ Created new partial unique index: uniq_products_tenant_website_slug');

    console.log('\n✅ Products index fixed successfully!');
    console.log('ℹ️  Multiple products with null slugs are now allowed per tenant/website');
  } catch (error) {
    console.error('❌ Error fixing products index:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

fixProductsIndex();
