"use client";

import { Check, Upload, Palette, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { TenantDetails } from "./TenantDetails";
import { UserDetails } from "./UserDetails";
import { WebsiteDetails } from "./WebsiteDetails";
import { Review } from "./Review";
import { toast } from "sonner";

export default function OnboardingTenants() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [tenantData, setTenantData] = useState({
    name: "",
    slug: "",
    email: "",
    tenantType: "manufacturer",
    plan: "trial",
    branding: {
      primaryColor: "#3B82F6",
      secondaryColor: "#8B5CF6",
      tertiaryColor: "#EC4899",
      typography: "Inter",
      logo: null,
    },
  });

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
  });

  const [websiteData, setWebsiteData] = useState({
    name: "",
    serviceType: "WEBSITE_ONLY",
    primaryDomains: [],
  });

  const [currentDomain, setCurrentDomain] = useState({
    type: "subdomain",
    value: "",
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const addPrimaryDomain = () => {
    if (!currentDomain.value) return;

    const domainValue =
      currentDomain.type === "subdomain"
        ? `${currentDomain.value}.mahimavalenza.in`
        : currentDomain.value;

    if (!websiteData.primaryDomains.includes(domainValue)) {
      setWebsiteData({
        ...websiteData,
        primaryDomains: [...websiteData.primaryDomains, domainValue],
      });
      setCurrentDomain({ type: "subdomain", value: "" });
    }
  };

  const removePrimaryDomain = (domain) => {
    setWebsiteData({
      ...websiteData,
      primaryDomains: websiteData.primaryDomains.filter((d) => d !== domain),
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/public/onboarding", {
        method: "POST",
        body: JSON.stringify({
          userData,
          tenantData,
          websiteData,
        }),
      });
      const result = await res.json();
      if (result.ok) {
        setTenantData({
          name: "",
          slug: "",
          email: "",
          tenantType: "manufacturer",
          plan: "trial",
          branding: {
            primaryColor: "#3B82F6",
            secondaryColor: "#8B5CF6",
            tertiaryColor: "#EC4899",
            typography: "Inter",
            logo: null,
          },
        });
        setWebsiteData({
          name: "",
          serviceType: "WEBSITE_ONLY",
          primaryDomains: [],
        });
        setUserData({
          name: "",
          email: "",
          password: "",
          role: "owner",
        });
        setCurrentStep(1)
        toast.success(`SuccessFully Onboarded ${result.userid}`);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const steps = [
    {
      id: 1,
      label: "Tenant Details",
      description: "Basic information & branding",
    },
    {
      id: 2,
      label: "User Details",
      description: "Owner account setup",
    },
    {
      id: 3,
      label: "Website Setup",
      description: "Configure your website",
    },
    {
      id: 4,
      label: "Review",
      description: "Review & submit",
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TenantDetails
            tenantData={tenantData}
            setTenantData={setTenantData}
          />
        );

      case 2:
        return <UserDetails userData={userData} setUserData={setUserData} />;

      case 3:
        return (
          <WebsiteDetails
            websiteData={websiteData}
            setWebsiteData={setWebsiteData}
            currentDomain={currentDomain}
            setCurrentDomain={setCurrentDomain}
            addPrimaryDomain={addPrimaryDomain}
            removePrimaryDomain={removePrimaryDomain}
          />
        );

      case 4:
        return (
          <Review
            handleSave={handleSave}
            userData={userData}
            tenantData={tenantData}
            websiteData={websiteData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 p-8 lg:p-12">
              {renderStepContent()}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex gap-4 mt-8 pt-6 border-t">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
                  >
                    {currentStep === 3 ? "Review" : "Continue"}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar - Steps */}
            <div className="lg:w-80 bg-gradient-to-br from-gray-900 to-gray-800 p-8 lg:p-12">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Tenant Setup
                </h1>
                <p className="text-gray-400 text-sm">
                  Complete all steps to get started
                </p>
              </div>

              <div className="space-y-1">
                {steps.map((step, index) => {
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;
                  const isClickable = isCompleted || isCurrent;

                  return (
                    <div key={step.id} className="relative">
                      <div
                        onClick={() => isClickable && setCurrentStep(step.id)}
                        className={`flex items-start gap-4 p-4 rounded-lg transition ${
                          isCurrent ? "bg-white/10" : ""
                        } ${
                          isClickable
                            ? "cursor-pointer hover:bg-white/5"
                            : "cursor-not-allowed opacity-50"
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : isCurrent
                                ? "bg-blue-500 text-white ring-4 ring-blue-500/30"
                                : "bg-gray-700 text-gray-400"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              step.id
                            )}
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={`absolute left-5 top-10 w-0.5 h-12 transition ${
                                isCompleted ? "bg-green-500" : "bg-gray-700"
                              }`}
                            />
                          )}
                        </div>

                        <div className="flex-1 pt-1">
                          <p
                            className={`font-semibold transition ${
                              isCurrent ? "text-white" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-gray-400">
                  Need help? Contact our support team at{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    support@example.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
