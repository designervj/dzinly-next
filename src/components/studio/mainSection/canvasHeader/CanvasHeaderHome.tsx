"use client"
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react'
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import DrawHeader from './DrawHeader';
import Toggleheader from './ToggleHeader';
import ZoomHeader from './ZoomHeader';
import { useDispatch } from 'react-redux';
import { setIsResetZoom } from '@/hooks/slices/canvas/canvasSlice';
const CanvasHeaderHome = () => {
      const [isOpen, setIsOpen] = useState(true);
 const dispatch = useDispatch();
 const handleResetZoom = () => {
    dispatch(setIsResetZoom(true));
  };
  return (
   <>   
      <div className="absolute items-center gap-2 z-[9] inset-x-10 transition-all duration-300">
        {/* Toolbar Card with smooth animation */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5 pointer-events-none"
          }`}>
          <Card className="flex flex-row absolute items-center gap-2 bg-white/60 rounded-b-lg z-[9] top-0 inset-x-10 px-2 py-0">
            <CardContent className="py-2 pt-1.5 px-4 flex items-center w-full pe-14">
              {/* <BreadcrumbHeader/> */}
              <DrawHeader />
              <div className="flex-1" />
              <div className="flex gap-4 items-center">
                <Toggleheader />
                <ZoomHeader resetCanvas={handleResetZoom} />
              </div>
            </CardContent>
          </Card>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-14 top-2.5 flex items-center justify-center bg-blue-500 hover:bg-blue-600  border border-blue-500 rounded-md p-1.5 shadow-sm  transition-all">
          {isOpen ? (
            // <LuChevronLast className="text-lg text-gray-700" />
            <LuChevronUp className="text-lg text-white" />
          ) : (
            <LuChevronDown className="text-lg text-white" />
          )}
        </button>
      </div>
   </>
  )
}

export default CanvasHeaderHome