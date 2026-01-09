"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppDispatch, RootState } from "@/store/store";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";
import { fetchLLMSettingByWebsiteId } from "@/hooks/slices/setting/llmSetting/LLMSettingSlice";
import { fetchWebsiteById } from "@/hooks/slices/websites/WebsiteThunk";
import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";

// shadcn
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// icons
import { ChevronDown, MessageSquareText, Plus, Pencil, BarChart3, Search } from "lucide-react";
import Link from "next/link";

export default function WpAdminEditorBar({ pageData }: { pageData: WebsitePageModel }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
    const {page:pageEditData} = useSelector((state: RootState) => state.pageEdit);
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { currentLLMSetting } = useSelector((state: RootState) => state.llmSetting);

  useEffect(() => {
    if (pageData?.websiteId && !currentWebsite) {
      dispatch(fetchWebsiteById(pageData.websiteId));
      dispatch(fetchLLMSettingByWebsiteId({ websiteId: pageData.websiteId }));
    }
  }, [pageData?.websiteId, currentWebsite, dispatch]);



  // Only superadmin sees this bar (your same condition)
  if (!(user && user.id && user.role === "superadmin")) return null;

  const siteName = currentWebsite?.name || "Codified Web Solutions";
  const userName = user?.name || "Admin";
  const handleClick = () => {
    //dispatch(setPageEdit(pageData));
    router.push(`/builder/${pageData?.slug}`);
  };
 
  return (
    <TooltipProvider delayDuration={120}>
     <header
  className="
    w-full h-9
    bg-gradient-to-b from-[#2a3138] to-[#1f252b]
    text-slate-200
    border-b border-white/10
    shadow-[0_1px_0_rgba(255,255,255,0.06)]
    sticky top-0 z-50 px-4
  "
>
        <div className="h-full px-2 flex items-center justify-between gap-2">
          {/* LEFT */}
          <div className="flex items-center gap-1 min-w-0">
            {/* <BarIconOnly label="WordPress" icon={<WpIcon />} /> */}
            <div>
              <img src="/dzinly-favicon.svg" alt="Dzinly Favicon" className="w-[26px] text-white"></img>
            </div>

         

            <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />

            <BarLink label="New" icon={<Plus className="h-4 w-4" />} />
            <BarLink label="Edit Page" icon={<Pencil className="h-4 w-4" />} />

            {/* ✅ Your button action placed here */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClick}
              className="h-8 px-2 rounded-sm hover:bg-[#2c3338] text-[#c3c4c7] hover:text-white text-[13px] font-semibold"
              title="Edit this page in Builder"
            >
              Edit in Builder
            </Button>

            <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />

            <BarLink label="Rank Math SEO" icon={<BarChart3 className="h-4 w-4" />} />
            <BarText label="Hostinger" />
            <BarText  label="Enable Visual Builder" />
            {/* <BarText label="Edit Home Page" /> */}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1">
            <BarIconOnly label="Search" icon={<Search className="h-4 w-4" />} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-8 px-2 rounded-sm flex items-center gap-2 hover:bg-[#2c3338] text-[13px] font-medium"
                  type="button"
                >
                  <span className="hidden sm:inline">Howdy, {userName}</span>
                  <span className="sm:hidden">{userName}</span>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <Link href="/admin/dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}

/* ----------------- Small UI helpers ----------------- */

function BarText({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="h-8 px-2 rounded-sm flex items-center hover:bg-[#2c3338] text-[13px] font-medium whitespace-nowrap"
    >
      {label}
    </a>
  );
}

function BarLink({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <a
      href="#"
      className="h-8 px-2 rounded-sm flex items-center gap-2 hover:bg-[#2c3338] text-[13px] font-medium whitespace-nowrap"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function BarIconOnly({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 px-0 rounded-sm hover:bg-[#2c3338] text-[#c3c4c7] hover:text-white"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}

function WpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" opacity="0.9" />
      <path
        d="M8.3 9.3l2.2 7.2 1.4-4.3-1-2.9m6 0l-2.3 7.2-1.3-4.1 1.1-3.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}
