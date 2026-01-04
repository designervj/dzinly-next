"use client";

import React from "react";
import { PackageModel } from "../packageType";
import { useRouter } from "next/navigation";

type PackageFormProps = {
  packageData: Partial<PackageModel> | null;
  setPackageData: React.Dispatch<React.SetStateAction<Partial<PackageModel> | null>>;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
};

export default function PackageForm({
  packageData,
  setPackageData,
  fieldErrors,
  setFieldErrors,
  isSaving,
  setIsSaving,
  onSave
}: PackageFormProps) {
  // Handle null packageData
  if (!packageData) {
    return null;
  }

const router = useRouter();

  return (
    <>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          value={packageData.name || ""}
          onChange={(e) =>
            setPackageData({ ...packageData, name: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="Enter package name"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={packageData.description || ""}
          onChange={(e) =>
            setPackageData({ ...packageData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
          rows={3}
          placeholder="Enter package description"
        />
        {fieldErrors.description && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.description}
          </div>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          value={packageData.type || "free"}
          onChange={(e) =>
            setPackageData({
              ...packageData,
              type: e.target.value as "free" | "trial" | "paid",
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="free">Free</option>
          <option value="trial">Trial</option>
          <option value="paid">Paid</option>
        </select>
        {fieldErrors.type && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.type}
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={packageData.price || 0}
          onChange={(e) =>
            setPackageData({
              ...packageData,
              price: parseFloat(e.target.value) || 0,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="0.00"
        />
        {fieldErrors.price && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.price}
          </div>
        )}
      </div>

      {/* Sale Price */}
      <div>
        <label className="block text-sm font-medium">Sale Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={packageData.salePrice || ""}
          onChange={(e) =>
            setPackageData({
              ...packageData,
              salePrice: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="0.00"
        />
        {fieldErrors.salePrice && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.salePrice}
          </div>
        )}
      </div>

      {/* Role Type */}
      <div>
        <label className="block text-sm font-medium">Role Type</label>
        <input
          value={packageData.roleType || ""}
          onChange={(e) =>
            setPackageData({ ...packageData, roleType: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="e.g., user, admin, editor"
        />
        {fieldErrors.roleType && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.roleType}
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          value={packageData.status || "active"}
          onChange={(e) =>
            setPackageData({
              ...packageData,
              status: e.target.value as "active" | "inactive" | "archived",
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
        {fieldErrors.status && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.status}
          </div>
        )}
      </div>

      {/* Discount Type */}
      <div>
        <label className="block text-sm font-medium">Discount Type</label>
        <select
          value={packageData.discountType || ""}
          onChange={(e) =>
            setPackageData({
              ...packageData,
              discountType: e.target.value
                ? (e.target.value as "flat" | "percent")
                : undefined,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">None</option>
          <option value="flat">Flat</option>
          <option value="percent">Percent</option>
        </select>
        {fieldErrors.discountType && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.discountType}
          </div>
        )}
      </div>

      {/* Discount Value */}
      <div>
        <label className="block text-sm font-medium">Discount Value</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={packageData.discountValue || ""}
          onChange={(e) =>
            setPackageData({
              ...packageData,
              discountValue: e.target.value
                ? parseFloat(e.target.value)
                : undefined,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder={
            packageData.discountType === "percent"
              ? "e.g., 10 for 10%"
              : "e.g., 50 for $50 off"
          }
          disabled={!packageData.discountType}
        />
        {fieldErrors.discountValue && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.discountValue}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button
          type="button"
          onClick={() => {
            // Reset form or navigate back
            setPackageData({});
            setFieldErrors({});
            router.back()
          }}
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={
          onSave
          }
          disabled={isSaving}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Package"}
        </button>
      </div>
    </>
  );
}
