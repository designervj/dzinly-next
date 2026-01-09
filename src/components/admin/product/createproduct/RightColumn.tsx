"use client";

import React from "react";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const RightColumn = ({ formData, handleInputChange }: any) => {
  // helper: make Select work like your handleInputChange
  const handleSelectChange = (name: string, value: string) => {
    handleInputChange({ target: { name, value } });
  };

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-6 ">
        <CardHeader className="pb-0 mb-0">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Organize
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Segment Type */}
          <div className="space-y-2">
            <Label htmlFor="segmentType">
              Segment Type <span className="text-red-500">*</span>
            </Label>

            <Select
              value={formData.segmentType}
              onValueChange={(v) => handleSelectChange("segmentType", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select segment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wall">Wall</SelectItem>
                <SelectItem value="Floor">Floor</SelectItem>
                <SelectItem value="Ceiling">Ceiling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label htmlFor="categories">
              Categories <span className="text-red-500">*</span>
            </Label>

            <Select
              value={formData.categories}
              onValueChange={(v) => handleSelectChange("categories", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paint">Paint</SelectItem>
                <SelectItem value="Primer">Primer</SelectItem>
                <SelectItem value="Stain">Stain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brands */}
          <div className="space-y-2">
            <Label htmlFor="brands">
              Brands <span className="text-red-500">*</span>
            </Label>

            <Select
              value={formData.brands}
              onValueChange={(v) => handleSelectChange("brands", v)}
            >
              <SelectTrigger className="w-full border-2 border-blue-500 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PPG">PPG</SelectItem>
                <SelectItem value="Sherwin-Williams">Sherwin-Williams</SelectItem>
                <SelectItem value="Behr">Behr</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">
              Tags <span className="text-gray-400 text-xs">Optional</span>
            </Label>

            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g. premium, exterior"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
