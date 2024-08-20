// SignupPage.tsx
"use client";
import Image from "next/image";
import { useContext } from "react";
import afyaLogo from "../public/images/logoRosa.png";
import { SignupContext } from "../contexts/SignupContext";
import { useRouter } from "next/navigation";
import InputField from "../components/InputField";
import { formatCpf, formatPhone, formatDate } from "../utils/formatters";

const SignupPage: React.FC = () => {
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

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDob = formatDate(e.target.value);
    setSignupData({
      ...signupData,
      dob: formattedDob,
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
    <div className="h-screen bg-branco bg-cover bg-center w-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-afya-pink text-center text-5xl">
        Olá, seja bem-vindo. <br /> Faça seu cadastro abaixo.
      </h1>
      <form className="flex flex-col w-[80%] my-20" onSubmit={handleSubmit}>
        <InputField
          id="name"
          label="Digite seu nome"
          type="text"
          value={signupData.name}
          onChange={handleChange}
          maxLength={100}
          name="name"
        />
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
          id="dob"
          label="Data de Nascimento"
          type="text"
          value={signupData.dob}
          onChange={handleDobChange}
          name="dob"
          placeholder="00/00/0000"
          maxLength={10}
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
          name="email"
        />
        <div className="flex items-center mt-10 mb-6">
          <input
            id="privacyPolicy"
            name="privacyPolicy"
            type="checkbox"
            checked={signupData.privacyPolicy}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="privacyPolicy" className="text-gray-400 text-lg">
            Ao informar meus dados, concordo com a{" "}
            <u className="text-afya-pink">política de privacidade</u>
          </label>
        </div>
        <div className="flex items-center mb-10">
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            checked={signupData.newsletter}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="newsletter" className="text-gray-400 text-lg">
            Aceito receber novidades e comunicações
          </label>
        </div>
        <button
          type="submit"
          className="bg-afya-pink text-white w-fit place-self-center font-bold py-2 px-6 rounded-lg"
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
