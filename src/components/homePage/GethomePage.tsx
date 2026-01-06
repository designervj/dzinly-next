"use client"
import React, { useEffect } from 'react'
import { WebsitePageModel } from '../admin/website/websitePage/WebsitePageType'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { setHomePage } from '@/hooks/slices/homepage/homePageSlice'


type Props={
    homePageData:WebsitePageModel
}
const GethomePage = ({homePageData}:Props) => {
  const { homepage:pageHome, hasFetched, isLoading, error } = useSelector((state: RootState) => state.homepage);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
  if( !hasFetched && !pageHome  ){
 
     dispatch(setHomePage(homePageData));
  }
  }, [pageHome, hasFetched,homePageData]);

  return (
  null
  )
}

export default GethomePage