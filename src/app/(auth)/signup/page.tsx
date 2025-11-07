"use client";

import React, { useState } from "react";
import MainSignUp from "./step1/page";
import { useAuthStore } from "@/store/useAuthStore";
import VerificationPage from "./step2/page";
import DetailsForm from "./step3/page";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const { signupData } = useAuthStore();

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div>
      {step === 1 && <MainSignUp onNext={nextStep} />}
      {step === 2 && (
        <VerificationPage
          onNext={nextStep}
          email={signupData.email ?? "your email"}
        />
      )}
      {step === 3 && <DetailsForm onPrev={prevStep} />}
    </div>
  );
}
