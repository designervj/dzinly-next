import { Check, Palette, Upload } from 'lucide-react';
import React from 'react'
import { tenantData } from './OnboardingTenants';

export interface TenantProps {
  tenantData: tenantData;
  setTenantData: React.Dispatch<React.SetStateAction<tenantData>>;
}



export const TenantDetails = ({tenantData, setTenantData}: TenantProps) => {
    const tenantTypes = [
    { value: "manufacturer", label: "Manufacturer", description: "Production and manufacturing businesses", icon: "🏭" },
    { value: "distributor", label: "Distributor", description: "Supply chain and distribution services", icon: "🚚" },
    { value: "architect", label: "Architect", description: "Design and architectural firms", icon: "📐" },
    { value: "home_owner", label: "Home Owner", description: "Individual property owners", icon: "🏠" }
  ];

  const plans = [
    { value: "trial", label: "Trial", description: "Free 14-day trial with basic features", icon: "🎯" },
    { value: "basic", label: "Basic", description: "Essential features for small businesses", icon: "📦" },
    { value: "pro", label: "Pro", description: "Advanced features for growing teams", icon: "⭐" },
    { value: "enterprise", label: "Enterprise", description: "Custom solutions for large organizations", icon: "🏢" }
  ];
  const fonts = ["Inter", "Roboto", "Poppins", "Montserrat", "Lato", "Open Sans"];


  
    return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tenant Information</h2>
              <p className="text-gray-600">Let's start with the basic details of your organization</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={tenantData.name}
                  onChange={(e) => setTenantData({...tenantData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={tenantData.slug}
                  onChange={(e) => setTenantData({...tenantData, slug: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="organization-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={tenantData.email}
                  onChange={(e) => setTenantData({...tenantData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="organization@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tenant Type *
                </label>
                <div className="space-y-3">
                  {tenantTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        tenantData.tenantType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tenantType"
                        value={type.value}
                        checked={tenantData.tenantType === type.value}
                        onChange={(e) => setTenantData({...tenantData, tenantType: e.target.value})}
                        className="w-4 h-4 text-blue-600 hidden"
                      />
                      <div className="text-2xl">{type.icon}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      {tenantData.tenantType === type.value && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose a Pricing Plan *
                </label>
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <label
                      key={plan.value}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        tenantData.plan === plan.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.value}
                        checked={tenantData.plan === plan.value}
                        onChange={(e) => setTenantData({...tenantData, plan: e.target.value})}
                        className="w-4 h-4 text-blue-600 hidden"
                      />
                      <div className="text-2xl">{plan.icon}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{plan.label}</p>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                      {tenantData.plan === plan.value && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Branding
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={tenantData.branding.primaryColor}
                        onChange={(e) => setTenantData({
                          ...tenantData,
                          branding: {...tenantData.branding, primaryColor: e.target.value}
                        })}
                        className="h-10 w-16 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={tenantData.branding.primaryColor}
                        onChange={(e) => setTenantData({
                          ...tenantData,
                          branding: {...tenantData.branding, primaryColor: e.target.value}
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={tenantData.branding.secondaryColor}
                        onChange={(e) => setTenantData({
                          ...tenantData,
                          branding: {...tenantData.branding, secondaryColor: e.target.value}
                        })}
                        className="h-10 w-16 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={tenantData.branding.secondaryColor}
                        onChange={(e) => setTenantData({
                          ...tenantData,
                          branding: {...tenantData.branding, secondaryColor: e.target.value}
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tertiary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={tenantData.branding.tertiaryColor}
                        onChange={(e) => setTenantData({
                          ...tenantData,
                          branding: {...tenantData.branding, tertiaryColor: e.target.value}
                        })}
                        className="h-10 w-16 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={tenantData.branding.tertiaryColor}
                        onChange={(e) => setTenantData({
                          ...tenantData,
                          branding: {...tenantData.branding, tertiaryColor: e.target.value}
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typography
                  </label>
                  <select
                    value={tenantData.branding.typography}
                    onChange={(e) => setTenantData({
                      ...tenantData,
                      branding: {...tenantData.branding, typography: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    {fonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
}
