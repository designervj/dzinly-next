"use client";

import * as React from "react";
import { Plus, Search, Filter, MoreHorizontal, Copy, Pencil, Trash2, Ban } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type CouponStatus = "Active" | "Scheduled" | "Expired" | "Disabled";
type CouponType = "Percent" | "Fixed" | "Free Shipping";

type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: string;
  status: CouponStatus;
  usage: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  updatedAt: string;
};

const STATUS_BADGE: Record<CouponStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Scheduled: "bg-indigo-50 text-indigo-700",
  Expired: "bg-zinc-100 text-zinc-600",
  Disabled: "bg-slate-100 text-slate-700",
};

const TYPES: CouponType[] = ["Percent", "Fixed", "Free Shipping"];

const MOCK: Coupon[] = [
  { id: "CP-701", code: "DZINLY30", type: "Percent", value: "30%", status: "Active", usage: 132, limit: 500, startDate: "2026-02-01", endDate: "2026-02-20", updatedAt: "today" },
  { id: "CP-702", code: "FREESHIP", type: "Free Shipping", value: "—", status: "Scheduled", usage: 0, limit: 1000, startDate: "2026-02-10", endDate: "2026-02-25", updatedAt: "yesterday" },
  { id: "CP-703", code: "SAVE500", type: "Fixed", value: "₹500", status: "Disabled", usage: 21, limit: 200, startDate: "2026-01-10", endDate: "2026-02-10", updatedAt: "3 days ago" },
  { id: "CP-704", code: "WINTER10", type: "Percent", value: "10%", status: "Expired", usage: 820, limit: 820, startDate: "2025-12-01", endDate: "2026-01-05", updatedAt: "1 month ago" },
];

export default function CouponsPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<CouponStatus | "All">("All");
  const [type, setType] = React.useState<CouponType | "All">("All");
  const [tab, setTab] = React.useState<"all" | "active" | "scheduled" | "expired" | "disabled">("all");

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Coupon | null>(null);

  const counts = React.useMemo(() => ({
    all: MOCK.length,
    active: MOCK.filter((x) => x.status === "Active").length,
    scheduled: MOCK.filter((x) => x.status === "Scheduled").length,
    expired: MOCK.filter((x) => x.status === "Expired").length,
    disabled: MOCK.filter((x) => x.status === "Disabled").length,
  }), []);

  const filtered = React.useMemo(() => {
    let data = [...MOCK];
    if (tab !== "all") data = data.filter((x) => x.status.toLowerCase() === tab);

    if (status !== "All") data = data.filter((x) => x.status === status);
    if (type !== "All") data = data.filter((x) => x.type === type);

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter((x) => x.code.toLowerCase().includes(q) || x.id.toLowerCase().includes(q));
    }
    return data;
  }, [query, status, type, tab]);

  const kpis = React.useMemo(() => {
    const active = MOCK.filter((x) => x.status === "Active").length;
    const totalUsage = MOCK.reduce((a, b) => a + b.usage, 0);
    const totalLimit = MOCK.reduce((a, b) => a + b.limit, 0);
    const usedPct = totalLimit ? Math.round((totalUsage / totalLimit) * 100) : 0;
    return { active, totalUsage, totalLimit, usedPct };
  }, []);

  const openPreview = (row: Coupon) => {
    setSelected(row);
    setPreviewOpen(true);
  };

  return (
    <div className="h-full w-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1400px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[26px] font-semibold tracking-tight text-slate-900">Coupons</div>
            <div className="mt-1 text-sm text-slate-500">Create coupon codes, limits, and expiry rules.</div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                <Plus size={16} />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
              <DialogHeader>
                <DialogTitle>Create Coupon</DialogTitle>
                <DialogDescription>Code, type, value, limits and schedule.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>Code</Label><Input placeholder="e.g. DZINLY30" /></div>
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select defaultValue="Percent">
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>Value</Label><Input placeholder="30% or 500" /></div>
                  <div className="grid gap-2"><Label>Usage Limit</Label><Input type="number" placeholder="e.g. 500" /></div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>Start Date</Label><Input type="date" /></div>
                  <div className="grid gap-2"><Label>End Date</Label><Input type="date" /></div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button className="bg-violet-600 hover:bg-violet-700">Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Active Coupons</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.active}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Total Usage</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.totalUsage}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Total Limit</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.totalLimit}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Usage %</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.usedPct}%</CardContent></Card>
        </div>

        <Card className="mt-5 rounded-2xl">
          <CardContent className="p-0">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
                <TabsList className="h-10 rounded-xl bg-slate-100 p-1">
                  <TabsTrigger className="rounded-lg" value="all">All <span className="ml-2 text-xs text-slate-500">{counts.all}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="active">Active <span className="ml-2 text-xs text-slate-500">{counts.active}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="scheduled">Scheduled <span className="ml-2 text-xs text-slate-500">{counts.scheduled}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="expired">Expired <span className="ml-2 text-xs text-slate-500">{counts.expired}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="disabled">Disabled <span className="ml-2 text-xs text-slate-500">{counts.disabled}</span></TabsTrigger>
                </TabsList>

                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
                  <div className="relative w-full md:w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search coupons…" className="h-10 rounded-xl pl-9" />
                  </div>

                  <Select value={type} onValueChange={(v) => setType(v as any)}>
                    <SelectTrigger className="h-10 w-full rounded-xl md:w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All types</SelectItem>
                      {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger className="h-10 w-full rounded-xl md:w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All status</SelectItem>
                      {(["Active", "Scheduled", "Expired", "Disabled"] as CouponStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                          <TableHead className="text-sm font-semibold text-slate-600">Coupon</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Type</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Status</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Usage</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Schedule</TableHead>
                          <TableHead className="text-right text-sm font-semibold text-slate-600">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filtered.map((c) => (
                          <TableRow key={c.id} className="cursor-pointer hover:bg-slate-50" onClick={() => openPreview(c)}>
                            <TableCell>
                              <div className="text-[15px] font-semibold text-slate-900">{c.code}</div>
                              <div className="text-xs text-slate-500">{c.id} • Updated {c.updatedAt}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-semibold text-slate-900">{c.type}</div>
                              <div className="text-xs text-slate-500">Value: {c.value}</div>
                            </TableCell>
                            <TableCell><Badge className={STATUS_BADGE[c.status]}>{c.status}</Badge></TableCell>
                            <TableCell>
                              <div className="text-sm font-semibold text-slate-900">{c.usage}/{c.limit}</div>
                              <div className="text-xs text-slate-500">Remaining {Math.max(0, c.limit - c.usage)}</div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-800">{c.startDate ?? "—"} → {c.endDate ?? "—"}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-xl" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal size={18} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}><Pencil className="mr-2" size={16} />Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}><Copy className="mr-2" size={16} />Copy Code</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}><Ban className="mr-2" size={16} />Disable</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}><Trash2 className="mr-2" size={16} />Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent className="w-[460px] sm:w-[520px]">
          <SheetHeader>
            <SheetTitle className="text-xl">Coupon Preview</SheetTitle>
            <SheetDescription>Review rules, usage and schedule.</SheetDescription>
          </SheetHeader>

          {!selected ? (
            <div className="p-6 text-sm text-slate-500">No coupon selected.</div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">{selected.code}</div>
                <div className="mt-1 text-xs text-slate-500">{selected.id}</div>

                <div className="mt-3 flex gap-2">
                  <Badge className={STATUS_BADGE[selected.status]}>{selected.status}</Badge>
                  <Badge className="bg-slate-100 text-slate-700">{selected.type}</Badge>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-xs text-slate-500">Value</div><div className="font-semibold text-slate-900">{selected.value}</div></div>
                  <div><div className="text-xs text-slate-500">Usage</div><div className="font-semibold text-slate-900">{selected.usage}/{selected.limit}</div></div>
                  <div><div className="text-xs text-slate-500">Start</div><div className="font-semibold text-slate-900">{selected.startDate ?? "—"}</div></div>
                  <div><div className="text-xs text-slate-500">End</div><div className="font-semibold text-slate-900">{selected.endDate ?? "—"}</div></div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-violet-600 hover:bg-violet-700">Edit</Button>
                <Button variant="outline" className="flex-1">Disable</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
