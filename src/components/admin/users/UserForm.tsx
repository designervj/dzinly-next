"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { RolePermissionModel } from "@/components/onboarding/RolePermisionModel";
import { TenantModel } from "../accounts/AccountType";
import { toast } from "sonner";
import { useParams } from "next/navigation";

// shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

interface FormData {
  email: string;
  password: string;
  name: string;
  role: string;
  status: string;
  tenantId: string | string[];
}

// Helper function to categorize permissions
const categorizePermissions = (permissions: string[]) => {
  const categories: Record<string, string[]> = {};
  permissions.forEach((permission) => {
    const [category] = permission.split(":");
    if (!categories[category]) categories[category] = [];
    categories[category].push(permission);
  });
  return categories;
};

// Helper function to format permission display
const formatPermission = (permission: string) => {
  const [, action] = permission.split(":");
  return {
    action: action ? action.charAt(0).toUpperCase() + action.slice(1) : permission,
  };
};

export function UserForm() {
  const params = useParams();
  const id = params.id as string | undefined;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { user, alluser } = useSelector((state: RootState) => state.user);
  const { rolesPermissions } = useSelector(
    (state: RootState) => state.rolePermission
  );
  const { allAccounts } = useSelector((state: RootState) => state.account);

  const [availableRoles, setAvailableRoles] = useState<RolePermissionModel[]>(
    []
  );

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    role: "",
    status: "active",
    tenantId: [],
  });

  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canSelectMultipleTenants, setCanSelectMultipleTenants] =
    useState(false);

  // Tenant combobox UI state (shadcn)
  const [tenantPopoverOpen, setTenantPopoverOpen] = useState(false);
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");

  // roles filter (same logic)
  useEffect(() => {
    if (user?.role == "superadmin") {
      setAvailableRoles(rolesPermissions);
    } else {
      const find = rolesPermissions.find((d) => d.code == user?.role)
        ?.canCreateRole;
      const filteredRoles = rolesPermissions.filter((d) => {
        return find?.includes(d.code!);
      });
      setAvailableRoles(filteredRoles);
    }
  }, [user, rolesPermissions]);

  // set form if edit id (same logic)
  useEffect(() => {
    if (alluser.length > 0 && id) {
      const dataifId = alluser.find((d) => d._id == id);
      if (
        dataifId &&
        dataifId.email &&
        dataifId.name &&
        dataifId.role &&
        dataifId.status &&
        dataifId.tenantId
      ) {
        setFormData({
          email: dataifId?.email,
          name: dataifId.name,
          role: dataifId?.role,
          status: dataifId?.status,
          tenantId: dataifId?.tenantId,
          password: "",
        });
      }
    }
  }, [alluser, id]);

  // Role -> permissions same behavior
  useEffect(() => {
    if (formData.role) {
      const selectedRole = availableRoles.find((r) => r.code === formData.role);

      if (selectedRole) {
        setRolePermissions(selectedRole.permissions || []);
        setSelectedPermissions(selectedRole.permissions || []);
        setCanSelectMultipleTenants(selectedRole.canMultipleTenants);

        // expand all
        const categories = categorizePermissions(selectedRole.permissions || []);
        const expanded: Record<string, boolean> = {};
        Object.keys(categories).forEach((cat) => (expanded[cat] = true));
        setExpandedCategories(expanded);

        // Reset tenantId based on canMultipleTenants (same logic)
        if (selectedRole.canMultipleTenants) {
          setFormData((prev) => ({
            ...prev,
            tenantId: Array.isArray(prev.tenantId)
              ? prev.tenantId
              : prev.tenantId
              ? [prev.tenantId]
              : [],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            tenantId: Array.isArray(prev.tenantId)
              ? prev.tenantId[0] || ""
              : prev.tenantId,
          }));
        }
      }
    } else {
      setRolePermissions([]);
      setSelectedPermissions([]);
      setCanSelectMultipleTenants(false);
      setFormData((prev) => ({ ...prev, tenantId: [] }));
      setExpandedCategories({});
    }
  }, [formData.role, availableRoles]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) return prev.filter((p) => p !== permission);
      return [...prev, permission];
    });
  };

  const toggleCategoryPermissions = (category: string, permissions: string[]) => {
    const allSelected = permissions.every((p) => selectedPermissions.includes(p));
    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !permissions.includes(p))
      );
    } else {
      setSelectedPermissions((prev) => {
        const next = [...prev];
        permissions.forEach((p) => {
          if (!next.includes(p)) next.push(p);
        });
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!id && !formData.password) newErrors.password = "Password is required";
    else if (!id && formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setMessage({ type: "", text: "" });
    if (!validateForm()) return;

    setLoading(true);

    try {
      const userData = {
        email: formData.email,
        passwordHash: formData.password,
        name: formData.name,
        role: formData.role,
        permissions: selectedPermissions,
        status: formData.status,
        tenantId: formData.tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let result;
      if (!id) {
        const response = await fetch("/api/admin/users", {
          method: "POST",
          body: JSON.stringify(userData),
        });
        result = await response.json();
      } else {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "PUT",
          body: JSON.stringify(userData),
        });
        result = await response.json();
      }

      if (result.success) {
        toast.success(result.message);
        if (!id) {
          setMessage({ type: "success", text: result.message });
          setFormData({
            email: "",
            password: "",
            name: "",
            role: "",
            status: "active",
            tenantId: [],
          });
          setSelectedPermissions([]);
          setRolePermissions([]);
          setErrors({});
          setCanSelectMultipleTenants(false);
        }
      } else {
        toast.error(result.message || "Not Possible");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to create user. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "",
      status: "active",
      tenantId: [],
    });
    setErrors({});
    setMessage({ type: "", text: "" });
    setTenantSearchQuery("");
    setTenantPopoverOpen(false);
    setCanSelectMultipleTenants(false);
    setSelectedPermissions([]);
    setRolePermissions([]);
  };

  // Cast allAccounts to Tenant[]
  const tenants = (allAccounts as TenantModel[]) || [];

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name?.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      tenant.slug?.toLowerCase().includes(tenantSearchQuery.toLowerCase())
  );

  const selectedTenants = tenants.filter((tenant) => {
    if (Array.isArray(formData.tenantId) && typeof tenant._id == "string") {
      return formData.tenantId.includes(tenant._id);
    }
    return formData.tenantId === tenant._id;
  });

  const isTenantSelected = (tenantId: string): boolean => {
    if (Array.isArray(formData.tenantId)) return formData.tenantId.includes(tenantId);
    return formData.tenantId === tenantId;
  };

  const toggleTenantSelection = (tenantId: string) => {
    if (canSelectMultipleTenants) {
      setFormData((prev) => {
        const currentIds = Array.isArray(prev.tenantId) ? prev.tenantId : [];
        const isSelected = currentIds.includes(tenantId);
        return {
          ...prev,
          tenantId: isSelected
            ? currentIds.filter((id) => id !== tenantId)
            : [...currentIds, tenantId],
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, tenantId }));
      setTenantPopoverOpen(false);
    }
  };

  const removeTenant = (tenantId: string) => {
    if (canSelectMultipleTenants && Array.isArray(formData.tenantId)) {
      setFormData((prev) => ({
        ...prev,
        tenantId: (prev.tenantId as string[]).filter((id) => id !== tenantId),
      }));
    } else {
      setFormData((prev) => ({ ...prev, tenantId: "" }));
    }
  };

  const categorizedPermissions = categorizePermissions(rolePermissions);

  // keep your same loading condition (logic unchanged)
  const isDataLoading = alluser.length <= 0;

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-muted/30 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold">Loading…</h2>
                <p className="text-sm text-muted-foreground">
                  Please wait while we load the required data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen  px-4 py-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* <h1 className="text-3xl font-bold tracking-tight">
                {id ? "Update User" : "Create User"}
              </h1> */}
              <BreadCrumbPage />

              <p className="text-muted-foreground mt-1">
                Add a new user to the system
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="bg-background">
                Admin Panel
              </Badge>
              {formData.role ? (
                <Badge className="bg-primary text-primary-foreground">
                  {formData.role}
                </Badge>
              ) : (
                <Badge variant="secondary">No role selected</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <Card
            className={`mb-6 border ${
              message.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-700" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 text-red-700" />
                )}
                <div className="text-sm font-medium">{message.text}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <Card className="lg:col-span-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">User Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label>
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="John Doe"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="john@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                {!id && (
                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, password: e.target.value }))
                        }
                        placeholder="Minimum 8 characters"
                        className={`pr-12 ${errors.password ? "border-red-500" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-600">{errors.password}</p>
                    )}
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Permissions */}
              {rolePermissions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Role Permissions</p>
                      <p className="text-xs text-muted-foreground">
                        Select or deselect permissions per category.
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {selectedPermissions.length} / {rolePermissions.length} selected
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(categorizedPermissions).map(
                      ([category, permissions]) => {
                        const allSelected = permissions.every((p) =>
                          selectedPermissions.includes(p)
                        );

                        return (
                          <div
                            key={category}
                            className="rounded-xl border bg-background overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition"
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={() =>
                                    toggleCategoryPermissions(category, permissions)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="text-left">
                                  <div className="text-sm font-semibold capitalize">
                                    {category}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {
                                      permissions.filter((p) =>
                                        selectedPermissions.includes(p)
                                      ).length
                                    }
                                    /{permissions.length} selected
                                  </div>
                                </div>
                              </div>

                              {expandedCategories[category] ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>

                            {expandedCategories[category] && (
                              <div className="p-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {permissions.map((permission) => {
                                    const { action } = formatPermission(permission);
                                    const checked = selectedPermissions.includes(permission);

                                    return (
                                      <label
                                        key={permission}
                                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                                          checked
                                            ? "border-primary/30 bg-primary/5"
                                            : "hover:bg-muted/30"
                                        }`}
                                      >
                                        <Checkbox
                                          checked={checked}
                                          onCheckedChange={() =>
                                            togglePermission(permission)
                                          }
                                        />
                                        <div className="min-w-0">
                                          <div className="text-sm font-medium">
                                            {action}
                                          </div>
                                          <div className="text-[11px] text-muted-foreground font-mono break-all">
                                            {permission}
                                          </div>
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Access & Assignment</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-5">
                {/* Role (shadcn Select) */}
                <div className="space-y-2">
                  <Label>
                    Role <span className="text-red-500">*</span>
                  </Label>

                  <div className="w-full">
                    <Select
                      value={formData.role}
                      onValueChange={(v) => {
                        setFormData((p) => ({ ...p, role: v }));
                        if (errors.role) setErrors((e) => ({ ...e, role: "" }));
                      }}
                    >
                      <SelectTrigger className={`w-full ${errors.role ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>

                      {/* width match trigger */}
                      <SelectContent className="w-[--radix-select-trigger-width]">
                        {availableRoles.map((role) => (
                          <SelectItem key={role._id} value={role.code!}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {errors.role && (
                    <p className="text-xs text-red-600">{errors.role}</p>
                  )}
                </div>

                {/* Tenant selection (shadcn Popover + Command) */}
                {formData.role && user?.role == "superadmin" && (
                  <div className="space-y-2">
                    <Label>
                      Select Business{canSelectMultipleTenants ? "s" : ""}
                      {canSelectMultipleTenants && (
                        <span className="ml-2 text-xs text-primary font-normal">
                          (Multiple selection enabled)
                        </span>
                      )}
                    </Label>

                    <Popover open={tenantPopoverOpen} onOpenChange={setTenantPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            {selectedTenants.length > 0
                              ? canSelectMultipleTenants
                                ? `${selectedTenants.length} tenant(s) selected`
                                : selectedTenants[0]?.name
                              : canSelectMultipleTenants
                              ? "Search and select business"
                              : "Search and select a business"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search business..."
                            value={tenantSearchQuery}
                            onValueChange={setTenantSearchQuery}
                          />
                          <CommandEmpty>No tenants found.</CommandEmpty>

                          <CommandGroup>
                            <ScrollArea className="h-64">
                              {filteredTenants.map((tenant) => {
                                const tid = String(tenant._id);
                                const selected = isTenantSelected(tid);

                                return (
                                  <CommandItem
                                    key={tid}
                                    value={`${tenant.name ?? ""} ${tenant.slug ?? ""}`}
                                    onSelect={() => toggleTenantSelection(tid)}
                                    className="flex items-start gap-3"
                                  >
                                    <div className="mt-0.5">
                                      {canSelectMultipleTenants ? (
                                        <Checkbox checked={selected} />
                                      ) : (
                                        <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                                          {selected ? (
                                            <Check className="h-3 w-3" />
                                          ) : null}
                                        </div>
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <div className="text-sm font-medium truncate">
                                        {tenant.name}
                                      </div>
                                      <div className="text-xs text-muted-foreground truncate">
                                        {tenant.slug}
                                      </div>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </ScrollArea>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Selected chips */}
                    {selectedTenants.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedTenants.map((tenant) => (
                          <Badge
                            key={String(tenant._id)}
                            variant="secondary"
                            className="gap-2 pr-1"
                          >
                            <span className="truncate max-w-[220px]">
                              {tenant.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeTenant(String(tenant._id))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Status (shadcn Select) */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="w-full">
                    <Select
                      value={formData.status}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, status: v }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="w-[--radix-select-trigger-width]">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-11 font-semibold"
                  >
                    {loading
                      ? id
                        ? "Updating..."
                        : "Creating..."
                      : id
                      ? "Update User"
                      : "Create User"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="h-11 font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-semibold">Tip</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Role select karte hi permissions auto-load hoti hain (as per role config).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
