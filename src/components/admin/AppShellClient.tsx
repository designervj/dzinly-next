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

  const handleWebsiteChange = async (websiteId: string) => {
    try {
      // Call API to update the current website cookie
      await fetch("/api/session/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteId }),
      });
    } catch (error) {
      console.error("Error updating website context:", error);
    }
  };

  useEffect(() => {
    if (initialCurrentWebsite) {
      handleWebsiteChange(initialCurrentWebsite._id);
    }
  }, []);

  // When client receives server-provided websites, save them to Redux
  useEffect(() => {
    if (websites && websites.length > 0) {
      dispatch(setWebsitesAction(websites));
    }
    // also set current website in redux when initialCurrentWebsite is provided
    if (initialCurrentWebsite) {
      dispatch(setCurrentWebsiteAction(initialCurrentWebsite));
    }
  }, [dispatch, websites, initialCurrentWebsite]);

  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());
    dispatch(clearSegments());
    dispatch(clearCategories());
    dispatch(clearProducts());
  };

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
