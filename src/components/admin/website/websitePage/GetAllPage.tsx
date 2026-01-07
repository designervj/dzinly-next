
"use client";
import { fetchWebsitePages, setAllWebsitePages } from "@/hooks/slices/websites/websitePageSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WebsitePageModel } from "./WebsitePageType";

type props={
 allPages: WebsitePageModel[]
}
const GetAllPage = ({allPages}:props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { hasFetched, websitePages } = useSelector(
    (state: RootState) => state.websitePage
  );

  useEffect(() => {
    if (!hasFetched && 
        !websitePages && 
        allPages.length>0&&
        currentWebsite && currentWebsite._id) {
      dispatch(setAllWebsitePages(allPages));
    }
  }, [hasFetched, websitePages,currentWebsite,allPages]);
  return null;
};

export default GetAllPage;
