"use client";

import React, { useState } from "react";
import { X, Eye, Edit2, Plus } from "lucide-react";

type ModalMode = "view" | "edit" | "create" | null;

interface Role {
  id: number;
  name: string;
  code: string;
  permissions: string[];
}

const ALL_PERMISSIONS = [
  "dashboard:read",
  "dashboard:create",
  "dashboard:update",
  "users:read",
  "users:create",
  "users:update",
  "users:delete",
  "settings:read",
  "settings:update",
];

const categorizePermissions = (permissions: string[]) => {
  const map: Record<string, string[]> = {};
  permissions.forEach((p) => {
    const [cat, action] = p.split(":");
    if (!map[cat]) map[cat] = [];
    map[cat].push(action);
  });
  return map;
};

const Page = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Admin",
      code: "ADMIN",
      permissions: ALL_PERMISSIONS,
    },
    {
      id: 2,
      name: "Editor",
      code: "EDITOR",
      permissions: ["dashboard:read", "users:read"],
    },
  ]);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    permissions: [] as string[],
  });

  const openModal = (mode: ModalMode, role?: Role) => {
    setModalMode(mode);
    if (role) {
      setSelectedRole(role);
      setFormData({
        name: role.name,
        code: role.code,
        permissions: role.permissions,
      });
    } else {
      setSelectedRole(null);
      setFormData({ name: "", code: "", permissions: [] });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedRole(null);
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSave = () => {
    if (modalMode === "create") {
      setRoles([
        ...roles,
        {
          id: Date.now(),
          name: formData.name,
          code: formData.code,
          permissions: formData.permissions,
        },
      ]);
    }

    if (modalMode === "edit" && selectedRole) {
      setRoles(
        roles.map((r) =>
          r.id === selectedRole.id ? { ...r, ...formData } : r
        )
      );
    }

    closeModal();
  };

  const categorizedPermissions = categorizePermissions(ALL_PERMISSIONS);
  const selectedCategorized = selectedRole
    ? categorizePermissions(selectedRole.permissions)
    : {};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Roles & Permissions</h1>
            <p className="text-sm text-gray-500">
              Manage roles and assign permissions
            </p>
          </div>
          <button
            onClick={() => openModal("create")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <Plus size={18} /> Create Role
          </button>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white border rounded-lg p-5"
            >
              <h3 className="font-semibold">{role.name}</h3>
              <p className="text-xs text-gray-500">{role.code}</p>

              <p className="text-sm mt-2">
                {role.permissions.length} permissions
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openModal("view", role)}
                  className="flex-1 border px-3 py-1.5 rounded-md text-sm flex justify-center gap-1"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => openModal("edit", role)}
                  className="flex-1 bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm flex justify-center gap-1"
                >
                  <Edit2 size={16} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="font-semibold text-lg">
                {modalMode === "view" && "View Role"}
                {modalMode === "edit" && "Edit Role"}
                {modalMode === "create" && "Create Role"}
              </h2>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              {modalMode === "view" ? (
                Object.entries(selectedCategorized).map(
                  ([cat, actions]) => (
                    <div key={cat}>
                      <h4 className="font-medium capitalize">{cat}</h4>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {actions.map((a) => (
                          <span
                            key={a}
                            className="px-3 py-1 text-sm bg-indigo-100 rounded-full"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )
              ) : (
                <>
                  <input
                    className="w-full border px-3 py-2 rounded-md"
                    placeholder="Role Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    className="w-full border px-3 py-2 rounded-md"
                    placeholder="Role Code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />

                  {Object.entries(categorizedPermissions).map(
                    ([cat, actions]) => (
                      <div key={cat}>
                        <h4 className="font-medium capitalize">{cat}</h4>
                        {actions.map((a) => {
                          const perm = `${cat}:${a}`;
                          return (
                            <label
                              key={perm}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(perm)}
                                onChange={() => togglePermission(perm)}
                              />
                              {a}
                            </label>
                          );
                        })}
                      </div>
                    )
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              {modalMode !== "view" && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
