"use client";

import React from "react";
import { Upload, X } from "lucide-react";
import type {
  FieldError,
  FieldErrorsImpl,
  UseFormRegister,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";

interface ImageUploadFieldProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  error?: FieldError | FieldErrorsImpl<T>;
  label?: string;
}

export default function ImageUploadField<T extends FieldValues>({
  name,
  register,
  setValue,
  error,
  label = "Upload Image",
}: ImageUploadFieldProps<T>) {
  const [fileName, setFileName] = React.useState("");
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { ref: formRef, ...rest } = register(name);

  const setRefs = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (typeof formRef === "function") formRef(el);
    else if (formRef)
      (formRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
  };

  const validateFile = (file: File): string | null => {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Only image files are allowed (JPEG, PNG, GIF, or WEBP).";
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return "File size must be less than 5MB.";
    }

    return null;
  };

  const updateFileValue = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file before processing
      const validationError = validateFile(file);
      if (validationError) {
        setFileName("");
        setPreview(null);
        setImageError(false);
        if (inputRef.current) inputRef.current.value = "";
        // Set error message via setValue to trigger validation
        setValue(name, null as unknown as T[Path<T>], {
          shouldValidate: true,
          shouldDirty: true,
        });
        return;
      }

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onerror = () => {
          console.error("Error reading file");
          setImageError(true);
          setPreview(null);
        };
        reader.onloadend = () => {
          if (reader.result) {
            setPreview(reader.result as string);
            setImageError(false);
          }
        };
        reader.readAsDataURL(file);
      }
      
      // Store an actual FileList
      const dt = new DataTransfer();
      dt.items.add(file);
      setValue(name, dt.files as unknown as T[Path<T>], {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setPreview(null);
      setImageError(false);
      setValue(name, null as unknown as T[Path<T>], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      updateFileValue(e.target.files);
    } else {
      setFileName("");
      setPreview(null);
      setImageError(false);
      updateFileValue(null);
    }
  };

  const handleDeleteFile = () => {
    setFileName("");
    setPreview(null);
    setImageError(false);
    if (inputRef.current) inputRef.current.value = "";
    updateFileValue(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file before processing
      const validationError = validateFile(file);
      if (validationError) {
        setFileName("");
        setPreview(null);
        setImageError(false);
        return;
      }
      
      setFileName(file.name);
      const dt = new DataTransfer();
      dt.items.add(file);
      if (inputRef.current) inputRef.current.files = dt.files;
      updateFileValue(dt.files);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm mb-2 font-medium text-gray-700">
        {label}
      </label>
      {!fileName ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition duration-200 cursor-pointer ${
            isDragging
              ? "border-yellow-500 bg-yellow-50"
              : error
              ? "border-red-500"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Upload
            className={`w-8 h-8 mb-2 ${
              isDragging ? "text-yellow-600" : "text-yellow-500"
            }`}
          />
          <p className="text-sm font-medium text-center">
            {isDragging
              ? "Drop image here..."
              : "Click to choose or drag image here"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPEG, PNG, GIF, or WEBP (max 5MB)
          </p>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            {...rest}
            ref={setRefs}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
            <p className="text-sm text-gray-800 truncate">
              <span className="font-medium">Selected:</span> {fileName}
            </p>
            <button
              type="button"
              onClick={handleDeleteFile}
              className="text-red-500 hover:text-red-600 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {preview && !imageError && (
            <div className="border border-gray-300 rounded-lg p-2 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Receipt preview"
                className="w-full h-auto max-h-64 object-contain rounded"
                onError={() => {
                  console.error("Image preview failed to load");
                  setImageError(true);
                }}
              />
            </div>
          )}
          {imageError && (
            <div className="border border-red-300 rounded-lg p-4 bg-red-50">
              <p className="text-sm text-red-600 text-center">
                Failed to load image preview. Please try again.
              </p>
            </div>
          )}
        </div>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1 text-center">
          {(error as FieldError)?.message ?? "Invalid file"}
        </p>
      )}
    </div>
  );
}

