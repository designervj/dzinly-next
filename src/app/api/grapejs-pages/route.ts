import { NextRequest, NextResponse } from 'next/server';

// import Page from '@/models/Page';

import { getDatabase } from '@/lib/db/mongodb';

// GET - Fetch all GrapeJS pages or a specific page by slug
// export async function GET(request: NextRequest) {
//     try {
//         const db = await getDatabase();
//         const collection = db.collection("pages");
    

//         const { searchParams } = new URL(request.url);
//         const slug = searchParams.get('slug');
//         const tenantId = searchParams.get('tenantId');

//         if (slug) {
//             // Get specific page
//             const page = await Page.findOne({ slug, tenantId });
//             if (!page) {
//                 return NextResponse.json({ error: 'Page not found' }, { status: 404 });
//             }
//             return NextResponse.json({ success: true, data: page });
//         } else {
//             // Get all pages for tenant
//             const pages = await Page.find({ tenantId }).sort({ updatedAt: -1 });
//             return NextResponse.json({ success: true, data: pages });
//         }
//     } catch (error: any) {
//         console.error('Error fetching pages:', error);
//         return NextResponse.json(
//             { error: 'Failed to fetch pages', details: error.message },
//             { status: 500 }
//         );
//     }
// }

