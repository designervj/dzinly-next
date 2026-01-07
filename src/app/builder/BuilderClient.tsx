"use client";

import { fetchWebsiteThunk } from "@/hooks/slices/pageEditSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Dynamically import GrapesJS editor to ensure it only loads on the client side
const GrapesJSEditor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-screen bg-[#1E1E1E]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-2 text-lg text-white">Loading editor...</span>
    </div>
  ),
});

export default function BuilderClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { page: pageHome, hasfetchPage, isLoading, error } = useSelector((state: RootState) => state.pageEdit);
  
  const pathname = usePathname();
  const slug = pathname.split('/').pop();
  console.log("pathan---", pathname)
  console.log("slug---", slug)
  // crop after builder of sliuger
  const cropSlug = slug?.split('/').pop();
  console.log("cropSlug---", cropSlug)
  useEffect(() => {
    if (!hasfetchPage
      && !pageHome
      && user &&
      user.id &&
      cropSlug
    ) {
      dispatch(fetchWebsiteThunk({ slug: cropSlug === "builder" ? "home-mahimavalenza" : cropSlug, tenantId: user.id as string }));
      console.log("fetching page")
    }

  }, [pageHome, hasfetchPage, user, cropSlug, dispatch]);

  return <GrapesJSEditor />;
}
