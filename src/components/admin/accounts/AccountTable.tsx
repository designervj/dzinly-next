"use client";

import React, { useState } from 'react';
import { DataTableExt } from '../DataTableExt';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { TenantModel } from './AccountType';
import { updateAccount, removeAccount } from '@/hooks/slices/user/accountSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AccountTable = () => {
  const { allAccounts, hasFetched } = useSelector((state: RootState) => state.account);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<TenantModel | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async (row: any) => {
    const id = row?._id?.toString() ?? row?.id;
    if (!id) {
      toast.error('Delete failed: Missing id');
      return;
    }

    const ok = confirm(`Delete account "${row?.name ?? id}"? This will suspend the tenant.`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/users/accounts?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeAccount(id));
      toast.success(`Account ${row?.name ?? id} suspended`);
    } catch (err: any) {
      console.error('Failed to delete account', err);
      toast.error(String(err?.message || err));
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;

    // Set the account data for editing
    setEditingAccount(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAccount) return;

    setFieldErrors({});
    const errors: Record<string, string> = {};

    if (!editingAccount.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!editingAccount.email?.trim()) {
      errors.email = 'Email is required';
    }
    if (!editingAccount.slug?.trim()) {
      errors.slug = 'Slug is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const id = (editingAccount as any)._id?.toString() ?? editingAccount._id;

      // Remove _id and other non-updatable fields from the payload
      const { _id, createdAt, ...updateData } = editingAccount as any;

      const res = await fetch(`/api/admin/users/accounts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updateData, id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      const { tenant } = await res.json();
      dispatch(updateAccount(tenant));
      toast.success(`Account ${editingAccount.name} updated successfully`);
      setIsEditDialogOpen(false);
      setEditingAccount(null);
    } catch (err: any) {
      console.error('Failed to update account', err);
      toast.error(String(err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    if (user?.role !== "superadmin") {
      toast.error("You don't have permission to create accounts");
      return;
    }
    router.push(`/admin/users/accounts/create`);
  };

  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'slug', label: 'Slug' },
    { 
      key: 'plan', 
      label: 'Plan',
      render: (value: string) => (
        <span className="capitalize px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => {
        const colors = {
          active: 'bg-green-100 text-green-800',
          suspended: 'bg-red-100 text-red-800',
          pending: 'bg-yellow-100 text-yellow-800',
        };
        return (
          <span className={`capitalize px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'subscriptionStatus', 
      label: 'Subscription',
      render: (value: string) => (
        <span className="capitalize">{value}</span>
      )
    },
    { key: 'customDomainVerified', label: 'Domain Verified', render: (value: boolean) => value ? '✓' : '✗' },
    { 
      key: 'createdAt', 
      label: 'Created',
      render: (value: Date) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'updatedAt', 
      label: 'Updated',
      render: (value: Date) => new Date(value).toLocaleDateString()
    },
  ];

  return (
    <>
      <div>
        <DataTableExt
          title="Accounts"
          data={allAccounts ?? []}
          onCreate={handleAdd}
          initialColumns={initialColumns}
          onDelete={(row) => handleDelete(row)}
          onView={(row) => handleView(row)}
        />
      </div>

      {/* Edit Account Dialog */}
      {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>

          {editingAccount && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={editingAccount.name}
                  onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                  placeholder="Account name"
                />
                {fieldErrors.name && (
                  <p className="text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingAccount.email}
                  onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                  placeholder="contact@example.com"
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={editingAccount.slug}
                  onChange={(e) => setEditingAccount({ ...editingAccount, slug: e.target.value.toLowerCase() })}
                  placeholder="account-slug"
                />
                {fieldErrors.slug && (
                  <p className="text-sm text-red-600">{fieldErrors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select
                  value={editingAccount.plan}
                  onValueChange={(value: any) => setEditingAccount({ ...editingAccount, plan: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingAccount.status}
                  onValueChange={(value: any) => setEditingAccount({ ...editingAccount, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriptionStatus">Subscription Status</Label>
                <Select
                  value={editingAccount.subscriptionStatus}
                  onValueChange={(value: any) => setEditingAccount({ ...editingAccount, subscriptionStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingAccount(null);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default AccountTable;