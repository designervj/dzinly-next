"use client";
import React from 'react'
import CanvasHeaderHome from './canvasHeader/CanvasHeaderHome'
import StudioCanvasHome from './studioCanvas/StudioCanvasHome'


import { useState } from "react";
import {
  FiGrid,
  FiSlash,
  FiHome,
  FiSearch,
  FiRotateCcw,
  FiChevronUp,
} from "react-icons/fi";

export default function ImageViewer() {
  const [hideHeader, setHideHeader] = useState(false);

  return (

    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* ===== TOP HEADER (HIDE / SHOW) ===== */}
     <CanvasHeaderHome/>

      {/* ===== IMAGE ===== */}
      {/* <img
        src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
        className="w-full h-full object-cover"
        alt="House"
      /> */}
      <StudioCanvasHome/>

      {/* ===== GREEN WL OVERLAY ===== */}
      {/* <div className="absolute right-10 top-40 w-24 h-72 bg-green-500/70 rounded-lg border border-green-700">
        <span className="absolute -top-6 left-2 text-xs bg-black text-white px-1 rounded">
          WL3
        </span>
      </div> */}
    </div>
  );
}

/* ===== UI Helpers ===== */

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
