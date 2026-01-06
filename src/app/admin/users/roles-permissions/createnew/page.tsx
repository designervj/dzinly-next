"use client";

import React, { useState } from "react";
import { X, Eye, Edit2, Plus } from "lucide-react";
import RolesPersmissionForm from "@/components/admin/users/rolesAndPermissions/RolesPersmissionForm";

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
    <div className="min-h-screen ">
      <RolesPersmissionForm />
    </div>
  );
};

export default Page;
