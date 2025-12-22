"use client";
import React, { useState, useEffect } from "react";
import { Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarUploaderProps {
  avatar?: string | null;
  onFileSelect: (file: File) => void;
}

export default function AvatarUploader({
  avatar,
  onFileSelect,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Initialize preview from avatar prop
  useEffect(() => {
    if (avatar) {
      const avatarUrl = avatar.trim();
      console.log("AvatarUploader: Setting preview from avatar prop", avatarUrl);
      setPreview(avatarUrl);
      setImageError(false);
      
      // Validate URL format
      if (avatarUrl.startsWith('http') || avatarUrl.startsWith('https')) {
        console.log("AvatarUploader: Valid external URL", avatarUrl);
      } else if (avatarUrl.startsWith('data:')) {
        console.log("AvatarUploader: Data URL detected");
      } else {
        console.warn("AvatarUploader: Unexpected avatar URL format", avatarUrl);
      }
    } else {
      console.log("AvatarUploader: No avatar provided, clearing preview");
      setPreview(null);
      setImageError(false);
    }
  }, [avatar]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("Avatar image must be less than 5MB");
        e.target.value = ""; // Clear input
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert("Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed");
        e.target.value = ""; // Clear input
        return;
      }

      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border flex items-center justify-center bg-gray-50 text-gray-500 overflow-hidden">
          {preview && !imageError ? (
            // Use regular img tag for better compatibility with external URLs
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error("AvatarUploader: Image failed to load", preview);
                console.error("AvatarUploader: Error event", e);
                setImageError(true);
              }}
              onLoad={() => {
                console.log("AvatarUploader: Image loaded successfully", preview);
              }}
            />
          ) : (
            <UserRound className="w-12 h-12" />
          )}
        </div>
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 cursor-pointer"
        >
          <div className="bg-blue-600 text-white p-2 rounded-full shadow">
            <Upload className="w-5 h-5" />
          </div>
        </label>
        <input
          id="avatar-upload"
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleUpload}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          onClick={() => document.getElementById("avatar-upload")?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        >
          Upload New
        </Button>
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent w-full sm:w-auto"
        >
          Delete Avatar
        </Button>
      </div>
    </div>
  );
}
