"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Plus,
  SlidersHorizontal,
  CreditCard,
  ShieldCheck,
  Zap,
  Plug,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MoreVertical,
  Package,
} from "lucide-react";

import { cn } from "@/lib/utils";

// shadcn/ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type Billing = "monthly" | "yearly";
type AddonCategory = "security" | "performance" | "marketing" | "ai" | "backup";

type Addon = {
  id: string;
  title: string;
  description: string;
  category: AddonCategory;
  priceMonthly: number; // in $
  priceYearly: number; // in $
  popular?: boolean;
  included?: boolean; // included in current plan
  enabled?: boolean;  // installed/enabled
  features: string[];
};

const ADDONS: Addon[] = [
  {
    id: "ai-assistant",
    title: "AI Assistant",
    description: "Generate pages, content, SEO text & product descriptions.",
    category: "ai",
    priceMonthly: 19,
    priceYearly: 190,
    popular: true,
    enabled: true,
    features: ["Content generation", "SEO suggestions", "Brand tone presets"],
  },
  {
    id: "waf-security",
    title: "WAF + Threat Protection",
    description: "Block bots, DDoS protection, and security monitoring.",
    category: "security",
    priceMonthly: 15,
    priceYearly: 150,
    features: ["WAF rules", "DDoS mitigation", "Security alerts"],
  },
  {
    id: "cdn-boost",
    title: "CDN Boost",
    description: "Faster global delivery + better cache for images and assets.",
    category: "performance",
    priceMonthly: 9,
    priceYearly: 90,
    enabled: true,
    features: ["Global edge cache", "Image optimization", "Auto compression"],
  },
  {
    id: "automated-backups",
    title: "Automated Backups",
    description: "Daily backups with 30-day restore points.",
    category: "backup",
    priceMonthly: 12,
    priceYearly: 120,
    features: ["Daily snapshots", "One-click restore", "30-day retention"],
  },
  {
    id: "marketing-suite",
    title: "Marketing Suite",
    description: "Campaigns, banners, coupons, and basic analytics events.",
    category: "marketing",
    priceMonthly: 14,
    priceYearly: 140,
    features: ["Coupons & promos", "Banner manager", "UTM tracking"],
  },
  {
    id: "advanced-roles",
    title: "Advanced Roles & Audit",
    description: "Granular permissions, audit logs, and approvals.",
    category: "security",
    priceMonthly: 11,
    priceYearly: 110,
    included: true,
    features: ["Audit logs", "Approvals", "Role templates"],
  },
];

function formatPrice(amount: number) {
  return `$${amount}`;
}

function catLabel(c: AddonCategory) {
  return (
    {
      security: "Security",
      performance: "Performance",
      marketing: "Marketing",
      ai: "AI",
      backup: "Backup",
    }[c] ?? c
  );
}

function catIcon(c: AddonCategory) {
  switch (c) {
    case "security":
      return ShieldCheck;
    case "performance":
      return Zap;
    case "marketing":
      return Plug;
    case "ai":
      return Sparkles;
    case "backup":
      return Package;
    default:
      return Plug;
  }
}

export default function PackageAddonPage() {
  const [billing, setBilling] = React.useState<Billing>("monthly");
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<AddonCategory | "all">("all");
  const [showEnabledOnly, setShowEnabledOnly] = React.useState(false);

  const [enabledMap, setEnabledMap] = React.useState<Record<string, boolean>>(
    Object.fromEntries(ADDONS.map((a) => [a.id, !!a.enabled]))
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return ADDONS.filter((a) => {
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);

      const matchesCategory = category === "all" ? true : a.category === category;

      const matchesEnabled = showEnabledOnly ? !!enabledMap[a.id] : true;

      return matchesQuery && matchesCategory && matchesEnabled;
    });
  }, [query, category, showEnabledOnly, enabledMap]);

  const selectedTotal = React.useMemo(() => {
    let total = 0;
    for (const a of ADDONS) {
      const isOn = enabledMap[a.id];
      if (!isOn) continue;
      if (a.included) continue; // included in plan => free
      total += billing === "monthly" ? a.priceMonthly : a.priceYearly;
    }
    return total;
  }, [enabledMap, billing]);

  const enabledCount = Object.values(enabledMap).filter(Boolean).length;

  const toggleAddon = (addon: Addon) => {
    if (addon.included) return; // included => always on (or treat as locked)
    setEnabledMap((prev) => ({ ...prev, [addon.id]: !prev[addon.id] }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-muted/20">
      {/* Top mini-bar like screenshot */}
      <div className="border-b bg-background">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="rounded-full">
                Dashboard
              </Badge>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  Deepak Rai
                </Badge>
                <span className="text-xs text-muted-foreground">
                  mahimavalenzas.in
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full md:w-[280px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search add-ons…"
                  className="pl-9"
                />
              </div>

              <Button variant="secondary" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Page */}
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {/* <h1 className="text-2xl font-semibold tracking-tight">
                Package Add-ons
              </h1> */}
            <BreadCrumbPage />
              
              <Badge variant="secondary">{enabledCount} enabled</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Enhance your website with optional modules. Enable/disable anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={billing} onValueChange={(v) => setBilling(v as Billing)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Billing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Request Add-on
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Request a custom add-on</DialogTitle>
                  <DialogDescription>
                    Tell us what you need — we’ll review and share an estimate.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <Input placeholder="Add-on title (e.g., Multi-language checkout)" />
                  <Input placeholder="Short description / requirements" />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Submit request</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: Add-ons */}
          <div className="space-y-4">
            {/* Filters row */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Filters</span>
                    </div>

                    <Select
                      value={category}
                      onValueChange={(v) => setCategory(v as any)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        <SelectItem value="ai">AI</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="backup">Backup</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                      <Switch
                        checked={showEnabledOnly}
                        onCheckedChange={setShowEnabledOnly}
                      />
                      <span className="text-sm">Enabled only</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filtered.length}</span>{" "}
                    add-ons
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="marketplace" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="installed">Installed</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>

              {/* Marketplace */}
              <TabsContent value="marketplace" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((a) => {
                    const Icon = catIcon(a.category);
                    const enabled = !!enabledMap[a.id];

                    const price =
                      billing === "monthly" ? a.priceMonthly : a.priceYearly;

                    return (
                      <Card key={a.id} className="group overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-xl border bg-muted/40 flex items-center justify-center">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold">{a.title}</div>
                                  {a.popular && (
                                    <Badge className="h-5">Popular</Badge>
                                  )}
                                  {a.included && (
                                    <Badge variant="secondary" className="h-5">
                                      Included
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {catLabel(a.category)}
                                </div>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-70 hover:opacity-100"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href="#" className="flex items-center gap-2">
                                    Learn more <ExternalLink className="h-4 w-4" />
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>View changelog</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {a.description}
                          </p>

                          <div className="flex items-end justify-between">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                {billing === "monthly" ? "Per month" : "Per year"}
                              </div>
                              <div className="text-2xl font-semibold">
                                {a.included ? "Free" : formatPrice(price)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={a.included ? true : enabled}
                                onCheckedChange={() => toggleAddon(a)}
                                disabled={a.included}
                              />
                              <span className="text-sm font-medium">
                                {a.included ? "On" : enabled ? "On" : "Off"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {a.features.slice(0, 3).map((f) => (
                              <div key={f} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{f}</span>
                              </div>
                            ))}
                          </div>

                          <Button
                            variant={enabled ? "secondary" : "outline"}
                            className="w-full"
                            onClick={() => toggleAddon(a)}
                            disabled={a.included}
                          >
                            {a.included
                              ? "Included in your plan"
                              : enabled
                              ? "Manage add-on"
                              : "Enable add-on"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Installed */}
              <TabsContent value="installed" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Installed add-ons</div>
                      <Badge variant="secondary">
                        {Object.values(enabledMap).filter(Boolean).length} active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Add-on</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ADDONS.filter((a) => enabledMap[a.id] || a.included).map((a) => (
                          <TableRow key={a.id}>
                            <TableCell className="font-medium">{a.title}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {catLabel(a.category)}
                            </TableCell>
                            <TableCell>
                              {a.included ? (
                                <Badge variant="secondary">Included</Badge>
                              ) : enabledMap[a.id] ? (
                                <Badge>Enabled</Badge>
                              ) : (
                                <Badge variant="outline">Disabled</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleAddon(a)}
                                disabled={a.included}
                                className="gap-2"
                              >
                                {enabledMap[a.id] ? (
                                  <>
                                    <XCircle className="h-4 w-4" />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Enable
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Requests */}
              <TabsContent value="requests" className="mt-4">
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    No requests yet. Use <span className="font-medium text-foreground">Request Add-on</span> to
                    ask for a custom feature/module.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <Card className="sticky top-6">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Summary</div>
                  <Badge variant="outline">
                    {billing === "monthly" ? "Monthly" : "Yearly"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="text-sm text-muted-foreground">Current package</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="font-semibold">Business Pro</div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Includes: Advanced Roles & Audit, Core CMS, Basic Analytics
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Enabled add-ons</div>
                  <div className="space-y-2">
                    {ADDONS.filter((a) => enabledMap[a.id] || a.included).map((a) => {
                      const price =
                        billing === "monthly" ? a.priceMonthly : a.priceYearly;

                      return (
                        <div
                          key={a.id}
                          className="flex items-center justify-between rounded-lg border px-3 py-2"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">
                              {a.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {a.included ? "Included" : formatPrice(price)}
                            </div>
                          </div>
                          <Badge variant={a.included ? "secondary" : "default"}>
                            {a.included ? "Free" : "Paid"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Add-ons total</div>
                  <div className="text-lg font-semibold">{formatPrice(selectedTotal)}</div>
                </div>

                <Button className="w-full">Save changes</Button>
                <Button variant="outline" className="w-full">
                  View invoices
                </Button>

                <p className="text-xs text-muted-foreground">
                  Billing updates may take a few minutes to reflect. Included add-ons
                  are part of your current plan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}
