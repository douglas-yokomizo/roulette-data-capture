"use client";
import { SignupContext } from "@/app/contexts/SignupContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { motion } from "framer-motion";

const titleVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } },
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 1 } },
};

const NoPrizePage = () => {
  const router = useRouter();
  const { resetSignupData } = useContext(SignupContext);

  const handleBackToHome = () => {
    resetSignupData();
    router.push("/");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="h-screen flex flex-col justify-center bg-fade bg-center bg-cover items-center"
    >
      <motion.h1
        className="font-bold text-5xl text-center text-pink-100 mb-24"
        variants={titleVariants}
      >
        Não foi dessa vez 😿
        <br />
        Obrigado por participar!
      </motion.h1>
      <motion.button
        className="bg-pink-100 text-afya-pink px-6 py-5 rounded-lg font-semibold"
        onClick={handleBackToHome}
        variants={buttonVariants}
      >
        &lt;&lt; Voltar à página inicial
      </motion.button>
    </motion.div>
  );
};

export default NoPrizePage;
