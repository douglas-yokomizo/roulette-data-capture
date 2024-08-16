"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import "./roulette.module.css";

const RoulettePage = () => {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data, error } = await supabase.from("prizes").select("*");
      if (error) console.error(error);
      else setPrizes(data);
    };
    fetchPrizes();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      drawRoulette();
    }
  }, [prizes, angle, highlightedIndex]);

  const drawRoulette = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const extendedPrizes = [
      ...prizes,
      { prize: "Não foi dessa vez", active: true, quantity: 1 },
    ];
    let numSlices = extendedPrizes.length;

    if (numSlices <= 4 || numSlices % 2 !== 0) {
      numSlices *= 2;
    }

    const sliceAngle = (2 * Math.PI) / numSlices;
    const radius = canvas.width / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle =
        i === highlightedIndex
          ? "#db2777"
          : i % 2 === 0
          ? "#FFFFF1"
          : "#db2777 ";
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#000";
      ctx.font = "24px Arial";
      const prizeText =
        extendedPrizes[i % extendedPrizes.length]?.prize || "No Prize";
      ctx.fillText(prizeText, radius - 10, 10);
      ctx.restore();
    }

    if (highlightedIndex !== null) {
      for (let i = 0; i < numSlices; i++) {
        if (i !== highlightedIndex) {
          const startAngle = i * sliceAngle;
          const endAngle = startAngle + sliceAngle;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.fill();
        }
      }
    }

    ctx.restore();

    const img = new Image();
    img.src = "../favicon.ico";
    img.onload = () => {
      ctx.drawImage(img, centerX - 50, centerY - 50, 100, 100);
    };
  };

  const drawPrize = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const activePrizes = prizes.filter((prize) => prize.active);
    const totalQuantity = activePrizes.reduce(
      (acc, prize) => acc + prize.quantity,
      0
    );

    const noPrizeProbability = totalQuantity > 0 ? 1 / (totalQuantity + 1) : 1;
    const prizeProbabilities = activePrizes.map((prize) => ({
      ...prize,
      probability: prize.quantity / (totalQuantity + 1),
    }));
    console.log(prizeProbabilities);
    console.log(noPrizeProbability);

    const random = Math.random();
    let accumulated = noPrizeProbability;

    if (random < accumulated) {
      spinRoulette(prizes.length);
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
            } else {
              setPrizes((prevPrizes) =>
                prevPrizes.map((p) =>
                  p.id === drawnPrize.id
                    ? { ...p, quantity: p.quantity - 1 }
                    : p
                )
              );
              spinRoulette(i);
            }
          } else {
            spinRoulette(prizes.length);
          }
          break;
        }
      }
    }
  };

  const spinRoulette = (slot: number) => {
    const duration = 3000;
    const finalAngle = (360 / prizes.length) * slot + 360 * 5;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentAngle = finalAngle * progress;

      setAngle(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setHighlightedIndex(slot);

        const resultPrize =
          slot === prizes.length ? "No Prize" : prizes[slot].prize;
        const prizeNames = prizes.map((p) => p.prize);
        setTimeout(() => {
          router.push(
            `/roulette/result?prize=${resultPrize}&prizes=${JSON.stringify(
              prizeNames
            )}`
          );
        }, 2000);
      }
    };

    requestAnimationFrame(animate);
  };

  {
    !prizes && <p>Carregando...</p>;
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="roulette-container">
        <canvas
          ref={canvasRef}
          width="600"
          height="600"
          onClick={drawPrize}
        ></canvas>
      </div>
    </div>
  );
};

export default RoulettePage;
