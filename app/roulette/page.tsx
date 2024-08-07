"use client";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/utils/supabase/client";
import "./roulette.module.css"; // Import the CSS file for styling

const RoulettePage = () => {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [result, setResult] = useState("");
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const numSlices = prizes.length;
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
          ? "#FFD700"
          : i % 2 === 0
          ? "#FFDDC1"
          : "#FFABAB";
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#000";
      ctx.font = "24px Arial";
      const prizeText = prizes[i]?.prize || "No Prize";
      ctx.fillText(prizeText, radius - 10, 10);
      ctx.restore();
    }

    ctx.restore();

    // Draw the center image
    const img = new Image();
    img.src = "/path/to/your/image.png"; // Replace with the path to your image
    img.onload = () => {
      ctx.drawImage(img, centerX - 50, centerY - 50, 100, 100); // Adjust the size and position as needed
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

    const random = Math.random();
    let accumulated = noPrizeProbability;

    if (random < accumulated) {
      setResult("No Prize");
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
              spinRoulette(i);
            }
          } else {
            setResult("No Prize");
            spinRoulette(prizes.length);
          }
          break;
        }
      }
    }
  };

  const spinRoulette = (slot: number) => {
    const degreesPerSlot = 360 / prizes.length;
    const targetAngle = 360 * 3 + slot * degreesPerSlot;
    const duration = 3000; // Duration of the spin in milliseconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentAngle = progress * targetAngle;
      setAngle(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Determine the prize at the top
        const finalAngle = currentAngle % 360;
        const prizeIndex =
          Math.floor(finalAngle / degreesPerSlot) % prizes.length;
        setHighlightedIndex(prizeIndex);
        const prizeText = prizes[prizeIndex]?.prize || "No Prize";
        setResult(prizeText);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="roulette-container">
      <canvas
        ref={canvasRef}
        width="400"
        height="400"
        onClick={drawPrize}
      ></canvas>
      <p className="result">{result}</p>
    </div>
  );
};

export default RoulettePage;
