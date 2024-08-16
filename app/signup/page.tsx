"use client";
import Image from "next/image";
import { useContext } from "react";
import afyaLogo from "../favicon.ico";
import { SignupContext } from "../contexts/SignupContext";
import { useRouter } from "next/navigation";

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
  name: string;
}

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  maxLength,
  name,
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
      name={name}
      className="w-full py-2 border-gray-300 focus:outline-none  text-gray-400"
    />
  </div>
);

const SignupPage = () => {
  const { signupData, setSignupData } = useContext(SignupContext);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignupData({
      ...signupData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCpf(e.target.value);
    setSignupData({
      ...signupData,
      cpf: formattedCpf,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setSignupData({
      ...signupData,
      phone: formattedPhone,
    });
  };

  const isFormValid = () => {
    return (
      signupData.cpf &&
      signupData.name &&
      signupData.dob &&
      signupData.phone &&
      signupData.email &&
      signupData.privacyPolicy
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/questions");
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-pink-600 text-center text-3xl mb-10">
        Olá, seja bem-vindo. <br /> Faça seu cadastro abaixo.
      </h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <InputField
          id="cpf"
          label="CPF"
          type="text"
          value={signupData.cpf}
          onChange={handleCpfChange}
          placeholder="000.000.000-00"
          maxLength={14}
          name="cpf"
        />
        <InputField
          id="name"
          label="Nome"
          type="text"
          value={signupData.name}
          onChange={handleChange}
          placeholder="Digite seu nome"
          maxLength={100}
          name="name"
        />
        <InputField
          id="dob"
          label="Data de Nascimento"
          type="date"
          value={signupData.dob}
          onChange={handleChange}
          placeholder="Data de nascimento"
          name="dob"
        />
        <InputField
          id="phone"
          label="Celular"
          type="tel"
          value={signupData.phone}
          onChange={handlePhoneChange}
          placeholder="(00) 00000-0000"
          maxLength={15}
          name="phone"
        />
        <InputField
          id="email"
          label="E-mail"
          type="email"
          value={signupData.email}
          onChange={handleChange}
          placeholder="Digite seu e-mail"
          name="email"
        />
        <div className="flex items-center mb-6">
          <input
            id="privacyPolicy"
            name="privacyPolicy"
            type="checkbox"
            checked={signupData.privacyPolicy}
            onChange={handleChange}
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
            name="newsletter"
            type="checkbox"
            checked={signupData.newsletter}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="newsletter" className="text-gray-400">
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
