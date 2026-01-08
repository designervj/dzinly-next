"use client";

import React, { useMemo, useState } from "react";
import { Search, ShieldCheck, CheckCircle2, XCircle, Layers } from "lucide-react";

// If you already have these shadcn components, use them.
// Otherwise, you can replace with simple div/button/input as needed.
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

type RoleFormData = {
  name: string;
  code: string;
  permissions: string[];
};

const ALL_PERMISSIONS = [
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
  "websites:delete",

  // Media
  "media:read",
  "media:create",
  "media:update",

  // Content
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

  // attributes
  "attribute:read",
  "attribute:create",
  "attribute:update",
  "attribute:delete",

  // segments
  "segment:read",
  "segment:create",
  "segment:update",
  "segment:delete",

  // AI Studio
  "ai:read",
  "ai:create",
  "ai:update",
  "ai:delete",

  "inventory:read",
] as const;

type Action = "read" | "create" | "update" | "delete";

const ACTIONS: Action[] = ["read", "create", "update", "delete"];

const ACTION_META: Record<Action, { label: string; badge: string }> = {
  read: { label: "Read", badge: "READ" },
  create: { label: "Create", badge: "CREATE" },
  update: { label: "Update", badge: "UPDATE" },
  delete: { label: "Delete", badge: "DELETE" },
};

function titleCase(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function categorizePermissions(perms: readonly string[]) {
  const map: Record<string, Action[]> = {};
  perms.forEach((perm) => {
    const [category, actionRaw] = perm.split(":");
    const action = actionRaw as Action;
    if (!map[category]) map[category] = [];
    map[category].push(action);
  });

  // stable ordering of actions (read/create/update/delete)
  Object.keys(map).forEach((cat) => {
    map[cat] = ACTIONS.filter((a) => map[cat].includes(a));
  });

  return map;
}

export default function RolesPersmissionForm() {
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    code: "",
    permissions: [],
  });

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<Set<Action>>(new Set()); // empty => all

  const categorized = useMemo(
    () => categorizePermissions(ALL_PERMISSIONS),
    []
  );

  const allSelectedCount = formData.permissions.length;
  const totalCount = ALL_PERMISSIONS.length;

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const setPermissionsBulk = (next: string[]) => {
    // unique
    const uniq = Array.from(new Set(next));
    setFormData((prev) => ({ ...prev, permissions: uniq }));
  };

  const selectAll = () => setPermissionsBulk([...ALL_PERMISSIONS]);
  const clearAll = () => setPermissionsBulk([]);

  const isActionFilteredIn = (action: Action) => {
    if (actionFilter.size === 0) return true;
    return actionFilter.has(action);
  };

  const toggleActionFilter = (action: Action) => {
    setActionFilter((prev) => {
      const next = new Set(prev);
      if (next.has(action)) next.delete(action);
      else next.add(action);
      return next;
    });
  };

  const matchesSearch = (category: string) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return category.toLowerCase().includes(q);
  };

  const categoryPermissions = (category: string, actions: Action[]) =>
    actions.map((a) => `${category}:${a}`);

  const isCategoryAllSelected = (category: string, actions: Action[]) => {
    const perms = categoryPermissions(category, actions);
    return perms.every((p) => formData.permissions.includes(p));
  };

  const categorySelectedCount = (category: string, actions: Action[]) => {
    const perms = categoryPermissions(category, actions);
    return perms.filter((p) => formData.permissions.includes(p)).length;
  };

  const toggleCategoryAll = (category: string, actions: Action[]) => {
    const perms = categoryPermissions(category, actions);
    const allOn = perms.every((p) => formData.permissions.includes(p));

    if (allOn) {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((p) => !perms.includes(p)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: Array.from(new Set([...prev.permissions, ...perms])),
      }));
    }
  };

  const visibleCategories = Object.entries(categorized)
    .filter(([category]) => matchesSearch(category))
    .map(([category, actions]) => {
      const filteredActions = actions.filter((a) => isActionFilteredIn(a));
      return [category, filteredActions] as const;
    })
    .filter(([, actions]) => actions.length > 0);

  return (
    <div className="w-full">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border bg-white flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold leading-tight">
                  Create Role & Permissions
                </div>
                <div className="text-sm text-muted-foreground">
                  Choose what this role can access across the platform.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-2">
                <Layers className="h-4 w-4" />
                Selected: {allSelectedCount}/{totalCount}
              </Badge>
              <Button
                type="button"
                variant="secondary"
                onClick={selectAll}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Select all
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={clearAll}
                className="gap-2 bg-white hover:bg-white hover:shadow-sm"
              >
                <XCircle className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

      <Card className="overflow-hidden">
        {/* <CardHeader className="border-b bg-background">
    
        </CardHeader> */}

        <CardContent className="p-4 md:p-6 space-y-6">
          {/* Role fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Super Admin"
              />
              <p className="text-xs text-muted-foreground">
                A readable name for admins to identify the role.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role Code</label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, code: e.target.value }))
                }
                placeholder="e.g. super_admin"
              />
              <p className="text-xs text-muted-foreground">
                A unique slug used internally (lowercase + underscores).
              </p>
            </div>
          </div>

          <Separator />

          {/* Permission tools */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules… (dashboard, media, product)"
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {ACTIONS.map((a) => {
                const active = actionFilter.size === 0
                  ? true
                  : actionFilter.has(a);

                return (
                  <Button
                    key={a}
                    type="button"
                    variant={active ? "secondary" : "outline"}
                    onClick={() => toggleActionFilter(a)}
                    className="h-9"
                  >
                    {ACTION_META[a].label}
                  </Button>
                );
              })}
              <Button
                type="button"
 
                onClick={() => setActionFilter(new Set())}

              >
                Reset filter
              </Button>
            </div>
          </div>

          {/* Permission list */}
          <div className="grid gap-4">
            {visibleCategories.map(([category, actions]) => {
              const selectedInCat = categorySelectedCount(category, actions);
              const totalInCat = actions.length;
              const allCat = isCategoryAllSelected(category, actions);

              return (
                <Card key={category} className="border">
                  <CardHeader className="py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="text-base font-semibold">
                            {titleCase(category)}
                          </div>
                          <Badge variant="secondary">
                            {selectedInCat}/{totalInCat}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Manage permissions for {titleCase(category)} module.
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => toggleCategoryAll(category, actions)}
                          className="h-9"
                        >
                          {allCat ? "Unselect all" : "Select all"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-5">
                    {/* FLEX GRID CHECKBOXES */}
                    <div className="flex flex-wrap gap-3">
                      {actions.map((action) => {
                        const permission = `${category}:${action}`;
                        const checked = formData.permissions.includes(permission);

                        return (
                          <label
                            key={permission}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border px-3 py-2",
                              "min-w-[180px] flex-1 md:flex-none",
                              "hover:bg-muted/40 transition cursor-pointer"
                            )}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={checked ? "default" : "secondary"}
                                className="text-[11px]"
                              >
                                {ACTION_META[action].badge}
                              </Badge>
                              <span className="text-sm font-medium">
                                {ACTION_META[action].label}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {visibleCategories.length === 0 && (
              <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
                No permissions found for your search/filter.
              </div>
            )}
          </div>

          {/* Debug / preview (optional) */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="text-sm font-semibold mb-2">Preview (selected)</div>
            <div className="flex flex-wrap gap-2">
              {formData.permissions.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  No permissions selected.
                </span>
              ) : (
                formData.permissions
                  .slice()
                  .sort()
                  .map((p) => (
                    <Badge key={p} variant="secondary">
                      {p}
                    </Badge>
                  ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
