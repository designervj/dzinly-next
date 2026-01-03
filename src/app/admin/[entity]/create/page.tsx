"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import type { MaterialCategory } from "@/components/admin/category/types/CategoryModel";
import type { MaterialBrandModel } from "@/components/admin/brand/types/brandModel";
import { MaterialAttributes } from "@/components/admin/attribute/types/attributeModel";
import { MaterialSegmentModel } from "@/components/admin/segment/types/SegmentModel";
import CategoryForm from "@/components/admin/category/forms/CategoryForm";
import BrandForm from "@/components/admin/brand/forms/BrandForm";
import SegmentForm from "@/components/admin/segment/forms/SegmentForm";
import AttributeForm from "@/components/admin/attribute/forms/AttributeForm";
import { ObjectId } from "mongodb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function EntityCreatePage() {
  const router = useRouter();
  const params = useParams();
  const entity = params.entity as string;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Redux state
  const { listCategory } = useSelector((state: RootState) => state.category);
  const currentWebsite = useSelector(
    (state: RootState) => state.websites.currentWebsite
  );
  const currentUser = useSelector((state: RootState) => state.user.user);

  // Filter data by current website
  const filterCategory = listCategory.filter(
    (item) => item.websiteId === currentWebsite?._id
  );

  // Entity-specific state
  const [category, setCategory] = useState<MaterialCategory>({
    name: "",
    icon: "",
    sort_order: 0,
  });

  const [segment, setSegment] = useState<MaterialSegmentModel>({
    name: "",
    color: "",
    color_code: "",
    icon: "",
    icon_svg: "",
    index: 0,
    is_active: false,
    is_visible: false,
    description: "",
    short_code: "",
    categories: [],
    gallery: "",
    userId: currentUser?.id as string | ObjectId,
  });

  const [brand, setBrand] = useState<MaterialBrandModel>({
    name: "",
    url: "",
    description: "",
    logo: "",
  });

  const [attribute, setAttribute] = useState<MaterialAttributes>({
    name: "",
    unit: "",
    possible_values: [],
    category_id: null,
  });

  // File upload handler for brand logo
  const handleLogoFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setBrand((b) => ({ ...b, logo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (entity === "category") {
      if (!category.name || category.name.trim() === "")
        errs.name = "Name is required";
      if (Number.isNaN(Number(category.sort_order)) || category.sort_order! < 0)
        errs.sort_order = "Sort order must be >= 0";
    } else if (entity === "segment") {
      if (!segment.name || segment.name.trim() === "")
        errs.name = "Name is required";
      if (Number.isNaN(Number(segment.index ?? 0)) || (segment.index ?? 0) < 0)
        errs.index = "Index must be >= 0";
    } else if (entity === "brand") {
      if (!brand.name || brand.name.trim() === "")
        errs.name = "Name is required";
      if (brand.url && brand.url.trim() !== "") {
        try {
          if (
            !(brand.url.startsWith("data:") || /^https?:\/\//.test(brand.url))
          ) {
            new URL(brand.url);
          }
        } catch {
          errs.url = "Invalid URL format";
        }
      }
    } else if (entity === "attribute") {
      if (!attribute.name || attribute.name.trim() === "")
        errs.name = "Name is required";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    if (!validate()) {
      setLoading(false);
      return;
    }

    let payload: any;
    if (entity === "category") {
      payload = { ...category } as any;
      const websiteId = currentWebsite?.websiteId ?? currentWebsite?._id;
      if (websiteId) payload.websiteId = websiteId;
      if (currentUser?.tenantId) payload.tenantId = currentUser.tenantId;
    } else if (entity === "segment") {
      payload = { ...segment } as any;
      const websiteId = currentWebsite?.websiteId ?? currentWebsite?._id;
      if (websiteId) payload.websiteId = websiteId;
      if (currentUser?.tenantId) payload.tenantId = currentUser.tenantId;
    } else if (entity === "brand") {
      payload = { ...brand } as any;
      const websiteId = currentWebsite?.websiteId ?? currentWebsite?._id;
      if (websiteId) payload.websiteId = websiteId;
      if (currentUser?.tenantId) payload.tenantId = currentUser.tenantId;
    } else if (entity === "attribute") {
      payload = { ...attribute } as any;
      const websiteId = currentWebsite?.websiteId ?? currentWebsite?._id;
      if (websiteId) payload.websiteId = websiteId;
      if (currentUser?.tenantId) payload.tenantId = currentUser.tenantId;
      if (currentUser?.id) payload.userId = currentUser.id;
    }

    try {
      const res = await fetch(`/api/admin/${entity}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data?.error ??
          data?.message ??
          (typeof data === "string" ? data : undefined) ??
          "Failed to create";
        throw new Error(msg);
      }

      // Update Redux store
      try {
        if (entity === "category") {
          const created = data?.item ?? data?.category ?? data;
          if (created) {
            const { addCategory } = await import(
              "@/hooks/slices/category/CategorySlice"
            );
            dispatch(addCategory(created));
          }
        } else if (entity === "brand") {
          const created = data?.item ?? data?.brand ?? data;
          if (created) {
            const { addBrand } = await import(
              "@/hooks/slices/brand/BrandSlice"
            );
            dispatch(addBrand(created));
          }
        } else if (entity === "attribute") {
          const created = data?.item ?? data?.attribute ?? data;
          if (created) {
            const { addAttribute } = await import(
              "@/hooks/slices/attribute/AttributeSlice"
            );
            dispatch(addAttribute(created));
          }
        } else if (entity === "segment") {
          const created = data?.item ?? data?.segment ?? data;
          if (created) {
            const { addSegment } = await import(
              "@/hooks/slices/segment/SegmentSlice"
            );
            dispatch(addSegment(created));
          }
        }
      } catch (e) {
        // Ignore dispatch errors
      }

      toast.success(`${entity.charAt(0).toUpperCase() + entity.slice(1)} created successfully`);
      router.push(`/admin/${entity}`);
    } catch (err: any) {
      toast.error(err?.message || "Unexpected error");
      setLoading(false);
    }
  };

  // Get entity title
  const getEntityTitle = () => {
    return entity.charAt(0).toUpperCase() + entity.slice(1);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/${entity}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {getEntityTitle()} List
        </Button>
        <h1 className="text-3xl font-bold">Create New {getEntityTitle()}</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the form below to create a new {entity}.
        </p>
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg border shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {entity === "category" ? (
            <CategoryForm
              category={category}
              setCategory={setCategory}
              fieldErrors={fieldErrors}
            />
          ) : entity === "segment" ? (
            <SegmentForm
              segment={segment}
              setSegment={setSegment}
              fieldErrors={fieldErrors}
            />
          ) : entity === "brand" ? (
            <BrandForm
              brand={brand}
              setBrand={setBrand}
              fieldErrors={fieldErrors}
              handleLogoFile={handleLogoFile}
            />
          ) : entity === "attribute" ? (
            <AttributeForm
              attribute={attribute}
              setAttribute={setAttribute}
              fieldErrors={fieldErrors}
              filterCategory={filterCategory}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Unknown entity type: {entity}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : `Create ${getEntityTitle()}`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/${entity}`)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}