"use client";

import * as React from "react";
import { Plus, Search, Filter, MoreHorizontal, RefreshCcw, Download, Eye, Trash2 } from "lucide-react";

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

type JobStatus = "Queued" | "Running" | "Completed" | "Failed";

type Job = {
  id: string;
  template: "Product Catalog" | "Price List" | "Dealer Pack" | "Brochure";
  status: JobStatus;
  items: number;
  createdAt: string;
  duration: string;
  output: "PDF" | "XLSX";
  createdBy: string;
};

const STATUS_BADGE: Record<JobStatus, string> = {
  Queued: "bg-slate-100 text-slate-700",
  Running: "bg-indigo-50 text-indigo-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Failed: "bg-red-50 text-red-700",
};

const TEMPLATES: Job["template"][] = ["Product Catalog", "Price List", "Dealer Pack", "Brochure"];

const MOCK: Job[] = [
  { id: "JOB-501", template: "Product Catalog", status: "Completed", items: 120, createdAt: "Today, 10:10", duration: "2m 18s", output: "PDF", createdBy: "Demo Admin" },
  { id: "JOB-502", template: "Price List", status: "Running", items: 860, createdAt: "Today, 10:40", duration: "—", output: "XLSX", createdBy: "Demo Admin" },
  { id: "JOB-503", template: "Dealer Pack", status: "Queued", items: 310, createdAt: "Today, 10:45", duration: "—", output: "PDF", createdBy: "Demo Admin" },
  { id: "JOB-504", template: "Brochure", status: "Failed", items: 70, createdAt: "Yesterday, 18:12", duration: "0m 42s", output: "PDF", createdBy: "Demo Admin" },
];

const fmt = (n: number) => new Intl.NumberFormat().format(n);

export default function CatalogGenerationPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<JobStatus | "All">("All");
  const [template, setTemplate] = React.useState<Job["template"] | "All">("All");
  const [tab, setTab] = React.useState<"all" | "running" | "completed" | "failed">("all");

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Job | null>(null);

  const counts = React.useMemo(() => ({
    all: MOCK.length,
    running: MOCK.filter((x) => x.status === "Running" || x.status === "Queued").length,
    completed: MOCK.filter((x) => x.status === "Completed").length,
    failed: MOCK.filter((x) => x.status === "Failed").length,
  }), []);

  const filtered = React.useMemo(() => {
    let data = [...MOCK];
    if (tab === "running") data = data.filter((x) => x.status === "Running" || x.status === "Queued");
    if (tab === "completed") data = data.filter((x) => x.status === "Completed");
    if (tab === "failed") data = data.filter((x) => x.status === "Failed");

    if (status !== "All") data = data.filter((x) => x.status === status);
    if (template !== "All") data = data.filter((x) => x.template === template);

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter((x) => x.id.toLowerCase().includes(q) || x.template.toLowerCase().includes(q));
    }
    return data;
  }, [query, status, template, tab]);

  const kpis = React.useMemo(() => {
    const completed = MOCK.filter((x) => x.status === "Completed").length;
    const running = MOCK.filter((x) => x.status === "Running" || x.status === "Queued").length;
    const totalItems = MOCK.reduce((a, b) => a + b.items, 0);
    const failed = MOCK.filter((x) => x.status === "Failed").length;
    return { completed, running, totalItems, failed };
  }, []);

  const openPreview = (row: Job) => {
    setSelected(row);
    setPreviewOpen(true);
  };

  return (
    <div className="h-full w-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1400px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[26px] font-semibold tracking-tight text-slate-900">Catalog Generation</div>
            <div className="mt-1 text-sm text-slate-500">Generate PDF/XLSX catalogs using templates and filters.</div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                <Plus size={16} />
                New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
              <DialogHeader>
                <DialogTitle>Create Catalog Job</DialogTitle>
                <DialogDescription>Select template, output type and filters.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Template</Label>
                  <Select defaultValue="Product Catalog">
                    <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                    <SelectContent>
                      {TEMPLATES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Output</Label>
                    <Select defaultValue="PDF">
                      <SelectTrigger><SelectValue placeholder="Select output" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="XLSX">XLSX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Items Limit</Label>
                    <Input type="number" placeholder="e.g. 500" />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>Category</Label><Input placeholder="All" /></div>
                  <div className="grid gap-2"><Label>Brand</Label><Input placeholder="All" /></div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button className="bg-violet-600 hover:bg-violet-700">Start</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Running / Queued</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.running}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.completed}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Items Processed</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{fmt(kpis.totalItems)}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Failed</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.failed}</CardContent></Card>
        </div>

        <Card className="mt-5 rounded-2xl">
          <CardContent className="p-0">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
                <TabsList className="h-10 rounded-xl bg-slate-100 p-1">
                  <TabsTrigger className="rounded-lg" value="all">All <span className="ml-2 text-xs text-slate-500">{counts.all}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="running">Running <span className="ml-2 text-xs text-slate-500">{counts.running}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="completed">Completed <span className="ml-2 text-xs text-slate-500">{counts.completed}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="failed">Failed <span className="ml-2 text-xs text-slate-500">{counts.failed}</span></TabsTrigger>
                </TabsList>

                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
                  <div className="relative w-full md:w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jobs…" className="h-10 rounded-xl pl-9" />
                  </div>

                  <Select value={template} onValueChange={(v) => setTemplate(v as any)}>
                    <SelectTrigger className="h-10 w-full rounded-xl md:w-[200px]"><SelectValue placeholder="Template" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All templates</SelectItem>
                      {TEMPLATES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger className="h-10 w-full rounded-xl md:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All status</SelectItem>
                      {(["Queued", "Running", "Completed", "Failed"] as JobStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                          <TableHead className="text-sm font-semibold text-slate-600">Job</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Template</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Status</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Items</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Output</TableHead>
                          <TableHead className="text-right text-sm font-semibold text-slate-600">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filtered.map((j) => (
                          <TableRow key={j.id} className="cursor-pointer hover:bg-slate-50" onClick={() => openPreview(j)}>
                            <TableCell>
                              <div className="text-[15px] font-semibold text-slate-900">{j.id}</div>
                              <div className="text-xs text-slate-500">Created {j.createdAt} • by {j.createdBy}</div>
                            </TableCell>
                            <TableCell className="text-sm font-medium text-slate-900">{j.template}</TableCell>
                            <TableCell><Badge className={STATUS_BADGE[j.status]}>{j.status}</Badge></TableCell>
                            <TableCell>
                              <div className="text-sm font-semibold text-slate-900">{fmt(j.items)}</div>
                              <div className="text-xs text-slate-500">Duration: {j.duration}</div>
                            </TableCell>
                            <TableCell><Badge className="bg-slate-100 text-slate-700">{j.output}</Badge></TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-xl" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal size={18} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}><Eye className="mr-2" size={16} />Preview</DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}><Download className="mr-2" size={16} />Download</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}><RefreshCcw className="mr-2" size={16} />Re-run</DropdownMenuItem>
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
            <SheetTitle className="text-xl">Job Preview</SheetTitle>
            <SheetDescription>View output details, template and generation summary.</SheetDescription>
          </SheetHeader>

          {!selected ? (
            <div className="p-6 text-sm text-slate-500">No job selected.</div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">{selected.id}</div>
                <div className="mt-1 text-xs text-slate-500">{selected.template} • {selected.output}</div>

                <div className="mt-3">
                  <Badge className={STATUS_BADGE[selected.status]}>{selected.status}</Badge>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-xs text-slate-500">Items</div><div className="font-semibold text-slate-900">{fmt(selected.items)}</div></div>
                  <div><div className="text-xs text-slate-500">Duration</div><div className="font-semibold text-slate-900">{selected.duration}</div></div>
                  <div><div className="text-xs text-slate-500">Created</div><div className="font-semibold text-slate-900">{selected.createdAt}</div></div>
                  <div><div className="text-xs text-slate-500">By</div><div className="font-semibold text-slate-900">{selected.createdBy}</div></div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-violet-600 hover:bg-violet-700"><Download size={16} className="mr-2" />Download</Button>
                <Button variant="outline" className="flex-1"><RefreshCcw size={16} className="mr-2" />Re-run</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
