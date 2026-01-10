"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Website, User } from "./AppShell";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "@/store/store";
import {
  setWebsites as setWebsitesAction,
  setCurrentWebsite as setCurrentWebsiteAction,
} from "@/hooks/slices/websites/WebsiteSlice";
import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";
import { clearSegments } from "@/hooks/slices/segment/SegmentSlice";
import { clearCategories } from "@/hooks/slices/category/CategorySlice";
import { clearProducts } from "@/hooks/slices/product/ProductSlice";

type AppShellClientProps = {
  children: React.ReactNode;
  websites: Website[];
  currentWebsite: Website | null;
  user: User | null;
};

export function AppShellClient({
  children,
  websites,
  currentWebsite: initialCurrentWebsite,
  user,
}: AppShellClientProps) {
  const [currentWebsite, setCurrentWebsite] = useState(initialCurrentWebsite);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  

  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());
    dispatch(clearSegments());
    dispatch(clearCategories());
    dispatch(clearProducts());
  };
  const handleWebsiteChange = async (websiteId: string) => {
    const newWebsite = websites.find((w) => w._id === websiteId) || null;
  
    setCurrentWebsite(newWebsite);
    try {
      // Call API to update the current website cookie
      const response = await fetch("/api/session/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteId }),
      });
      if (response.ok) {
        // Clear Redux state first to prevent old data from being used
        resetRedux();
        // Navigate to /admin (which will load fresh data for new website)
         window.location.href = "/admin/dashboard";
        // router.push("/admin")
      } else {
        console.error("Failed to update website context");
        // Revert the optimistic update
        setCurrentWebsite(initialCurrentWebsite);
      }
    } catch (error) {
      console.error("Error updating website context:", error);
      setCurrentWebsite(initialCurrentWebsite);
    }
  };

  // useEffect(() => {
  //   if (initialCurrentWebsite) {
  //     handleWebsiteChange(initialCurrentWebsite._id);
  //   }
  // }, []);

  // When client receives server-provided websites, save them to Redux
  useEffect(() => {
    if (websites && websites.length > 0) {
      // Serialize and deserialize to remove non-serializable values (ObjectId, Date, etc.)
      const serializedWebsites = JSON.parse(JSON.stringify(websites));
      dispatch(setWebsitesAction(serializedWebsites));
    }
    // also set current website in redux when initialCurrentWebsite is provided
    if (initialCurrentWebsite) {
      // Serialize and deserialize to remove non-serializable values
      const serializedCurrentWebsite = JSON.parse(JSON.stringify(initialCurrentWebsite));
      dispatch(setCurrentWebsiteAction(serializedCurrentWebsite));
    }
  }, [dispatch, websites, initialCurrentWebsite]);


  return (
    <AppShell
      websites={websites}
      currentWebsite={currentWebsite}
      user={user}
      onWebsiteChange={handleWebsiteChange}
    >
      {children}
    </AppShell>
  );
}
