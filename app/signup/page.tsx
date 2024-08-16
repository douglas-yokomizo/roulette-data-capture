"use client";
import Image from "next/image";
import { useState } from "react";
import afyaLogo from "../favicon.ico";

// Funções utilitárias para formatação
const formatCpf = (value: string) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
};

const formatPhone = (value: string) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value;
};

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  maxLength?: number;
}

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  maxLength,
}: InputFieldProps) => (
  <div className="flex items-center mb-6 border-b-[1px] border-black">
    <label
      htmlFor={id}
      className="text-pink-600 mr-2 font-bold whitespace-nowrap"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="w-full py-2 border-gray-300 focus:outline-none  text-gray-400"
    />
  </div>
);

const SignupPage = () => {
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const isFormValid = () => {
    return cpf && name && dob && phone && email && privacyPolicy;
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-pink-600 text-center text-3xl mb-10">
        Olá, seja bem-vindo. <br /> Faça seu cadastro abaixo.
      </h1>
      <form className="flex flex-col">
        <InputField
          id="cpf"
          label="CPF"
          type="text"
          value={cpf}
          onChange={handleCpfChange}
          placeholder="000.000.000-00"
          maxLength={14}
        />
        <InputField
          id="name"
          label="Nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome"
          maxLength={100}
        />
        <InputField
          id="dob"
          label="Data de Nascimento"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          placeholder="Data de nascimento"
        />
        <InputField
          id="phone"
          label="Celular"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="(00) 00000-0000"
          maxLength={15}
        />
        <InputField
          id="email"
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
        />
        <div className="flex items-center mb-6">
          <input
            id="privacyPolicy"
            type="checkbox"
            checked={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="privacyPolicy" className="text-gray-400">
            Ao informar meus dados, concordo com a{" "}
            <u className="text-pink-600">política de privacidade</u>
          </label>
        </div>
        <div className="flex items-center mb-6">
          <input
            id="newsletter"
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="newsletter" className="text-pink-600 text-gray-400">
            Aceito receber novidades e comunicações
          </label>
        </div>
        <button
          type="submit"
          className="bg-pink-600 text-white font-bold py-2 px-4 rounded"
          disabled={!isFormValid()}
        >
          Seguinte &gt;&gt;
        </button>
      </form>
      <Image src={afyaLogo} alt="Afya Logo" />
    </div>
  );
};

export default SignupPage;
