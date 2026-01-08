
"use client";
import WebsitePageHome from '@/components/admin/website/websitePage/WebsitePageHome';
import React from 'react'

const page = () => {
  return (
  <>
  <WebsitePageHome/>
  </>
  )
}

export default page





// import { cookies } from "next/headers";
// import { DataTableExt } from "@/components/dataTable/DataTableExt";
// import { auth } from "@/auth";
// import { pageService } from "@/modules/website/page-service";
// import { formatDateDisplay } from "@/components/projects/FunctionDisplayDate";
// import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
// import GetAllPage from "@/components/admin/website/websitePage/GetAllPage";
// import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";

// export default async function PagesAdmin() {
//   const session = await auth();

//   if (!session?.user?.tenantId) {
//     return (
//       <div className="text-sm text-red-600">Unauthorized: Please sign in</div>
//     );
//   }

//   const currentWebsiteId = (await cookies()).get("current_website_id")?.value;

//   try {
//     const data = await pageService.listPages(
//       session.user.tenantId as string,
//       currentWebsiteId
//     );

//     const items: WebsitePageModel[] = (data || []).map((p: any) => ({
//       ...p,
//       _id: p._id?.toString(),
//       tenantId: p.tenantId?.toString(),
//       websiteId: p.websiteId?.toString(),
//       createdAt: p.createdAt
//         ? formatDateDisplay(new Date(p.createdAt).toISOString())
//         : null,
//       updatedAt: p.updatedAt
//         ? formatDateDisplay(new Date(p.updatedAt).toISOString())
//         : null,
//       publishedAt: p.publishedAt
//         ? new Date(p.publishedAt).toISOString().slice(0, 10)
//         : null,
//     }));

//     // Serialize website data to plain objects for client components
//     const sysdomain =
//       data.length > 0 && data[0].website?.systemSubdomain
//         ? data[0].website.systemSubdomain
//         : null;

//     const website =
//       data.length > 0 && data[0].website?.primaryDomain
//         ? data[0].website.primaryDomain.map((d: any) => d.domain || d)
//         : null;


//     // const handleDelete = (row: any) => {
//     //   console.log(row);
//     // };

//     return (
//       <div>

//         {items.length > 0 && <GetAllPage
//           allPages={items}
//         />}
//         <DataTableExt
//           website={website}
//           sysdomain={sysdomain}
//           title=""
//           data={items}
//           createHref="/admin/websites/pages/create"
//           // onDelete={handleDelete}
//           initialColumns={[
//             { key: "slug", label: "Slug" },
//             { key: "status", label: "Status" },

//             { key: "createdAt", label: "Created At" },
//             { key: "updatedAt", label: "Updated At" },
//           ]}
//         />
//       </div>
//     );
//   } catch (error) {
//     console.error("Error loading pages:", error);
//     return (
//       <div className="text-sm text-red-600">
//         Failed to load pages:{" "}
//         {error instanceof Error ? error.message : "Unknown error"}
//       </div>
//     );
//   }
// }
