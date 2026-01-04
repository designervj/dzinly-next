"use client"
import React, { useEffect } from 'react'
import { PackageModel } from './packageType'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { setPackages } from '@/hooks/slices/package/packageSlice'
import PackageTable from './PackageTable'

type Props = {
  packages: PackageModel[]
}
const PackageHome = ({ packages }: Props) => {

  const { allPackages, hasFetched } = useSelector((state: RootState) => state.package)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!hasFetched &&
      packages) {
      dispatch(setPackages(packages))
    }
  }, [hasFetched, packages])
  return (
    <div>
      <PackageTable />
    </div>
  )
}

export default PackageHome