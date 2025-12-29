import { Check, Plus, X } from "lucide-react";
import React from "react";
import { currentDomain, websiteData } from "./OnboardingTenants";

export interface WebsiteProps {
  websiteData: websiteData;
  setWebsiteData: React.Dispatch<React.SetStateAction<websiteData>>;
  currentDomain: currentDomain,
  setCurrentDomain: React.Dispatch<React.SetStateAction<currentDomain>>
  addPrimaryDomain: () => void,
  removePrimaryDomain: (domain:string) =>void
}

export const WebsiteDetails = ({
  websiteData,
  setWebsiteData,
  currentDomain,
  setCurrentDomain,
  addPrimaryDomain,
  removePrimaryDomain,
}: WebsiteProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Website Configuration
        </h2>
        <p className="text-gray-600">Set up your website and primary domains</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website Name *
          </label>
          <input
            type="text"
            value={websiteData.name}
            onChange={(e) =>
              setWebsiteData({ ...websiteData, name: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="My Demo Site"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Service Type *
          </label>
          <div className="space-y-3">
            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                websiteData.serviceType === "WEBSITE_ONLY"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="serviceType"
                value="WEBSITE_ONLY"
                checked={websiteData.serviceType === "WEBSITE_ONLY"}
                onChange={(e) =>
                  setWebsiteData({
                    ...websiteData,
                    serviceType: e.target.value,
                  })
                }
                className="hidden"
              />
              <div className="text-2xl">🌐</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Website Only</p>
                <p className="text-sm text-gray-600">
                  Standard business website
                </p>
              </div>
              {websiteData.serviceType === "WEBSITE_ONLY" && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </label>

            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                websiteData.serviceType === "ECOMMERCE"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="serviceType"
                value="ECOMMERCE"
                checked={websiteData.serviceType === "ECOMMERCE"}
                onChange={(e) =>
                  setWebsiteData({
                    ...websiteData,
                    serviceType: e.target.value,
                  })
                }
                className="hidden"
              />
              <div className="text-2xl">🛒</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">E-commerce</p>
                <p className="text-sm text-gray-600">
                  Online store with shopping cart
                </p>
              </div>
              {websiteData.serviceType === "ECOMMERCE" && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </label>

            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                websiteData.serviceType === "BLOG"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="serviceType"
                value="BLOG"
                checked={websiteData.serviceType === "BLOG"}
                onChange={(e) =>
                  setWebsiteData({
                    ...websiteData,
                    serviceType: e.target.value,
                  })
                }
                className="hidden"
              />
              <div className="text-2xl">📝</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Blog</p>
                <p className="text-sm text-gray-600">
                  Content publishing platform
                </p>
              </div>
              {websiteData.serviceType === "BLOG" && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Primary Domains *
            </label>

            {/* Domain Type Selection */}
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="domainType"
                  value="subdomain"
                  checked={currentDomain.type === "subdomain"}
                  onChange={(e) =>
                    setCurrentDomain({
                      ...currentDomain,
                      type: e.target.value,
                      value: "",
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Subdomain</p>
                  <p className="text-sm text-gray-500">
                    yoursite.mahimavalenza.in
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="domainType"
                  value="custom"
                  checked={currentDomain.type === "custom"}
                  onChange={(e) =>
                    setCurrentDomain({
                      ...currentDomain,
                      type: e.target.value,
                      value: "",
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Own Domain</p>
                  <p className="text-sm text-gray-500">www.yourdomain.com</p>
                </div>
              </label>
            </div>

            {/* Domain Input */}
            {currentDomain.type === "subdomain" ? (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={currentDomain.value}
                    onChange={(e) =>
                      setCurrentDomain({
                        ...currentDomain,
                        value: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="yoursite"
                  />
                  <span className="text-gray-500 font-medium whitespace-nowrap">
                    .mahimavalenza.in
                  </span>
                </div>
                <button
                  onClick={addPrimaryDomain}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentDomain.value}
                  onChange={(e) =>
                    setCurrentDomain({
                      ...currentDomain,
                      value: e.target.value,
                    })
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="www.yourdomain.com"
                />
                <button
                  onClick={addPrimaryDomain}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            )}

            {currentDomain.type === "custom" && (
              <p className="text-xs text-gray-500 mt-2">
                You'll need to configure DNS records for custom domains
              </p>
            )}
          </div>

          {/* Added Domains List */}
          {websiteData.primaryDomains.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Added Domains:
              </p>
              <div className="space-y-2">
                {websiteData.primaryDomains.map((domain, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <span className="text-sm text-gray-900 font-medium">
                      {domain}
                    </span>
                    <button
                      onClick={() => removePrimaryDomain(domain)}
                      className="p-1 hover:bg-blue-100 rounded transition"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
