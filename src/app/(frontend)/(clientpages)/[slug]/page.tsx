"use client"

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import WpAdminEditorBar from "../EditButton";
import Refreshpage from "./Refreshpage";

export default function PageTemplate() {
  const { page, hasfetchPage, error } = useSelector((state: RootState) => state.pageEdit);


  return (
    <div>
      {/* Render the page content from Redux */}

      <Refreshpage />
      {!hasfetchPage ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {page && page.content && <>
            <WpAdminEditorBar
              pageData={page}
            />
            <div   className="grapejs-rendered-page"
            dangerouslySetInnerHTML={{ __html: page.content }} />
          </>}
        </>
      )}

    </div>
  );
}
