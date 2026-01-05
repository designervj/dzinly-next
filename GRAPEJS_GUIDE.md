# GrapeJS Integration Guide

This guide explains how to use GrapeJS to create, save, and dynamically display pages from the database.

## Overview

The GrapeJS integration allows you to:
1. Create pages visually using a drag-and-drop editor
2. Save page content (HTML, CSS, components) to MongoDB
3. Dynamically render saved pages on your website

## Installation

First, install the required dependencies:

```bash
npm install grapesjs grapesjs-preset-webpage grapesjs-blocks-basic
# or
pnpm add grapesjs grapesjs-preset-webpage grapesjs-blocks-basic
```

## File Structure

```
src/
├── models/
│   └── Page.ts                          # MongoDB schema for pages
├── app/
│   ├── api/
│   │   └── grapejs-pages/
│   │       └── route.ts                 # API endpoints for CRUD operations
│   ├── admin/
│   │   └── pages/
│   │       └── create/
│   │           └── page.tsx             # Page creation interface
│   └── (frontend)/
│       └── pages/
│           └── [slug]/
│               └── page.tsx             # Dynamic page renderer
└── components/
    └── grapejs/
        ├── GrapeJSEditor.tsx            # GrapeJS editor component
        └── PageRenderer.tsx             # Component to render saved pages
```

## Database Schema

The `Page` model stores:
- `tenantId`: For multi-tenant support
- `slug`: Unique URL identifier
- `title`: Page title
- `description`: Page description
- `html`: Generated HTML
- `css`: Generated CSS
- `components`: GrapeJS components JSON
- `styles`: GrapeJS styles JSON
- `assets`: Images and other assets
- `isPublished`: Publication status
- `metaTags`: SEO metadata

## API Endpoints

### GET /api/grapejs-pages
Fetch all pages or a specific page by slug

**Query Parameters:**
- `slug` (optional): Get a specific page

**Example:**
```javascript
// Get all pages
const response = await fetch('/api/grapejs-pages');

// Get specific page
const response = await fetch('/api/grapejs-pages?slug=about-us');
```

### POST /api/grapejs-pages
Create a new page

**Request Body:**
```json
{
  "slug": "about-us",
  "title": "About Us",
  "description": "Learn more about our company",
  "html": "<div>...</div>",
  "css": ".class { ... }",
  "components": { ... },
  "styles": [ ... ],
  "assets": [],
  "isPublished": true,
  "metaTags": {
    "title": "About Us - Company Name",
    "description": "SEO description",
    "keywords": "keyword1, keyword2"
  }
}
```

### PUT /api/grapejs-pages
Update an existing page

**Request Body:**
```json
{
  "slug": "about-us",
  "title": "Updated Title",
  "html": "<div>...</div>",
  "css": ".class { ... }",
  "components": { ... },
  "styles": [ ... ]
}
```

### DELETE /api/grapejs-pages?slug=about-us
Delete a page

## Usage Examples

### 1. Creating a Page with GrapeJS Editor

```tsx
"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const GrapeJSEditor = dynamic(
  () => import('@/components/grapejs/GrapeJSEditor'),
  { ssr: false }
);

export default function CreatePage() {
  const [pageInfo, setPageInfo] = useState({
    slug: 'my-page',
    title: 'My Page',
    description: 'Page description',
    isPublished: false,
  });

  const handleSave = async (editorData) => {
    const response = await fetch('/api/grapejs-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...pageInfo,
        html: editorData.html,
        css: editorData.css,
        components: editorData.components,
        styles: editorData.styles,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      toast.success('Page saved!');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      {/* Page metadata form */}
      <input
        value={pageInfo.slug}
        onChange={(e) => setPageInfo({ ...pageInfo, slug: e.target.value })}
        placeholder="Page slug"
      />
      
      {/* GrapeJS Editor */}
      <GrapeJSEditor onSave={handleSave} />
    </div>
  );
}
```

### 2. Editing an Existing Page

```tsx
"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const GrapeJSEditor = dynamic(
  () => import('@/components/grapejs/GrapeJSEditor'),
  { ssr: false }
);

export default function EditPage({ slug }: { slug: string }) {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    // Fetch existing page data
    fetch(`/api/grapejs-pages?slug=${slug}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setPageData(result.data);
        }
      });
  }, [slug]);

  const handleSave = async (editorData) => {
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
    console.log(result);
  };

  if (!pageData) return <div>Loading...</div>;

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

### 3. Displaying a Dynamic Page

```tsx
import PageRenderer from '@/components/grapejs/PageRenderer';

export default function DynamicPage() {
  // The slug will be automatically extracted from the URL
  return <PageRenderer />;
}
```

Or with a specific slug:

```tsx
import PageRenderer from '@/components/grapejs/PageRenderer';

export default function AboutPage() {
  return <PageRenderer slug="about-us" />;
}
```

### 4. Programmatically Fetching and Rendering a Page

```tsx
"use client";

import { useEffect, useState } from 'react';

export default function CustomPageRenderer({ slug }: { slug: string }) {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    fetch(`/api/grapejs-pages?slug=${slug}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setPageData(result.data);
        }
      });
  }, [slug]);

  if (!pageData) return <div>Loading...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageData.css }} />
      <div dangerouslySetInnerHTML={{ __html: pageData.html }} />
    </>
  );
}
```

## What Gets Saved to Database

When you save a page from GrapeJS, the following data is stored:

1. **HTML** (`html`): The final rendered HTML
   ```html
   <div class="container">
     <h1>Welcome</h1>
     <p>This is my page</p>
   </div>
   ```

2. **CSS** (`css`): The generated CSS styles
   ```css
   .container {
     padding: 20px;
     background: #fff;
   }
   h1 {
     color: #333;
   }
   ```

3. **Components** (`components`): GrapeJS component structure (for editing)
   ```json
   {
     "tagName": "div",
     "classes": ["container"],
     "components": [
       {
         "tagName": "h1",
         "type": "text",
         "content": "Welcome"
       }
     ]
   }
   ```

4. **Styles** (`styles`): GrapeJS style rules (for editing)
   ```json
   [
     {
       "selectors": [".container"],
       "style": {
         "padding": "20px",
         "background": "#fff"
       }
     }
   ]
   ```

## Important Notes

1. **SSR Compatibility**: GrapeJS doesn't work with SSR, so always use `dynamic` import with `{ ssr: false }`

2. **Font Awesome**: The editor UI uses Font Awesome icons. Add to your layout:
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
   ```

3. **Tenant Isolation**: Pages are automatically scoped to the logged-in user's tenant

4. **Slug Uniqueness**: Each slug must be unique within a tenant

5. **Security**: The API validates authentication before allowing CRUD operations

## Customization

### Adding Custom Blocks

```tsx
editor.BlockManager.add('my-custom-block', {
  label: 'Custom Block',
  content: '<div class="my-block">Custom content</div>',
  category: 'Custom',
});
```

### Adding Custom Components

```tsx
editor.DomComponents.addType('my-component', {
  model: {
    defaults: {
      tagName: 'div',
      draggable: true,
      droppable: true,
    }
  }
});
```

## Troubleshooting

### Editor not loading
- Ensure GrapeJS is imported dynamically with `{ ssr: false }`
- Check browser console for errors

### Styles not applying on rendered page
- Verify CSS is being saved correctly
- Check that `dangerouslySetInnerHTML` is used for both HTML and CSS

### Page not found
- Verify the slug matches exactly (case-sensitive)
- Check that the page is published (`isPublished: true`)
- Ensure you're logged in with the correct tenant

## Next Steps

1. Add image upload functionality
2. Implement page versioning
3. Add page templates
4. Create a page management dashboard
5. Add SEO optimization tools
