"use client";

import React from "react";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";
import GetAllUsers from "@/components/admin/users/GetAllUsers";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IUser } from "@/models/user";

export default function Page() {
  const users = [
    {
      id: 1,
      name: "Deepak Rai",
      email: "deepak@gmail.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Amit Sharma",
      email: "amit@gmail.com",
      role: "Editor",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Rohit Verma",
      email: "rohit@gmail.com",
      role: "Viewer",
      status: "Active",
    },
  ];

   const { user, hasFetchedAllUsers, alluser } = useSelector(
    (state: RootState) => state.user
  );
  return (
    <>

    {/* get all users */}
    <GetAllUsers/>

     <div className="min-h-screen bg-gray-50 p-8">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">All Users</h1>
          <p className="text-gray-500 mt-1">
            Manage users, roles and permissions
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select className="border rounded-lg px-4 py-2">
          <option>All Roles</option>
          <option>Admin</option>
          <option>Editor</option>
          <option>Viewer</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
      </div>
    </div>
    </>
   
  );
}
