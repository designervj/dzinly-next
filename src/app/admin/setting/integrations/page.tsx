import React from "react";

export default function IntegrationsPage() {
  const integrations = [
    { name: "Google Analytics", status: "Connected" },
    { name: "Stripe", status: "Not Connected" },
    { name: "Slack", status: "Connected" },
    { name: "Zapier", status: "Not Connected" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Integrations</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        {integrations.map((integration, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border-b last:border-b-0 py-3"
          >
            <div className="text-gray-800 font-medium">{integration.name}</div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  integration.status === "Connected"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {integration.status}
              </span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                {integration.status === "Connected" ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add New Integration
        </button>
      </div>
    </div>
  );
}
