"use client";
import { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";
import logoAfya from "../public/images/logoRosa.png";
import logoRoleta from "../public/images/logoRoleta.png";
import "./roulette.module.css";
import Image from "next/image";
import { SignupContext } from "../contexts/SignupContext";
import { motion } from "framer-motion";

const RoulettePage = () => {
  const [activePrizes, setActivePrizes] = useState<any[]>([]);
  const [allPrizes, setAllPrizes] = useState<any[]>([{ prize: "Curso Afya" }]);
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const logoRef = useRef<HTMLImageElement | null>(null);
  const { signupData } = useContext(SignupContext);

  const userCpf = signupData.cpf;

  useEffect(() => {
    const fetchPrizes = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("prizes").select("*");
      if (error) {
        console.error(error);
      } else {
        setAllPrizes(data);
        const filteredPrizes = data.filter(
          (prize) => prize.active && prize.quantity > 0
        );
        setActivePrizes(filteredPrizes);
      }
      setIsLoading(false);
    };
    fetchPrizes();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      drawRoulette();
    }
  }, [allPrizes, angle, highlightedIndex]);

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

    const numSlices = allPrizes.length * 2;
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
      const prizeId = allPrizes[i % allPrizes.length]?.id;
      ctx.fillText(prizeId?.toString(), radius - 30, 10);
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

    const randomIndex = Math.floor(Math.random() * activePrizes.length);
    const drawnPrize = activePrizes[randomIndex];

    if (drawnPrize.quantity !== Infinity && drawnPrize.quantity > 0) {
      const { data, error } = await supabase
        .from("prizes")
        .update({ quantity: drawnPrize.quantity - 1 })
        .eq("id", drawnPrize.id);
      if (error) {
        console.error(error);
      } else {
        setAllPrizes((prevPrizes) =>
          prevPrizes.map((p) =>
            p.id === drawnPrize.id ? { ...p, quantity: p.quantity - 1 } : p
          )
        );
        spinRoulette(allPrizes.findIndex((p) => p.id === drawnPrize.id));
      }
    } else {
      spinRoulette(allPrizes.findIndex((p) => p.id === drawnPrize.id));
    }
  };

  const spinRoulette = (slot: number) => {
    const duration = 5000;
    const finalAngle = (360 / allPrizes.length) * slot + 360 * 5;
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

        const resultPrize = allPrizes[slot].prize;
        const sortedPrizes = allPrizes.sort((a, b) => a.id - b.id);

        const saveUserPrize = async (userId: number, prize: string) => {
          const { data, error } = await supabase
            .from("users")
            .update({ prize })
            .eq("id", userId);
          if (error) {
            console.error("Error saving user prize:", error);
          } else {
            console.log("User prize saved successfully:", data);
          }
        };

        const checkCpfExists = async (cpf: string) => {
          const { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("cpf", cpf)
            .single();
          if (error) {
            console.error(error);
            return null;
          }
          return data;
        };

        setTimeout(async () => {
          const userData = await checkCpfExists(userCpf);
          if (userData) {
            await saveUserPrize(userData.id, resultPrize);
          }

          router.push(
            `/roulette/result?prize=${resultPrize}&prizes=${JSON.stringify(
              sortedPrizes
            )}&index=${slot}`
          );
        }, 2000);
      }
    };

    requestAnimationFrame(animate);
  };

  const titleVariants = {
    hidden: { y: -300, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1 } },
  };

  const logoVariants = {
    hidden: { y: 300, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1 } },
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="flex items-center flex-col gap-6 justify-center h-screen bg-branco bg-cover bg-center"
      >
        <motion.h1
          className="text-5xl text-center font-semibold text-afya-pink"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          Carregando...
        </motion.h1>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
      className="flex items-center flex-col gap-6 justify-center h-screen bg-branco bg-cover bg-center"
    >
      <motion.h1
        className="text-5xl text-center font-semibold text-afya-pink"
        initial="hidden"
        animate="visible"
        variants={titleVariants}
      >
        Toque para <br /> ganhar um brinde
      </motion.h1>
      <div className="roulette-container mb-10">
        <canvas
          ref={canvasRef}
          width="600"
          height="600"
          onClick={drawPrize}
        ></canvas>
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={logoVariants}
        className="mt-10"
      >
        <Image src={logoAfya} alt="Logo Afya" />
      </motion.div>
    </motion.div>
  );
};

export default RoulettePage;
