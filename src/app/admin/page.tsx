"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { getAllUser } from "@/hooks/slices/user/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function AdminIndex() {
  const {user, alluser,hasFetched }= useSelector((state:RootState)=>state.user)
   const dispatch= useDispatch<AppDispatch>()
  const router= useRouter()  


  useEffect(()=>{
    if(user && user.tenantId){
  // dispatch(getAllUser())
   router.push("/admin/dashboard")

    }
  },[user])



  return (
    null
  //   <div className="space-y-6">
  //     <div>
  //       <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
  //       <p className="text-sm text-muted-foreground">Quick overview</p>
  //     </div>
  //  { user && user.role==="superadmin" &&  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  //       <Link href={"/onboarding"} className="flex items-center justify-center w-40 rounded-lg bg-green-500 text-white hover:bg-white hover:text-green-500 p-2 border border-green-500">
  //         Onboard Tenant
  //       </Link>
  //     </div>}
  //   </div>
  );
}
