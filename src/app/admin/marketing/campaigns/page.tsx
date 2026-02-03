"use client";

import * as React from "react";
import { Plus, Search, Filter, MoreHorizontal, Pencil, Copy, PauseCircle, PlayCircle, Trash2 } from "lucide-react";

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

type CampaignStatus = "Draft" | "Active" | "Paused" | "Completed";
type Objective = "Leads" | "Sales" | "Traffic" | "Branding";

type Campaign = {
  id: string;
  name: string;
  objective: Objective;
  status: CampaignStatus;
  startDate?: string;
  endDate?: string;
  budget: number;
  spent: number;
  leads: number;
  roas: number;
  updatedAt: string;
};

const STATUS_BADGE: Record<CampaignStatus, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Active: "bg-emerald-50 text-emerald-700",
  Paused: "bg-amber-50 text-amber-700",
  Completed: "bg-zinc-100 text-zinc-600",
};

const OBJECTIVES: Objective[] = ["Leads", "Sales", "Traffic", "Branding"];

const MOCK: Campaign[] = [
  { id: "CMP-201", name: "Valentine Launch", objective: "Sales", status: "Active", startDate: "2026-02-01", endDate: "2026-02-14", budget: 120000, spent: 48600, leads: 214, roas: 3.2, updatedAt: "today" },
  { id: "CMP-202", name: "Catalog – Tiles Awareness", objective: "Traffic", status: "Active", startDate: "2026-02-01", endDate: "2026-02-28", budget: 80000, spent: 19250, leads: 0, roas: 1.3, updatedAt: "yesterday" },
  { id: "CMP-203", name: "AI Studio New Users", objective: "Leads", status: "Paused", startDate: "2026-01-15", endDate: "2026-02-15", budget: 60000, spent: 50110, leads: 392, roas: 2.1, updatedAt: "2 days ago" },
  { id: "CMP-204", name: "Spring Prep", objective: "Branding", status: "Draft", budget: 50000, spent: 0, leads: 0, roas: 0, updatedAt: "1 week ago" },
  { id: "CMP-205", name: "Winter Sale", objective: "Sales", status: "Completed", startDate: "2025-12-01", endDate: "2026-01-10", budget: 200000, spent: 198400, leads: 980, roas: 4.1, updatedAt: "3 weeks ago" },
];

const fmt = (n: number) => new Intl.NumberFormat().format(n);

export default function CampaignsPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<CampaignStatus | "All">("All");
  const [objective, setObjective] = React.useState<Objective | "All">("All");
  const [tab, setTab] = React.useState<"all" | "active" | "draft" | "paused" | "completed">("all");

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Campaign | null>(null);

  const counts = React.useMemo(() => {
    return {
      all: MOCK.length,
      active: MOCK.filter((x) => x.status === "Active").length,
      draft: MOCK.filter((x) => x.status === "Draft").length,
      paused: MOCK.filter((x) => x.status === "Paused").length,
      completed: MOCK.filter((x) => x.status === "Completed").length,
    };
  }, []);

  const filtered = React.useMemo(() => {
    let data = [...MOCK];
    if (tab === "active") data = data.filter((x) => x.status === "Active");
    if (tab === "draft") data = data.filter((x) => x.status === "Draft");
    if (tab === "paused") data = data.filter((x) => x.status === "Paused");
    if (tab === "completed") data = data.filter((x) => x.status === "Completed");

    if (status !== "All") data = data.filter((x) => x.status === status);
    if (objective !== "All") data = data.filter((x) => x.objective === objective);

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter((x) => x.name.toLowerCase().includes(q) || x.id.toLowerCase().includes(q));
    }
    return data;
  }, [query, status, objective, tab]);

  const kpis = React.useMemo(() => {
    const active = MOCK.filter((x) => x.status === "Active");
    const totalBudget = MOCK.reduce((a, b) => a + b.budget, 0);
    const totalSpent = MOCK.reduce((a, b) => a + b.spent, 0);
    const totalLeads = MOCK.reduce((a, b) => a + b.leads, 0);
    return { active: active.length, totalBudget, totalSpent, totalLeads };
  }, []);

  const openPreview = (row: Campaign) => {
    setSelected(row);
    setPreviewOpen(true);
  };

  return (
    <div className="h-full w-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1400px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[26px] font-semibold tracking-tight text-slate-900">Campaigns</div>
            <div className="mt-1 text-sm text-slate-500">Manage marketing campaigns, budgets, and performance.</div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                <Plus size={16} />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
              <DialogHeader>
                <DialogTitle>Create Campaign</DialogTitle>
                <DialogDescription>Setup objective, budget and schedule.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input placeholder="e.g. Spring Sale Campaign" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Objective</Label>
                    <Select defaultValue="Leads">
                      <SelectTrigger><SelectValue placeholder="Select objective" /></SelectTrigger>
                      <SelectContent>
                        {OBJECTIVES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select defaultValue="Draft">
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        {(["Draft", "Active", "Paused"] as CampaignStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>Budget</Label><Input type="number" placeholder="e.g. 50000" /></div>
                  <div className="grid gap-2"><Label>Daily Cap</Label><Input type="number" placeholder="e.g. 2500" /></div>
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
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Active Campaigns</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.active}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Total Budget</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">₹{fmt(kpis.totalBudget)}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Total Spent</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">₹{fmt(kpis.totalSpent)}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Leads</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{fmt(kpis.totalLeads)}</CardContent></Card>
        </div>

        <Card className="mt-5 rounded-2xl">
          <CardContent className="p-0">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
                <TabsList className="h-10 rounded-xl bg-slate-100 p-1">
                  <TabsTrigger className="rounded-lg" value="all">All <span className="ml-2 text-xs text-slate-500">{counts.all}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="active">Active <span className="ml-2 text-xs text-slate-500">{counts.active}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="draft">Draft <span className="ml-2 text-xs text-slate-500">{counts.draft}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="paused">Paused <span className="ml-2 text-xs text-slate-500">{counts.paused}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="completed">Completed <span className="ml-2 text-xs text-slate-500">{counts.completed}</span></TabsTrigger>
                </TabsList>

                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
                  <div className="relative w-full md:w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search campaigns…" className="h-10 rounded-xl pl-9" />
                  </div>

                  <Select value={objective} onValueChange={(v) => setObjective(v as any)}>
                    <SelectTrigger className="h-10 w-full rounded-xl md:w-[170px]"><SelectValue placeholder="Objective" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All objectives</SelectItem>
                      {OBJECTIVES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger className="h-10 w-full rounded-xl md:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All status</SelectItem>
                      {(["Draft", "Active", "Paused", "Completed"] as CampaignStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                          <TableHead className="text-sm font-semibold text-slate-600">Campaign</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Objective</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Status</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Budget</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Performance</TableHead>
                          <TableHead className="text-right text-sm font-semibold text-slate-600">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filtered.map((c) => (
                          <TableRow key={c.id} className="cursor-pointer hover:bg-slate-50" onClick={() => openPreview(c)}>
                            <TableCell>
                              <div className="min-w-0">
                                <div className="text-[15px] font-semibold text-slate-900">{c.name}</div>
                                <div className="mt-0.5 text-xs text-slate-500">{c.id} • Updated {c.updatedAt}</div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="text-sm font-medium text-slate-900">{c.objective}</div>
                              <div className="text-xs text-slate-500">{c.startDate ?? "—"} → {c.endDate ?? "—"}</div>
                            </TableCell>

                            <TableCell><Badge className={STATUS_BADGE[c.status]}>{c.status}</Badge></TableCell>

                            <TableCell>
                              <div className="text-sm font-semibold text-slate-900">₹{fmt(c.budget)}</div>
                              <div className="text-xs text-slate-500">Spent ₹{fmt(c.spent)}</div>
                            </TableCell>

                            <TableCell>
                              <div className="text-sm font-semibold text-slate-900">{fmt(c.leads)} leads</div>
                              <div className="text-xs text-slate-500">ROAS {c.roas.toFixed(1)}x</div>
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
                                  {c.status === "Active" ? (
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}><PauseCircle className="mr-2" size={16} />Pause</DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}><PlayCircle className="mr-2" size={16} />Activate</DropdownMenuItem>
                                  )}
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
            <SheetTitle className="text-xl">Campaign Details</SheetTitle>
            <SheetDescription>Review objective, budget and performance.</SheetDescription>
          </SheetHeader>

          {!selected ? (
            <div className="p-6 text-sm text-slate-500">No campaign selected.</div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">{selected.name}</div>
                <div className="mt-1 text-xs text-slate-500">{selected.id}</div>

                <div className="mt-3 flex items-center gap-2">
                  <Badge className={STATUS_BADGE[selected.status]}>{selected.status}</Badge>
                  <Badge className="bg-slate-100 text-slate-700">{selected.objective}</Badge>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-xs text-slate-500">Budget</div><div className="font-semibold text-slate-900">₹{fmt(selected.budget)}</div></div>
                  <div><div className="text-xs text-slate-500">Spent</div><div className="font-semibold text-slate-900">₹{fmt(selected.spent)}</div></div>
                  <div><div className="text-xs text-slate-500">Leads</div><div className="font-semibold text-slate-900">{fmt(selected.leads)}</div></div>
                  <div><div className="text-xs text-slate-500">ROAS</div><div className="font-semibold text-slate-900">{selected.roas.toFixed(1)}x</div></div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-violet-600 hover:bg-violet-700">Open Analytics</Button>
                <Button variant="outline" className="flex-1">Edit</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
