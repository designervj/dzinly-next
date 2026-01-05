"use client"
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page
// "use client";

// import { useState } from 'react';
// import dynamic from 'next/dynamic';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';

// // Dynamically import GrapeJS editor to avoid SSR issues
// const GrapeJSEditor = dynamic(
//     () => import('@/components/grapejs/GrapeJSEditor'),
//     { ssr: false }
// );

// export default function CreatePageClient() {
//     const router = useRouter();
//     const [pageInfo, setPageInfo] = useState({
//         slug: '',
//         title: '',
//         description: '',
//         isPublished: false,
//     });
//     const [isSaving, setIsSaving] = useState(false);

//     const handleSave = async (editorData: {
//         html: string;
//         css: string;
//         components: any;
//         styles: any;
//     }) => {
//         if (!pageInfo.slug || !pageInfo.title) {
//             toast.error('Please fill in the page slug and title');
//             return;
//         }

//         try {
//             setIsSaving(true);

//             const response = await fetch('/api/grapejs-pages', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     slug: pageInfo.slug,
//                     title: pageInfo.title,
//                     description: pageInfo.description,
//                     html: editorData.html,
//                     css: editorData.css,
//                     components: editorData.components,
//                     styles: editorData.styles,
//                     isPublished: pageInfo.isPublished,
//                 }),
//             });

//             const result = await response.json();

//             if (response.ok && result.success) {
//                 toast.success('Page saved successfully!');
//                 // Optionally redirect to the page list or view page
//                 // router.push('/admin/pages');
//             } else {
//                 toast.error(result.error || 'Failed to save page');
//             }
//         } catch (error: any) {
//             console.error('Error saving page:', error);
//             toast.error('An error occurred while saving the page');
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <div className="h-screen flex flex-col">
//             {/* Page Info Form */}
//             <div className="bg-white border-b border-gray-200 p-4">
//                 <div className="max-w-7xl mx-auto">
//                     <h1 className="text-2xl font-bold mb-4">Create New Page</h1>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Page Slug *
//                             </label>
//                             <input
//                                 type="text"
//                                 value={pageInfo.slug}
//                                 onChange={(e) => setPageInfo({ ...pageInfo, slug: e.target.value })}
//                                 placeholder="e.g., about-us"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                                 required
//                             />
//                             <p className="text-xs text-gray-500 mt-1">
//                                 URL: /pages/{pageInfo.slug || 'your-slug'}
//                             </p>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Page Title *
//                             </label>
//                             <input
//                                 type="text"
//                                 value={pageInfo.title}
//                                 onChange={(e) => {
//                                     const title = e.target.value;
//                                     const slug = title.toLowerCase().replace(/\s+/g, '-');
//                                     setPageInfo({ ...pageInfo, title, slug });
//                                 }}
//                                 placeholder="e.g., About Us"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Description
//                             </label>
//                             <input
//                                 type="text"
//                                 value={pageInfo.description}
//                                 onChange={(e) => setPageInfo({ ...pageInfo, description: e.target.value })}
//                                 placeholder="Brief description"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                             />
//                         </div>
//                     </div>
//                     <div className="mt-4 flex items-center">
//                         <input
//                             type="checkbox"
//                             id="isPublished"
//                             checked={pageInfo.isPublished}
//                             onChange={(e) => setPageInfo({ ...pageInfo, isPublished: e.target.checked })}
//                             className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
//                         />
//                         <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
//                             Publish immediately
//                         </label>
//                     </div>
//                 </div>
//             </div>

//             {/* GrapeJS Editor */}
//             <div className="flex-1 overflow-hidden">
//                 <GrapeJSEditor onSave={handleSave} />
//             </div>

//             {/* Loading Overlay */}
//             {isSaving && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-6 flex items-center gap-4">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                         <span className="text-lg font-medium">Saving page...</span>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
