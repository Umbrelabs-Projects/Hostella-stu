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

interface PdfUploadFieldProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  error?: FieldError | FieldErrorsImpl<T>;
}

export default function PdfUploadField<T extends FieldValues>({
  name,
  register,
  setValue,
  error,
}: PdfUploadFieldProps<T>) {
  const [fileName, setFileName] = React.useState("");
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
      // ✅ Store an actual FileList, not a proxy or null
      const dt = new DataTransfer();
      dt.items.add(files[0]);
      setValue(name, dt.files as unknown as T[Path<T>], {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
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
      updateFileValue(null);
    }
  };

  const handleDeleteFile = () => {
    setFileName("");
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
    if (file && file.type === "application/pdf") {
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
        Upload Admission letter
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
            className={`w-6 h-6 mb-2 ${
              isDragging ? "text-yellow-600" : "text-yellow-500"
            }`}
          />
          <p className="text-sm font-medium text-center">
            {isDragging
              ? "Drop file here..."
              : "Click to choose or drag file here"}
          </p>
          <p className="text-xs text-gray-400 mt-1">PDF format only</p>
          <input
            type="file"
            accept="application/pdf"
            {...rest}
            ref={setRefs}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
          <p className="text-sm text-gray-800 truncate">
            <span className="font-medium">Selected:</span> {fileName}
          </p>
          <button
            type="button"
            onClick={handleDeleteFile}
            className="text-red-500 hover:text-red-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
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
