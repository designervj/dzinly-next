"use client"
import { fetchAccount } from '@/hooks/slices/user/accountSlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const GetUserAccount = () => {

    const {tenantUser, user} = useSelector((state:RootState) => state.user);
   const dispatch = useDispatch<AppDispatch>();
     useEffect(() => {
      
        if (tenantUser==null && user && user.tenantId) {
          console.log("fetching accoun rt user")
           dispatch(fetchAccount(user.tenantId))
        }
     }, [tenantUser,user,dispatch])

      const { currentWebsite: reduxCurrentWebsite } = useSelector((state: RootState) => state.websites);
    const isApi= useRef<boolean>(false);
      useEffect(() => {
    if (reduxCurrentWebsite && reduxCurrentWebsite._id && !isApi.current) {
      isApi.current=true;
      setCurrentWebsiteToCookies(reduxCurrentWebsite._id);
    }
  }, [reduxCurrentWebsite]);

       const setCurrentWebsiteToCookies = async (websiteId: string) => {
    try {
      // Call API to update the current website cookie
      const response = await fetch("/api/session/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteId }),
      });
      if (response.ok) {
   

      } else {
        console.error("Failed to update website context");
       
      }
    } catch (error) {
      console.error("Error updating website context:", error);
      
    }
  };
    return (
null
  )
}


export default GetUserAccount