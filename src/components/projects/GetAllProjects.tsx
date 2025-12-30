"use client"
import React, { useEffect } from 'react'
import { ProjectModel } from './projectModel'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { setHasFetched } from '@/hooks/slices/project/ProjectSlice'

type Props={
  allproject:ProjectModel[]
}
const GetAllProjects = ({allproject}:Props) => {
   const dispatch= useDispatch<AppDispatch>()
  const {hasFetched ,projects }= useSelector((state:RootState)=>state.projects)
  useEffect(()=>{

    if(!hasFetched && 
      projects.length==0 &&
    allproject){
      dispatch(setHasFetched(allproject))
    }
  },[hasFetched, projects,allproject])
  return (
  null
  )
}

export default GetAllProjects