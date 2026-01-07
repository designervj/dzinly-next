"use client"
import React, { useEffect } from 'react'
import { WebsitePageModel } from '../admin/website/websitePage/WebsitePageType'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { setPageEdit } from '@/hooks/slices/pageEditSlice'
import EditButton from '@/app/(frontend)/(clientpages)/EditButton'


type Props = {
  homePageData: WebsitePageModel
}
const GethomePage = ({ homePageData }: Props) => {
  const { page: pageHome, hasfetchPage, isLoading, error } = useSelector((state: RootState) => state.pageEdit);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!hasfetchPage 
      && !pageHome && 
      homePageData &&homePageData.content) {
      dispatch(setPageEdit(homePageData));
    }
    
  }, [pageHome, hasfetchPage, homePageData]);


  //

  // Debug: Log when content changes
  useEffect(() => {
    console.log("GethomePage - pageHome updated:", {
      hasContent: !!pageHome?.content,
      contentLength: pageHome?.content?.length || 0,
      title: pageHome?.title
    });
  }, [pageHome?.content]);

  // Helper function to process template variables
  const processTemplate = (html: string, data: Record<string, any>) => {
    let processedHtml = html;
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processedHtml = processedHtml.replace(regex, data[key] || '');
    });
    return processedHtml;
  };


  // Get data from Redux or other sources
  const templateData = React.useMemo(() => ({
    name: pageHome?.title || "Guest",

  }), [pageHome?.title]);

  const processedHtml = React.useMemo(() => {
    const html = pageHome?.content || "";
    console.log("Processing HTML, content length:", html.length);
    console.log("First 100 chars:", html.substring(0, 100));
    return processTemplate(html, templateData);
  }, [pageHome?.content, templateData]);

  console.log("Rendering GethomePage, processedHtml length:", processedHtml.length);

  return (
    <>
      {pageHome && <EditButton pageData={pageHome} />}
      <div
        key={`content-${pageHome?.content?.length || 0}`}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    </>
  )
}

export default GethomePage