"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";
import logoAfya from "../public/images/logoRosa.png";
import logoRoleta from "../public/images/logoRoleta.png";
import "./roulette.module.css";
import Image from "next/image";

const RoulettePage = () => {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const logoRef = useRef<HTMLImageElement | null>(null);

  const keywordMaskMap: { [key: string]: string } = {
    "premio 1": "1",
    "premio 2": "2",
    "premio 3": "3",
    "Não foi dessa vez": "4",
  };

  const getPrizeMask = (prize: string) => {
    const normalizedPrize = prize.toLowerCase();
    for (const keyword in keywordMaskMap) {
      if (normalizedPrize.includes(keyword.toLowerCase())) {
        return keywordMaskMap[keyword];
      }
    }
    return prize;
  };

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

  useEffect(() => {
    const img = document.createElement("img");
    img.src = logoRoleta.src;
    img.onload = () => {
      logoRef.current = img;
      drawRoulette();
    };
  }, []);

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
      const fillStyle =
        i === highlightedIndex
          ? "#D8005F"
          : i % 2 === 0
          ? "#fce7f3"
          : "#D8005F";
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = fillStyle === "#D8005F" ? "#fce7f3" : "#D8005F";
      ctx.font = "80px SansBeanBody";
      const prizeText = getPrizeMask(
        extendedPrizes[i % extendedPrizes.length]?.prize || "No Prize"
      );
      ctx.fillText(prizeText, radius - 30, 10);
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

    if (logoRef.current) {
      ctx.drawImage(logoRef.current, centerX - 50, centerY - 50, 100, 100);
    }
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
          if (resultPrize === "No Prize") {
            router.push("/roulette/no-prize");
          } else {
            router.push(
              `/roulette/result?prize=${resultPrize}&prizes=${JSON.stringify(
                prizeNames
              )}`
            );
          }
        }, 2000);
      }
    };

    requestAnimationFrame(animate);
  };

  {
    !prizes && <p>Carregando...</p>;
  }
  return (
    <div className="flex items-center flex-col gap-6 justify-center h-screen bg-branco bg-cover bg-center">
      <h1 className="text-5xl text-center font-semibold text-afya-pink">
        Toque para <br /> ganhar um brinde
      </h1>
      <div className="roulette-container mb-10">
        <canvas
          ref={canvasRef}
          width="600"
          height="600"
          onClick={drawPrize}
        ></canvas>
      </div>
      <Image src={logoAfya} alt="Logo Afya" />
    </div>
  );
};

export default RoulettePage;
