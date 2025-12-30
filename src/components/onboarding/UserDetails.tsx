import { Check } from "lucide-react";
import React from "react";
import { userData } from "./OnboardingTenants";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export interface UserProps {
  userData: userData;
  setUserData: React.Dispatch<React.SetStateAction<userData>>;
}


export const UserDetails = ({userData, setUserData}:UserProps) => {

  const {rolesPermissions}= useSelector((state:RootState)=>state.rolePermission)
   console.log("rolesPermissions--",rolesPermissions)
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Owner Account</h2>
        <p className="text-gray-600">
          Create the primary administrator account
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Role *
          </label>
          <div className="space-y-3">
            {rolesPermissions && rolesPermissions.length > 0 &&
              rolesPermissions.map((item) => {
                return (
                  <label
                    key={item.name}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                      userData.role === item.name
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={item.name}
                      checked={userData.role === item.name}
                      onChange={(e) =>
                        setUserData({ ...userData, role: e.target.value })
                      }
                      className="hidden"
                    />
                    <div className="text-2xl">👑</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Full access to all features and settings
                      </p>
                    </div>
                    {userData.role === item.name && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                );
              })}
            {/* <label
              className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                userData.role === "owner"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="owner"
                checked={userData.role === "owner"}
                onChange={(e) =>
                  setUserData({ ...userData, role: e.target.value })
                }
                className="hidden"
              />
              <div className="text-2xl">👑</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Owner</p>
                <p className="text-sm text-gray-600">
                  Full access to all features and settings
                </p>
              </div>
              {userData.role === "owner" && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </label>

            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                userData.role === "admin"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="admin"
                checked={userData.role === "admin"}
                onChange={(e) =>
                  setUserData({ ...userData, role: e.target.value })
                }
                className="hidden"
              />
              <div className="text-2xl">⚙️</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Admin</p>
                <p className="text-sm text-gray-600">
                  Manage users and content with limited access
                </p>
              </div>
              {userData.role === "admin" && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </label> */}
          </div>
        </div>
      </div>
    </div>
  );
};
