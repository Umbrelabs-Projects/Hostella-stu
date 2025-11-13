"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";

export default function VerificationSettings() {
  const [verificationStatus, setVerificationStatus] = useState({
    email: { verified: true, value: "user@example.com" },
    phone: { verified: false, value: "+1 (555) 000-0000" },
    identity: { verified: false, value: "Pending" },
  });

  const handleVerify = (type: string) => {
    alert(
      `Verification link sent to ${
        verificationStatus[type as keyof typeof verificationStatus].value
      }`
    );
  };

  interface VerificationType {
    verified: boolean;
    value: string;
  }

  const renderStatus = (item: VerificationType) => {
    if (item.verified) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Verified</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-yellow-600">
        <Clock className="w-5 h-5" />
        <span className="text-sm font-medium">Pending</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Account Verification
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Verify your account information for enhanced security
        </p>
      </div>

      <div className="space-y-4">
        {/* Email Verification */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Email Address</h3>
            <p className="text-sm text-gray-600 mt-1">
              {verificationStatus.email.value}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {renderStatus(verificationStatus.email)}
            {!verificationStatus.email.verified && (
              <Button
                onClick={() => handleVerify("email")}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm"
              >
                Verify
              </Button>
            )}
          </div>
        </div>

        {/* Phone Verification */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Phone Number</h3>
            <p className="text-sm text-gray-600 mt-1">
              {verificationStatus.phone.value}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {renderStatus(verificationStatus.phone)}
            {!verificationStatus.phone.verified && (
              <Button
                onClick={() => handleVerify("phone")}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm"
              >
                Verify
              </Button>
            )}
          </div>
        </div>

        {/* Identity Verification */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Identity Verification</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete identity verification to unlock premium features
            </p>
          </div>
          <div className="flex items-center gap-4">
            {renderStatus(verificationStatus.identity)}
            {!verificationStatus.identity.verified && (
              <Button
                onClick={() => handleVerify("identity")}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm"
              >
                Start
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
