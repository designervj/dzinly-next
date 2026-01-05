# GrapeJS Integration - Complete Package

This package provides a complete GrapeJS integration for creating, editing, and displaying dynamic pages in your Next.js application.

## 📦 What's Included

### Core Files

| File | Purpose |
|------|---------|
| `src/models/Page.ts` | MongoDB schema for pages |
| `src/app/api/grapejs-pages/route.ts` | CRUD API endpoints |
| `src/components/grapejs/GrapeJSEditor.tsx` | Visual page editor |
| `src/components/grapejs/PageRenderer.tsx` | Dynamic page renderer |
| `src/app/admin/pages/create/page.tsx` | Page creation interface |
| `src/app/(frontend)/pages/[slug]/page.tsx` | Dynamic page route |

### Documentation

| File | Description |
|------|-------------|
| `GRAPEJS_QUICK_START.md` | ⭐ **START HERE** - Quick overview and setup |
| `GRAPEJS_GUIDE.md` | Complete usage guide with examples |
| `GRAPEJS_MIGRATION_GUIDE.md` | How to convert existing pages |
| `GRAPEJS_DATA_FLOW.md` | Architecture and data flow diagrams |
| `examples/save-page-to-database.ts` | Code examples for saving pages |

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm add grapesjs grapesjs-preset-webpage grapesjs-blocks-basic
```

### 2. Add Font Awesome

Add to your root layout:

```html
<link 
  rel="stylesheet" 
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
/>
```

### 3. Create Your First Page

1. Navigate to `/admin/pages/create`
2. Fill in the form:
   - Slug: `test-page`
   - Title: `Test Page`
3. Design in the editor
4. Click "Save Page"

### 4. View Your Page

Visit `/pages/test-page` to see your page!

## 📖 Documentation Guide

### New to GrapeJS?
Start with **`GRAPEJS_QUICK_START.md`** for a quick overview.

### Want detailed examples?
Read **`GRAPEJS_GUIDE.md`** for comprehensive documentation.

### Converting existing pages?
Check **`GRAPEJS_MIGRATION_GUIDE.md`** for migration strategies.

### Understanding the architecture?
See **`GRAPEJS_DATA_FLOW.md`** for data flow diagrams.

### Need code examples?
Look at **`examples/save-page-to-database.ts`** for ready-to-use code.

## 🎯 Use Cases

### 1. Create New Pages
```tsx
import dynamic from 'next/dynamic';

const GrapeJSEditor = dynamic(
  () => import('@/components/grapejs/GrapeJSEditor'),
  { ssr: false }
);

export default function CreatePage() {
  const handleSave = async (data) => {
    await fetch('/api/grapejs-pages', {
      method: 'POST',
      body: JSON.stringify({ slug: 'my-page', ...data }),
    });
  };
  
  return <GrapeJSEditor onSave={handleSave} />;
}
```

### 2. Display Dynamic Pages
```tsx
import PageRenderer from '@/components/grapejs/PageRenderer';

export default function DynamicPage() {
  return <PageRenderer slug="my-page" />;
}
```

### 3. Edit Existing Pages
```tsx
const [pageData, setPageData] = useState(null);

useEffect(() => {
  fetch('/api/grapejs-pages?slug=my-page')
    .then(res => res.json())
    .then(result => setPageData(result.data));
}, []);

return <GrapeJSEditor pageData={pageData} onSave={handleUpdate} />;
```

## 🔑 Key Features

✅ **Visual Editor** - Drag-and-drop page builder  
✅ **Database Storage** - Pages saved to MongoDB  
✅ **Dynamic Rendering** - Load pages from database  
✅ **Multi-tenant** - Automatic tenant isolation  
✅ **Responsive** - Built-in device preview  
✅ **SEO-friendly** - Meta tags support  
✅ **Secure** - Authentication required  

## 📁 File Structure

```
dzinly-next/
├── src/
│   ├── models/
│   │   └── Page.ts                                    ✅
│   ├── app/
│   │   ├── api/
│   │   │   └── grapejs-pages/
│   │   │       └── route.ts                           ✅
│   │   ├── admin/
│   │   │   └── pages/
│   │   │       └── create/
│   │   │           └── page.tsx                       ✅
│   │   └── (frontend)/
│   │       └── pages/
│   │           └── [slug]/
│   │               └── page.tsx                       ✅
│   └── components/
│       └── grapejs/
│           ├── GrapeJSEditor.tsx                      ✅
│           └── PageRenderer.tsx                       ✅
├── examples/
│   └── save-page-to-database.ts                       ✅
├── GRAPEJS_QUICK_START.md                             ✅
├── GRAPEJS_GUIDE.md                                   ✅
├── GRAPEJS_MIGRATION_GUIDE.md                         ✅
├── GRAPEJS_DATA_FLOW.md                               ✅
└── README_GRAPEJS.md                                  ✅ (this file)
```

## 🔧 API Reference

### GET /api/grapejs-pages
Fetch pages

```javascript
// Get all pages
fetch('/api/grapejs-pages')

// Get specific page
fetch('/api/grapejs-pages?slug=my-page')
```

### POST /api/grapejs-pages
Create page

```javascript
fetch('/api/grapejs-pages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'my-page',
    title: 'My Page',
    html: '<div>...</div>',
    css: '.class { ... }',
    components: {...},
    styles: [...],
  }),
})
```

### PUT /api/grapejs-pages
Update page

```javascript
fetch('/api/grapejs-pages', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'my-page',
    html: '<div>...</div>',
    // ... other fields
  }),
})
```

### DELETE /api/grapejs-pages
Delete page

```javascript
fetch('/api/grapejs-pages?slug=my-page', {
  method: 'DELETE',
})
```

## 💾 Database Schema

```javascript
{
  tenantId: String,        // Tenant identifier
  slug: String,            // URL slug (unique per tenant)
  title: String,           // Page title
  description: String,     // Page description
  html: String,            // Rendered HTML
  css: String,             // Rendered CSS
  components: Object,      // GrapeJS components (for editing)
  styles: Array,           // GrapeJS styles (for editing)
  assets: Array,           // Images and assets
  isPublished: Boolean,    // Publication status
  metaTags: Object,        // SEO metadata
  createdBy: String,       // Creator email
  updatedBy: String,       // Last updater email
  createdAt: Date,         // Creation timestamp
  updatedAt: Date,         // Last update timestamp
}
```

## 🎨 Customization

### Add Custom Blocks

```javascript
editor.BlockManager.add('custom-block', {
  label: 'Custom Block',
  content: '<div class="custom">Content</div>',
  category: 'Custom',
});
```

### Add Custom Components

```javascript
editor.DomComponents.addType('custom-component', {
  model: {
    defaults: {
      tagName: 'div',
      draggable: true,
    }
  }
});
```

### Customize Editor Theme

```css
.gjs-one-bg { background-color: #1f2937; }
.gjs-two-color { color: rgba(255, 255, 255, 0.7); }
.gjs-three-bg { background-color: #374151; }
.gjs-four-color { color: #6366f1; }
```

## 🐛 Troubleshooting

### Editor not loading
- Ensure dynamic import with `{ ssr: false }`
- Check Font Awesome is loaded
- Verify dependencies are installed

### Styles not applying
- Check CSS is saved correctly
- Verify `dangerouslySetInnerHTML` is used
- Inspect browser console for errors

### Page not found
- Verify slug matches exactly
- Check page is published
- Ensure correct tenant

## 📚 Learn More

- [GrapeJS Documentation](https://grapesjs.com/docs/)
- [GrapeJS Preset Webpage](https://github.com/GrapesJS/preset-webpage)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

To add new features:

1. Add custom blocks to `GrapeJSEditor.tsx`
2. Extend `Page` model if needed
3. Update API routes for new fields
4. Document changes in guides

## 📝 License

This integration is part of the Dzinly project.

## 🎉 You're Ready!

Everything is set up and ready to use. Start creating beautiful pages with GrapeJS!

**Next Steps:**
1. Install dependencies: `pnpm add grapesjs grapesjs-preset-webpage grapesjs-blocks-basic`
2. Add Font Awesome to your layout
3. Visit `/admin/pages/create` to create your first page
4. Read `GRAPEJS_QUICK_START.md` for more details

Happy building! 🚀
