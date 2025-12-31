"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

interface FormData {
  title: string;
  basePrice: string;
  description: string;
  segmentType: string;
  categories: string;
  brands: string;
  tags: string;
}

interface ImageFile {
  id: number;
  url: string;
  file: File;
}

interface OptionValue {
  option: string;
  value: string;
}

interface ProductOption {
  id: number;
  title: string;
  values: string[];
  useForVariants: boolean;
}

interface Variant {
  id: number;
  combination: OptionValue[];
  combined: string;
}

interface VariantConfig {
  id: number;
  title: string;
  sku: string;
  stock: number;
  price: string;
  imageUrl: string;
  combined: string;
}

export const CreateProduct = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    basePrice: "",
    description: "",
    segmentType: "Wall",
    categories: "Paint",
    brands: "PPG",
    tags: "",
  });

  const [images, setImages] = useState<ImageFile[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantConfigs, setVariantConfigs] = useState<VariantConfig[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const filesArray = Array.from(files);
    const newImages: ImageFile[] = filesArray.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const addProductOption = () => {
    setProductOptions((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        values: [],
        useForVariants: false,
      },
    ]);
  };

  const updateOption = (id: number, field: keyof ProductOption, value: string | boolean) => {
    setProductOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  const removeOption = (id: number) => {
    setProductOptions((prev) => prev.filter((opt) => opt.id !== id));
    generateVariants();
  };

  const addValueToOption = (optionId: number, value: string) => {
    if (!value.trim()) return;
    setProductOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId
          ? { ...opt, values: [...opt.values, value.trim()] }
          : opt
      )
    );
  };

  const removeValueFromOption = (optionId: number, valueIndex: number) => {
    setProductOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId
          ? { ...opt, values: opt.values.filter((_, i) => i !== valueIndex) }
          : opt
      )
    );
    generateVariants();
  };

  const generateVariants = () => {
    const variantOptions = productOptions.filter((opt) => opt.useForVariants);

    if (variantOptions.length === 0) {
      setVariants([]);
      setVariantConfigs([]);
      return;
    }

    const combinations: OptionValue[][] = [];
    const generate = (current: OptionValue[], depth: number) => {
      if (depth === variantOptions.length) {
        combinations.push([...current]);
        return;
      }

      variantOptions[depth].values.forEach((value) => {
        generate(
          [...current, { option: variantOptions[depth].title, value }],
          depth + 1
        );
      });
    };

    generate([], 0);

    const newVariants: Variant[] = combinations.map((combo, idx) => ({
      id: idx,
      combination: combo,
      combined: combo.map((c) => `${c.value}`).join(" / "),
    }));

    setVariants(newVariants);

    const newConfigs: VariantConfig[] = newVariants.map((v) => ({
      id: v.id,
      title: "",
      sku: "",
      stock: 0,
      price: "",
      imageUrl: "",
      combined: v.combined,
    }));

    setVariantConfigs(newConfigs);
  };

  const updateVariantConfig = (id: number, field: keyof VariantConfig, value: string | number) => {
    setVariantConfigs((prev) =>
      prev.map((config) =>
        config.id === id ? { ...config, [field]: value } : config
      )
    );
  };

  const autoGenerateConfigs = () => {
    const stockInput = document.querySelector<HTMLInputElement>('input[placeholder="Enter Stock"]');
    const priceInput = document.querySelector<HTMLInputElement>('input[placeholder="Enter Price $ 0.00"]');
    
    const defaultStock = stockInput?.value || "0";
    const defaultPrice = priceInput?.value || "0.00";

    setVariantConfigs((prev) =>
      prev.map((config) => ({
        ...config,
        stock: parseInt(defaultStock) || 0,
        price: defaultPrice,
      }))
    );
  };

  useEffect(() => {
    generateVariants();
  }, [productOptions]);

  console.log(variantConfigs);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">General</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Winter jacket"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-red-500 mt-1">
                    Product name is required
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    placeholder="Enter Price $ 0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-red-500 mt-1">
                    Base Price is required.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description{" "}
                    <span className="text-gray-400 text-xs">Optional</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="A warm and cozy jacket"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-medium mb-1">
                Media{" "}
                <span className="text-gray-400 text-sm font-normal">
                  Optional
                </span>
              </h2>

              <div className="mt-4">
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {images.map((img, idx) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.url}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-24 object-cover rounded border-2 border-gray-200"
                        />
                        {idx === 0 && (
                          <div className="absolute bottom-1 left-1 bg-white rounded-full p-1">
                            <div className="w-4 h-4 border-2 border-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop an image here or click to upload.
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Product Options */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Product options</h2>
                  <p className="text-sm text-gray-500">
                    Define the options for the product, e.g. color, size, etc.
                  </p>
                </div>
                <button
                  onClick={addProductOption}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Add
                </button>
              </div>

              <div className="space-y-4">
                {productOptions.map((option) => (
                  <div
                    key={option.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={option.title}
                          onChange={(e) =>
                            updateOption(option.id, "title", e.target.value)
                          }
                          placeholder="Coverage per Unit"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Values
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search or add value..."
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                const target = e.target as HTMLInputElement;
                                addValueToOption(option.id, target.value);
                                target.value = "";
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {option.values.map((value, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm"
                            >
                              {value}
                              <button
                                onClick={() =>
                                  removeValueFromOption(option.id, idx)
                                }
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={option.useForVariants}
                          onChange={(e) => {
                            updateOption(
                              option.id,
                              "useForVariants",
                              e.target.checked
                            );
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Use for variants
                        </span>
                      </label>
                      <button
                        onClick={() => removeOption(option.id)}
                        className="text-red-500 text-sm font-medium hover:text-red-600"
                      >
                        × Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configure Variants */}
            {variantConfigs.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div>
                  <h2 className="text-xl font-semibold">Configure Variants</h2>
                  <p className="text-sm text-gray-500">
                    Set SKU, pricing, and inventory for each variant
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-4 mb-6">
                  <input
                    type="text"
                    placeholder="Enter Stock"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Enter Price $ 0.00"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={autoGenerateConfigs}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Auto Generate
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                    Bulk Actions
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Finish / viscosity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Image URL
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {variantConfigs.map((config) => (
                        <tr key={config.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            {config.combined}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">
                                {config.combined.charAt(0)}
                              </span>
                              <input
                                type="text"
                                value={config.title}
                                onChange={(e) =>
                                  updateVariantConfig(
                                    config.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="SKU"
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={config.sku}
                              onChange={(e) =>
                                updateVariantConfig(
                                  config.id,
                                  "sku",
                                  e.target.value
                                )
                              }
                              placeholder="SKU"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={config.stock}
                              onChange={(e) =>
                                updateVariantConfig(
                                  config.id,
                                  "stock",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="text-sm">$</span>
                              <input
                                type="text"
                                value={config.price}
                                onChange={(e) =>
                                  updateVariantConfig(
                                    config.id,
                                    "price",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                              Upload
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Organize */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Organize</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="segmentType"
                    value={formData.segmentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    placeholder="Add tags..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}