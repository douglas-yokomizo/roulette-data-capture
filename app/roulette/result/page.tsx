"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import logoAfya from "../../public/images/logoBranco.png";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const prize = searchParams.get("prize");
  const prizes = searchParams.get("prizes");
  const router = useRouter();

  const parsedPrizes = prizes ? JSON.parse(prizes as string) : [];

  return (
    <div className="flex items-center flex-col bg-fade bg-center bg-cover justify-center h-screen">
      <div className="w-full">
        <h1 className="text-6xl font-semibold text-center text-white mb-4">
          Parabéns! <br /> Você ganhou
        </h1>
        <ul className="flex flex-col gap-4 p-4 w-full items-center">
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
        </ul>
      </div>
      <Image src={logoAfya} alt="" width={300} className="my-10" />
      <button
        onClick={() => router.push("/")}
        className="bg-pink-100 text-afya-pink font-bold py-6 px-8 rounded focus:outline-none focus:shadow-outline"
      >
        &lt;&lt; Voltar ao início
      </button>
    </div>
  );
};

export default ResultPage;
