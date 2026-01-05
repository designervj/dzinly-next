"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryAttributeMap: { [key: string]: string[] } = {
  Paint: ["paint", "color"],
  Primer: ["paint"],
  Stain: ["color"],
};

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

interface ProductOption {
  id: number;
  title: string;
  values: string[];
  useForVariants: boolean;
  unit?: string;
}

interface VariantAttribute {
  attributeId: number;
  attributeName: string;
  value: string;
  unit?: string;
}

interface VariantConfig {
  id: number;
  sku: string;
  stock: number;
  price: string;
  attributes: VariantAttribute[];
}

export function CreateProduct() {
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
  const [variantConfigs, setVariantConfigs] = useState<VariantConfig[]>([]);
  const [attributes, setAttributes] = useState([
    {
      id: 1,
      name: "Color",
      category_id: "color",
      unit: "",
      default_values: ["Red", "Blue", "Green"],
    },
    {
      id: 2,
      name: "Finish Type",
      category_id: "paint",
      unit: "",
      default_values: ["Matte", "Glossy", "Satin", "Semi-Gloss"],
    },
    {
      id: 3,
      name: "Paint Type",
      category_id: "paint",
      unit: "",
      default_values: ["Emulsion", "Enamel", "Distemper", "Texture"],
    },
    {
      id: 4,
      name: "Coverage Area",
      category_id: "paint",
      unit: "sq ft/litre",
      default_values: ["80", "100", "120", "140"],
    },
    {
      id: 5,
      name: "Drying Time",
      category_id: "paint",
      unit: "hours",
      default_values: ["1", "2", "4", "6"],
    },
  ]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [showValueDropdown, setShowValueDropdown] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [valueSearchTerm, setValueSearchTerm] = useState<{
    [key: number]: string;
  }>({});

  console.log(images);

  // useEffect(() => {
  //   (async () => {
  //     const req = await fetch("/api/admin/category");
  //     const res = await req.json();
  //     setAttributes(res.items);
  //   })();
  // }, []);

  useEffect(() => {
    const categoryIds = categoryAttributeMap[formData.categories] || [];
    const relevantAttrs = attributes.filter((attr) =>
      categoryIds.includes(attr.category_id)
    );

    setProductOptions((prev) => {
      return relevantAttrs.map((attr) => {
        const existing = prev.find((opt) => opt.id === attr.id);

        return (
          existing ?? {
            id: attr.id,
            title: attr.name,
            values: attr.default_values,
            useForVariants: false,
            unit: attr.unit,
          }
        );
      });
    });
  }, [formData.categories, attributes]);

  const generateVariants = () => {
    const variantOptions = productOptions.filter(
      (opt) => opt.useForVariants && opt.values.length > 0
    );

    if (variantOptions.length === 0) {
      setVariantConfigs([]);
      return;
    }

    const combinations: VariantAttribute[][] = [];

    const generate = (depth: number, current: VariantAttribute[]) => {
      if (depth === variantOptions.length) {
        combinations.push(current);
        return;
      }

      const option = variantOptions[depth];

      option.values.forEach((value) => {
        generate(depth + 1, [
          ...current,
          {
            attributeId: option.id!,
            attributeName: option.title,
            value,
            unit: option.unit,
          },
        ]);
      });
    };

    generate(0, []);

    const variants: VariantConfig[] = combinations.map((attrs, idx) => ({
      id: idx,
      sku: "",
      stock: 0,
      price: "",
      attributes: attrs,
    }));

    setVariantConfigs(variants);
  };

  useEffect(() => {
    generateVariants();
  }, [productOptions]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ImageFile[] = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: number) =>
    setImages((prev) => prev.filter((img) => img.id !== id));

  const addProductOption = () => {
    setProductOptions((prev) => [
      ...prev,
      { id: Date.now(), title: "", values: [], useForVariants: false },
    ]);
  };

  const updateOption = (
    id: number,
    field: keyof ProductOption,
    value: string | boolean
  ) => {
    setProductOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  const selectAttribute = (optionId: number, attrId: number) => {
    const attr = attributes.find((a) => a.id === attrId);
    if (!attr) return;
    setProductOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId
          ? { ...opt, title: attr.name, attributeId: attr.id, unit: attr.unit }
          : opt
      )
    );
    setShowDropdown(null);
    setSearchTerm("");
  };

  const removeOption = (id: number) =>
    setProductOptions((prev) => prev.filter((opt) => opt.id !== id));

  const addValue = (optionId: number, value: string) => {
    if (!value.trim()) return;
    const option = productOptions.find((opt) => opt.id === optionId);

    const clonedOption = structuredClone(productOptions);

    const index = clonedOption.findIndex((d) => d.id == optionId);

    // Check if value already exists
    if (clonedOption[index]?.values.includes(value.trim())) return;

    clonedOption[index].values.push(value);

    setProductOptions(clonedOption);

    // If this option is linked to an attribute and value doesn't exist in default_values, add it
    if (option?.id) {
      setAttributes((prev) =>
        prev.map((attr) => {
          if (
            attr.id === option.id &&
            !attr.default_values.includes(value.trim())
          ) {
            return {
              ...attr,
              default_values: [...attr.default_values, value.trim()],
            };
          }
          return attr;
        })
      );
    }

    // Clear the search term for this option
    setValueSearchTerm((prev) => ({ ...prev, [optionId]: "" }));
  };

  const removeValue = (optionId: number, idx: number) => {
    setProductOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId
          ? { ...opt, values: opt.values.filter((_, i) => i !== idx) }
          : opt
      )
    );
  };

  const autoGenConfigs = () => {
    const stock =
      document.querySelector<HTMLInputElement>(
        'input[placeholder="Enter Stock"]'
      )?.value || "0";

    const price =
      document.querySelector<HTMLInputElement>(
        'input[placeholder="Enter Variant Price $ 0.00"]'
      )?.value || "0.00";

    const princeInNum = parseFloat(price).toFixed(2);

    setVariantConfigs((prev) =>
      prev.map((cfg) => ({
        ...cfg,
        stock: parseInt(stock) || 0,
        price: princeInNum,
      }))
    );
  };

  const updateConfig = (
    id: number,
    field: keyof VariantConfig,
    value: string | number
  ) => {
    setVariantConfigs((prev) =>
      prev.map((cfg) => (cfg.id === id ? { ...cfg, [field]: value } : cfg))
    );
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".attribute-dropdown-container")) {
        setShowDropdown(null);
      }
      if (!target.closest(".value-dropdown-container")) {
        setShowValueDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSaveProduct = async () => {
    const finalObj: {
      productdata: any;
      variantData: any;
    } = {
      productdata: {
        ...formData,
        options: productOptions,
      },
      variantData: variantConfigs,
    };

    if (images.length > 0) {
      const image: string[] = [];

      const mapped = images.map((d) => {
        return fileToBase64(d.file);
      });

      const finalImages = await Promise.all(mapped);

      console.log(finalImages)
      finalObj.productdata.images = finalImages;
    }

    try {
      const req = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(finalObj),
      });

      const res = await req.json();

      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mb-4 flex flex-row-reverse">
        <Button
          onClick={handleSaveProduct}

        >
          Save Product
        </Button>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* General */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold tracking-tight mb-4">General</h2>
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
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
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
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
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
                  <h2 className="text-2xl font-bold tracking-tight">Product options</h2>
                  <p className="text-sm text-gray-500">
                    Define options for the product based on category
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
                {productOptions.map((option) => {
                  const linkedAttr = attributes.find(
                    (attr) => attr.id === option.id
                  );
                  const availVals = linkedAttr?.default_values || [];
                  const filteredAttrs = attributes.filter((attr) =>
                    attr.name.toLowerCase().includes(searchTerm.toLowerCase())
                  );

                  return (
                    <div
                      key={option.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="relative attribute-dropdown-container">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={option.title}
                            onChange={(e) => {
                              updateOption(option.id, "title", e.target.value);
                              setSearchTerm(e.target.value);
                            }}
                            onFocus={() => setShowDropdown(option.id)}
                            placeholder="Search attribute..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {option.unit && (
                            <span className="text-xs text-gray-500 mt-1 block">
                              Unit: {option.unit}
                            </span>
                          )}
                          {showDropdown === option.id &&
                            filteredAttrs.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {filteredAttrs.map((attr) => (
                                  <button
                                    key={attr.id}
                                    type="button"
                                    onClick={() =>
                                      selectAttribute(option.id, attr.id)
                                    }
                                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                                  >
                                    <div className="font-medium">
                                      {attr.name}
                                    </div>
                                    {attr.unit && (
                                      <div className="text-xs text-gray-500">
                                        Unit: {attr.unit}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                        <div className="value-dropdown-container">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Values
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search or add value..."
                              value={valueSearchTerm[option.id] || ""}
                              onChange={(e) =>
                                setValueSearchTerm((prev) => ({
                                  ...prev,
                                  [option.id]: e.target.value,
                                }))
                              }
                              onFocus={() => setShowValueDropdown(option.id)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  addValue(
                                    option.id,
                                    valueSearchTerm[option.id] || ""
                                  );
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {showValueDropdown === option.id &&
                              availVals.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                  {availVals
                                    .filter(
                                      (val) =>
                                        val
                                          .toLowerCase()
                                          .includes(
                                            (
                                              valueSearchTerm[option.id] || ""
                                            ).toLowerCase()
                                          ) && !option.values.includes(val)
                                    )
                                    .map((val, i) => (
                                      <button
                                        key={i}
                                        type="button"
                                        onClick={() => addValue(option.id, val)}
                                        className="w-full px-3 py-2 text-left hover:bg-blue-50 text-sm flex items-center justify-between"
                                      >
                                        <span>{val}</span>
                                        <span className="text-blue-600 text-xs">
                                          + Add
                                        </span>
                                      </button>
                                    ))}
                                  {availVals.filter(
                                    (val) =>
                                      val
                                        .toLowerCase()
                                        .includes(
                                          (
                                            valueSearchTerm[option.id] || ""
                                          ).toLowerCase()
                                        ) && !option.values.includes(val)
                                  ).length === 0 &&
                                    (
                                      valueSearchTerm[option.id] || ""
                                    ).trim() && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          addValue(
                                            option.id,
                                            valueSearchTerm[option.id] || ""
                                          )
                                        }
                                        className="w-full px-3 py-2 text-left hover:bg-green-50 text-sm flex items-center justify-between"
                                      >
                                        <span>
                                          Create "{valueSearchTerm[option.id]}"
                                        </span>
                                        <span className="text-green-600 text-xs">
                                          + Create New
                                        </span>
                                      </button>
                                    )}
                                </div>
                              )}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {option.values.map((val, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                              >
                                {val}
                                <button
                                  onClick={() => removeValue(option.id, idx)}
                                  className="text-blue-600 hover:text-blue-800"
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
                            onChange={(e) =>
                              updateOption(
                                option.id,
                                "useForVariants",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 rounded"
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
                  );
                })}
              </div>
            </div>

            {/* Variants */}
            {variantConfigs.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold tracking-tight">Configure Variants</h2>
                <p className="text-sm text-gray-500">
                  Set SKU, pricing, and inventory
                </p>
                <div className="flex items-center gap-4 mt-4 mb-6">
                  <input
                    type="text"
                    placeholder="Enter Stock"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Enter Variant Price $ 0.00"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={autoGenConfigs}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Auto Generate
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Variant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {variantConfigs.map((cfg) => (
                        <tr key={cfg.id} className="hover:bg-gray-50">
                          {/* <td className="px-4 py-3 text-sm">{cfg.combined}</td>
                          
                          */}

                          <td className="px-4 py-3 text-sm">
                            {cfg.attributes
                              .map((a) => `${a.attributeName}: ${a.value}`)
                              .join(" / ")}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={cfg.sku}
                              onChange={(e) =>
                                updateConfig(cfg.id, "sku", e.target.value)
                              }
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={cfg.stock}
                              onChange={(e) =>
                                updateConfig(
                                  cfg.id,
                                  "stock",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20 px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={cfg.price}
                              onChange={(e) =>
                                updateConfig(cfg.id, "price", e.target.value)
                              }
                              className="w-20 px-2 py-1 border rounded text-sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
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
        </div>
      </div>
    </div>
  );
}
