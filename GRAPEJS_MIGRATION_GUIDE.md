# Converting Existing Pages to GrapeJS

This guide shows how to convert your existing static page (like `homee/page.client.tsx`) to be dynamically loaded from the database using GrapeJS.

## Option 1: Keep Static, Add Dynamic Option

You can keep your existing static page and add a dynamic version that loads from the database:

### Step 1: Create a Database-Driven Version

```tsx
// src/app/(frontend)/(localpages)/homee-dynamic/page.tsx
import PageRenderer from '@/components/grapejs/PageRenderer';

export default function HomeeDynamicPage() {
  return <PageRenderer slug="homee" />;
}
```

### Step 2: Create the Page in GrapeJS Editor

1. Go to `/admin/pages/create`
2. Set slug to `homee`
3. Design your page in the editor
4. Click "Save Page"

### Step 3: Access Your Dynamic Page

Visit `/pages/homee` to see the dynamically loaded version.

## Option 2: Hybrid Approach (Recommended)

Load from database if exists, otherwise show static version:

```tsx
"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import StaticHomePage from './StaticHomePage'; // Your existing component

export default function HybridHomePage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [useStatic, setUseStatic] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/grapejs-pages?slug=homee');
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.isPublished) {
            setPageData(result.data);
          } else {
            setUseStatic(true);
          }
        } else {
          setUseStatic(true);
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        setUseStatic(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show static version if no database version exists
  if (useStatic) {
    return <StaticHomePage />;
  }

  // Show dynamic version from database
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageData.css }} />
      <div dangerouslySetInnerHTML={{ __html: pageData.html }} />
    </>
  );
}
```

## Option 3: Migrate Existing HTML to GrapeJS

You can import your existing HTML into GrapeJS:

### Step 1: Extract Your HTML and CSS

From your existing `page.client.tsx`, extract the JSX as HTML:

```javascript
// Save this as a script or run in browser console
const extractPageContent = () => {
  const html = document.querySelector('main').outerHTML;
  const css = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');
  
  return { html, css };
};

const content = extractPageContent();
console.log('HTML:', content.html);
console.log('CSS:', content.css);
```

### Step 2: Create Page via API

```javascript
const createPageFromExisting = async () => {
  const response = await fetch('/api/grapejs-pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      slug: 'homee',
      title: 'Home Page',
      description: 'Main landing page',
      html: content.html,
      css: content.css,
      components: content.html, // GrapeJS will parse this
      styles: [],
      isPublished: true,
    }),
  });

  const result = await response.json();
  console.log(result);
};

createPageFromExisting();
```

### Step 3: Edit in GrapeJS

Create an edit page:

```tsx
// src/app/admin/pages/edit/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const GrapeJSEditor = dynamic(
  () => import('@/components/grapejs/GrapeJSEditor'),
  { ssr: false }
);

export default function EditPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/grapejs-pages?slug=${slug}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setPageData(result.data);
        }
        setLoading(false);
      });
  }, [slug]);

  const handleSave = async (editorData: any) => {
    const response = await fetch('/api/grapejs-pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: slug,
        html: editorData.html,
        css: editorData.css,
        components: editorData.components,
        styles: editorData.styles,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      toast.success('Page updated successfully!');
    } else {
      toast.error(result.error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!pageData) {
    return <div>Page not found</div>;
  }

  return (
    <GrapeJSEditor
      pageData={{
        html: pageData.html,
        css: pageData.css,
        components: pageData.components,
        styles: pageData.styles,
      }}
      onSave={handleSave}
    />
  );
}
```

Now you can edit the page at `/admin/pages/edit/homee`

## Option 4: Conditional Rendering Based on User Role

Show editable version to admins, static to regular users:

```tsx
"use client";

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import PageRenderer from '@/components/grapejs/PageRenderer';
import StaticHomePage from './StaticHomePage';

export default function SmartHomePage() {
  const { user } = useSelector((state: RootState) => state.user);
  
  // Show dynamic version to admins (so they can edit)
  if (user?.role === 'admin' || user?.role === 'superadmin') {
    return (
      <div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">Admin Mode</p>
          <p>You're seeing the database version. <a href="/admin/pages/edit/homee" className="underline">Edit this page</a></p>
        </div>
        <PageRenderer slug="homee" />
      </div>
    );
  }
  
  // Show static version to regular users
  return <StaticHomePage />;
}
```

## Best Practices

1. **Start with Static**: Keep your existing static pages working
2. **Gradual Migration**: Migrate one page at a time to GrapeJS
3. **Fallback Strategy**: Always have a fallback if database page doesn't exist
4. **Version Control**: Keep your static pages in Git as backup
5. **Performance**: Cache database pages for better performance
6. **SEO**: Ensure meta tags are properly set in the database

## Example: Full Migration Workflow

```bash
# 1. Install dependencies
pnpm add grapesjs grapesjs-preset-webpage grapesjs-blocks-basic

# 2. Create the database schema (already done - Page.ts)

# 3. Create API routes (already done - /api/grapejs-pages)

# 4. Create editor component (already done - GrapeJSEditor.tsx)

# 5. Create renderer component (already done - PageRenderer.tsx)

# 6. Create admin page to create/edit pages
# Visit /admin/pages/create

# 7. Create your page in the editor

# 8. Update your route to use PageRenderer
# Change your page.tsx to use <PageRenderer slug="homee" />

# 9. Test the dynamic page

# 10. Deploy!
```

## Summary

You now have multiple options:

1. **Keep Static** - No changes needed
2. **Hybrid** - Load from DB if exists, else static
3. **Full Migration** - Convert everything to GrapeJS
4. **Role-Based** - Dynamic for admins, static for users

Choose the approach that best fits your needs!
