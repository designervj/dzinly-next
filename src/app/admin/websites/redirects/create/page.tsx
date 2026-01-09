"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ArrowRight } from "lucide-react";

type RedirectType = "301" | "302" | "307" | "308";

function normalizePath(v: string) {
  const s = (v || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s; // allow full URL for "to"
  return s.startsWith("/") ? s : `/${s}`;
}

function isValidFrom(v: string) {
  const s = v.trim();
  return !!s && s.startsWith("/") && !s.startsWith("//");
}
function isValidTo(v: string) {
  const s = v.trim();
  return !!s && (s.startsWith("/") || s.startsWith("http://") || s.startsWith("https://"));
}

// ---- API PLACEHOLDER (replace with your backend) ----
async function apiCreateRedirect(payload: { from: string; to: string; type: RedirectType }) {
  const res = await fetch("/api/admin/redirects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json() as Promise<{ id: string }>;
}

export default function Page() {
  const router = useRouter();

  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [type, setType] = React.useState<RedirectType>("301");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const onSave = async () => {
    const nFrom = normalizePath(from);
    const nTo = normalizePath(to);

    if (!isValidFrom(nFrom)) {
      setError(`"From" should start with / (example: /old-page)`);
      return;
    }
    if (!isValidTo(nTo)) {
      setError(`"To" should be a /path or full URL (https://...)`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await apiCreateRedirect({ from: nFrom, to: nTo, type });
      router.push("/admin/websites/redirects");
    } catch (e) {
      setError("Failed to create redirect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mb-6">
        <BreadCrumbPage />
      </div>

      <div className="px-0 pb-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Redirects</h1>
          <p className="text-muted-foreground mt-1">Create a new redirect rule</p>
        </div>

        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="text-xl">Create New Redirect</CardTitle>
            <CardDescription>
              From URL ko To URL par redirect karo (301/302 etc.)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[1fr_44px_1fr_220px] items-end">
              {/* From */}
              <div className="space-y-2">
                <Label>From</Label>
                <Input
                  className="rounded-xl"
                  placeholder="/from-url"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center pb-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* To */}
              <div className="space-y-2">
                <Label>To</Label>
                <Input
                  className="rounded-xl"
                  placeholder="/to-url or https://example.com/to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as RedirectType)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">301 Permanent</SelectItem>
                    <SelectItem value="302">302 Temporary</SelectItem>
                    <SelectItem value="307">307 Temporary</SelectItem>
                    <SelectItem value="308">308 Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error ? <div className="text-sm text-red-600">{error}</div> : null}

            <Separator />

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl"
                onClick={() => router.push("/admin/websites/redirects")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl"
                onClick={onSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Redirect"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
