"use client";

import * as React from "react";
import { Plus, Search, Filter, MoreHorizontal, Pencil, Copy, Archive, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type BannerStatus = "Draft" | "Scheduled" | "Live" | "Paused" | "Archived";
type Placement = "Homepage" | "Catalog" | "Checkout" | "AI Studio" | "Global";

type Banner = {
  id: string;
  title: string;
  placement: Placement;
  status: BannerStatus;
  startDate?: string;
  endDate?: string;
  updatedAt: string;
  createdBy: string;
  impressions: number;
  clicks: number;
  ctaText?: string;
  ctaUrl?: string;
  enabled: boolean;
};

const STATUS_BADGE: Record<BannerStatus, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Scheduled: "bg-indigo-50 text-indigo-700",
  Live: "bg-emerald-50 text-emerald-700",
  Paused: "bg-amber-50 text-amber-700",
  Archived: "bg-zinc-100 text-zinc-600",
};

const PLACEMENTS: Placement[] = ["Homepage", "Catalog", "Checkout", "AI Studio", "Global"];

const MOCK: Banner[] = [
  {
    id: "BNR-1001",
    title: "New Year Offer – 30% Off",
    placement: "Homepage",
    status: "Live",
    startDate: "2026-02-01",
    endDate: "2026-02-15",
    updatedAt: "2 hours ago",
    createdBy: "Demo Admin",
    impressions: 48210,
    clicks: 1912,
    ctaText: "Explore Deals",
    ctaUrl: "/offers",
    enabled: true,
  },
  {
    id: "BNR-1002",
    title: "Catalog Promo – Tiles Week",
    placement: "Catalog",
    status: "Scheduled",
    startDate: "2026-02-05",
    endDate: "2026-02-12",
    updatedAt: "yesterday",
    createdBy: "Demo Admin",
    impressions: 0,
    clicks: 0,
    ctaText: "View Collection",
    ctaUrl: "/catalog?tag=tiles",
    enabled: true,
  },
  {
    id: "BNR-1003",
    title: "Checkout Upsell – Free Delivery",
    placement: "Checkout",
    status: "Paused",
    startDate: "2026-01-20",
    endDate: "2026-02-20",
    updatedAt: "3 days ago",
    createdBy: "Demo Admin",
    impressions: 12090,
    clicks: 410,
    ctaText: "Learn More",
    ctaUrl: "/shipping",
    enabled: false,
  },
  {
    id: "BNR-1004",
    title: "AI Studio – Try New Styles",
    placement: "AI Studio",
    status: "Draft",
    updatedAt: "5 days ago",
    createdBy: "Demo Admin",
    impressions: 0,
    clicks: 0,
    enabled: false,
  },
  {
    id: "BNR-1005",
    title: "Old Campaign – Winter Sale",
    placement: "Global",
    status: "Archived",
    updatedAt: "2 weeks ago",
    createdBy: "Demo Admin",
    impressions: 99300,
    clicks: 4320,
    enabled: false,
  },
];

const fmt = (n: number) => new Intl.NumberFormat().format(n);
const ctr = (c: number, i: number) => (!i ? "—" : `${((c / i) * 100).toFixed(2)}%`);

export default function BannersPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<BannerStatus | "All">("All");
  const [placement, setPlacement] = React.useState<Placement | "All">("All");
  const [tab, setTab] = React.useState<"all" | "live" | "scheduled" | "drafts" | "archived">("all");

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Banner | null>(null);

  const counts = React.useMemo(() => {
    const all = MOCK.length;
    const live = MOCK.filter((x) => x.status === "Live").length;
    const scheduled = MOCK.filter((x) => x.status === "Scheduled").length;
    const drafts = MOCK.filter((x) => x.status === "Draft").length;
    const archived = MOCK.filter((x) => x.status === "Archived").length;
    return { all, live, scheduled, drafts, archived };
  }, []);

  const filtered = React.useMemo(() => {
    let data = [...MOCK];

    if (tab === "live") data = data.filter((x) => x.status === "Live");
    if (tab === "scheduled") data = data.filter((x) => x.status === "Scheduled");
    if (tab === "drafts") data = data.filter((x) => x.status === "Draft");
    if (tab === "archived") data = data.filter((x) => x.status === "Archived");

    if (status !== "All") data = data.filter((x) => x.status === status);
    if (placement !== "All") data = data.filter((x) => x.placement === placement);

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q) ||
          x.placement.toLowerCase().includes(q)
      );
    }
    return data;
  }, [query, status, placement, tab]);

  const totals = React.useMemo(() => {
    const impressions = MOCK.reduce((a, b) => a + b.impressions, 0);
    const clicks = MOCK.reduce((a, b) => a + b.clicks, 0);
    return {
      live: MOCK.filter((x) => x.status === "Live").length,
      scheduled: MOCK.filter((x) => x.status === "Scheduled").length,
      impressions,
      clicks,
      ctr: ctr(clicks, impressions),
    };
  }, []);

  const openPreview = (row: Banner) => {
    setSelected(row);
    setPreviewOpen(true);
  };

  return (
    <div className="h-full w-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1400px] p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[26px] font-semibold tracking-tight text-slate-900">Banners</div>
            <div className="mt-1 text-sm text-slate-500">Create and manage promotional banners across your site.</div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                <Plus size={16} />
                Create Banner
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[620px]">
              <DialogHeader>
                <DialogTitle>Create Banner</DialogTitle>
                <DialogDescription>Define banner content, placement, schedule and visibility.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input placeholder="e.g. New Offer Banner" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Placement</Label>
                    <Select defaultValue="Homepage">
                      <SelectTrigger><SelectValue placeholder="Select placement" /></SelectTrigger>
                      <SelectContent>
                        {PLACEMENTS.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select defaultValue="Draft">
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        {(["Draft", "Scheduled", "Live", "Paused"] as BannerStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>Start Date</Label><Input type="date" /></div>
                  <div className="grid gap-2"><Label>End Date</Label><Input type="date" /></div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>CTA Text</Label><Input placeholder="e.g. Explore Deals" /></div>
                  <div className="grid gap-2"><Label>CTA URL</Label><Input placeholder="/offers" /></div>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                  <div>
                    <div className="text-sm font-medium text-slate-900">Enabled</div>
                    <div className="text-xs text-slate-500">If disabled, banner won’t render on site.</div>
                  </div>
                  <Switch />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button className="bg-violet-600 hover:bg-violet-700">Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Live Banners</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{totals.live}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Scheduled</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{totals.scheduled}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Impressions</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{fmt(totals.impressions)}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">CTR</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{totals.ctr}</CardContent></Card>
        </div>

        {/* List */}
        <Card className="mt-5 rounded-2xl">
          <CardContent className="p-0">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
                <TabsList className="h-10 rounded-xl bg-slate-100 p-1">
                  <TabsTrigger className="rounded-lg" value="all">All <span className="ml-2 text-xs text-slate-500">{counts.all}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="live">Live <span className="ml-2 text-xs text-slate-500">{counts.live}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="scheduled">Scheduled <span className="ml-2 text-xs text-slate-500">{counts.scheduled}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="drafts">Drafts <span className="ml-2 text-xs text-slate-500">{counts.drafts}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="archived">Archived <span className="ml-2 text-xs text-slate-500">{counts.archived}</span></TabsTrigger>
                </TabsList>

                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
                  {/* <div className="relative w-full md:w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search banners…" className="h-10 rounded-xl pl-9" />
                  </div> */}

                  <Select value={placement} onValueChange={(v) => setPlacement(v as any)}>
                    <SelectTrigger className="h-10 w-full rounded-xl md:w-[180px]"><SelectValue placeholder="Placement" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All placements</SelectItem>
                      {PLACEMENTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger className="h-10 w-full rounded-xl md:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All status</SelectItem>
                      {(["Draft", "Scheduled", "Live", "Paused", "Archived"] as BannerStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="h-10 rounded-xl gap-2"><Filter size={16} />More</Button>
                </div>
              </div>

              <TabsContent value={tab} className="m-0">
                <div className="p-4">
                  <div className="overflow-hidden rounded-xl border bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="text-sm font-semibold text-slate-600">Banner</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Placement</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Status</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Schedule</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Performance</TableHead>
                          <TableHead className="text-right text-sm font-semibold text-slate-600">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filtered.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="py-16 text-center">
                              <div className="text-base font-semibold text-slate-900">No banners found</div>
                              <div className="mt-1 text-sm text-slate-500">Try changing filters or create a new banner.</div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filtered.map((b) => (
                            <TableRow key={b.id} className="cursor-pointer hover:bg-slate-50" onClick={() => openPreview(b)}>
                              <TableCell>
                                <div className="flex items-start gap-3">
                                  <div className="mt-1 h-10 w-10 rounded-xl bg-slate-100" />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <div className="truncate text-[15px] font-semibold text-slate-900">{b.title}</div>
                                      {!b.enabled && <Badge className="bg-slate-100 text-slate-600">Disabled</Badge>}
                                    </div>
                                    <div className="mt-0.5 text-xs text-slate-500">{b.id} • Updated {b.updatedAt} • by {b.createdBy}</div>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="text-sm font-medium text-slate-800">{b.placement}</div>
                                <div className="text-xs text-slate-500">Visibility: Global</div>
                              </TableCell>

                              <TableCell>
                                <Badge className={STATUS_BADGE[b.status]}>{b.status}</Badge>
                              </TableCell>

                              <TableCell>
                                <div className="text-sm text-slate-800">{b.startDate ?? "—"} → {b.endDate ?? "—"}</div>
                                <div className="text-xs text-slate-500">{b.status === "Live" ? "Currently running" : "Timing based"}</div>
                              </TableCell>

                              <TableCell>
                                <div className="text-sm font-medium text-slate-900">{fmt(b.clicks)} clicks</div>
                                <div className="text-xs text-slate-500">{fmt(b.impressions)} impressions • CTR {ctr(b.clicks, b.impressions)}</div>
                              </TableCell>

                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-xl" onClick={(e) => e.stopPropagation()}>
                                      <MoreHorizontal size={18} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}><Pencil className="mr-2" size={16} />Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}><Copy className="mr-2" size={16} />Duplicate</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}><Archive className="mr-2" size={16} />Archive</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}><Trash2 className="mr-2" size={16} />Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent className="w-[460px] sm:w-[520px]">
          <SheetHeader>
            <SheetTitle className="text-xl">Banner Preview</SheetTitle>
            <SheetDescription>Review banner content, CTA, placement and visibility.</SheetDescription>
          </SheetHeader>

          {!selected ? (
            <div className="p-6 text-sm text-slate-500">No banner selected.</div>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-800">{selected.title}</div>
                <div className="mt-1 text-xs text-slate-500">{selected.id} • {selected.placement}</div>

                <div className="mt-3 flex items-center gap-2">
                  <Badge className={STATUS_BADGE[selected.status]}>{selected.status}</Badge>
                  {!selected.enabled && <Badge className="bg-slate-100 text-slate-600">Disabled</Badge>}
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-xs text-slate-500">Start</div><div className="font-medium text-slate-900">{selected.startDate ?? "—"}</div></div>
                  <div><div className="text-xs text-slate-500">End</div><div className="font-medium text-slate-900">{selected.endDate ?? "—"}</div></div>
                  <div><div className="text-xs text-slate-500">Impressions</div><div className="font-medium text-slate-900">{fmt(selected.impressions)}</div></div>
                  <div><div className="text-xs text-slate-500">Clicks</div><div className="font-medium text-slate-900">{fmt(selected.clicks)}</div></div>
                </div>

                <Separator className="my-4" />

                <div>
                  <div className="text-xs text-slate-500">CTA</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">{selected.ctaText ?? "—"}</div>
                  <div className="text-xs text-slate-500">{selected.ctaUrl ?? "—"}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2 bg-violet-600 hover:bg-violet-700"><Eye size={16} />View on Site</Button>
                <Button variant="outline" className="flex-1">Edit</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
