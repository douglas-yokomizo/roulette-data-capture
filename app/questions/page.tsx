"use client";
import { useContext, useState } from "react";
import { SignupContext } from "../contexts/SignupContext";
import { saveChoice } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

const Page1 = () => {
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
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-3xl text-pink-500 mb-10">
        Conte pra gente: em <br />
        que momento da sua <br />
        jornada você está?{" "}
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex w-full space-x-4">
          <button
            onClick={() => handleSelect("Estudante")}
            className={`flex-1 border-2 border-pink-400 font-bold p-4 rounded ${
              selectedOption === "Estudante"
                ? "bg-pink-600 text-white"
                : "text-pink-400"
            }`}
          >
            Sou estudante de medicina
          </button>
          <button
            onClick={() => handleSelect("Médico")}
            className={`flex-1 border-2 border-pink-400 font-bold p-4 rounded ${
              selectedOption === "Médico"
                ? "bg-pink-600 text-white"
                : "text-pink-400"
            }`}
          >
            Sou médico
          </button>
        </div>
        <button
          onClick={() => handleSelect("Profissional de outra área")}
          className={`w-1/2 border-2 border-pink-400 font-bold p-4 rounded ${
            selectedOption === "Profissional de outra área"
              ? "bg-pink-600 text-white"
              : "text-pink-400"
          }`}
        >
          Profissional de outra área
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-12 rounded shadow-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500"
            >
              X
            </button>
            <h2 className="text-xl text-pink-400 font-bold mb-4">
              Em que período da jornada acadêmica você está?
            </h2>
            <div className="flex justify-center items-center space-x-4 mt-8 mb-12">
              <button
                onClick={() => handleModalSelect("1º ao 4º ano")}
                className={`border-2 border-pink-400 font-bold py-2 px-4 rounded ${
                  selectedModalOption === "1º ao 4º ano"
                    ? "bg-pink-600 text-white"
                    : "text-pink-400"
                }`}
              >
                1º ao 4º ano
              </button>
              <button
                onClick={() => handleModalSelect("5º ao 6º ano")}
                className={`border-2 border-pink-400 font-bold py-2 px-4 rounded ${
                  selectedModalOption === "5º ao 6º ano"
                    ? "bg-pink-600 text-white"
                    : "text-pink-400"
                }`}
              >
                5º ao 6º ano
              </button>
            </div>
            <button
              onClick={handleFinish}
              className="absolute bottom-2 right-2 bg-pink-600 text-white font-bold py-2 px-4 rounded-lg"
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
            className="bg-white p-8 rounded shadow-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleConfirmCloseModal}
              className="absolute top-2 right-2 text-gray-500"
            >
              X
            </button>
            <h2 className="text-xl text-pink-400 font-bold mb-4">
              Confirmar escolha?
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <button
                onClick={handleConfirm}
                className="border-2 border-pink-400 text-pink-400 font-bold py-2 px-4 rounded"
              >
                Sim
              </button>
              <button
                onClick={handleConfirmCloseModal}
                className="border-2 border-pink-400 bg-pink-600 text-white font-bold py-2 px-4 rounded"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page1;
