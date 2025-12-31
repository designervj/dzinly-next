
import { cookies } from "next/headers";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { auth } from "@/auth";
import { pageService } from "@/modules/website/page-service";
import ProjectHome from "@/components/projects/ProjectHome";
import axios from "axios";
import GetAllProjects from "@/components/projects/GetAllProjects";

const isSessionExpired = (expires: string) => {
  return new Date() > new Date(expires);
};
export default async function PagesAdmin() {
  const session = await auth();
  
      let allproject = null;
   if(session?.expires &&session.user.role!=="superadmin"){
 if (!isSessionExpired(session?.expires )) {


    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:55803';
    const url = `${baseUrl.replace(/\/$/, '')}/api/projects?user_id=${session.user.id}`;
    const res = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    });
  
    if (res.ok) {
      allproject = await res.json();
      console.log("allproject", allproject);
    } else {
      console.error("Failed to fetch projects", res.status, await res.text());
    }
    // Use allproject as needed
  } else {
    // Session expired: handle accordingly (e.g., redirect, show message)
  }
   }
 


  return (
    <>
      <ProjectHome/>
      
     <GetAllProjects
     allproject={allproject}
     />
    </>

  )
}

