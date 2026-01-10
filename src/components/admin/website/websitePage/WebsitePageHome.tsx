"use client"
import React from 'react'
import WebsitePageTable from './WebsitePageTable'
import GetAllPage from './GetAllPage'
import GetUserAccount from '@/app/admin/dashboard/GetUserAccount'

const WebsitePageHome = () => {
  return (
    <>
    <WebsitePageTable/>
    <GetAllPage/>
    <GetUserAccount/>
    </>
  )
}

export default WebsitePageHome