import { cookies } from "next/headers";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { auth } from "@/auth";
import { pageService } from "@/modules/website/page-service";
import ProjectHome from "@/components/projects/ProjectHome";

export default async function PagesAdmin() {
  const session = await auth();

  return (
  <ProjectHome/>
  )
}

