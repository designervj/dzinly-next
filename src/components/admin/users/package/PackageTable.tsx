"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { DataTableExt } from '../../DataTableExt';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PackageModel } from './packageType';
import { updatePackage, removePackage } from '@/hooks/slices/package/packageSlice';
import PackageForm from './packageForm/PackageFrom';
import { formatDateDisplay } from '@/components/projects/FunctionDisplayDate';

const PackageTable = () => {
  const { allPackages, hasFetched } = useSelector((state: RootState) => state.package);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<PackageModel> | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async (row: any) => {
    const id = row?._id?.toString() ?? row?.id;
    if (!id) {
      toast.error('Delete failed: Missing id');
      return;
    }

    const ok = confirm(`Delete package "${row?.name ?? id}"? This action cannot be undone.`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/users/packages?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removePackage(id));
      toast.success(`Package ${row?.name ?? id} deleted successfully`);
    } catch (err: any) {
      console.error('Failed to delete package', err);
      toast.error(String(err?.message || err));
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;

    // Set the package data for editing
    setEditingPackage(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPackage) return;

    setFieldErrors({});
    const errors: Record<string, string> = {};

    if (!editingPackage.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!editingPackage.type) {
      errors.type = 'Type is required';
    }
    if (editingPackage.price === undefined || editingPackage.price < 0) {
      errors.price = 'Price must be 0 or greater';
    }
    if (!editingPackage.status) {
      errors.status = 'Status is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const id = (editingPackage as any)._id?.toString() ?? editingPackage._id;

      // Remove _id and other non-updatable fields from the payload
      const { _id, createdAt, updatedAt, ...updateData } = editingPackage as any;

      const res = await fetch(`/api/admin/users/packages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updateData, id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      const { package: updatedPackage } = await res.json();
      dispatch(updatePackage(updatedPackage));
      toast.success(`Package ${editingPackage.name} updated successfully`);
      setIsEditDialogOpen(false);
      setEditingPackage(null);
    } catch (err: any) {
      console.error('Failed to update package', err);
      toast.error(String(err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    router.push(`/admin/users/packages/create`);
  };

  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { 
      key: 'description', 
      label: 'Description',
      render: (value: string) => (
        <span className="truncate max-w-xs block">{value || '-'}</span>
      )
    },
    {
              key: 'createdAt',
              label: 'Created',
              render: (value: any) => formatDateDisplay(value),
            },
            {
              key: 'updatedAt',
              label: 'Updated',
              render: (value: any) => formatDateDisplay(value),
            },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: string) => {
        const colors = {
          free: 'bg-green-100 text-green-800',
          trial: 'bg-yellow-100 text-yellow-800',
          paid: 'bg-blue-100 text-blue-800',
        };
        return (
          <span className={`capitalize px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'price', 
      label: 'Price',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      key: 'salePrice', 
      label: 'Sale Price',
      render: (value: number) => value ? `$${value.toFixed(2)}` : '-'
    },
    { 
      key: 'roleType', 
      label: 'Role Type',
      render: (value: string) => value || '-'
    },

  ];

  return (
    <>
      <div>
        <DataTableExt
          title="Packages"
          data={allPackages ?? []}
          onCreate={handleAdd}
          initialColumns={initialColumns}
          onDelete={(row) => handleDelete(row)}
          onView={(row) => handleView(row)}
        />
      </div>

      
    </>
  );
};

export default PackageTable;