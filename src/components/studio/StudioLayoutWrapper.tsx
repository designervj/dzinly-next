'use client'

import React from 'react'
import SideBarHome from './sidebar/SideBarHome'
import styles from './StudioLayoutWrapper.module.css'

interface StudioLayoutWrapperProps {
  children: React.ReactNode
}

const StudioLayoutWrapper = ({ children }: StudioLayoutWrapperProps) => {
  return (
    <div className={styles.studioLayout}>
      <div className={styles.studioLeftSection}>
        <SideBarHome />
      </div>
      <div className={styles.studioRightSection}>
        {children}
      </div>
    </div>
  )
}

export default StudioLayoutWrapper
