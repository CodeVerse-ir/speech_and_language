"use client";

import { useState } from "react";

// components
import UsernameAndPassword from "./UsernameAndPassword";
import OtpForm from "./OtpForm";

const ChooseLogin = () => {
  const [step, setStep] = useState(1);

  return <div>
    {step === 1 && <UsernameAndPassword setStep={setStep} />}
    {step === 2 && <OtpForm setStep={setStep} />}
  </div>;
};

export default ChooseLogin;
