"use client";
import { useRouter } from "next/navigation";

const NoPrizePage = () => {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col justify-center bg-fade bg-center bg-cover items-center">
      <h1 className="font-bold text-5xl text-center text-pink-100 mb-24">
        Não foi dessa vez 😿
        <br />
        Obrigado por participar!
      </h1>
      <button
        className="bg-pink-100 text-afya-pink px-6 py-5 rounded-lg font-semibold"
        onClick={() => router.push("/")}
      >
        &lt;&lt; Voltar à página inicial
      </button>
    </div>
  );
};

export default NoPrizePage;
