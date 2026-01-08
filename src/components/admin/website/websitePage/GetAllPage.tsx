
"use client";
import { fetchWebsitePages, setAllWebsitePages } from "@/hooks/slices/websites/websitePageSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WebsitePageModel } from "./WebsitePageType";

// type props={
//  allPages: WebsitePageModel[]
// }
const GetAllPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { hasFetched, websitePages } = useSelector(
    (state: RootState) => state.websitePage
  );

  // console.log("AlLL p[ahesbbs", allPages)
  // useEffect(() => {
  //   if (!hasFetched && 
  //       !websitePages && 
  //       allPages.length>0&&
  //       currentWebsite && currentWebsite._id) {
  //     dispatch(setAllWebsitePages(allPages));
  //   }
  // }, [hasFetched, websitePages,currentWebsite,allPages]);
    useEffect(() => {
    if (!hasFetched && 
        currentWebsite && currentWebsite._id) {
          console.log("currentWebsite", currentWebsite)
      dispatch(fetchWebsitePages(currentWebsite._id));
    }
  }, [hasFetched, websitePages,currentWebsite]);
  return null;
};

export default GetAllPage;
