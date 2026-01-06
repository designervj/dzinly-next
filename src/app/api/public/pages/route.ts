import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { pageService } from '@/modules/website/page-service';
import { auth } from '@/auth';

// Public: no auth required; uses selected website cookie or domain middleware ahead of time
export async function GET(req: Request) {
  // Extract query parameters from URL
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const tenantId = searchParams.get('tenantId');

  console.log('Slug:', slug);
  console.log('TenantId:', tenantId);

  if (!slug || !tenantId) {
    return NextResponse.json({ error: 'Missing slug or tenantId' }, { status: 400 });
  }

  // // Get website ID from cookies if available
  // const websiteId = (await cookies()).get('current_website_id')?.value;

  const doc = await pageService.getPageBySlug(tenantId, slug);
     
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item: doc });
}

