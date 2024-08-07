"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function Home() {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [result, setResult] = useState("");

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data, error } = await supabase.from("prizes").select("*");
      if (error) console.error(error);
      else setPrizes(data);
    };
    fetchPrizes();
  }, []);

  const drawPrize = async () => {
    const activePrizes = prizes.filter((prize) => prize.active);
    const totalQuantity = activePrizes.reduce(
      (acc, prize) => acc + prize.quantity,
      0
    );

    const noPrizeProbability = totalQuantity > 0 ? 1 / (totalQuantity + 1) : 1;
    console.log("Probability of no prize:", noPrizeProbability);

    const prizeProbabilities = activePrizes.map((prize) => ({
      ...prize,
      probability: prize.quantity / (totalQuantity + 1),
    }));

    console.log("Probabilities of each prize:", prizeProbabilities);

    const random = Math.random();
    let accumulated = noPrizeProbability;

    if (random < accumulated) {
      setResult("No Prize");
    } else {
      for (let i = 0; i < prizeProbabilities.length; i++) {
        accumulated += prizeProbabilities[i].probability;
        if (random < accumulated) {
          const drawnPrize = prizeProbabilities[i];
          if (drawnPrize.quantity > 0) {
            const { data, error } = await supabase
              .from("prizes")
              .update({ quantity: drawnPrize.quantity - 1 })
              .eq("id", drawnPrize.id);
            if (error) {
              console.error(error);
              setResult("Error updating the prize");
            } else {
              setResult(drawnPrize.prize);
              setPrizes((prevPrizes) =>
                prevPrizes.map((p) =>
                  p.id === drawnPrize.id
                    ? { ...p, quantity: p.quantity - 1 }
                    : p
                )
              );
            }
          } else {
            setResult("No Prize");
          }
          break;
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={drawPrize}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Spin Roulette
      </button>
      <p className="mt-4 text-lg">{result}</p>
    </div>
  );
}
