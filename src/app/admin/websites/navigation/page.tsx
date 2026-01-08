"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  FileText,
  Layers,
  Settings,
  ChevronDown,
  ChevronRight,
  Pencil,
} from "lucide-react";

import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavChild = { id: string; label: string; href: string };
type NavItem = {
  id: string;
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  iconClass: string;
  children?: NavChild[];
};

export default function Page() {
  const [open, setOpen] = useState<string | null>("posts");

  const toggle = (key: string) => setOpen(open === key ? null : key);

  // ✅ demo data (later API se replace kar dena)
  const items: NavItem[] = useMemo(
    () => [
      {
        id: "nav_dashboard",
        key: "dashboard",
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutGrid size={18} />,
        iconClass: "bg-blue-100 text-blue-600",
      },
      {
        id: "nav_posts",
        key: "posts",
        label: "Posts",
        href: "/admin/websites/posts",
        icon: <FileText size={18} />,
        iconClass: "bg-green-100 text-green-600",
        children: [
          { id: "nav_posts_all", label: "All Posts", href: "/admin/websites/posts" },
          { id: "nav_posts_add", label: "Add New", href: "/admin/websites/posts/new" },
          { id: "nav_posts_cat", label: "Categories", href: "/admin/websites/posts/categories" },
        ],
      },
      {
        id: "nav_pages",
        key: "pages",
        label: "Pages",
        href: "/admin/websites/pages",
        icon: <Layers size={18} />,
        iconClass: "bg-purple-100 text-purple-600",
        children: [
          { id: "nav_pages_all", label: "All Pages", href: "/admin/websites/pages" },
          { id: "nav_pages_add", label: "Add Page", href: "/admin/websites/pages/new" },
        ],
      },
      {
        id: "nav_settings",
        key: "settings",
        label: "Settings",
        href: "/admin/settings",
        icon: <Settings size={18} />,
        iconClass: "bg-gray-100 text-gray-600",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <BreadCrumbPage />
          <p className="text-gray-500 mt-1">Manage your website navigation and menus</p>
        </div>

        {/* ✅ Create route */}
        <Link href="/admin/websites/navigation/create">
          <Button className="rounded-md">Create Navigation</Button>
        </Link>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white shadow-sm border w-full rounded-md overflow-hidden">
        <div className="divide-y">
          {items.map((item) => {
            const isAccordion = !!item.children?.length;
            const isOpen = open === item.key;

            return (
              <div key={item.id} className="p-5">
                <div className="flex items-center justify-between">
                  {/* LEFT */}
                  <div
                    onClick={() => (isAccordion ? toggle(item.key) : null)}
                    className={cn(
                      "flex items-center gap-4",
                      isAccordion ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <div className={cn("h-10 w-10 flex items-center justify-center rounded-lg", item.iconClass)}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-800">{item.label}</span>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">
                    {/* ✅ Edit button (go to edit form) */}
                    <Link href={`/admin/websites/navigation/${item.id}/edit`}>
                      <Button variant="secondary" className="rounded-xl h-9 px-3">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>

                    {/* Accordion arrow */}
                    {isAccordion ? (
                      isOpen ? (
                        <ChevronDown className="text-gray-500" />
                      ) : (
                        <ChevronRight className="text-gray-500" />
                      )
                    ) : null}
                  </div>
                </div>

                {/* CHILDREN */}
                {isAccordion && isOpen && (
                  <div className="mt-4 ml-14 space-y-3 text-sm text-gray-600">
                    {item.children!.map((c) => (
                      <div key={c.id} className="flex items-center justify-between">
                        <span className="hover:text-black cursor-pointer">{c.label}</span>

                        {/* ✅ child edit optional */}
                        <Link href={`/admin/websites/navigation/${c.id}/edit`}>
                          <Button variant="ghost" className="h-8 px-2 rounded-lg">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
