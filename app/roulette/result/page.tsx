"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import logoAfya from "../../public/images/logoBranco.png";
import { useContext, Suspense } from "react";
import { SignupContext } from "@/app/contexts/SignupContext";

// Defina as animações
const titleVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 1 } },
};

const logoVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 1, delay: 1.5 } },
};

const ResultPage = () => {
  const searchParams = useSearchParams();
  const prize = searchParams.get("prize");
  const prizes = searchParams.get("prizes");
  const router = useRouter();
  const { resetSignupData } = useContext(SignupContext);

  const handleBackToHome = () => {
    resetSignupData();
    router.push("/");
  };

  const parsedPrizes = prizes ? JSON.parse(prizes as string) : [];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex items-center flex-col bg-fade bg-center bg-cover justify-center h-screen"
    >
      <div className="w-full">
        <motion.h1
          className="text-6xl font-semibold text-center text-white mb-4"
          variants={titleVariants}
        >
          Parabéns! 🎉
          <br /> Você ganhou
        </motion.h1>
        <motion.ul
          className="flex flex-col gap-4 p-4 w-full items-center"
          variants={listVariants}
        >
          {parsedPrizes.map((p: string, index: number) => (
            <li
              key={index}
              className={`flex gap-4 items-center text-2xl mb-2 w-3/5 py-6 px-8 border rounded-xl ${
                p === prize
                  ? "bg-pink-100 text-afya-pink"
                  : "text-pink-100 bg-afya-pink"
              }`}
            >
              <span className="text-5xl">{index + 1}</span>
              {p}
            </li>
          ))}
        </motion.ul>
      </div>
      <motion.div variants={logoVariants}>
        <Image src={logoAfya} alt="Logo Afya" width={300} className="my-10" />
      </motion.div>
      <motion.button
        onClick={handleBackToHome}
        className="bg-pink-100 text-afya-pink font-bold py-6 px-8 rounded focus:outline-none focus:shadow-outline"
        variants={buttonVariants}
      >
        &lt;&lt; Voltar ao início
      </motion.button>
    </motion.div>
  );
};

const SuspenseWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResultPage />
  </Suspense>
);

export default SuspenseWrapper;
