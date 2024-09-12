"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { IoLibraryOutline, IoPersonOutline } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa";
import { SignupContext } from "../contexts/SignupContext";
import { saveChoice } from "../utils/supabase/client";
import toast, { Toaster } from "react-hot-toast";
import afyaLogo from "../public/images/logoBranco.png";
import booksIcon from "../public/icons/books.png";

const titleVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } },
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

const modalVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

const logoVariants = {
  hidden: { y: 300, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1, delay: 1 } },
};

const QuestionsPage = () => {
  const { signupData } = useContext(SignupContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedModalOption, setSelectedModalOption] = useState<string | null>(
    null
  );
  const router = useRouter();

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setShowModal(true);
  };

  const handleModalSelect = (option: string) => {
    setSelectedModalOption(option);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFinish = async () => {
    if (!selectedModalOption) {
      toast.error("Por favor, selecione uma opção.");
      return;
    }

    if (selectedOption) {
      const formattedChoice =
        selectedOption === "Estudante"
          ? `Estudante: ${selectedModalOption}`
          : selectedOption === "Docente"
          ? `Docente: ${selectedModalOption}`
          : `Profissional de outra área: ${selectedModalOption}`;
      const dataToSave = {
        ...signupData,
        choice: formattedChoice,
      };
      await saveChoice(dataToSave);
      setShowModal(false);
      router.push("/roulette");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="h-screen bg-rosa bg-center bg-cover w-full flex flex-col justify-center items-center"
    >
      <Toaster />
      <motion.h1
        className="font-bold text-5xl text-pink-100 mb-24 text-center"
        variants={titleVariants}
      >
        Conta pra gente: em <br />
        que momento da sua <br />
        jornada você está?{" "}
      </motion.h1>
      <div className="flex flex-col text-xl items-center space-y-4">
        <div className="flex w-full space-x-4">
          <motion.button
            onClick={() => handleSelect("Estudante")}
            className={`flex-1 border-2 border-pink-100 font-bold p-10 rounded-xl ${
              selectedOption === "Estudante"
                ? "bg-afya-pink text-pink-100"
                : "bg-pink-100 text-afya-pink"
            }`}
            variants={buttonVariants}
          >
            <div className="flex flex-col gap-2 items-center justify-center">
              <div
                className={`p-3 rounded-full ${
                  selectedOption === "Estudante"
                    ? "bg-pink-100 text-afya-pink"
                    : "bg-afya-pink text-pink-100"
                }`}
              >
                <IoLibraryOutline size={40} />
              </div>
              Sou estudante de medicina
            </div>
          </motion.button>
          <motion.button
            onClick={() => handleSelect("Docente")}
            className={`flex-1 border-2 border-pink-100 font-bold p-10 rounded-xl ${
              selectedOption === "Docente"
                ? "bg-afya-pink text-pink-100"
                : "bg-pink-100 text-afya-pink"
            }`}
            variants={buttonVariants}
          >
            <div className="flex flex-col gap-2 items-center justify-center">
              <div
                className={`p-3 rounded-full ${
                  selectedOption === "Docente"
                    ? "bg-pink-100 text-afya-pink"
                    : "bg-afya-pink text-pink-100"
                }`}
              >
                <FaUserGraduate size={40} />
              </div>
              Sou docente
            </div>
          </motion.button>
        </div>
        <motion.button
          onClick={() => handleSelect("Profissional de outra área")}
          className={`w-1/2 border-2 border-pink-100 font-bold p-10 rounded-xl ${
            selectedOption === "Profissional de outra área"
              ? "bg-afya-pink text-pink-100"
              : "bg-pink-100 text-afya-pink"
          }`}
          variants={buttonVariants}
        >
          <div className="flex flex-col gap-2 items-center justify-center">
            <div
              className={`p-3 rounded-full ${
                selectedOption === "Profissional de outra área"
                  ? "bg-pink-100 text-afya-pink"
                  : "bg-afya-pink text-pink-100"
              }`}
            >
              <IoPersonOutline size={40} />
            </div>
            Sou profissional de outra área
          </div>
        </motion.button>
      </div>

      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
          onClick={handleCloseModal}
          initial="hidden"
          animate="visible"
          variants={modalVariants}
        >
          <div
            className="bg-white w-[80%] p-24 rounded-lg shadow-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute text-2xl top-2 right-2 text-afya-pink"
            >
              X
            </button>
            <div className="flex justify-center">
              <Image
                src={booksIcon}
                alt=""
                width={60}
                className="absolute top-0"
              />
            </div>
            <h2 className="text-2xl text-center text-afya-pink font-semibold my-10">
              {selectedOption === "Estudante"
                ? "Em que período da jornada acadêmica você está?"
                : selectedOption === "Docente"
                ? "Em qual área você atua?"
                : "Você se identifica como?"}
            </h2>
            {selectedOption === "Estudante" ? (
              <div className="flex justify-center items-center space-x-4 mb-8">
                <button
                  onClick={() => handleModalSelect("1º ao 4º ano")}
                  className={`border-2 border-afya-pink font-bold py-4 px-8 rounded ${
                    selectedModalOption === "1º ao 4º ano"
                      ? "bg-afya-pink text-pink-100"
                      : "text-afya-pink"
                  }`}
                >
                  1º ao 4º ano
                </button>
                <button
                  onClick={() => handleModalSelect("5º ao 6º ano")}
                  className={`border-2 border-afya-pink font-bold py-4 px-8 rounded ${
                    selectedModalOption === "5º ao 6º ano"
                      ? "bg-afya-pink text-pink-100"
                      : "text-afya-pink"
                  }`}
                >
                  5º ao 6º ano
                </button>
              </div>
            ) : selectedOption === "Docente" ? (
              <div className="flex justify-center items-center space-x-4 mb-8">
                <button
                  onClick={() => handleModalSelect("Área médica")}
                  className={`border-2 border-afya-pink font-bold py-4 px-8 rounded ${
                    selectedModalOption === "Área médica"
                      ? "bg-afya-pink text-pink-100"
                      : "text-afya-pink"
                  }`}
                >
                  Área médica
                </button>
                <button
                  onClick={() => handleModalSelect("Outra área")}
                  className={`border-2 border-afya-pink font-bold py-4 px-8 rounded ${
                    selectedModalOption === "Outra área"
                      ? "bg-afya-pink text-pink-100"
                      : "text-afya-pink"
                  }`}
                >
                  Outra área
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center space-y-4 mb-8">
                <button
                  onClick={() =>
                    handleModalSelect("Profissional de saúde pública")
                  }
                  className={`border-2 border-afya-pink font-bold py-4 px-8 rounded ${
                    selectedModalOption === "Profissional de saúde pública"
                      ? "bg-afya-pink text-pink-100"
                      : "text-afya-pink"
                  }`}
                >
                  Profissional de saúde pública
                </button>
                <button
                  onClick={() =>
                    handleModalSelect("Profissional de saúde privado")
                  }
                  className={`border-2 border-afya-pink font-bold py-4 px-8 rounded ${
                    selectedModalOption === "Profissional de saúde privado"
                      ? "bg-afya-pink text-pink-100"
                      : "text-afya-pink"
                  }`}
                >
                  Profissional de saúde privado
                </button>
                <button
                  onClick={() => handleModalSelect("Outros")}
                  className={`border-2 border-afya-pink font-bold py-4 px-8 rounded ${
                    selectedModalOption === "Outros"
                      ? "bg-afya-pink text-pink-100"
                      : "text-afya-pink"
                  }`}
                >
                  Outros
                </button>
              </div>
            )}
            <button
              onClick={handleFinish}
              className="absolute bottom-6 right-6 bg-afya-pink text-pink-100 font-bold py-2 px-4 rounded-lg"
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      )}
      <motion.button
        onClick={() => router.back()}
        className="place-self-start mt-16 mb-28 ml-56 bg-pink-100 text-afya-pink px-6 py-2 rounded-lg"
        variants={buttonVariants}
      >
        &lt;&lt; Voltar
      </motion.button>
      <motion.div variants={logoVariants}>
        <Image src={afyaLogo} alt="Afya Logo" />
      </motion.div>
    </motion.div>
  );
};

export default QuestionsPage;
