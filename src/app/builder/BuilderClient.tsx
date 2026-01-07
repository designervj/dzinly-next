"use client";

import { fetchWebsiteThunk } from "@/hooks/slices/pageEditSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
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

  // Memoize cropSlug to prevent continuous re-renders
  const cropSlug = useMemo(() => {
    const slug = pathname.split('/').pop();
    return slug?.split('/').pop();
  }, [pathname]);

  console.log("pathname---", pathname)
  console.log("cropSlug---", cropSlug)
  useEffect(() => {
    if (!hasfetchPage
      && !pageHome
      && user &&
      user.id &&
      cropSlug
    ) {
      // Handle demo page or default to home-mahimavalenza
      const pageSlug = cropSlug === "builder" ? "home-mahimavalenza" : cropSlug;

      dispatch(fetchWebsiteThunk({ slug: pageSlug, tenantId: user.id as string }));
      console.log("fetching page:", pageSlug)
    }

  }, [pageHome, hasfetchPage, user, cropSlug, dispatch]);

  return <GrapesJSEditor />;
}
