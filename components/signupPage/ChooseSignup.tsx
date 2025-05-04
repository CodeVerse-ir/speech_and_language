"use client";

import { useState } from "react";

// components
import NameAndMobileForm from "./NameAndMobileForm";
import UsernameAndPassword from "./UsernameAndPassword";
import OtpForm from "./OtpForm";

const ChooseSignup = () => {
  const [step, setStep] = useState(1);
  const [dataSignup, setDataSignup] = useState({
    first_name: "",
    last_name: "",
    parent_role: "F",
    mobile_number: "",
    username: "",
    password: "",
    repeat_password: "",
  });
  return (
    <div>
      {step === 1 && (
        <NameAndMobileForm
          setStep={setStep}
          dataSignup={dataSignup}
          setDataSignup={setDataSignup}
        />
      )}
      {step === 2 && (
        <UsernameAndPassword
          setStep={setStep}
          dataSignup={dataSignup}
          setDataSignup={setDataSignup}
        />
      )}
      {step === 3 && <OtpForm setStep={setStep} dataSignup={dataSignup} />}
    </div>
  );
};

export default ChooseSignup;
