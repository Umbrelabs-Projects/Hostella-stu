"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfileSettings() {
  const { user, updateProfile, loading } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [avatar, setAvatar] = useState<string>(user?.avatar || "/avatar.avif");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (avatarFile) formData.append("avatar", avatarFile);
    await updateProfile(formData);
  };

  return (
    <div className="bg-white rounded-lg border p-8 space-y-8">
      <h2 className="text-lg font-semibold">Profile Settings</h2>
      <div className="flex gap-6 items-center">
        <div className="relative">
          <Image
            src={avatar}
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full border"
          />
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
            accept="image/*"
            onChange={handleAvatarUpload}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={firstName}
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        />
        <input
          type="text"
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        />
      </div>
      <Button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
