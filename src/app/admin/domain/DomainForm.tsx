"use client"
import React from 'react'
import { X, Plus, Globe, ShoppingCart, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { addNewDomain } from '@/hooks/slices/websites/websitePageSlice';
const DomainForm = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = React.useState("");
    const [adminName, setAdminName] = React.useState("");
    const [serviceType, setServiceType] = React.useState("WEBSITE_ONLY");
    const [isOwnDomain, setIsOwnDomain] = React.useState(false);
    const [currentDomain, setCurrentDomain] = React.useState("");
    const [primaryDomains, setPrimaryDomains] = React.useState<string[]>([]);

    const addDomain = () => {
        if (primaryDomains.length > 3) {
            setCurrentDomain("");
            alert("You have added enough domains");
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

    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/domain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                serviceType,
                primaryDomain: primaryDomains.length > 0 ? primaryDomains : null,
            }),
        });
        console.log("res--->domanin added",res);

        if (res.ok) {
            dispatch(addNewDomain(res.json()));
            setName("");
            setPrimaryDomains([]);
            setCurrentDomain("");
            setServiceType("WEBSITE_ONLY");
            router.push("/admin/domain");

        } else {
            let msg = "";
            try {
                msg = (await res.json()).error;
            } catch { }
            alert("Create failed: " + (msg || res.status));
        }
    };
    return (
        <>
            {/* Create Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">


                <form onSubmit={onCreate} className="p-6 space-y-6">
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

                        {/* user Name */}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Admin Name
                        </label>
                        <input
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            placeholder="My Awesome Website"
                            required
                        />
                    </div>

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
                                    For Manufacturerss
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
                                    className={`h-10 w-10 mx-auto mb-3 ${serviceType === "ECOMMERCE"
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

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/domain")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                        >
                            Create Website
                        </Button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default DomainForm