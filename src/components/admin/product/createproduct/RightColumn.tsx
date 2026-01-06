import React from "react";

export const RightColumn = ({ formData, handleInputChange }: any) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow p-6 sticky top-6">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Organize</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segment Type <span className="text-red-500">*</span>
            </label>
            <select
              name="segmentType"
              value={formData.segmentType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option>Wall</option>
              <option>Floor</option>
              <option>Ceiling</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories <span className="text-red-500">*</span>
            </label>
            <select
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option>Paint</option>
              <option>Primer</option>
              <option>Stain</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brands <span className="text-red-500">*</span>
            </label>
            <select
              name="brands"
              value={formData.brands}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-2 border-blue-500 rounded-md"
            >
              <option>PPG</option>
              <option>Sherwin-Williams</option>
              <option>Behr</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-400 text-xs">Optional</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
