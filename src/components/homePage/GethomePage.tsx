"use client"
import React, { useEffect } from 'react'
import { WebsitePageModel } from '../admin/website/websitePage/WebsitePageType'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { setPageEdit } from '@/hooks/slices/pageEditSlice'


type Props={
    homePageData:WebsitePageModel
}
const GethomePage = ({homePageData}:Props) => {
  const { page:pageHome, hasfetchPage, isLoading, error } = useSelector((state: RootState) => state.pageEdit);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
  if( !hasfetchPage && !pageHome  ){
 
     dispatch(setPageEdit(homePageData));
  }
  }, [pageHome, hasfetchPage,homePageData]);

  return (
  null
  )
}

export default GethomePage