"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import afyaLogo from "../public/images/logoRosa.png";
import { SignupContext } from "../contexts/SignupContext";
import InputField from "../components/InputField";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import { formatCpf, formatPhone, formatDate } from "../utils/formatters";
import { checkCpfExists } from "../utils/supabase/client";
import VirtualKeyboard from "../components/VirtualKeyboard";
import toast, { Toaster } from "react-hot-toast";

const titleVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } },
};

const formVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
};

const logoVariants = {
  hidden: { y: 300, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1, delay: 1 } },
};

const SignupPage: React.FC = () => {
  const { signupData, setSignupData } = useContext(SignupContext);
  const [isVirtualKeyboardVisible, setVirtualKeyboardVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");

  const handleInputFocus = (id: string) => {
    setFocusedInput(id);
    setVirtualKeyboardVisible(true);
  };

  const handleInputChange = (value: string) => {
    let formattedValue = value;

    switch (focusedInput) {
      case "cpf":
        formattedValue = formatCpf(value);
        break;
      case "phone":
        formattedValue = formatPhone(value);
        break;
      case "dob":
        formattedValue = formatDate(value);
        break;
      default:
        break;
    }

    setSignupData({
      ...signupData,
      [focusedInput]: formattedValue,
    });
  };

  const router = useRouter();
  const [errors, setErrors] = useState({
    name: "",
    cpf: "",
    email: "",
    dob: "",
  });
  const [isPrivacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);

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

  const isFormValid = () => {
    const isCpfValid = signupData.cpf.length === 14; // CPF format: 000.000.000-00
    const isDobValid = signupData.dob.length === 10; // DOB format: 00/00/0000

    return (
      signupData.cpf &&
      signupData.name &&
      signupData.email &&
      signupData.privacyPolicy &&
      isCpfValid &&
      isDobValid
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      name: signupData.name ? "" : "Este campo é obrigatório",
      cpf: signupData.cpf ? "" : "Este campo é obrigatório",
      email: signupData.email ? "" : "Este campo é obrigatório",
      dob: signupData.dob ? "" : "Este campo é obrigatório",
    };

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const isCpfValid = signupData.cpf.length === 14; // CPF format: 000.000.000-00
    const isDobValid = signupData.dob.length === 10; // DOB format: 00/00/0000

    if (!isCpfValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cpf: "CPF incompleto",
      }));
      return;
    }

    if (!isDobValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dob: "Data de nascimento incompleta",
      }));
      return;
    }

    const cpfExists = await checkCpfExists(signupData.cpf);
    if (cpfExists) {
      toast.error("Este CPF já participou");
      return;
    }

    if (isFormValid()) {
      router.push("/questions");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="h-screen bg-branco bg-cover bg-center w-full flex flex-col justify-center items-center"
    >
      <Toaster />
      <motion.h1
        className="font-bold text-afya-pink text-center text-5xl"
        variants={titleVariants}
      >
        Olá, seja bem-vindo. <br /> Faça seu cadastro abaixo.
      </motion.h1>
      <motion.form
        className="flex flex-col w-[80%] my-20"
        onSubmit={handleSubmit}
        variants={formVariants}
      >
        <InputField
          id="name"
          label="Digite seu nome"
          type="text"
          value={signupData.name}
          onChange={handleChange}
          maxLength={100}
          name="name"
          error={errors.name}
          onFocus={handleInputFocus}
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
          error={errors.cpf}
          onFocus={handleInputFocus}
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
          error={errors.dob}
          onFocus={handleInputFocus}
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
          onFocus={handleInputFocus}
        />
        <InputField
          id="email"
          label="E-mail"
          type="email"
          value={signupData.email}
          onChange={handleChange}
          name="email"
          error={errors.email}
          onFocus={handleInputFocus}
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
        >
          Seguinte &gt;&gt;
        </button>
      </motion.form>
      <motion.div variants={logoVariants}>
        <Image
          src={afyaLogo}
          alt="Afya Logo"
          className={isVirtualKeyboardVisible ? "mb-10" : ""}
        />
      </motion.div>
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={() => setPrivacyPolicyModalOpen(false)}
      />
      <VirtualKeyboard
        isVisible={isVirtualKeyboardVisible}
        onChange={handleInputChange}
        focusedInput={focusedInput}
        inputValue={
          typeof signupData[focusedInput as keyof typeof signupData] ===
          "string"
            ? (signupData[focusedInput as keyof typeof signupData] as string)
            : ""
        }
      />
    </motion.div>
  );
};

export default SignupPage;
