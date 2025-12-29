"use client";
import { createCustomer } from "@/hooks/slices/user/userSlice";
import { useToast } from "@/hooks/use-toast";
import { IUser } from "@/models/user";
import { AppDispatch } from "@/store/store";

import React, { useState } from "react";
import { useDispatch } from "react-redux";


const initialState: IUser = {
  email: "",
  passwordHash: "",
  name: "",
  role: "",
  status: "active",
  permissions: [],
  lastLoginAt: new Date(),
};

const Page = () => {
  const [form, setForm] = useState<IUser>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const dispatch= useDispatch<AppDispatch>()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e:any) => {
    //setForm(initialState);
  e.preventDefault()

  console.log(" user form", form)
  const resposne= await dispatch(createCustomer(form)).unwrap
    // if(resposne ){
    //   alert("")
    // }  
}
    // try {
    //   // Prepare payload for API (send password as 'password', not 'passwordHash')
    //   const payload = {
    //     ...form,
    //     password: form.passwordHash,
    //   };
    //   delete payload.passwordHash;
    //   const res = await fetch(`/api/admin/customer`, {
    //     method: "POST",
    //     credentials: "same-origin",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   });
    //   const data = await res.json().catch(() => null);
    //   if (!res.ok) {
    //     const msg =
    //       data?.error ??
    //       data?.message ??
    //       (typeof data === "string" ? data : undefined) ??
    //       "Failed to create";
    //     throw new Error(msg);
    //   }
    //   const created = data?.item ?? data;
    //   // toast({ title: 'Created', description: `Category ${newCategory.name} created successfully` });
    //   setForm(initialState);
    //   // window.location.reload();
    // } catch (err: any) {
    //   console.error("Failed to create category", err);
    //   // toast({ title: 'Create failed', description: String(err?.message || err), variant: 'destructive' });
    // } finally {
    //   setForm(initialState);
    //   //setIsSaving(false);
    // }

  return (
    <div className="p-6">
      <form className="bg-gray-50 border rounded-xl p-6 max-w-4xl mx-auto" onSubmit={handleCreateUser}>
        <h2 className="text-xl font-bold mb-6">User Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white placeholder-gray-400"
              placeholder="user@example.com"
              autoComplete="email"
              required
            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="passwordHash"
                value={form.passwordHash}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white placeholder-gray-400 pr-10"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" stroke="#888" strokeWidth="2" />
                  <circle cx="10" cy="10" r="3" fill="#888" />
                </svg>
              </button>
            </div>
          </div>
          {/* Business Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              User Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white placeholder-gray-400"
              placeholder="Business Name"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold mb-2">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleSelectChange}
              className="w-full border rounded px-3 py-2 bg-white placeholder-gray-400"
              required
            >
              <option value="">Select role</option>
              <option value="customer">Customer</option>
              <option value="designer coordinator">Designer Coordinator</option>
              <option value="design keeper">Design Keeper</option>
            </select>
          </div>
          {/* Status */}
          {/* <div className="flex items-center gap-4 mt-6">
            <label className="block text-sm font-semibold">Status</label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="status"
                value="active"
                checked={form.status === true}
                onChange={() => setForm(prev => ({ ...prev, status: true }))}
              />
              <span className="text-xs">Active</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={form.status === false}
                onChange={() => setForm(prev => ({ ...prev, status: false }))}
              />
              <span className="text-xs">Inactive</span>
            </label>
          </div> */}
          {/* Permissions */}
          {/* <div>
            <label className="block text-sm font-semibold mb-2">Permissions</label>
            <select
              name="permissions"
              multiple
              value={form.permissions}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                setForm(prev => ({ ...prev, permissions: options }));
              }}
              className="w-full border rounded px-3 py-2 bg-white placeholder-gray-400"
            >
              <option value="dashboard">Dashboard</option>
              <option value="users">Users</option>
              <option value="tenants">Tenants</option>
              <option value="products">Products</option>
              <option value="orders">Orders</option>
              <option value="content">Content</option>
              <option value="settings">Settings</option>
            </select>
          </div> */}
          {/* Last Login (read-only) */}
          {/* <div>
            <label className="block text-sm font-semibold mb-2">Last Login</label>
            <input
              type="text"
              name="lastLogin"
              value={form.lastLogin}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
              placeholder="Last login timestamp"
            />
          </div> */}
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded shadow"
          >
            Create
          </button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded shadow"
            onClick={() => setForm(initialState)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
