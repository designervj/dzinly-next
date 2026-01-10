
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WpAdminEditorBar from "../EditButton";
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";

export default async function Builder({ params }: { params: { slug: string } }) {
  const session = await auth();
// get parrama from url
  const { slug } = await params;
  console.log(slug)
  // Check if user is authenticated
  if (!session || !session.user) {
    redirect("/auth/signin");
  }
  const cookieStore = await cookies();
  let data;
  const currentWebsiteId = cookieStore.get("current_website_id")?.value;
   console.log(currentWebsiteId)
  if (session && session.user && session.user.role && currentWebsiteId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/pages?slug=${slug}&tenantId=${session.user.tenantId}`, {
        method: 'GET',
        cache: 'no-store' // Ensure fresh data on each request
      });

    
      if (res.ok) {
         data = await res.json();
     

     
        // dispatch(setPageEdit(data.item));
      }
    } catch (error: any) {
      //toast.error("Error fetching page data:", error);
    }
  }

  return(
    <>
          <WpAdminEditorBar
               pageData={data.item}
             />
             <div   className="grapejs-rendered-page"
             dangerouslySetInnerHTML={{ __html: data.item.content }} />
           </>
  
  )
}


// "use client"

// import { RootState } from "@/store/store";
// import { useSelector } from "react-redux";
// import WpAdminEditorBar from "../EditButton";
// import Refreshpage from "./Refreshpage";

// export default function PageTemplate() {
//   const { page, hasfetchPage, error } = useSelector((state: RootState) => state.pageEdit);


//   return (
//     <div>
//       {/* Render the page content from Redux */}

//       <Refreshpage />
//       {!hasfetchPage ? (
//         <h3>Loading...</h3>
//       ) : (
//         <>
//           {page && page.content && <>
//             <WpAdminEditorBar
//               pageData={page}
//             />
//             <div   className="grapejs-rendered-page"
//             dangerouslySetInnerHTML={{ __html: page.content }} />
//           </>}
//         </>
//       )}

//     </div>
//   );
// }
