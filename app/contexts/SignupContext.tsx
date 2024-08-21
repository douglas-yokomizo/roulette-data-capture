"use client";
import { createContext, useState, ReactNode } from "react";

export interface ISignupData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  dob: string;
  privacyPolicy: boolean;
  newsletter?: boolean;
  choice?: string;
}

interface SignupContextProps {
  signupData: ISignupData;
  setSignupData: (data: ISignupData) => void;
  resetSignupData: () => void;
}

const defaultSignupData: ISignupData = {
  name: "",
  email: "",
  cpf: "",
  phone: "",
  dob: "",
  privacyPolicy: false,
  newsletter: false,
};

export const SignupContext = createContext<SignupContextProps>({
  signupData: defaultSignupData,
  setSignupData: () => {},
  resetSignupData: () => {},
});

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<ISignupData>(defaultSignupData);

  const resetSignupData = () => {
    setSignupData(defaultSignupData);
  };

  return (
    <SignupContext.Provider
      value={{ signupData, setSignupData, resetSignupData }}
    >
      {children}
    </SignupContext.Provider>
  );
};
