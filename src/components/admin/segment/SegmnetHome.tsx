import React from 'react'
import SegmentTable from './segmentList/SegmentTable'
import GetAllSegment from './segmentList/GetAllSegment'
import GetAllcategory from '../category/listCategory/GetAllcategory'

const SegmentHome = () => {
  return (
   <>
   <GetAllSegment/>
   <SegmentTable/>
   <GetAllcategory/>
   </>
  )
}

export default SegmentHome