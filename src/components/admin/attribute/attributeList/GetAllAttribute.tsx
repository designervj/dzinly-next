"use client";
import { fetchAttributes } from '@/hooks/slices/attribute/AttributeSlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const GetAllAttribute = () => {
    const { isCategoryLoading, hasFetched } = useSelector(
    (state: RootState) => state.category
  )

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetched && !isCategoryLoading) {
      dispatch(fetchAttributes());
    }
  }, [hasFetched, isCategoryLoading, dispatch]);
  return (
    null
  )
}

export default GetAllAttribute