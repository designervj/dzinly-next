import { auth } from "@/auth";
import GethomePage from "@/components/homePage/GethomePage";
import { headers } from "next/headers";
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";
import React from 'react'
import EditButton from "../../(clientpages)/EditButton";

export default async function HomeTemplate({ params }: any) {
      const tenantId = "6941349ebc8a14e00bbc100c";
  const slug="home-mahimavalenza"
     const res = await fetch(`${API_BASE_URL}/api/public/pages?slug=${slug}&tenantId=${tenantId}`); 
  const t = await res.json();
  console.log("tt=> ",t)
  // Check if the response has the expected structure
  if (!t || !t.item || !t.item.content ) {
    return <div>Page not found or content unavailable</div>;
  }

  const html = t.item.content;

//   const EditButton = (await import("../EditButton")).default;

  const name = "Himanshu";

  const processedHtml = html.replace(/\{\{name\}\}/g, name);   
  return (
    <>
    <GethomePage homePageData={t.item}/>
     <EditButton pageData={t.item} />
    <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </>
  
  )
}