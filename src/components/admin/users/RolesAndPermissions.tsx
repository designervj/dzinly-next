"use client";

import { addRoles, updateRolePermissions } from "@/hooks/slices/RolePermission/rolePermissionSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Plus, X, Eye, Edit2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Roles {
  _id: string;
  code: string;
  name: string;
  permissions: string[];
}

interface RolesProps {
  totalroles: Roles[];
}

type ModalMode = "view" | "edit" | "create" | null;

export const RolesAndPermissions = ({ totalroles }: RolesProps) => {
  const [roles, setRoles] = useState(totalroles);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedRole, setSelectedRole] = useState<Roles | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    permissions: [] as string[],
  });
  const dispatch = useDispatch<AppDispatch>();
  const { rolesPermissions, hasFetched } = useSelector(
    (state: RootState) => state.rolePermission
  );

  // upadate the redux

  useEffect(() => {
    if (
      rolesPermissions &&
      rolesPermissions.length == 0 &&
      totalroles &&
      !hasFetched
    ) {
      dispatch(updateRolePermissions(totalroles));
    }
  }, [rolesPermissions, hasFetched]);

  // All available permissions - can be fetched from API


 const allPermissions = [
  // Dashboard
  "dashboard:read",
  "dashboard:create",
  "dashboard:update",

  // Analytics
  "analytics:read",

  // Security
  "security:read",
  "security:create",
  "security:update",

  // Websites
  "websites:read",
  "websites:create",
  "websites:update",
  "website:delete",

  // Media
  "media:read",
  "media:create",
  "media:update",

  // Content (CMS / Branding / Marketing / Users / Settings / Blocks)
  "content:read",
  "content:create",
  "content:update",
  "content:delete",

  // Products
  "product:read",
  "product:create",
  "product:update",
  "product:delete",

  // categories
  "category:read",
  "category:create",
  "category:update",
  "category:delete",
  //attributes
  "attribute:read",
  "attribute:create",
  "attribute:update",
  "attribute:delete",

  //segments
  "segment:read",
  "segment:create",
  "segment:update",
  "segment:delete",

  // AI Studio
  "ai:read",
  "ai:create",
  "ai:update",
  "ai:delete",
];


  // Categorize permissions
  const categorizePermissions = (permissions: string[]) => {
    const categories: { [key: string]: string[] } = {};
    permissions.forEach((perm) => {
      const [category, action] = perm.split(":");
      if (!categories[category]) categories[category] = [];
      categories[category].push(action);
    });
    return categories;
  };

  const openModal = (mode: ModalMode, role?: Roles) => {
    setModalMode(mode);
    if (role) {
      setSelectedRole(role);
      setFormData({
        name: role.name,
        code: role.code,
        permissions: [...role.permissions],
      });
    } else {
      setSelectedRole(null);
      setFormData({ name: "", code: "", permissions: [] });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedRole(null);
    setFormData({ name: "", code: "", permissions: [] });
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSave = async () => {
    if (modalMode === "create") {
      const res = await fetch(`/api/rolesandpermissions`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.ok) {
        const newRole = result.roles;
        setRoles([...roles, newRole]);
      }
    } else if (modalMode === "edit" && selectedRole) {
      const res = await fetch(
        `/api/rolesandpermissions?id=${selectedRole._id}&type=edit`,
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );
      const updated = await res.json();
      if (updated.ok) {
        dispatch(addRoles(updated.roles))
        const newRole = updated.roles;
        setRoles(
          roles.map((r) =>
            r._id === selectedRole._id ? { ...r, ...newRole } : r
          )
        );
      }
    }
    closeModal();
  };

  const categorizedPermissions = categorizePermissions(allPermissions);
  const selectedCategorized = selectedRole
    ? categorizePermissions(selectedRole.permissions)
    : {};
  const formCategorized = categorizePermissions(formData.permissions);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Roles & Permissions
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Review your members roles and allocate permissions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <div
                key={role._id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {role.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{role.code}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {role.permissions.length} Permissions
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal("view", role)}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openModal("edit", role)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            ))}

            <div
              onClick={() => openModal("create")}
              className="bg-white rounded-lg border border-gray-200 border-dashed p-6 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-50"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <button className="text-sm font-medium text-gray-900 hover:text-gray-700">
                Create New Role
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {modalMode === "view" && "View Role"}
                  {modalMode === "edit" && "Edit Role"}
                  {modalMode === "create" && "Create New Role"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {modalMode === "view" ? (
                  // View Mode
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role Name
                      </label>
                      <p className="text-base text-gray-900">
                        {selectedRole?.name}
                      </p>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role Code
                      </label>
                      <p className="text-base text-gray-900">
                        {selectedRole?.code}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Permissions
                      </label>
                      <div className="space-y-4">
                        {Object.entries(selectedCategorized).map(
                          ([category, actions]) => (
                            <div
                              key={category}
                              className="border rounded-lg p-4"
                            >
                              <h4 className="font-medium text-gray-900 mb-2 capitalize">
                                {category}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {actions.map((action) => (
                                  <span
                                    key={action}
                                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                  >
                                    {action}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit/Create Mode
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter role name"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role Code
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter role code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Permissions
                      </label>
                      <div className="space-y-4">
                        {Object.entries(categorizedPermissions).map(
                          ([category, actions]) => (
                            <div
                              key={category}
                              className="border rounded-lg p-4"
                            >
                              <h4 className="font-medium text-gray-900 mb-3 capitalize">
                                {category}
                              </h4>
                              <div className="space-y-2">
                                {actions.map((action) => {
                                  const permission = `${category}:${action}`;
                                  return (
                                    <label
                                      key={permission}
                                      className="flex items-center cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={formData.permissions.includes(
                                          permission
                                        )}
                                        onChange={() =>
                                          togglePermission(permission)
                                        }
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">
                                        {action}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
                  >
                    {modalMode === "create" ? "Create Role" : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
