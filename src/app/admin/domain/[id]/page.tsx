"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, Plus, Globe, ShoppingCart, LayoutGrid, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type ServiceType = "WEBSITE_ONLY" | "ECOMMERCE" | "MATERIAL_LIBRARY";

const DomainEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const domainId = params.id as string;

  // Get current website from Redux
  const currentWebsite = useSelector((state: RootState) => state.websites.currentWebsite);

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("WEBSITE_ONLY");
  const [isOwnDomain, setIsOwnDomain] = useState(false);
  const [currentDomain, setCurrentDomain] = useState("");
  const [primaryDomains, setPrimaryDomains] = useState<string[]>([]);

  // Initialize form with Redux data
  useEffect(() => {
    if (!currentWebsite) {
      toast.error("No website data found. Redirecting...");
      router.push("/admin/domain");
      return;
    }

    // Verify the ID matches
    if (currentWebsite._id !== domainId) {
      toast.error("Website ID mismatch. Redirecting...");
      router.push("/admin/domain");
      return;
    }

    // Populate form fields
    setName(currentWebsite.name || "");
    setServiceType(currentWebsite.serviceType || "WEBSITE_ONLY");

    // Handle primaryDomain - convert to array if needed
    if (currentWebsite.primaryDomain) {
      const domains = Array.isArray(currentWebsite.primaryDomain)
        ? currentWebsite.primaryDomain
        : [currentWebsite.primaryDomain];
      setPrimaryDomains(domains);
    }
  }, [currentWebsite, domainId, router]);

  const addDomain = () => {
    if (primaryDomains.length > 3) {
      setCurrentDomain("");
      toast.warning("You have added enough domains (maximum 4)");
      return;
    }
    if (currentDomain.trim()) {
      const domainToAdd = isOwnDomain
        ? currentDomain.trim()
        : `${currentDomain.trim()}.mahimavalenza.in`;
      setPrimaryDomains([...primaryDomains, domainToAdd]);
      setCurrentDomain("");
    }
  };

  const removeDomain = (index: number) => {
    setPrimaryDomains(primaryDomains.filter((_, i) => i !== index));
  };

  const handleDomainKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDomain();
    }
  };

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await fetch(`/api/domain/${domainId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          serviceType,
          primaryDomain: primaryDomains.length > 0 ? primaryDomains : null,
        }),
      });

      if (response.ok) {
        toast.success("Domain updated successfully");
        router.push("/admin/domain");
      } else {
        let msg = "";
        try {
          msg = (await response.json()).error;
        } catch { }
        toast.error("Update failed: " + (msg || response.status));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update domain");
    } finally {
      setSaving(false);
    }
  };

  if (!currentWebsite) {
    return (
      <div className="space-y-8 mx-auto p-6">
        <BreadCrumbPage />
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Loading domain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mx-auto p-6">
      <div>
        <BreadCrumbPage />
        <p className="text-gray-600 mt-2">Edit website domain configuration</p>
      </div>

      {/* Back Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push("/admin/domain")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Domains
      </Button>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Edit Website Domain
          </h2>
          {currentWebsite?.websiteId && (
            <p className="text-sm text-gray-500 mt-1">
              Website ID: {currentWebsite.websiteId}
            </p>
          )}
        </div>

        <form onSubmit={onUpdate} className="p-6 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Website Name
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Website"
              required
            />
          </div>

          {/* System Subdomain (Read-only) */}
          {currentWebsite?.systemSubdomain && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                System Subdomain
              </label>
              <input
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                value={currentWebsite.systemSubdomain}
                disabled
              />
              <p className="text-xs text-gray-500">This field cannot be edited</p>
            </div>
          )}

          {/* Service Type */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Service Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setServiceType("WEBSITE_ONLY")}
                className={`p-5 rounded-xl border-2 transition-all ${serviceType === "WEBSITE_ONLY"
                  ? "border-primary-500 bg-primary/5 shadow-md ring-2 ring-primary"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
              >
                <Globe
                  className={`h-10 w-10 mx-auto mb-3 ${serviceType === "WEBSITE_ONLY"
                    ? "text-primary"
                    : "text-gray-400"
                    }`}
                />
                <div className="font-semibold text-gray-900">Website Only</div>
                <div className="text-xs text-gray-500 mt-1">For Architects</div>
              </button>

              <button
                type="button"
                onClick={() => setServiceType("ECOMMERCE")}
                className={`p-5 rounded-xl border-2 transition-all ${serviceType === "ECOMMERCE"
                  ? "border-primary-500 bg-primary/5 shadow-md ring-2 ring-primary"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
              >
                <ShoppingCart
                  className={`h-10 w-10 mx-auto mb-3 ${serviceType === "ECOMMERCE"
                    ? "text-primary"
                    : "text-gray-400"
                    }`}
                />
                <div className="font-semibold text-gray-900">E-Commerce</div>
                <div className="text-xs text-gray-500 mt-1">
                  For Manufacturers
                </div>
              </button>

              <button
                type="button"
                onClick={() => setServiceType("MATERIAL_LIBRARY")}
                className={`p-5 rounded-xl border-2 transition-all ${serviceType === "MATERIAL_LIBRARY"
                  ? "border-primary-500 bg-primary/5 shadow-md ring-2 ring-primary"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
              >
                <LayoutGrid
                  className={`h-10 w-10 mx-auto mb-3 ${serviceType === "MATERIAL_LIBRARY"
                    ? "text-primary"
                    : "text-gray-400"
                    }`}
                />
                <div className="font-semibold text-gray-900">
                  Materials Library
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  For Distributors
                </div>
              </button>
            </div>
          </div>

          {/* Primary Domains */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Primary Domains
            </label>

            {/* Own Domain Checkbox */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="ownDomain"
                checked={isOwnDomain}
                onChange={(e) => setIsOwnDomain(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="ownDomain"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Use own domain
              </label>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 flex items-center border-2 border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all overflow-hidden">
                <input
                  className="flex-1 px-4 py-3 outline-none"
                  value={currentDomain}
                  onChange={(e) => setCurrentDomain(e.target.value)}
                  onKeyPress={handleDomainKeyPress}
                  placeholder={isOwnDomain ? "example.com" : "shadcnstudio"}
                />
                {!isOwnDomain && (
                  <span className="px-4 py-3 bg-gray-100 text-gray-600 font-medium border-l border-gray-300">
                    .mahimavalenza.in
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={addDomain}
                className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-5 py-3 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <Plus className="h-5 w-5" />
                Add
              </button>
            </div>

            {primaryDomains.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  Added Domains ({primaryDomains.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {primaryDomains.map((domain, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-blue-300 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="font-medium text-sm">{domain}</span>
                      <button
                        type="button"
                        onClick={() => removeDomain(index)}
                        className="hover:bg-red-100 rounded-full p-1 transition-colors ml-1"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/domain")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Website"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DomainEditPage;