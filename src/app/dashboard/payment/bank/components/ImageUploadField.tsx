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
import Image from "next/image";

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
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { ref: formRef, ...rest } = register(name);

  const setRefs = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (typeof formRef === "function") formRef(el);
    else if (formRef)
      (formRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
  };

  const updateFileValue = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
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
      updateFileValue(null);
    }
  };

  const handleDeleteFile = () => {
    setFileName("");
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    updateFileValue(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
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
          {preview && (
            <div className="border border-gray-300 rounded-lg p-2 bg-white">
              <Image
                src={preview}
                alt="Receipt preview"
                className="w-full h-auto max-h-64 object-contain rounded"
              />
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

