"use client";
import { useEffect, useMemo } from "react";
import VerificationItem from "./components/VerificationItem";
import { useAuthStore } from "@/store/useAuthStore";

export default function VerificationSettings() {
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchProfile().catch(() => {
        /* error handled in store */
      });
    }
  }, [fetchProfile, user]);

  const verificationStatus = useMemo(
    () => ({
      email: {
        verified: Boolean(user?.emailVerified),
        value: user?.email || "Fetching from backend...",
      },
      phone: {
        verified: Boolean(user?.phoneVerified),
        value: user?.phone || "Add a phone number to verify",
      },
    }),
    [user]
  );

  const handleVerify = (type: keyof typeof verificationStatus) => {
    alert(`Verification link sent to ${verificationStatus[type].value}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Account Verification
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Verify your account information for enhanced security
        </p>
      </div>

      <div className="space-y-4">
        <VerificationItem
          title="Email Address"
          description={verificationStatus.email.value}
          status={verificationStatus.email}
          actionLabel={
            !verificationStatus.email.verified ? "Verify" : undefined
          }
          onAction={() => handleVerify("email")}
        />
        <VerificationItem
          title="Phone Number"
          description={verificationStatus.phone.value}
          status={verificationStatus.phone}
          actionLabel={
            !verificationStatus.phone.verified ? "Verify" : undefined
          }
          onAction={() => handleVerify("phone")}
        />
      </div>
    </div>
  );
}
