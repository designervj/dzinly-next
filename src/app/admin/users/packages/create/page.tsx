"use client"
import PackageForm from '@/components/admin/users/package/packageForm/PackageFrom'
import React, { useState } from 'react'
import { PackageModel } from '@/components/admin/users/package/packageType'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { createPackage } from '@/hooks/slices/package/packageThunks'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const page = () => {

    const [packageData, setPackageData] = useState<Partial<PackageModel> | null>({
        name: "",
        description: "",
        type: 'free',
        price: 0,
        salePrice: 0,
        roleType: "",
        status: 'active',
        discountType: 'flat',
        discountValue: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const router = useRouter()
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch<AppDispatch>()
    const handleSave = async () => {
        if (!packageData) return;
        setIsSaving(true);
        const response = await dispatch(createPackage(packageData)).unwrap()
        console.log("created package", response)
        if (response && response.success) {
            setIsSaving(false)
            setPackageData({})
            setFieldErrors({})
            toast.success("Package created successfully")
            router.push("/admin/users/packages")
        }
    }
    return (
        <PackageForm
            packageData={packageData}
            setPackageData={setPackageData}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            onSave={handleSave}
        />

    )
}

export default page