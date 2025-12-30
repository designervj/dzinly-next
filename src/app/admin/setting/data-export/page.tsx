import React from "react";
import { Download, FileText } from "lucide-react";

export default function DataExportPage() {
  const exports = [
    { id: 1, name: "Users Data", type: "CSV", date: "30 Dec 2025" },
    { id: 2, name: "Orders Data", type: "Excel", date: "29 Dec 2025" },
    { id: 3, name: "Transactions", type: "CSV", date: "28 Dec 2025" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Data Export</h1>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium">Export Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full">
            <option>Select Data Type</option>
            <option>Users</option>
            <option>Orders</option>
            <option>Transactions</option>
          </select>

          <select className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full">
            <option>Select Format</option>
            <option>CSV</option>
            <option>Excel</option>
            <option>JSON</option>
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-3">Export History</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Download</th>
            </tr>
          </thead>
          <tbody>
            {exports.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.date}</td>
                <td className="p-3 text-right">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
