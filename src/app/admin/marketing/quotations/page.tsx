"use client";

import * as React from "react";
import { Plus, Search, Filter, MoreHorizontal, Send, CheckCircle2, FileText, Trash2 } from "lucide-react";

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

type QuoteStatus = "Draft" | "Pending Approval" | "Approved" | "Sent" | "Rejected";
type Quote = {
  id: string;
  customer: string;
  amount: number;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  items: number;
  owner: string;
};

const STATUS_BADGE: Record<QuoteStatus, string> = {
  Draft: "bg-slate-100 text-slate-700",
  "Pending Approval": "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Sent: "bg-indigo-50 text-indigo-700",
  Rejected: "bg-red-50 text-red-700",
};

const MOCK: Quote[] = [
  { id: "Q-9001", customer: "hunk", amount: 45000, status: "Pending Approval", createdAt: "Today 10:05", updatedAt: "Today 10:20", items: 12, owner: "Demo Admin" },
  { id: "Q-9002", customer: "Mahima Valenza", amount: 98200, status: "Approved", createdAt: "Yesterday 12:10", updatedAt: "Yesterday 18:40", items: 28, owner: "Demo Admin" },
  { id: "Q-9003", customer: "Demo Client", amount: 16500, status: "Draft", createdAt: "2 days ago", updatedAt: "2 days ago", items: 6, owner: "Demo Admin" },
  { id: "Q-9004", customer: "Builder Group", amount: 220000, status: "Sent", createdAt: "1 week ago", updatedAt: "1 week ago", items: 54, owner: "Demo Admin" },
];

const fmt = (n: number) => new Intl.NumberFormat().format(n);

export default function QuotationsPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<QuoteStatus | "All">("All");
  const [tab, setTab] = React.useState<"all" | "pending" | "approved" | "sent" | "draft">("all");

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Quote | null>(null);

  const counts = React.useMemo(() => ({
    all: MOCK.length,
    pending: MOCK.filter((x) => x.status === "Pending Approval").length,
    approved: MOCK.filter((x) => x.status === "Approved").length,
    sent: MOCK.filter((x) => x.status === "Sent").length,
    draft: MOCK.filter((x) => x.status === "Draft").length,
  }), []);

  const filtered = React.useMemo(() => {
    let data = [...MOCK];
    if (tab === "pending") data = data.filter((x) => x.status === "Pending Approval");
    if (tab === "approved") data = data.filter((x) => x.status === "Approved");
    if (tab === "sent") data = data.filter((x) => x.status === "Sent");
    if (tab === "draft") data = data.filter((x) => x.status === "Draft");

    if (status !== "All") data = data.filter((x) => x.status === status);

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter((x) => x.id.toLowerCase().includes(q) || x.customer.toLowerCase().includes(q));
    }
    return data;
  }, [query, status, tab]);

  const kpis = React.useMemo(() => {
    const pending = MOCK.filter((x) => x.status === "Pending Approval").length;
    const total = MOCK.reduce((a, b) => a + b.amount, 0);
    const sent = MOCK.filter((x) => x.status === "Sent").length;
    const avg = MOCK.length ? total / MOCK.length : 0;
    return { pending, total, sent, avg };
  }, []);

  const openPreview = (row: Quote) => {
    setSelected(row);
    setPreviewOpen(true);
  };

  return (
    <div className="h-full w-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1400px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[26px] font-semibold tracking-tight text-slate-900">Quotations</div>
            <div className="mt-1 text-sm text-slate-500">Create quotes, approve, and send to customers.</div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                <Plus size={16} />
                Create Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
              <DialogHeader>
                <DialogTitle>Create Quote</DialogTitle>
                <DialogDescription>Customer, items, pricing and approval flow.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Customer</Label>
                  <Input placeholder="Customer name" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>Amount</Label><Input type="number" placeholder="e.g. 45000" /></div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select defaultValue="Draft">
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        {(["Draft", "Pending Approval", "Approved"] as QuoteStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <Input placeholder="Optional note…" />
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
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Pending Approval</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.pending}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Total Quoted</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">₹{fmt(kpis.total)}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Sent</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">{kpis.sent}</CardContent></Card>
          <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-600">Avg Quote</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-slate-900">₹{fmt(Math.round(kpis.avg))}</CardContent></Card>
        </div>

        <Card className="mt-5 rounded-2xl">
          <CardContent className="p-0">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
                <TabsList className="h-10 rounded-xl bg-slate-100 p-1">
                  <TabsTrigger className="rounded-lg" value="all">All <span className="ml-2 text-xs text-slate-500">{counts.all}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="pending">Pending <span className="ml-2 text-xs text-slate-500">{counts.pending}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="approved">Approved <span className="ml-2 text-xs text-slate-500">{counts.approved}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="sent">Sent <span className="ml-2 text-xs text-slate-500">{counts.sent}</span></TabsTrigger>
                  <TabsTrigger className="rounded-lg" value="draft">Draft <span className="ml-2 text-xs text-slate-500">{counts.draft}</span></TabsTrigger>
                </TabsList>

                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
                  <div className="relative w-full md:w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search quotations…" className="h-10 rounded-xl pl-9" />
                  </div>

                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger className="h-10 w-full rounded-xl md:w-[190px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All status</SelectItem>
                      {(["Draft", "Pending Approval", "Approved", "Sent", "Rejected"] as QuoteStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                          <TableHead className="text-sm font-semibold text-slate-600">Quote</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Customer</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Status</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Amount</TableHead>
                          <TableHead className="text-sm font-semibold text-slate-600">Items</TableHead>
                          <TableHead className="text-right text-sm font-semibold text-slate-600">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filtered.map((q) => (
                          <TableRow key={q.id} className="cursor-pointer hover:bg-slate-50" onClick={() => openPreview(q)}>
                            <TableCell>
                              <div className="text-[15px] font-semibold text-slate-900">{q.id}</div>
                              <div className="text-xs text-slate-500">Created {q.createdAt} • Updated {q.updatedAt}</div>
                            </TableCell>

                            <TableCell>
                              <div className="text-sm font-semibold text-slate-900">{q.customer}</div>
                              <div className="text-xs text-slate-500">Owner: {q.owner}</div>
                            </TableCell>

                            <TableCell><Badge className={STATUS_BADGE[q.status]}>{q.status}</Badge></TableCell>

                            <TableCell className="text-sm font-semibold text-slate-900">₹{fmt(q.amount)}</TableCell>
                            <TableCell className="text-sm font-medium text-slate-900">{q.items}</TableCell>

                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-xl" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal size={18} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}><FileText className="mr-2" size={16} />Open</DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}><CheckCircle2 className="mr-2" size={16} />Approve</DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}><Send className="mr-2" size={16} />Send</DropdownMenuItem>
                                  <DropdownMenuSeparator />
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
            <SheetTitle className="text-xl">Quote Preview</SheetTitle>
            <SheetDescription>Check pricing, status and next actions.</SheetDescription>
          </SheetHeader>

          {!selected ? (
            <div className="p-6 text-sm text-slate-500">No quote selected.</div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">{selected.id}</div>
                <div className="mt-1 text-xs text-slate-500">{selected.customer}</div>

                <div className="mt-3">
                  <Badge className={STATUS_BADGE[selected.status]}>{selected.status}</Badge>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-xs text-slate-500">Amount</div><div className="font-semibold text-slate-900">₹{fmt(selected.amount)}</div></div>
                  <div><div className="text-xs text-slate-500">Items</div><div className="font-semibold text-slate-900">{selected.items}</div></div>
                  <div><div className="text-xs text-slate-500">Created</div><div className="font-semibold text-slate-900">{selected.createdAt}</div></div>
                  <div><div className="text-xs text-slate-500">Owner</div><div className="font-semibold text-slate-900">{selected.owner}</div></div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-violet-600 hover:bg-violet-700">Approve</Button>
                <Button variant="outline" className="flex-1">Send</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
