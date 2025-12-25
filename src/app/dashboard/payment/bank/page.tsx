import React, { Suspense } from "react";
import PaymentMessage from "../reusablecomponent/PaymentMessage";
import BankDetails from "./components/BankDetails";
import { SkeletonCard } from "@/components/ui/skeleton";

// Server component that reads environment variables and passes them to client component
export default function BankPayment() {
  // Read bank details from environment variables (server-side only)
  // Strip quotes if present
  const stripQuotes = (value: string | undefined) => {
    if (!value) return undefined;
    return value.replace(/^["']|["']$/g, '');
  };

  const bankName = stripQuotes(process.env.BANK_NAME);
  const accountName = stripQuotes(process.env.BANK_ACCOUNT_NAME);
  const accountNumber = stripQuotes(process.env.BANK_ACCOUNT_NUMBER);
  const branch = stripQuotes(process.env.BANK_BRANCH);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
        <PaymentMessage />
        <div className="w-full md:w-1/2">
          <Suspense fallback={<SkeletonCard />}>
            <BankDetails
              bankName={bankName}
              accountName={accountName}
              accountNumber={accountNumber}
              branch={branch}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
