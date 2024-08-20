"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoLibraryOutline, IoPersonOutline } from "react-icons/io5";
import { FaStethoscope } from "react-icons/fa";
import { SignupContext } from "../contexts/SignupContext";
import { saveChoice } from "../utils/supabase/client";
import afyaLogo from "../public/images/logoBranco.png";
import booksIcon from "../public/icons/books.png";

const QuestionsPage = () => {
  const { signupData } = useContext(SignupContext);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedModalOption, setSelectedModalOption] = useState<string | null>(
    null
  );
  const router = useRouter();

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (option === "Estudante") {
      setShowModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleModalSelect = (option: string) => {
    setSelectedModalOption(option);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmCloseModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirm = async () => {
    if (selectedOption) {
      const dataToSave = {
        ...signupData,
        choice: selectedOption,
      };
      await saveChoice(dataToSave);
      setShowConfirmModal(false);
      router.push("/roulette");
    }
  };

  const handleFinish = async () => {
    if (selectedModalOption) {
      const formattedChoice = `Estudante: ${selectedModalOption}`;
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
    <div className="h-screen bg-rosa bg-center bg-cover w-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-5xl text-pink-100 mb-24">
        Conta pra gente: em <br />
        que momento da sua <br />
        jornada você está?{" "}
      </h1>
      <div className="flex flex-col text-xl items-center space-y-4">
        <div className="flex w-full space-x-4">
          <button
            onClick={() => handleSelect("Estudante")}
            className={`flex-1 border-2 border-pink-100 font-bold p-10 rounded-xl ${
              selectedOption === "Estudante"
                ? "bg-afya-pink text-pink-100"
                : "bg-pink-100 text-afya-pink"
            }`}
          >
            <div className="flex flex-col gap-2 items-center justify-center">
              <div
                className={`p-3 rounded-full ${
                  selectedOption === "Estudante"
                    ? "bg-pink-100 text-afya-pink"
                    : "bg-afya-pink text-pink-100"
                }`}
              >
                {" "}
                <IoLibraryOutline size={40} />
              </div>
              Sou estudante de medicina
            </div>
          </button>
          <button
            onClick={() => handleSelect("Médico")}
            className={`flex-1 border-2 border-pink-100 font-bold p-10 rounded-xl ${
              selectedOption === "Médico"
                ? "bg-afya-pink text-pink-100"
                : "bg-pink-100 text-afya-pink"
            }`}
          >
            <div className="flex flex-col gap-2 items-center justify-center">
              <div
                className={`p-3 rounded-full ${
                  selectedOption === "Médico"
                    ? "bg-pink-100 text-afya-pink"
                    : "bg-afya-pink text-pink-100"
                }`}
              >
                <FaStethoscope size={40} />
              </div>
              Sou médico
            </div>
          </button>
        </div>
        <button
          onClick={() => handleSelect("Profissional de outra área")}
          className={`w-1/2 border-2 border-pink-100 font-bold p-10 rounded-xl ${
            selectedOption === "Profissional de outra área"
              ? "bg-afya-pink text-pink-100"
              : "bg-pink-100 text-afya-pink"
          }`}
        >
          <div className="flex flex-col gap-2 items-center justify-center">
            <div
              className={`p-3 rounded-full ${
                selectedOption === "Profissional de outra área"
                  ? "bg-pink-100 text-afya-pink"
                  : "bg-afya-pink text-pink-100"
              }`}
            >
              {" "}
              <IoPersonOutline size={40} />
            </div>
            Profissional de outra área
          </div>
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
          onClick={handleCloseModal}
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
              Em que período da jornada <br /> acadêmica você está?
            </h2>
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
            <button
              onClick={handleFinish}
              className="absolute bottom-6 right-6 bg-afya-pink text-pink-100 font-bold py-2 px-4 rounded-lg"
            >
              Finalizar
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
          onClick={handleConfirmCloseModal}
        >
          <div
            className="bg-white p-24 rounded-lg shadow-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleConfirmCloseModal}
              className="absolute text-2xl top-2 right-2 text-afya-pink"
            >
              X
            </button>
            <h2 className="text-2xl text-center text-afya-pink font-semibold mb-8">
              Confirmar escolha?
            </h2>
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={handleConfirm}
                className="border-2 border-afya-pink text-afya-pink font-bold py-4 px-8 rounded"
              >
                Confirmar
              </button>
              <button
                onClick={handleConfirmCloseModal}
                className="border-2 border-afya-pink bg-afya-pink text-pink-100 font-bold py-4 px-8 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => router.back()}
        className="place-self-start mt-16 mb-28 ml-56 bg-pink-100 text-afya-pink px-6 py-2 rounded-lg"
      >
        &lt;&lt; Voltar
      </button>
      <Image src={afyaLogo} alt="" width={280} />
    </div>
  );
};

export default QuestionsPage;
