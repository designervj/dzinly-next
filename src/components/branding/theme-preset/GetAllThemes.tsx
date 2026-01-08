
"use client"
import React from 'react'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllThemesThunk } from '@/hooks/slices/branding/theme-preset-slice';
import { AppDispatch, RootState } from '@/store/store';
const GetAllThemes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { allThemes, hasFetched ,isLoading} = useSelector((state: RootState) => state.themePreset);
    useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchAllThemesThunk());
    }
  }, [dispatch, hasFetched]);
  
  return (
   <>
   
   </>
  )
}

export default GetAllThemes