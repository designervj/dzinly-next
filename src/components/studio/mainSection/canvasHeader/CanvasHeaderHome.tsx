"use client"
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react'
import { LuChevronDown, LuChevronUp } from "react-icons/lu";


import { useDispatch } from 'react-redux';
import { setIsResetZoom } from '@/hooks/slices/canvas/canvasSlice';
import {
  FiGrid,
  FiSlash,
  FiHome,
  FiSearch,
  FiRotateCcw,
  FiChevronUp,
} from "react-icons/fi";
const  CanvasHeaderHome= () => {
      const [isOpen, setIsOpen] = useState(true);
        const [hideHeader, setHideHeader] = useState(false);
 const dispatch = useDispatch();
 
  return (
   <>   
        <div
        className={`absolute top-0 left-0 w-full z-20 transition-all duration-300
        ${hideHeader ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
      >
        {/* Blue strip */}
        <div className="h-16 bg-white/90 opacity-90" />

        {/* Floating toolbar */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 bg-white/10 rounded-none shadow-none px-3 py-2">

            <Icon icon={<FiGrid />} />
            <Icon icon={<FiSlash />} active />
            <Icon icon={<FiHome />} />

            <Divider />

            <div className="text-sm font-medium text-gray-700 flex items-center gap-4">
              <div>X: 1236</div>
              <div>Y: 375</div>
            </div>

            <Divider />

            <Icon icon={<FiSearch />} />
            <span className="text-sm font-medium">100%</span>
            <Icon icon={<FiRotateCcw />} />
          </div>
        </div>
      </div>

      {/* ===== TOGGLE BUTTON (RIGHT) ===== */}
      <button
        onClick={() => setHideHeader(!hideHeader)}
        className="absolute top-2 right-4 z-30 w-11 h-11 rounded-lg
                   bg-blue-600 text-white flex items-center justify-center shadow"
      >
        <FiChevronUp
          size={22}
          className={`transition-transform duration-300
            ${hideHeader ? "rotate-180" : "rotate-0"}`}
        />
      </button>
   </>
  )
}

export default CanvasHeaderHome

function Icon({ icon, active = false }: any) {
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-lg border   bg-white
      ${active ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:shadow"}`}
    >
      {icon}
    </div>
  );
}

function Divider() {
  return <div className="w-px h-8 bg-gray-200 mx-1" />;
}
