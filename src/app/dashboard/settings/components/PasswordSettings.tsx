"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggle: () => void;
  id: string;
}

export default function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const PasswordInput = ({
    label,
    value,
    onChange,
    showPassword,
    onToggle,
    id,
  }: PasswordInputProps) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Change Password</h2>
        <p className="text-sm text-gray-600">
          Update your password to keep your account secure
        </p>
      </div>

      <div className="space-y-6 pt-4">
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          showPassword={showPasswords.current}
          onToggle={() =>
            setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
          }
          id="current-password"
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showPassword={showPasswords.new}
          onToggle={() =>
            setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
          }
          id="new-password"
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showPasswords.confirm}
          onToggle={() =>
            setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
          }
          id="confirm-password"
        />

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={
              isSaving || !currentPassword || !newPassword || !confirmPassword
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            {isSaving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}
