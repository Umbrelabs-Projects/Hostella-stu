// app/(auth)/signup/page.tsx
"use client";

import React, { useState } from "react";
import MainSignUp from "./step1/page";
import DetailsForm from "./details/page";

export default function SignupPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div>
      {step === 1 && <MainSignUp onNext={nextStep} />}
      {step === 2 && <DetailsForm onPrev={prevStep} />}
    </div>
  );
}
