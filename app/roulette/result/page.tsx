"use client";
import { useRouter, useSearchParams } from "next/navigation";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const prize = searchParams.get("prize");
  const prizes = searchParams.get("prizes");
  const router = useRouter();

  const parsedPrizes = prizes ? JSON.parse(prizes as string) : [];

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="result-container">
        <h1 className="text-2xl font-bold mb-4">Resultado</h1>
        <ul className="bg-white shadow-md rounded p-4">
          {parsedPrizes.map((p: string, index: number) => (
            <li
              key={index}
              className={`flex justify-between items-center mb-2 p-2 border-b ${
                p === prize ? "bg-yellow-200" : ""
              }`}
            >
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
