"use client";

import React, { useCallback, useMemo, useState } from "react";
import { ProductModel } from "../type/ProductModel";
import { MaterialBrandModel } from "../../brand/types/brandModel";
import { MaterialCategory } from "../../category/types/CategoryModel";
import { MaterialSegmentModel } from "../../segment/types/SegmentModel";
import { Upload, X } from "lucide-react";
import { DirectS3UploadService, UploadResult } from "../../uploadImage/utilies/DirectS3UploadService";
import { convertImageFileToWebp } from "../../uploadImage/utilies/ConvertImageToWebp";
import UploadImage from "../../uploadImage/UploadImage";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { toast } from "sonner";

type ProductFormProps = {
  product: ProductModel;
  setProduct: React.Dispatch<React.SetStateAction<ProductModel>>;
  fieldErrors: Record<string, string>;
  filterCategory: MaterialCategory[];
  listBrand: MaterialBrandModel[];
  listSegment: MaterialSegmentModel[];
};

export default function ProductForm({
  product,
  setProduct,
  fieldErrors,
  filterCategory,
  listBrand,
  listSegment,
}: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
 
  const {  currentWebsite}= useSelector((state:RootState)=>state.websites)  
 const {  user}= useSelector((state:RootState)=>state.user)  


  const folderName = useMemo(() => {
    if (currentWebsite && currentWebsite.name && user && user.name)  {
      return currentWebsite.name.replace(/\s+/g, '-');
    }
    return '';
  }, [currentWebsite, user]);
  const handleRemoveImage = () => {
    setProduct({ ...product, photo: undefined });
  };


  const CheckJobImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return false;
    }
    setImageLoading(true);
    return true;
  };
  return (
    <>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={product.name || ""}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={product.description || ""}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={String(product.product_category_id || "")}
          onChange={(e) =>
            setProduct({
              ...product,
              product_category_id: e.target.value || undefined,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">Select category</option>
          {filterCategory.map((cat) => (
            <option
              key={String(cat._id || cat.id)}
              value={String(cat._id || cat.id)}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Brand</label>
        <select
          value={String(product.brand_id || "")}
          onChange={(e) =>
            setProduct({
              ...product,
              brand_id: e.target.value || undefined,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">Select brand</option>
          {listBrand.map((brand) => (
            <option
              key={String((brand as any)._id || brand.id)}
              value={String((brand as any)._id || brand.id)}
            >
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Segment</label>
        <select
          value={String(product.material_segment_id || "")}
          onChange={(e) =>
            setProduct({
              ...product,
              material_segment_id: e.target.value || undefined,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">Select segment</option>
          {listSegment.map((segment) => (
            <option
              key={String((segment as any)._id || segment.id)}
              value={String((segment as any)._id || segment.id)}
            >
              {segment.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Base Price</label>
        <input
          type="number"
          step="0.01"
          value={product.base_price ?? ""}
          onChange={(e) =>
            setProduct({
              ...product,
              base_price: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Product Photo</label>
        
        {product.photo ? (
          <div className="relative inline-block">
            <img
              src={product.photo}
              alt="product preview"
              className="h-32 w-32 object-cover rounded border"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {imageLoading ? (
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600">Loading image...</span>
              </div>
            ) : (
              <>
                <label
                  htmlFor="photo-upload"
                  className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                </label>
                <UploadImage
                  createdProjectId={`${folderName}/products` || null}
                  jobImageUpload={CheckJobImageUpload}
                  onUploadSuccess={(data) => {
                    setImageLoading(false);
                    setProduct({...product, photo: data});
                  }}
                  onUploadError={() => setImageLoading(false)}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* <div>
        <label className="block text-sm font-medium">AI Summary</label>
        <span className="text-gray-400 text-xs font-normal">Optional</span>
        <textarea
          value={product.ai_summary || ""}
          onChange={(e) =>
            setProduct({ ...product, ai_summary: e.target.value || null })
          }
          className="mt-1 block w-full rounded-md border p-2"
          rows={2}
          placeholder="AI-generated product summary"
        />
      </div> */}
    </>
  );
}
