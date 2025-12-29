import React, { useRef, useState } from 'react'


import { Upload, Check, X, Plus } from "lucide-react";

interface ViewUploaderProps {
  viewType: string;
  uploadedFile: File | null;
  onFileUpload: (file: File, viewType: string) => void;
  onFileRemove: () => void;
  disabled?: boolean;
}

const ImageUploader = ({
    uploadedFile,
  onFileUpload,
  onFileRemove,
  disabled = false,
}:ViewUploaderProps) => {
      const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Generate image preview when file is uploaded
  React.useEffect(() => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setImagePreview(null);
    }
  }, [uploadedFile]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileUpload(file, "front view");
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0], "front");
    }
  };

  const openFileSelector = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };
  return (
  <>
    <div className="relative">
      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 h-80 transition-all duration-300 cursor-pointer overflow-hidden ${
          disabled
            ? "border-blue-500 bg-gray-50 cursor-not-allowed"
            : dragActive
            ? "border-blue-500 bg-blue-50"
            : uploadedFile
            ? "border-green-500 bg-green-50"
            : "border-blue-500 bg-white hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        {/* Background / Uploaded Image */}
        {!uploadedFile && (
          <div className="absolute inset-0 bg-blue-50 flex flex-col justify-center items-center text-center z-10">
            <div className="bg-white w-10 h-10 flex justify-center items-center rounded-full mb-2 shadow-none">
              <Upload className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-700 font-medium">
              Drag & Drop photos here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {disabled ? "Only one image allowed" : "JPG, PNG"}
            </p>
          </div>
        )}

        {uploadedFile && imagePreview && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${imagePreview})` }}
          />
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {/* Overlay when uploaded */}
        {uploadedFile && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white z-20">
            <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs font-medium bg-black bg-opacity-50 rounded px-2 py-1">
              Image Selected
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-gray-50 flex items-center justify-center shadow-md transition-all"
            >
              <X className="w-4 h-4 text-gray-800" />
            </button>
          </div>
        )}
      </div>

      {/* 👇 Preview appears BELOW upload area */}
      {imagePreview && (
        <div className="mt-4 flex gap-3 flex-wrap">
          {/* Uploaded Preview */}
          <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={imagePreview}
              alt="uploaded-preview"
              className="object-cover w-full h-full"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Add More */}
          {/* <label
            onClick={openFileSelector}
            className="w-32 h-24 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <Plus className="text-gray-500 w-6 h-6" />
            <span className="text-sm mt-1 text-gray-600">Add more</span>
          </label> */}
        </div>
      )}
    </div>
  </>
  )
}

export default ImageUploader