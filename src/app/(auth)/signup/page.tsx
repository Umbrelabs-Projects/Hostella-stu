"use client";

import React, { useState, useEffect } from "react";
import MainSignUp from "./step1/page";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import VerificationPage from "./step2/page";
import DetailsForm from "./step3/page";

export default function SignupPage() {
  const { signupData } = useAuthStore();
  const { setShowNavbar } = useUIStore();

  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("signup-step");
      return savedStep ? Number(savedStep) : 1;
    }
    return 1;
  });

  useEffect(() => {
    localStorage.setItem("signup-step", String(step));
    setShowNavbar(step === 1); 
  }, [step, setShowNavbar]);

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
