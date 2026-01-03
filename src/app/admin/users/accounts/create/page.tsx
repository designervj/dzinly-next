"use client";
import GetAllRolePermission from '@/components/onboarding/GetAllRolePermission';
import OnboardingTenants from '@/components/onboarding/OnboardingTenants';
import React from 'react'

const page = () => {
  return (
    <div className="h-screen">
      <OnboardingTenants/>
      <GetAllRolePermission/>
      
    </div>
  )
}

export default page