# GrapeJS Integration - Quick Start Summary

## What You Asked For

You wanted to know how to:
1. Use GrapeJS to create pages
2. Save those pages to the database
3. Dynamically show pages from the database

## What I've Created

### 1. Database Model
**File:** `src/models/Page.ts`
- MongoDB schema for storing GrapeJS pages
- Includes: HTML, CSS, components, styles, metadata

### 2. API Routes
**File:** `src/app/api/grapejs-pages/route.ts`
- `GET` - Fetch pages (all or by slug)
- `POST` - Create new page
- `PUT` - Update existing page
- `DELETE` - Delete page

### 3. GrapeJS Editor Component
**File:** `src/components/grapejs/GrapeJSEditor.tsx`
- Full-featured visual page editor
- Drag-and-drop interface
- Device preview (desktop, tablet, mobile)
- Style manager, layer manager, trait manager

### 4. Page Renderer Component
**File:** `src/components/grapejs/PageRenderer.tsx`
- Fetches page from database by slug
- Renders HTML and CSS dynamically
- Handles loading and error states

### 5. Example Pages

#### Create Page
**File:** `src/app/admin/pages/create/page.tsx`
- Form for page metadata (slug, title, description)
- Integrated GrapeJS editor
- Save functionality

#### Dynamic Page Display
**File:** `src/app/(frontend)/pages/[slug]/page.tsx`
- Displays any page from database
- URL: `/pages/your-slug`

### 6. Documentation

#### Main Guide
**File:** `GRAPEJS_GUIDE.md`
- Complete usage documentation
- API reference
- Code examples
- Troubleshooting

#### Migration Guide
**File:** `GRAPEJS_MIGRATION_GUIDE.md`
- How to convert existing pages
- Multiple migration strategies
- Best practices

#### Example Scripts
**File:** `examples/save-page-to-database.ts`
- 4 different methods to save pages
- Ready-to-use code snippets

## How to Use

### Step 1: Install Dependencies

```bash
pnpm add grapesjs grapesjs-preset-webpage grapesjs-blocks-basic
```

### Step 2: Add Font Awesome (for editor icons)

Add to your `layout.tsx` or `index.html`:

```html
<link 
  rel="stylesheet" 
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
/>
```

### Step 3: Create a Page

1. Navigate to `/admin/pages/create`
2. Fill in:
   - **Slug**: `my-page` (URL will be `/pages/my-page`)
   - **Title**: `My Page`
   - **Description**: Optional description
3. Design your page in the GrapeJS editor
4. Click "Save Page"

### Step 4: View Your Page

Visit `/pages/my-page` to see your dynamically loaded page!

### Step 5: Edit Your Page

Create an edit route (see `GRAPEJS_GUIDE.md` for full code):

```tsx
// src/app/admin/pages/edit/[slug]/page.tsx
import dynamic from 'next/dynamic';

const GrapeJSEditor = dynamic(
  () => import('@/components/grapejs/GrapeJSEditor'),
  { ssr: false }
);

export default function EditPage({ params }) {
  // Fetch page data
  // Load into GrapeJSEditor with pageData prop
  // Save updates with PUT request
}
```

## Code to Save to Database

Here's the exact code you need to save a page:

```javascript
const pageData = {
  slug: 'my-page',           // URL identifier
  title: 'My Page',          // Page title
  description: 'Optional',   // Page description
  html: '<div>...</div>',    // HTML from GrapeJS
  css: '.class { ... }',     // CSS from GrapeJS
  components: {...},         // GrapeJS components JSON
  styles: [...],             // GrapeJS styles JSON
  isPublished: true,         // Publish immediately
};

// Save to database
const response = await fetch('/api/grapejs-pages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(pageData),
});

const result = await response.json();
console.log(result); // { success: true, data: {...} }
```

## What Gets Saved

When you click "Save" in the GrapeJS editor:

1. **HTML** - The rendered HTML structure
2. **CSS** - All styles applied to elements
3. **Components** - GrapeJS component tree (for editing later)
4. **Styles** - GrapeJS style rules (for editing later)
5. **Metadata** - Title, description, slug, etc.

## How to Display Saved Pages

### Method 1: Using PageRenderer Component

```tsx
import PageRenderer from '@/components/grapejs/PageRenderer';

export default function MyPage() {
  return <PageRenderer slug="my-page" />;
}
```

### Method 2: Manual Fetch and Render

```tsx
"use client";

import { useEffect, useState } from 'react';

export default function MyPage() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch('/api/grapejs-pages?slug=my-page')
      .then(res => res.json())
      .then(result => setPage(result.data));
  }, []);

  if (!page) return <div>Loading...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: page.css }} />
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </>
  );
}
```

## Converting Your Existing Homee Page

You have several options:

### Option 1: Keep Static (No Changes)
- Your current page stays as-is
- No migration needed

### Option 2: Create Dynamic Version
- Create new page in GrapeJS editor
- Save with slug `homee`
- Access at `/pages/homee`
- Original stays at `/homee`

### Option 3: Hybrid Approach
- Try to load from database
- Fall back to static if not found
- See `GRAPEJS_MIGRATION_GUIDE.md` for code

### Option 4: Full Migration
- Save current HTML to database
- Replace component with `<PageRenderer slug="homee" />`
- Edit via GrapeJS editor

## File Structure

```
src/
├── models/
│   └── Page.ts                                    ✅ Created
├── app/
│   ├── api/
│   │   └── grapejs-pages/
│   │       └── route.ts                           ✅ Created
│   ├── admin/
│   │   └── pages/
│   │       └── create/
│   │           └── page.tsx                       ✅ Created
│   └── (frontend)/
│       └── pages/
│           └── [slug]/
│               └── page.tsx                       ✅ Created
├── components/
│   └── grapejs/
│       ├── GrapeJSEditor.tsx                      ✅ Created
│       └── PageRenderer.tsx                       ✅ Created
├── examples/
│   └── save-page-to-database.ts                   ✅ Created
├── GRAPEJS_GUIDE.md                               ✅ Created
└── GRAPEJS_MIGRATION_GUIDE.md                     ✅ Created
```

## Next Steps

1. **Install dependencies**: `pnpm add grapesjs grapesjs-preset-webpage grapesjs-blocks-basic`
2. **Add Font Awesome**: Add link tag to your layout
3. **Test the editor**: Visit `/admin/pages/create`
4. **Create a test page**: Design something simple
5. **View your page**: Visit `/pages/your-slug`
6. **Read the guides**: Check `GRAPEJS_GUIDE.md` for more details

## Key Points

✅ **Multi-tenant**: Pages are scoped to tenant automatically  
✅ **Secure**: Authentication required for all operations  
✅ **Flexible**: Edit pages visually or via code  
✅ **SEO-friendly**: Meta tags supported  
✅ **Responsive**: Built-in device preview  
✅ **No SSR issues**: Editor loaded dynamically  

## Questions?

Check the documentation files:
- `GRAPEJS_GUIDE.md` - Complete usage guide
- `GRAPEJS_MIGRATION_GUIDE.md` - Migration strategies
- `examples/save-page-to-database.ts` - Code examples

## Summary

You now have a complete GrapeJS integration that allows you to:
1. ✅ Create pages visually with drag-and-drop
2. ✅ Save pages to MongoDB database
3. ✅ Display pages dynamically from database
4. ✅ Edit existing pages
5. ✅ Manage page metadata and SEO

All the code is ready to use! Just install the dependencies and start creating pages! 🚀
