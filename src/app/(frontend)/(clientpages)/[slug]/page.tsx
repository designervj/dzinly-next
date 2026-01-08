"use client"

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function PageTemplate() {
  const { page, isLoading, error } = useSelector((state: RootState) => state.pageEdit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading page...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Page not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Render the page content from Redux */}
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
