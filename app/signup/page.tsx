"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import afyaLogo from "../public/images/logoRosa.png";
import { SignupContext } from "../contexts/SignupContext";
import InputField from "../components/InputField";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import { formatCpf, formatPhone, formatDate } from "../utils/formatters";
import { checkCpfExists } from "../utils/supabase/client";

const SignupPage: React.FC = () => {
  const { signupData, setSignupData } = useContext(SignupContext);
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: "",
    cpf: "",
    email: "",
  });
  const [isPrivacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignupData({
      ...signupData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCpf(e.target.value);
    setSignupData({
      ...signupData,
      cpf: formattedCpf,
    });
    setErrors({ ...errors, cpf: "" });
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!value) {
      setErrors({ ...errors, [name]: "Este campo é obrigatório" });
    }
  };

  const isFormValid = () => {
    return (
      signupData.cpf &&
      signupData.name &&
      signupData.email &&
      signupData.privacyPolicy
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cpfExists = await checkCpfExists(signupData.cpf);
    if (cpfExists) {
      setErrors({ ...errors, cpf: "Este CPF já participou" });
      return;
    }

    if (isFormValid()) {
      router.push("/questions");
    } else {
      setErrors({
        name: signupData.name ? "" : "Este campo é obrigatório",
        cpf: signupData.cpf ? "" : "Este campo é obrigatório",
        email: signupData.email ? "" : "Este campo é obrigatório",
      });
    }
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
          onBlur={handleBlur}
          maxLength={100}
          name="name"
          error={errors.name}
        />
        <InputField
          id="cpf"
          label="CPF"
          type="text"
          value={signupData.cpf}
          onChange={handleCpfChange}
          onBlur={handleBlur}
          placeholder="000.000.000-00"
          maxLength={14}
          name="cpf"
          error={errors.cpf}
        />
        <InputField
          id="dob"
          label="Data de Nascimento"
          type="text"
          value={signupData.dob}
          onChange={handleDobChange}
          onBlur={handleBlur}
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
          onBlur={handleBlur}
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
          onBlur={handleBlur}
          name="email"
          error={errors.email}
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
            <u
              className="text-afya-pink cursor-pointer"
              onClick={() => setPrivacyPolicyModalOpen(true)}
            >
              política de privacidade
            </u>
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
          className="bg-afya-pink cursor-pointer text-2xl text-white place-self-center font-bold py-2 px-6 rounded-lg"
          disabled={!isFormValid()}
        >
          Seguinte &gt;&gt;
        </button>
      </form>
      <Image src={afyaLogo} alt="Afya Logo" />
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={() => setPrivacyPolicyModalOpen(false)}
      />
    </div>
  );
};

export default SignupPage;
