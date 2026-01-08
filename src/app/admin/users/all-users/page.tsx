"use client";

import React from "react";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";
import GetAllUsers from "@/components/admin/users/GetAllUsers";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IUser } from "@/models/user";
import { Button } from "@/components/ui/button";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableExt } from "@/components/dataTable/DataTableExt";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/utils";
import { toast } from "sonner";

export default function Page() {
  const { user, hasFetchedAllUsers, alluser } = useSelector(
    (state: RootState) => state.user
  );

  const router = useRouter();

  const handleAdd = () => {
    const check = hasPermission(user, "user:create");
    if (check) {
      router.push("/admin/users/all-users/create");
    } else {
      toast.error("You are not Allowed");
    }
  };

  const handleView = (row: IUser) => {
    const check = hasPermission(user, "user:update");
    if (check) {
      router.push(`/admin/users/all-users/${row._id}`);
    } else {
      toast.error("You are not Allowed");
    }
  };

  const handleDelete = (row: IUser) => {};
  // const handleView = (row: IUser) => {

  // };
  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "tenantId", label: "Tenant ID" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
    { key: "passwordHash", label: "Password Hash", hidden: true },
    { key: "permissions", label: "Permissions", hidden: true },
  ];
  return (
    <>
      {/* get all users */}
      <GetAllUsers />
      <DataTableExt
        title=""
        data={alluser ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
      />

      <div className="min-h-screen">
        {/* PAGE HEADER */}
        <div className="flex items-center justify-between mb-6">
          {/* <div>
        <BreadCrumbPage/>
           <p className="text-gray-500 mt-1">
            Manage users, roles and permissions
          </p>
        </div> */}

          {/* <Button >
          <UserPlus size={18} />
          Add User
        </Button> */}
        </div>

        {/* SEARCH + FILTER */}
        {/* <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Select defaultValue="all">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All Roles</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </SelectContent>
    </Select>
      </div> */}

        {/* USERS TABLE */}
        {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-600">Name</th>
              <th className="p-4 text-sm font-medium text-gray-600">Email</th>
              <th className="p-4 text-sm font-medium text-gray-600">Role</th>
              <th className="p-4 text-sm font-medium text-gray-600">Status</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {alluser &&
            alluser.length>0 &&
            alluser.map((user:IUser) => (
              <tr
                key={user?._id?.toString()}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      </div>
    </>
  );
}
