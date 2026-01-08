"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ExternalLink,
  Eye,
  Trash2,
  Save,
  Loader2,
  Calendar,
  Link2,
  LayoutDashboard,
} from "lucide-react";

// shadcn/ui
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import BreadCrumbPage from "../breadCrumb/BreadCrumbPage";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "readonly" | "array";
  options?: { value: string; label: string }[];
  side: "left" | "right" | "NA";
  placeholder?: string;
  rows?: number;
  nestedKey?: string;
  readOnly?: boolean;
};

type PageEditorProps = {
  id: string;
  item: any;
  fields: FieldConfig[];
  apiEndpoint?: string;
  onDeleteRedirect?: string;
  viewUrl?: any;
};

function formatDateTime(dateString?: string) {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** ✅ ONE CARD that contains Status + Tenant + Website (your request) */
function StatusTenantWebsiteCard({
  status,
  tenantId,
  websiteId,
  onChange,
}: {
  status: string;
  tenantId: string;
  websiteId: string;
  onChange: (name: "status" | "tenantId" | "websiteId", value: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="text-sm font-semibold">Publish & Ownership</div>
        <div className="text-xs text-muted-foreground">
          Status + Tenant + Website in a single card
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={status || "draft"}
            onValueChange={(v) => onChange("status", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tenant */}
        <div className="space-y-2">
          <Label>Tenant</Label>
          <Input
            value={tenantId || ""}
            onChange={(e) => onChange("tenantId", e.target.value)}
            placeholder="tenant-id"
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label>Website</Label>
          <Input
            value={websiteId || ""}
            onChange={(e) => onChange("websiteId", e.target.value)}
            placeholder="website-id"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PageEditor({
  id,
  item,
  fields,
  apiEndpoint = "/api/pages",
  onDeleteRedirect = "/admin/pages",
  viewUrl,
}: PageEditorProps) {
  const router = useRouter();

  const [formData, setFormData] = useState(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === "readonly") return;

      const { name, type, nestedKey } = field;

      if (nestedKey && item?.[name] && typeof item[name] === "object") {
        initialData[name] = item[name]?.[nestedKey] ?? "";
      } else if (type === "array") {
        initialData[name] = Array.isArray(item?.[name]) ? item[name] : [];
      } else {
        initialData[name] = item?.[name] ?? "";
      }
    });

    // ensure these exist so values show in the ONE card
    if (typeof initialData.status === "undefined")
      initialData.status = item?.status ?? "draft";
    if (typeof initialData.tenantId === "undefined")
      initialData.tenantId = item?.tenantId ?? "";
    if (typeof initialData.websiteId === "undefined")
      initialData.websiteId = item?.websiteId ?? "";

    return initialData;
  });

  const [saving, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Array helpers
  const handleArrayAdd = (name: string) => {
    const currentArray = formData[name] || [];
    setFormData((prev) => ({ ...prev, [name]: [...currentArray, ""] }));
  };

  const handleArrayChange = (name: string, index: number, value: string) => {
    const currentArray = [...(formData[name] || [])];
    currentArray[index] = value;
    setFormData((prev) => ({ ...prev, [name]: currentArray }));
  };

  const handleArrayRemove = (name: string, index: number) => {
    const currentArray = [...(formData[name] || [])];
    currentArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [name]: currentArray }));
  };

  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMsg(null);

    start(async () => {
      const transformedData = { ...formData };

      const res = await fetch(`${apiEndpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });

      const ok = res.ok;
      setMsg(ok ? "Saved successfully" : "Save failed");
      if (ok) {
        toast.message("Updated successfully");
        router.push("/admin/websites/pages")
      } else {
        toast.error("Save failed");
      }
    });
  };

  const handleDelete = async () => {
    const res = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = onDeleteRedirect;
    } else {
      setMsg("Delete failed");
      toast.error("Delete failed");
    }
  };

  const leftFields = useMemo(
    () => fields.filter((f) => f.side === "left"),
    [fields]
  );
  const rightFields = useMemo(
    () => fields.filter((f) => f.side === "right"),
    [fields]
  );
  const readonlyFields = useMemo(
    () => fields.filter((f) => f.type === "readonly"),
    [fields]
  );

  const slugField = useMemo(
    () => fields.find((f) => f.name === "slug" && f.type !== "readonly"),
    [fields]
  );

  const renderReadonlyMeta = () => {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {readonlyFields.map((field) => {
          const { name, label, nestedKey } = field;

          const rawValue =
            nestedKey && item?.[name] && typeof item[name] === "object"
              ? item[name]?.[nestedKey]
              : item?.[name];

          const isDateTime =
            name.toLowerCase().includes("at") ||
            name.toLowerCase().includes("date");

          const displayValue = isDateTime
            ? formatDateTime(rawValue)
            : rawValue ?? "—";

          const isCreated = name.toLowerCase().includes("created");
          const isUpdated = name.toLowerCase().includes("updated");

          return (
            <div key={name} className="rounded-xl border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{label}</div>
                {(isCreated || isUpdated) && (
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {isCreated ? "Created" : "Updated"}
                  </Badge>
                )}
              </div>
              <div className="mt-1 text-sm font-medium">
                {String(displayValue)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderField = (field: FieldConfig) => {
    const { name, label, type, options, placeholder, rows, readOnly } = field;

    if (type === "readonly") return null;

    // IMPORTANT: these 3 will be rendered inside ONE card
    if (["status", "tenantId", "websiteId"].includes(name)) return null;

    if (type === "array") {
      const arrayValue: string[] = formData[name] || [];
      return (
        <Card key={name}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-base font-semibold">{label}</div>
                <div className="text-sm text-muted-foreground">
                  Add multiple values (e.g., tags, keywords).
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleArrayAdd(name)}>
                + Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {arrayValue.length === 0 ? (
              <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
                No items yet. Click{" "}
                <span className="font-medium text-foreground">Add</span> to
                create one.
              </div>
            ) : (
              arrayValue.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={val}
                    onChange={(e) =>
                      handleArrayChange(name, idx, e.target.value)
                    }
                    placeholder={placeholder}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleArrayRemove(name, idx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={name}>
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <Label className="text-sm">{label}</Label>
              {placeholder ? (
                <div className="text-xs text-muted-foreground">
                  {placeholder}
                </div>
              ) : null}
            </div>

            {name === "slug" ? (
              <Badge variant="outline" className="gap-1">
                <Link2 className="h-3.5 w-3.5" />
                Slug
              </Badge>
            ) : null}
          </div>

          {type === "text" && (
            <Input
              value={formData[name] ?? ""}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              readOnly={!!readOnly}
            />
          )}

          {type === "textarea" && (
            <textarea
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 resize-none"
              value={formData[name] || ""}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              rows={rows || 8}
            />
          )}

          {type === "select" && options && (
            <Select
              value={formData[name] ?? ""}
              onValueChange={(v) => handleChange(name, v)}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || "Select option"} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {name === "slug" ? (
            <div className="flex flex-col gap-2 pt-1">
              <div className="text-xs text-muted-foreground">
                URL preview:{" "}
                <span className="font-mono text-foreground">
                  /{String(formData[name] || "")}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleChange("slug", slugify(String(formData[name] || "")))
                  }>
                  Auto-format
                </Button>
                {String(formData["title"] || "").trim() ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleChange(
                        "slug",
                        slugify(String(formData["title"] || ""))
                      )
                    }>
                    Generate from Title
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  const viewHref =
    viewUrl?.item?.primaryDomain?.[0] && item?.slug
      ? `//${viewUrl.item.primaryDomain[0]}${item.slug}`
      : null;

  return (
    <>
    <div className="flex items-center justify-between">
      <div>
      <BreadCrumbPage />
      <p className="text-sm text-muted-foreground">
        Update content, metadata and publish settings.
      </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {viewHref ? (
          <Button asChild variant="outline" className="gap-2">
            <a href={viewHref} rel="noopener noreferrer" target="_blank">
              <Eye className="h-4 w-4" />
              View
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : null}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              className="gap-2 cursor-pointer">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this item?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          type="button"
          disabled={saving}
          onClick={() => onSubmit()}
          className="gap-2 ">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
          {/* <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-muted/30">
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">
                Edit:{" "}
                <span className="text-muted-foreground">
                  {item?.title || item?.name || "Item"}
                </span>
              </h1>
              {item?.status ? <Badge variant="secondary">{String(item.status)}</Badge> : null}
            </div>
            <p className="text-sm text-muted-foreground">
              Update content, metadata and publish settings.
            </p>
          </div>
          </div> */}

          {/* <Separator className="my-4" /> */}

          {/* readonly meta */}
          <div className="space-y-3">
            {renderReadonlyMeta()}

            {/* slug bar */}
            {slugField ? (
              <div className="rounded-xl border bg-muted/10 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-2 w-full md:max-w-md">
                    <div className="flex items-center justify-between">
                      <Label>Slug</Label>
                      <Badge variant="outline" className="gap-1">
                        <Link2 className="h-3.5 w-3.5" />
                        URL
                      </Badge>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        /
                      </span>
                      <Input
                        className="pl-7"
                        value={String(formData["slug"] ?? "")}
                        onChange={(e) => handleChange("slug", e.target.value)}
                        placeholder="home"
                      />
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Preview:{" "}
                      <span className="font-mono text-foreground">
                        /{String(formData["slug"] ?? "")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        handleChange(
                          "slug",
                          slugify(String(formData["slug"] ?? ""))
                        )
                      }>
                      Auto-format
                    </Button>
                    {String(formData["title"] || "").trim() ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          handleChange(
                            "slug",
                            slugify(String(formData["title"]))
                          )
                        }>
                        Generate from Title
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* message */}
        {msg ? (
          <Alert className="mb-6">
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>{msg}</AlertDescription>
          </Alert>
        ) : null}

        {/* Body */}
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-8 space-y-4">
            {leftFields.map(renderField)}
          </div>

          {/* Right */}
          <div className="lg:col-span-4 space-y-4">
            {/* ✅ ONE card for three values */}
            <StatusTenantWebsiteCard
              status={String(formData.status || "draft")}
              tenantId={String(formData.tenantId || "")}
              websiteId={String(formData.websiteId || "")}
              onChange={(name, value) => handleChange(name, value)}
            />

            {/* other right fields except status/tenantId/websiteId */}
            {rightFields.map(renderField)}
          </div>
        </form>

        <div className="h-10" />
      </div>
    </>
  );
}
