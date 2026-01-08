"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { LayoutGrid, FileText, Layers, Settings, ExternalLink } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type IconKey = "dashboard" | "posts" | "pages" | "settings";

export type NavFormValues = {
  label: string;
  url: string;
  icon: IconKey;
  description: string;
  cssClasses: string;
  visible: boolean;
  openInNewTab: boolean;
};

const ICONS: Record<IconKey, React.ReactNode> = {
  dashboard: <LayoutGrid className="h-5 w-5" />,
  posts: <FileText className="h-5 w-5" />,
  pages: <Layers className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
};

const ICON_BG: Record<IconKey, string> = {
  dashboard: "bg-blue-100 text-blue-700",
  posts: "bg-green-100 text-green-700",
  pages: "bg-purple-100 text-purple-700",
  settings: "bg-slate-100 text-slate-700",
};

// ---- API PLACEHOLDER (replace later) ----
async function apiSave(mode: "create" | "edit", id: string | null, payload: NavFormValues) {
  const url = mode === "create" ? "/api/admin/navigation" : `/api/admin/navigation/${id}`;
  const method = mode === "create" ? "POST" : "PUT";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Save failed");
  return res.json() as Promise<{ id: string }>;
}

type Props = {
  mode: "create" | "edit";
  defaultValues?: Partial<NavFormValues>;
};

export default function NavigationForm({ mode, defaultValues }: Props) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const navId = mode === "edit" ? String(params?.id || "") : null;

  const [isPending, startTransition] = useTransition();

  const [values, setValues] = React.useState<NavFormValues>({
    label: "",
    url: "#",
    icon: "pages",
    description: "",
    cssClasses: "",
    visible: true,
    openInNewTab: false,
    ...defaultValues,
  });

  const set = <K extends keyof NavFormValues>(k: K, v: NavFormValues[K]) =>
    setValues((p) => ({ ...p, [k]: v }));

  const onSubmit = () => {
    startTransition(async () => {
      try {
        const saved = await apiSave(mode, navId, values);
        if (mode === "create") {
          router.push(`/admin/websites/navigation/${saved.id}/edit`);
        } else {
          router.push("/admin/websites/navigation");
        }
      } catch (e) {
        alert("Save failed");
      }
    });
  };

  return (
    <div className="w-full">

           <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <BreadCrumbPage />            
                <p>Menu label, url aur settings update karo.</p>
              </div>
              {/* <Badge variant={values.visible ? "default" : "secondary"} className="rounded-full">
                {values.visible ? "Visible" : "Hidden"}
              </Badge> */}

              
            </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
      >
        {/* LEFT */}
        <Card className="rounded-md">
          {/* <CardHeader className="space-y-2">
           
          </CardHeader> */}

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Navigation Label</Label>
                <Input
                  className="rounded-xl"
                  value={values.label}
                  onChange={(e) => set("label", e.target.value)}
                  placeholder="e.g. Posts"
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  className="rounded-xl"
                  value={values.url}
                  onChange={(e) => set("url", e.target.value)}
                  placeholder="/websites/posts"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(["dashboard", "posts", "pages", "settings"] as IconKey[]).map((k) => {
                  const active = values.icon === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => set("icon", k)}
                      className={cn(
                        "rounded-md border p-3 flex items-center gap-3 hover:bg-muted/30 transition",
                        active && "border-slate-900 bg-muted/40"
                      )}
                    >
                      <div className={cn("h-10 w-10 rounded-md flex items-center justify-center", ICON_BG[k])}>
                        {ICONS[k]}
                      </div>
                      <div className="text-sm font-medium capitalize">{k}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                className="rounded-xl"
                rows={4}
                value={values.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Optional description..."
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>CSS Classes (optional)</Label>
              <Input
                className="rounded-xl"
                value={values.cssClasses}
                onChange={(e) => set("cssClasses", e.target.value)}
                placeholder="e.g. primary-menu-highlight"
              />
            </div>
          </CardContent>
        </Card>

        {/* RIGHT */}
        <div className="space-y-6">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Controls</CardTitle>
              <CardDescription>Show/hide & new tab settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Visible</p>
                  <p className="text-xs text-muted-foreground">Header me show hoga</p>
                </div>
                <Switch checked={values.visible} onCheckedChange={(v) => set("visible", v)} />
              </div>

              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Open in new tab</p>
                  <p className="text-xs text-muted-foreground">target=_blank</p>
                </div>
                <Switch checked={values.openInNewTab} onCheckedChange={(v) => set("openInNewTab", v)} />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 rounded-xl" disabled={isPending}>
                  {isPending ? "Saving..." : mode === "create" ? "Create" : "Update"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 rounded-xl"
                  onClick={() => router.push("/admin/websites/navigation")}
                  disabled={isPending}
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PREVIEW */}
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Live Preview</CardTitle>
              <CardDescription>Header item preview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border bg-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-md flex items-center justify-center", ICON_BG[values.icon])}>
                    {ICONS[values.icon]}
                  </div>
                  <div>
                    <div className="font-semibold">{values.label || "Label"}</div>
                    <div className="text-xs text-muted-foreground">{values.url || "#"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {values.openInNewTab && (
                    <span className="inline-flex items-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5" /> new tab
                    </span>
                  )}
                  {!values.visible && <Badge variant="secondary">Hidden</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
