"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import afyaLogo from "../app/public/images/logoBranco.png";
import Link from "next/link";

const titleVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } },
};

const logoVariants = {
  hidden: { y: 300, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } },
};

const textVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, delay: 1 } },
};

const HomePage = () => {
  return (
    <Link href={"/signup"}>
      <motion.div
        initial="hidden"
        animate="visible"
        className="h-screen text-white bg-fade w-full bg-cover bg-center flex flex-col justify-center items-center gap-14"
      >
        <motion.h3 className="text-5xl font-bold" variants={titleVariants}>
          Premiações exclusivas
        </motion.h3>
        <motion.div variants={logoVariants}>
          <Image src={afyaLogo} alt="Afya Logo" width={700} height={700} />
        </motion.div>
        <motion.p className="text-3xl animate-pulse" variants={textVariants}>
          Toque para iniciar
        </motion.p>
      </motion.div>
    </Link>
  );
};

export default HomePage;
