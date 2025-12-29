import React from "react";
import { toast } from "sonner";
import { tenantData, userData, websiteData } from "./OnboardingTenants";


export interface ReviewProps {
  tenantData: tenantData;
  userData: userData
  websiteData: websiteData
  handleSave: () => void
}


export const Review = ({ tenantData, userData, websiteData, handleSave }: ReviewProps) => {
  

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Information
        </h2>
        <p className="text-gray-600">
          Please review all details before submitting
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Tenant Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Organization:</span>
              <span className="font-medium">{tenantData.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Slug:</span>
              <span className="font-medium">{tenantData.slug || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{tenantData.email || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tenant Type:</span>
              <span className="font-medium capitalize">
                {tenantData.tenantType.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium capitalize">{tenantData.plan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Brand Colors:</span>
              <div className="flex gap-2">
                <div
                  className="w-6 h-6 rounded border"
                  style={{
                    backgroundColor: tenantData.branding.primaryColor,
                  }}
                ></div>
                <div
                  className="w-6 h-6 rounded border"
                  style={{
                    backgroundColor: tenantData.branding.secondaryColor,
                  }}
                ></div>
                <div
                  className="w-6 h-6 rounded border"
                  style={{
                    backgroundColor: tenantData.branding.tertiaryColor,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Owner Account</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{userData.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{userData.email || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium capitalize">{userData.role}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Website Configuration
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Website Name:</span>
              <span className="font-medium">{websiteData.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Type:</span>
              <span className="font-medium">
                {websiteData.serviceType.replace("_", " ")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-600">Primary Domains:</span>
              {websiteData.primaryDomains.length > 0 ? (
                <div className="space-y-1">
                  {websiteData.primaryDomains.map((domain, index) => (
                    <span
                      key={index}
                      className="block font-medium text-blue-600"
                    >
                      • {domain}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="font-medium">-</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
      >
        Submit & Create Tenant
      </button>
    </div>
  );
};
