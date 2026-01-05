"use client";

import React, { useState } from 'react'



const RolesPersmissionForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        permissions: [] as string[],
    });
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

    const togglePermission = (permission: string) => {
        setFormData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter((p) => p !== permission)
                : [...prev.permissions, permission],
        }));
    };

    const categorizedPermissions = categorizePermissions(allPermissions);
    return (

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
    )
}

export default RolesPersmissionForm