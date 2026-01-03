"use client";

import { useState } from "react";
import {
  Home,
  Share2,
  Calculator,
  Layers,
  Plus,
  Grid,
  DoorOpen,
  Warehouse,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import TabsHome from "./TabsHome";

/**
 * PIXEL‑ALIGNED RIGHT SIDEBAR (Matched to screenshot)
 * Width, spacing, radius, borders intentionally hard‑coded
 */

export default function RightSidebar() {
  const [activeTop, setActiveTop] = useState("home");
  const router = useRouter();
  const handleBack = () => {
    router.push("/projects")
  };

  return (
   
    <aside className="w-[360px] h-screen border-r bg-white flex flex-col">
         
         <div className="flex items-center justify-between px-4 py-2 border-b">
          <img src="../dzinlylogo.svg" className="w-48"></img>

          <button className="border rounded-sm px-3 py-1 font-semibold bg-primary text-white flex items-center gap-1"
          onClick={handleBack}
          > <IoArrowBackOutline />Back</button>
         </div>

      {/* Top Tabs */}
      <div className="flex gap-2 p-3 border-b">
    
        {/* <TopTab icon={Home} active={activeTop === "home"} onClick={() => setActiveTop("home")} />
        <TopTab icon={Share2} active={activeTop === "materials"} onClick={() => setActiveTop("materials")} />
        <TopTab icon={Calculator} active={activeTop === "measure"} onClick={() => setActiveTop("measure")} />
        <TopTab icon={Layers} />
        <TopTab icon={Plus} /> */}
      </div>

      <div className="flex flex-1 overflow-hidden">
            <TabsHome/>
        {/* Left Vertical Icons */}
        {/* <div className="w-[56px] border-r flex flex-col items-center gap-3 pt-4">
          <SideIcon icon={Grid} active />
          <SideIcon icon={DoorOpen} />
          <SideIcon icon={Warehouse} />
          <SideIcon icon={Square} />
        </div> */}

        {/* Main */}
        {/* <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
          {activeTop === "home" && <Materials />}
          {activeTop === "materials" && <Materials />}
          {activeTop === "measure" && <Measurements />}
        </div> */}
      </div>

      {/* Bottom Fixed Button */}
      <div className="absolute bottom-0 right-0 w-[360px] p-4 bg-white border-t">
        <Button className="w-full bg-[#7A2E63] hover:bg-[#6a2857]">Pricing PDF</Button>
      </div>
    </aside>
 
  );
}

function TopTab({ icon: Icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-600"
          : "border-slate-200 text-slate-500"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />
    </button>
  );
}

function SideIcon({ icon: Icon, active }: any) {
  return (
    <div
      className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
        active
          ? "bg-green-50 border-green-400 text-green-600"
          : "border-slate-200 text-slate-500"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />
    </div>
  );
}

function Materials() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[18px]">Wall</h3>

      <div className="flex gap-2 flex-wrap">
        {["WL1", "WL2", "WL3", "WL4"].map((w) => (
          <Badge
            key={w}
            className="px-4 py-1.5 rounded-lg border border-blue-500 bg-white text-blue-600"
          >
            {w}
          </Badge>
        ))}
      </div>

      <h4 className="pt-2 font-semibold">All Materials</h4>

      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[140px] rounded-xl border border-slate-200 bg-white shadow-sm"
          />
        ))}
      </div>
    </div>
  );
}

function Measurements() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[18px]">Measurements</h3>
        <Select defaultValue="sqm">
          <SelectTrigger className="w-[90px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sqm">sq. m</SelectItem>
            <SelectItem value="sqft">sq. ft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge className="bg-blue-50 text-blue-600">Wall 9</Badge>
        <Badge variant="secondary">Door 1</Badge>
        <Badge variant="secondary">Garage 2</Badge>
        <Badge variant="secondary">Window 8</Badge>
      </div>

      <div className="border rounded-xl p-4 flex justify-between items-center">
        <div>
          <p className="font-medium">Wall 1</p>
          <p className="text-sm text-slate-500">9 segments</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">0.00 sq. m</p>
          <Button size="sm" variant="outline">
            Select Style
          </Button>
        </div>
      </div>
    </div>
  );
}


/* =============================
   MAIN CANVAS VIEW (IMAGE AREA)
   Matches DZINLY screenshot
============================= */

export function CanvasView() {
  return (
    <div className="flex-1 bg-[#f7f7f7] flex flex-col">
      {/* Header */}
      <div className="h-[64px] bg-white border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-widest text-slate-600">DZINLY</span>
        </div>
        <button className="px-4 py-2 rounded-lg border text-sm">← Back</button>
      </div>

      {/* Top Mode Tabs */}
      <div className="bg-white border-b px-6 py-3 flex gap-3">
        <ModeTab active icon="🏠" />
        <ModeTab icon="🔗" />
        <ModeTab icon="📐" />
        <ModeTab icon="🧱" />
        <ModeTab icon="➕" />
      </div>

      {/* Sub Tabs */}
      <div className="bg-white px-6 py-3 flex gap-3">
        <SubTab active label="Chat" />
        <SubTab label="Play" />
        <SubTab label="History" />
      </div>

      {/* Image Canvas */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-3">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            className="w-[640px] rounded-lg"
            alt="House"
          />
        </div>
      </div>

      {/* Prompt Bar */}
      <div className="border-t bg-white p-4">
        <div className="border-2 border-purple-500 rounded-xl p-3 flex items-center gap-3">
          <input
            placeholder="Type your prompt..."
            className="flex-1 outline-none"
          />
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeTab({ icon, active }: any) {
  return (
    <div
      className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
        active
          ? "border-blue-500 bg-blue-50"
          : "border-slate-200"
      }`}
    >
      {icon}
    </div>
  );
}

function SubTab({ label, active }: any) {
  return (
    <button
      className={`px-6 py-2 rounded-xl border text-sm ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-600"
          : "border-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
