"use client";

import * as React from "react";
import { toast } from "sonner";
import { UploadCloud, ArrowLeft, Trash2, FileText, ImageIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type MediaItem = {
  name: string;
  url: string;
  type: "IMAGE" | "PDF" | "DOC" | "SHEET" | "FILE";
  size: number;
  updatedAt: string;
};

async function fetchMedia(): Promise<MediaItem[]> {
  const res = await fetch("/api/admin/media", { cache: "no-store" });
  const data = await res.json();
  return data.items || [];
}

async function uploadMedia(file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/admin/media/upload", {
    method: "POST",
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Upload failed");
  return data as { url: string; name: string };
}

async function deleteMedia(name: string) {
  const res = await fetch(`/api/admin/media?name=${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Delete failed");
  return true;
}

function prettySize(bytes: number) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export default function UploadMediaPage() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [drag, setDrag] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setItems(await fetchMedia());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onPickFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file);
      }
      toast.success("Media uploaded");
      setItems(await fetchMedia());
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (name: string) => {
    try {
      await deleteMedia(name);
      toast.success("Deleted");
      setItems((prev) => prev.filter((x) => x.name !== name));
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-4">
        {/* <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/websites/media" className="inline-flex items-center gap-2 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <span>•</span>
            <span>Websites - Media - Upload</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mt-2">Upload Media</h1>
          <p className="text-muted-foreground mt-1">
            Drag & drop ya click karke images / pdf upload karo.
          </p>
        </div> */}
         <BreadCrumbPage />


        <Button

          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Choose Files"}
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          onPickFiles(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      {/* Dropzone */}
      <Card
        className={cn(
          "rounded-lg border-2 border-dashed p-10",
          "transition flex flex-col items-center justify-center text-center gap-2",
          drag ? "bg-muted/50 border-primary" : "border-muted-foreground/20"
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(false);
          onPickFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
          <UploadCloud className="h-6 w-6" />
        </div>
        <p className="text-base font-semibold">Drop files here</p>
        <p className="text-sm text-muted-foreground">
          or click to browse (JPG/PNG/WEBP/GIF/SVG + PDF)
        </p>

        {uploading && (
          <div className="mt-4 text-sm text-muted-foreground">
            Uploading... please wait
          </div>
        )}
      </Card>

      {/* Uploaded Grid */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Uploaded Media</h2>
        <Link href="/websites/media">
          <Button variant="secondary" className="rounded-xl">
            View Media Library
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-muted-foreground">No media uploaded yet.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((m) => (
            <Card key={m.name} className="rounded-md overflow-hidden">
              <div className="h-44 bg-muted/40 flex items-center justify-center">
                {m.type === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-background border flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    {m.type === "IMAGE" ? (
                      <span className="inline-flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> IMAGE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {m.type}
                      </span>
                    )}
                    <span>•</span>
                    <span>{prettySize(m.size)}</span>
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(m.name)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
