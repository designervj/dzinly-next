"use client";

import React from "react";
import {
  Image,
  Upload,
  Trash2,
  FileText,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const mediaItems = [
    { id: 1, type: "image", name: "banner.jpg" },
    { id: 2, type: "image", name: "logo.png" },
    { id: 2, type: "image", name: "logo.png" },
    { id: 4, type: "image", name: "cover.jpg" },
    { id: 1, type: "image", name: "banner.jpg" },
    { id: 2, type: "image", name: "logo.png" },
    { id: 2, type: "image", name: "logo.png" },
    { id: 4, type: "image", name: "cover.jpg" },
  ];

  return (
    <div className="min-h-screen ">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* <h1 className="text-3xl font-semibold">Media</h1> */}
          <BreadCrumbPage />
          
          <p className="text-gray-500 mt-1">
            Manage images, documents and files
          </p>
        </div>

        <Link href="/admin/websites/media/upload-media">
          <Button>
            <Upload size={18} />
             Upload Media
          </Button>
        </Link>
      </div>

      {/* MEDIA GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* PREVIEW */}
            <div className="h-36 bg-gray-100 flex items-center justify-center">
              {item.type === "image" ? (
                <Image className="text-gray-400" size={40} />
              ) : (
                <FileText className="text-gray-400" size={40} />
              )}
            </div>

            {/* INFO */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.type.toUpperCase()}
                </p>
              </div>

              <button className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}