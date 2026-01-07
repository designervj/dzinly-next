"use client";
import { useEffect, useState, useMemo } from "react";
import { X, Plus, Globe, ShoppingCart, LayoutGrid } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setAllWebsitePages, updateCurrentPage } from "@/hooks/slices/websites/websitePageSlice";

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function WebsitesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
 const router = useRouter();
  const [name, setName] = useState("");
  const [adminName, setAdminName] = useState("");

  const [serviceType, setServiceType] = useState<
    "WEBSITE_ONLY" | "ECOMMERCE" | "MATERIAL_LIBRARY"
  >("WEBSITE_ONLY");

  const dispatch = useDispatch<AppDispatch>();
  const [primaryDomains, setPrimaryDomains] = useState<string[]>([]);
  const [currentDomain, setCurrentDomain] = useState("");
  const [isOwnDomain, setIsOwnDomain] = useState(false);
  const { websitePages, hasFetched } = useSelector((state: RootState) => state.websitePage);
  const processedItems = useMemo(() => {
    return websitePages.map((d) => ({
      ...d,
      createdAt: formatDate(d.createdAt),
      updatedAt: formatDate(d.updatedAt),
    }));
  }, [websitePages]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [listRes, curRes] = await Promise.all([
        fetch("/api/domain"),
        fetch("/api/session/website"),
      ]);
      if (!listRes.ok) throw new Error("Failed to load websites");
      const listJson = await listRes.json();
      setItems(listJson.items || []);
      dispatch(setAllWebsitePages(listJson.items || []));
      if (curRes.ok) {
        const curJson = await curRes.json();
        setCurrentId(curJson.websiteId || null);
        dispatch(updateCurrentPage(curJson.websiteId || null));
      }
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // const addDomain = () => {
  //   if (primaryDomains.length > 3) {
  //     setCurrentDomain("");
  //     alert("You have added enough domains");
  //     return;
  //   }
  //   if (currentDomain.trim()) {
  //     const domainToAdd = isOwnDomain
  //       ? currentDomain.trim()
  //       : `${currentDomain.trim()}.mahimavalenza.in`;
  //     setPrimaryDomains([...primaryDomains, domainToAdd]);
  //     setCurrentDomain("");
  //   }
  // };

  // const removeDomain = (index: number) => {
  //   setPrimaryDomains(primaryDomains.filter((_, i) => i !== index));
  // };

  // const handleDomainKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     addDomain();
  //   }
  // };

  // const onCreate = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const res = await fetch("/api/domain", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       name,
  //       serviceType,
  //       primaryDomain: primaryDomains.length > 0 ? primaryDomains : null,
  //     }),
  //   });

  //   if (res.ok) {
  //     setName("");
  //     setPrimaryDomains([]);
  //     setCurrentDomain("");
  //     setServiceType("WEBSITE_ONLY");
  //     load();
  //   } else {
  //     let msg = "";
  //     try {
  //       msg = (await res.json()).error;
  //     } catch { }
  //     alert("Create failed: " + (msg || res.status));
  //   }
  // };

  return (
    <div className="space-y-8 mx-auto p-6">

      <div>

        <BreadCrumbPage />
        <p className="text-gray-600 mt-2">Manage your website configurations</p>
      </div>

      

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Existing Websites List */}
      {!loading && processedItems.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Your Websites
            </h2>
                  <div className="flex justify-end">
        <Button
          type="button"
          className="flex items-center gap-2"
          onClick={() => router.push("/admin/domain/create")}
        >
          <Plus className="h-5 w-5" />
          Create New Website
        </Button>
      </div>
          </div>
    
          <div className="p-6">
            {(() => {
              const Ext = require("./ExtTable").default as any;
              return <Ext items={processedItems} currentId={currentId} />;
            })()}
          </div>
        </div>
      ) : (
        !loading && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No websites yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Create your first website to get started!
            </p>
          </div>
        )
      )}
    </div>
  );
}
