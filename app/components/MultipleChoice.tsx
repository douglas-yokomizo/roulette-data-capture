"use client";
import { useState } from "react";

interface MultipleChoiceProps {
  options: string[];
  onSelect: (selectedOption: string) => void;
}

const MultipleChoice = ({ options, onSelect }: MultipleChoiceProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <div className="flex flex-col items-center">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`py-2 px-4 rounded mb-2 ${
            selectedOption === option ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MultipleChoice;
