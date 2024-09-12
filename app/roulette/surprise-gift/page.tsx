"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import qrCodeBrinde from "../../public/images/qrCodeBrinde.png";
import logoAfya from "../../public/images/logoBranco.png";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { SignupContext } from "@/app/contexts/SignupContext";

const SupriseGiftPage = () => {
  const { resetSignupData } = useContext(SignupContext);
  const router = useRouter();

  const handleBackToHome = () => {
    resetSignupData();
    router.push("/");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex items-center flex-col bg-fade bg-center bg-cover justify-center h-screen"
    >
      <motion.h1
        className="text-6xl font-semibold text-center text-white mb-4"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1 } },
        }}
      >
        Parabéns!
        <br /> Você ganhou um Brinde Surpresa Afya.
      </motion.h1>
      <motion.div
        className="flex flex-col items-center mt-5 mb-10"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
        }}
      >
        <h2 className="text-4xl font-bold text-center text-white mt-10 mb-8">
          Escaneie o QR Code abaixo para acessar o Brinde Surpresa Afya.
        </h2>
        <Image
          src={qrCodeBrinde}
          alt="QR Code Curso Afya"
          width={300}
          height={300}
          className="rounded-lg border-2 border-white p-2"
        />
      </motion.div>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1, delay: 1 } },
        }}
      >
        <Image src={logoAfya} alt="Logo Afya" width={300} className="my-10" />
      </motion.div>
      <motion.button
        className="bg-pink-100 text-afya-pink px-6 py-5 rounded-lg font-semibold"
        onClick={handleBackToHome}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1, delay: 1.5 } },
        }}
      >
        &lt;&lt; Voltar à página inicial
      </motion.button>
    </motion.div>
  );
};

export default SupriseGiftPage;
