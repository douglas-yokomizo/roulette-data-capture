"use client";
import MultipleChoice from "../components/MultipleChoice";
import { saveChoice } from "../../utils/supabase/client";

const Page1 = () => {
  const handleSelect = (selectedOption: string) => {
    saveChoice(selectedOption);
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-3xl text-pink-500 mb-10">
        Você já conhece a Afya?
      </h1>
      <MultipleChoice options={["Sim", "Não"]} onSelect={handleSelect} />
    </div>
  );
};

export default Page1;
