# GrapeJS Data Flow

This document explains how data flows through the GrapeJS integration.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌───────────────────┐     ┌──────────────────┐
        │  GrapeJS Editor   │     │  Page Renderer   │
        │  (Create/Edit)    │     │  (Display)       │
        └───────────────────┘     └──────────────────┘
                    │                         │
                    │ Save                    │ Fetch
                    │                         │
                    ▼                         ▼
        ┌───────────────────────────────────────────┐
        │         API Routes                        │
        │    /api/grapejs-pages                     │
        │  • POST (create)                          │
        │  • GET (read)                             │
        │  • PUT (update)                           │
        │  • DELETE (delete)                        │
        └───────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   MongoDB Database     │
                    │   Collection: pages    │
                    └────────────────────────┘
```

## Data Flow: Creating a Page

```
1. User navigates to /admin/pages/create
   │
   ▼
2. User fills in page metadata:
   • Slug: "about-us"
   • Title: "About Us"
   • Description: "Learn about our company"
   │
   ▼
3. User designs page in GrapeJS editor:
   • Drag and drop components
   • Style elements
   • Add content
   │
   ▼
4. User clicks "Save Page"
   │
   ▼
5. GrapeJSEditor.onSave() is called
   │
   ▼
6. Editor extracts data:
   • HTML: editor.getHtml()
   • CSS: editor.getCss()
   • Components: editor.getComponents()
   • Styles: editor.getStyle()
   │
   ▼
7. POST request to /api/grapejs-pages
   │
   ▼
8. API validates:
   • User is authenticated
   • Required fields present
   • Slug is unique
   │
   ▼
9. Data saved to MongoDB:
   {
     tenantId: "tenant-123",
     slug: "about-us",
     title: "About Us",
     html: "<div>...</div>",
     css: ".class { ... }",
     components: {...},
     styles: [...],
     isPublished: true
   }
   │
   ▼
10. Success response returned
    │
    ▼
11. User sees success message
```

## Data Flow: Displaying a Page

```
1. User navigates to /pages/about-us
   │
   ▼
2. PageRenderer component loads
   │
   ▼
3. useEffect hook triggers
   │
   ▼
4. GET request to /api/grapejs-pages?slug=about-us
   │
   ▼
5. API queries MongoDB:
   Page.findOne({ slug: "about-us", tenantId: "..." })
   │
   ▼
6. Page data returned:
   {
     html: "<div>...</div>",
     css: ".class { ... }",
     title: "About Us"
   }
   │
   ▼
7. PageRenderer sets state with page data
   │
   ▼
8. Component renders:
   • <style> tag with CSS
   • <div> with HTML content
   │
   ▼
9. User sees the page
```

## Data Flow: Editing a Page

```
1. User navigates to /admin/pages/edit/about-us
   │
   ▼
2. Component fetches existing page data
   │
   ▼
3. GET request to /api/grapejs-pages?slug=about-us
   │
   ▼
4. Page data loaded into GrapeJS editor:
   • editor.setComponents(pageData.components)
   • editor.setStyle(pageData.styles)
   │
   ▼
5. User makes changes in editor
   │
   ▼
6. User clicks "Save"
   │
   ▼
7. PUT request to /api/grapejs-pages
   │
   ▼
8. API updates MongoDB:
   Page.findOneAndUpdate(
     { slug: "about-us" },
     { html, css, components, styles }
   )
   │
   ▼
9. Updated page saved
   │
   ▼
10. User sees success message
```

## What Gets Stored in Database

```javascript
{
  // Identifiers
  _id: ObjectId("..."),
  tenantId: "tenant-123",
  slug: "about-us",
  
  // Content
  title: "About Us",
  description: "Learn about our company",
  
  // GrapeJS Data
  html: `
    <div class="container">
      <h1>About Us</h1>
      <p>We are a great company...</p>
    </div>
  `,
  
  css: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      font-size: 2rem;
      color: #333;
    }
  `,
  
  components: {
    // GrapeJS component tree (for editing)
    tagName: "div",
    classes: ["container"],
    components: [
      {
        tagName: "h1",
        type: "text",
        content: "About Us"
      },
      {
        tagName: "p",
        type: "text",
        content: "We are a great company..."
      }
    ]
  },
  
  styles: [
    // GrapeJS style rules (for editing)
    {
      selectors: [".container"],
      style: {
        "max-width": "1200px",
        "margin": "0 auto",
        "padding": "20px"
      }
    }
  ],
  
  assets: [],
  
  // Metadata
  isPublished: true,
  metaTags: {
    title: "About Us - Company Name",
    description: "Learn about our company",
    keywords: "about, company, team",
    ogImage: "/images/about-og.jpg"
  },
  
  // Audit
  createdBy: "user@example.com",
  updatedBy: "user@example.com",
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-02T00:00:00Z")
}
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────┐
│                    Admin Interface                      │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Page Metadata Form                              │  │
│  │  • Slug input                                    │  │
│  │  • Title input                                   │  │
│  │  • Description input                             │  │
│  │  • Publish checkbox                              │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         ▼                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  GrapeJSEditor Component                         │  │
│  │                                                  │  │
│  │  ┌────────────┐  ┌──────────┐  ┌─────────────┐  │  │
│  │  │   Blocks   │  │  Canvas  │  │   Styles    │  │  │
│  │  │  Manager   │  │  (Edit)  │  │   Manager   │  │  │
│  │  └────────────┘  └──────────┘  └─────────────┘  │  │
│  │                                                  │  │
│  │  ┌────────────┐  ┌──────────┐  ┌─────────────┐  │  │
│  │  │   Layers   │  │ Devices  │  │   Traits    │  │  │
│  │  │  Manager   │  │ Preview  │  │   Manager   │  │  │
│  │  └────────────┘  └──────────┘  └─────────────┘  │  │
│  │                                                  │  │
│  │              [Save Page Button]                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ onSave callback
                           ▼
                  ┌─────────────────┐
                  │  API Request    │
                  │  POST/PUT       │
                  └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    Database     │
                  └─────────────────┘
```

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend Display                      │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  PageRenderer Component                          │  │
│  │                                                  │  │
│  │  1. Fetch page data from API                    │  │
│  │     ↓                                            │  │
│  │  2. Show loading state                          │  │
│  │     ↓                                            │  │
│  │  3. Inject CSS into <style> tag                 │  │
│  │     ↓                                            │  │
│  │  4. Render HTML with dangerouslySetInnerHTML    │  │
│  │     ↓                                            │  │
│  │  5. Display page to user                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. Separation of Concerns

- **HTML**: Final rendered output (for display)
- **CSS**: Styling rules (for display)
- **Components**: GrapeJS component tree (for editing)
- **Styles**: GrapeJS style rules (for editing)

### 2. Why Store Both HTML and Components?

- **HTML + CSS**: Used for fast rendering on frontend
- **Components + Styles**: Used for editing in GrapeJS editor

### 3. Tenant Isolation

Every page is scoped to a tenant:
```javascript
{
  tenantId: "tenant-123",
  slug: "about-us"
}
```

This ensures:
- Tenant A cannot see Tenant B's pages
- Same slug can exist across different tenants
- Multi-tenant security

### 4. Slug-based Routing

```
URL: /pages/about-us
         ↓
Extract slug: "about-us"
         ↓
Query: Page.findOne({ slug: "about-us", tenantId: "..." })
         ↓
Render page
```

## Security Flow

```
1. User makes request
   │
   ▼
2. API checks authentication
   if (!session?.user) return 401
   │
   ▼
3. Extract tenantId from session
   tenantId = session.user.tenantId
   │
   ▼
4. Query scoped to tenant
   Page.find({ tenantId })
   │
   ▼
5. Return only tenant's pages
```

## Performance Considerations

### Caching Strategy

```javascript
// Option 1: Static Generation (ISR)
export const revalidate = 3600; // Revalidate every hour

// Option 2: Client-side caching
const cache = new Map();
if (cache.has(slug)) {
  return cache.get(slug);
}

// Option 3: Redis caching
const cached = await redis.get(`page:${slug}`);
if (cached) return JSON.parse(cached);
```

### Lazy Loading

```javascript
// Load editor only when needed
const GrapeJSEditor = dynamic(
  () => import('@/components/grapejs/GrapeJSEditor'),
  { ssr: false, loading: () => <div>Loading editor...</div> }
);
```

## Summary

The GrapeJS integration follows a clean architecture:

1. **Editor** → Creates/edits pages visually
2. **API** → Handles CRUD operations
3. **Database** → Stores page data
4. **Renderer** → Displays pages to users

All data flows through authenticated API routes with tenant isolation for security.
